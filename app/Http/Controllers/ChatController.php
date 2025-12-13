<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $conversations = $user ->conversations()
            ->with(['messages' => function($query) use ($user) {
                // Latest message must not be deleted by me
                $query->where(function ($q) use ($user) {
                        $q->whereNull('deleted_by')
                          ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                    ->latest()
                    ->limit(1);
            }])
            ->with(['users', 'participants' => function($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($conversation) use ($user) {
                $lastReadAt = $conversation->participants->first()->last_read_at;
                
                // Count unread, excluding hidden messages
                $conversation->unread_count = $conversation->messages()
                    ->where('created_at', '>', $lastReadAt ?? '1970-01-01')
                    ->where(function ($query) use ($user) {
                        $query->whereNull('deleted_by')
                              ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                    ->count();
                    
                return $conversation;
            })
            ->sortByDesc(fn($c) => $c->messages->first()?->created_at ?? $c->created_at)
            ->values();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations
        ]);
    }

    public function show(Conversation $conversation)
    {
        abort_unless($conversation->users->contains(Auth::id()), 403);

        $conversation->load(['messages' => function($query) {
             $query->where(function ($q) {
                 $q->whereNull('deleted_by')
                   ->orWhereJsonDoesntContain('deleted_by', Auth::id());
             })->with(['user', 'replyTo.user']);
        }, 'users']);
        
        // Mark as read immediately when opening
        $this->markAsReadInternal($conversation);

        $user = Auth::user();
        $conversations = $user->conversations()
            ->with(['messages' => function($query) use ($user) {
                $query->where(function ($q) use ($user) {
                        $q->whereNull('deleted_by')
                          ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                    ->latest()
                    ->limit(1);
            }])
            ->with(['users', 'participants' => function($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($conversation) use ($user) {
                $lastReadAt = $conversation->participants->first()->last_read_at;
                $conversation->unread_count = $conversation->messages()
                    ->where('created_at', '>', $lastReadAt ?? '1970-01-01')
                    ->where(function ($query) use ($user) {
                        $query->whereNull('deleted_by')
                              ->orWhereJsonDoesntContain('deleted_by', $user->id);
                    })
                    ->count();
                return $conversation;
            })
            ->sortByDesc(fn($c) => $c->messages->first()?->created_at ?? $c->created_at)
            ->values();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => $conversation
        ]);
    }

    public function markAsRead(Conversation $conversation)
    {
        $this->markAsReadInternal($conversation);
        return response()->json(['success' => true]);
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

        return back();
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json([]);
        }

        $users = \App\Models\User::where('id', '!=', Auth::id())
            ->where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name', 'email']);

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
