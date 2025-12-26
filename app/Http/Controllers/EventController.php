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
        $query = Event::forUser(Auth::id());

        // Optional: Filter by date range if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        }

        $events = $query->orderBy('date', 'asc')
                       ->orderBy('start_time', 'asc')
                       ->get();

        return response()->json($events);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $event = Event::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json($event, 201);
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event)
    {
        // Ensure user can only view their own events
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return response()->json($event);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, Event $event)
    {
        // Ensure user can only update their own events
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
        ]);

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