<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatusController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query('q');
        $fromDate = $request->query('from_date');
        $fromTime = $request->query('from_time');
        $toDate = $request->query('to_date');
        $toTime = $request->query('to_time');

        $statusesQuery = Status::with('user')->orderBy('created_at', 'desc');

        if ($query) {
            $statusesQuery->where(function($q) use ($query) {
                $q->where('content', 'like', "%{$query}%")
                  ->orWhereHas('user', function($uq) use ($query) {
                      $uq->where('name', 'like', "%{$query}%")
                         ->orWhere('email', 'like', "%{$query}%");
                  });
            });
        }

        // Date/time filtering: combine date and time where provided
        if ($fromDate) {
            $fromTime = $fromTime ?: '00:00';
            try {
                $from = \Carbon\Carbon::createFromFormat('Y-m-d H:i', "{$fromDate} {$fromTime}");
                $statusesQuery->where('created_at', '>=', $from);
            } catch (\Exception $e) {
                // ignore invalid format
            }
        }

        if ($toDate) {
            $toTime = $toTime ?: '23:59';
            try {
                $to = \Carbon\Carbon::createFromFormat('Y-m-d H:i', "{$toDate} {$toTime}");
                $statusesQuery->where('created_at', '<=', $to);
            } catch (\Exception $e) {
                // ignore invalid format
            }
        }

        $statuses = $statusesQuery->paginate(20)->appends($request->only(['q', 'from_date', 'from_time', 'to_date', 'to_time']));

        return Inertia::render('Admin/Statuses', [
            'statuses' => $statuses,
            'filters' => $request->only(['q', 'from_date', 'from_time', 'to_date', 'to_time']),
        ]);
    }

    public function destroy(Status $status)
    {
        // Only allow admins (middleware should enforce)
        if ($status->media_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($status->media_path);
        }
        $status->delete();
        return redirect()->back()->with('success', 'Status removed.');
    }
}
