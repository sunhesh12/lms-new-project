<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function aiAssistant()
    {
        /** @var User|null $user */
        $user = Auth::user();
        if (!$user) {
            abort(401);
        }
        $aiUuid = '00000000-0000-0000-0000-000000000000';

        $this->ensureAiConversation($user, $aiUuid);

        $conversation = $user->conversations()
            ->where('type', 'private')
            ->whereHas('participants', function ($q) use ($aiUuid) {
                $q->where('user_id', $aiUuid);
            })
            ->with(['messages.user', 'messages.replyTo.user', 'users'])
            ->first();

        // Mark as read
        $this->markAsReadInternal($conversation);

        return Inertia::render('AIAssistant/Index', [
            'conversation' => $conversation,
            'conversations' => $this->getConversations($user)
        ]);
    }



    public function index()
    {
        /** @var User|null $user */
        $user = Auth::user();
        if (!$user) {
            abort(401);
        }
        $conversations = $this->getConversations($user);

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations
        ]);
    }

    public function show(Conversation $conversation)
    {
        abort_unless($conversation->users->contains(Auth::id()), 403);

        $conversation->load([
            'messages' => function ($query) {
                $query->where(function ($q) {
                    $q->whereNull('deleted_by')
                        ->orWhereJsonDoesntContain('deleted_by', Auth::id());
                })->with(['user', 'replyTo.user']);
            },
            'users'
        ]);

        // Mark as read immediately when opening
        $this->markAsReadInternal($conversation);

        $user = Auth::user();
        $conversations = $this->getConversations($user);

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => $conversation
        ]);
    }

    private function getConversations($user)
    {
        // ensure valid user model
        if (!$user || !($user instanceof User)) {
            return collect();
        }

        $aiUuid = '00000000-0000-0000-0000-000000000000';
        if ($user->id !== $aiUuid) {
            $this->ensureAiConversation($user, $aiUuid);
        }

        return $user->conversations()
            ->with([
                'messages' => function ($query) use ($user) {
                    $query->where(function ($q) use ($user) {
                        $q->whereNull('deleted_by')
                            ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                        ->latest()
                        ->limit(1);
                }
            ])
            ->with([
                'users',
                'participants' => function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                }
            ])
            ->get()
            ->map(function ($conversation) use ($user) {
                $participant = $conversation->participants->first();
                $lastReadAt = $participant ? $participant->last_read_at : '1970-01-01';

                $conversation->unread_count = $conversation->messages()
                    ->where('created_at', '>', $lastReadAt ?? '1970-01-01')
                    ->where('user_id', '!=', $user->id)
                    ->where(function ($query) use ($user) {
                        $query->whereNull('deleted_by')
                            ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                    ->count();

                return $conversation;
            })
            ->sortByDesc(fn($c) => $c->messages->first()?->created_at ?? $c->created_at)
            ->values();
    }

    public function markAsRead(Conversation $conversation)
    {
        $this->markAsReadInternal($conversation);
        return response()->json(['success' => true]);
    }

    private function ensureAiConversation($user, $aiUuid)
    {
        $exists = $user->conversations()
            ->where('type', 'private')
            ->whereHas('participants', function ($q) use ($aiUuid) {
                $q->where('user_id', $aiUuid);
            })
            ->exists();

        if (!$exists) {
            // Check if AI user exists in users table to prevent integrity constraint violation
            if (!\App\Models\User::where('id', $aiUuid)->exists()) {
                \Illuminate\Support\Facades\Log::warning("AI Assistant user ($aiUuid) does not exist in the users table.");
                return;
            }

            $conversation = \App\Models\Conversation::create(['type' => 'private']);
            $conversation->participants()->create(['user_id' => $user->id]);
            $conversation->participants()->create(['user_id' => $aiUuid]);
        }
    }

    private function markAsReadInternal(Conversation $conversation)
    {
        $participant = $conversation->participants()->where('user_id', Auth::id())->first();
        if ($participant) {
            $participant->update(['last_read_at' => now()]);
            broadcast(new \App\Events\MessageRead($conversation->id, Auth::id()))->toOthers();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'nullable|string',
            'conversation_id' => 'required|exists:conversations,id',
            'reply_to_id' => 'nullable|exists:messages,id',
            'attachment' => 'nullable|file|max:10240', // 10MB max
            'attachment_type' => 'nullable|string|in:image,video,audio,pdf'
        ]);

        if (!$request->body && !$request->hasFile('attachment')) {
            return response()->json(['error' => 'Message must have body or attachment'], 422);
        }

        $conversation = Conversation::find($request->conversation_id);
        abort_unless($conversation->users->contains(Auth::id()), 403);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        $message = $conversation->messages()->create([
            'user_id' => Auth::id(),
            'body' => $request->body ?? '',
            'reply_to_id' => $request->reply_to_id,
            'attachment_path' => $attachmentPath,
            'attachment_type' => $request->attachment_type
        ]);

        // Broadcast event
        $message->load(['user', 'replyTo.user']);
        // Ensure appends are present for broadcast
        $message->append('attachment_url');

        broadcast(new \App\Events\MessageSent($message))->toOthers();

        // Broadcast ConversationUpdated to all participants to move conversation to top of list
        foreach ($conversation->users as $participant) {
            broadcast(new \App\Events\ConversationUpdated($conversation->load(['messages' => function($q) {
                $q->latest()->limit(1);
            }, 'users']), $participant->id));
        }

        // Check if message is for the AI Assistant
        $aiUuid = '00000000-0000-0000-0000-000000000000';
        if ($conversation->users->contains($aiUuid) && Auth::id() !== $aiUuid) {
            // Process AI response in the background (or inline for simplicity now)
            try {
                $provider = $request->input('ai_provider') ?: null;
                if (!$provider && Auth::check()) {
                    $provider = Auth::user()->ai_provider;
                }
                $provider = $provider ?: config('services.ai.provider');
                $aiService = \App\Services\AiProviderFactory::make($provider);
                $aiResponse = $aiService->generateResponse($message->body);

                if ($aiResponse) {
                    $aiMessage = $conversation->messages()->create([
                        'user_id' => $aiUuid,
                        'body' => $aiResponse,
                        'reply_to_id' => $message->id,
                    ]);

                    $aiMessage->load(['user', 'replyTo.user']);
                    $aiMessage->append('attachment_url');

                    // Broadcast the AI response
                    broadcast(new \App\Events\MessageSent($aiMessage));
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('AI Response Failed: ' . $e->getMessage());
            }
        }

        return back();
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        // Since name and email are encrypted, we fetch users and filter in memory.
        // For performance with 14 users this is fine.
        $users = \App\Models\User::where('id', '!=', Auth::id())
            ->get(['id', 'name', 'email', 'profile_pic'])
            ->filter(function ($user) use ($query) {
                if (empty($query))
                    return true;
                return stripos($user->name, $query) !== false ||
                    stripos($user->email, $query) !== false;
            })
            ->take(20)
            ->values();

        return response()->json($users);
    }

    public function checkConversation(Request $request)
    {
        $userId = $request->input('user_id');

        // Check for existing private conversation
        $conversation = Conversation::where('type', 'private')
            ->whereHas('participants', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->whereHas('participants', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create(['type' => 'private']);
            $conversation->participants()->create(['user_id' => Auth::id()]);
            $conversation->participants()->create(['user_id' => $userId]);
        }

        return response()->json(['conversation_id' => $conversation->id]);
    }

    public function storeGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id'
        ]);

        $conversation = Conversation::create([
            'type' => 'group',
            'name' => $request->name
        ]);

        // Add creator
        $conversation->participants()->create(['user_id' => Auth::id()]);

        // Add other participants
        foreach ($request->participants as $userId) {
            $conversation->participants()->create(['user_id' => $userId]);
        }

        return response()->json(['conversation_id' => $conversation->id]);
    }

    public function deleteForEveryone(\App\Models\Message $message)
    {
        abort_unless($message->user_id === Auth::id(), 403);

        $conversationId = $message->conversation_id;
        $messageId = $message->id;

        $message->delete(); // Soft delete

        broadcast(new \App\Events\MessageDeleted($messageId, $conversationId))->toOthers();

        return response()->json(['success' => true]);
    }

    public function deleteForMe(\App\Models\Message $message)
    {
        abort_unless($message->conversation->users->contains(Auth::id()), 403);

        $deletedBy = $message->deleted_by ?? [];
        if (!in_array(Auth::id(), $deletedBy)) {
            $deletedBy[] = Auth::id();
            $message->deleted_by = $deletedBy;
            $message->save();
        }

        return response()->json(['success' => true]);
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'message_ids' => 'required|array',
            'message_ids.*' => 'exists:messages,id'
        ]);

        $messages = \App\Models\Message::whereIn('id', $request->message_ids)->get();

        foreach ($messages as $message) {
            if ($message->conversation->users->contains(Auth::id())) {
                $deletedBy = $message->deleted_by ?? [];
                if (!in_array(Auth::id(), $deletedBy)) {
                    $deletedBy[] = Auth::id();
                    $message->deleted_by = $deletedBy;
                    $message->save();
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
