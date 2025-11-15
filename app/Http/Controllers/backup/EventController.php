<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Event;
use App\Models\PortalUser;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function createEventForUsers(Request $request)
    {
        // Validate input
        $request->validate([
            'event_name' => 'required|string',
            'start_date' => 'required|date',
            'user_ids' => 'required|array', // Expect an array of user IDs
            'user_ids.*' => 'exists:portal_users,id', // Ensure each ID exists in the users table
        ]);

        if (!$request->has('activity_id')){
            $event = Event::create([
                'event_name' => $request->event_name,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'description' => $request->description,
                'status' => 'scheduled',
            ]);
        }


        // Attach the event to the provided users
        $event->users()->attach($request->user_ids);

        return response()->json(['event' => $event], 201);
    }

    public function getAllEventsForAUser($userId)
    {
        $user = PortalUser::with('events')->findOrFail($userId);

        return response()->json($user->events);
    }

    public function getSpecificEventForAUser($userId, $eventId)
    {
        $event = Event::whereHas('users', function ($query) use ($userId) {
            $query->where('portal_users.id', $userId); // Explicitly specify the table name
        })->find($eventId);

        if (!$event) {
            return ResponseHelper::notFound('Event not found for the specified user.');
        }

        return ResponseHelper::success('Event retrieved successfully.', $event);
    }

    public function getSpecificEventDetails($eventId)
    {
        $event = Event::findOrFail($eventId);
        if (!$event) {
            return ResponseHelper::notFound('Event not found for the specified user.');
        }

        return ResponseHelper::success('Event retrieved successfully.', $event);
    }

    public function updateEvent(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId); // Fetch the event

        // Validate the input
        $request->validate([
            'event_name' => 'string|max:255',
            'start_date' => 'date',
            'start_time' => 'date_format:H:i',
            'end_date' => 'date|nullable',
            'end_time' => 'nullable|date_format:H:i',
            'status' => 'string|in:scheduled,completed,canceled',
            'description' => 'string|nullable',
        ]);

        // Update the event with the request data
        $event->update($request->all());

        return response()->json(['message' => 'Event updated successfully.', 'event' => $event]);
    }

    public function deleteEvent($eventid)
    {
        $event = Event::find($eventid);
        if (!$event) {
            return ResponseHelper::notFound('Event not found');
        }

        $event->delete();
        return ResponseHelper::success('Event deleted successfully');
    }
}
