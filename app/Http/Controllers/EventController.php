<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the user's events.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        
        // Fetch user's own events
        $userEventsQuery = Event::where('user_id', $userId);
        
        if ($request->has('start_date') && $request->has('end_date')) {
            $userEventsQuery->whereBetween('date', [$request->start_date, $request->end_date]);
        }
        
        $userEvents = $userEventsQuery->orderBy('date', 'asc')
                                    ->orderBy('start_time', 'asc')
                                    ->get()
                                    ->map(function ($event) {
                                        $event->is_own = true;
                                        return $event;
                                    });

        // Fetch public events from others
        $publicEventsQuery = Event::where('user_id', '!=', $userId)
                                  ->where('visibility', 'public');

        if ($request->has('start_date') && $request->has('end_date')) {
            $publicEventsQuery->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $publicEvents = $publicEventsQuery->orderBy('date', 'asc')
                                        ->orderBy('start_time', 'asc')
                                        ->with('user:id,name') // Include creator info
                                        ->get()
                                        ->map(function ($event) {
                                            $event->is_own = false;
                                            return $event;
                                        });

        return response()->json([
            'personal' => $userEvents,
            'public' => $publicEvents
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'visibility' => 'required|in:private,public',
        ]);

        // Security check: Only admins/lecturers can create public events
        if ($validated['visibility'] === 'public' && !$user->isAdmin() && !$user->isLecturer()) {
            return response()->json(['message' => 'Only admins and lecturers can create public events.'], 403);
        }

        $event = Event::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'visibility' => $validated['visibility'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        $event->is_own = true;
        return response()->json($event, 201);
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event)
    {
        // Allow viewing if it's yours OR if it's public
        if ($event->user_id !== Auth::id() && $event->visibility !== 'public') {
            abort(403, 'Unauthorized');
        }

        return response()->json($event);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, Event $event)
    {
        $user = Auth::user();
        
        // Ensure user can only update their own events
        if ($event->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'visibility' => 'sometimes|required|in:private,public',
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
        ]);

        // Security check: Only admins/lecturers can make events public
        if (isset($validated['visibility']) && $validated['visibility'] === 'public' && !$user->isAdmin() && !$user->isLecturer()) {
            return response()->json(['message' => 'Only admins and lecturers can set events to public.'], 403);
        }

        $event->update($validated);

        return response()->json($event);
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(Event $event)
    {
        // Ensure user can only delete their own events
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully'], 200);
    }
}