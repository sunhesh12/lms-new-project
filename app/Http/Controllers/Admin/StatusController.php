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

        $statuses = $statusesQuery->get()
            ->filter(function ($status) use ($query) {
                if (empty($query))
                    return true;
                $user = $status->user;
                return stripos($status->content, $query) !== false ||
                    ($user && (stripos($user->name, $query) !== false || stripos($user->email, $query) !== false));
            });

        $total = $statuses->count();
        $page = $request->query('page', 1);
        $perPage = 20;
        $statuses = new \Illuminate\Pagination\LengthAwarePaginator(
            $statuses->forPage($page, $perPage)->values(),
            $total,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

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
