<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TopicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(Request $request, $moduleId)
    {
        $validatedData = $request->validate([
            'topic_name' => 'required|string|max:50',
            'description' => 'nullable|string|max:100',
        ]);

        $module = Module::find($moduleId);

        if (!$module) {
            return redirect()->back()->with('message', 'Topic doesent belonging to a module successfully');
        }

        $topic = $module->topics()->create([
            'topic_name' => $validatedData['topic_name'],
            'description' => $validatedData['description'] ?? null,
        ]);


        return redirect()->back()->with('message', 'Topic created successfully');
    }

    public function reset(Request $request, $moduleId, $topicId)
    {
        $topic = Topic::where('module_id', $moduleId)
            ->where('id', $topicId)
            ->first();

        if (!$topic->is_deleted) {
            return redirect()->back()->with('message', 'Topic isnt a deleted module');
        }

        // Reset logic here (e.g., resetting progress, status, etc.)
        // For demonstration, let's assume we reset a 'progress' field to 0
        $topic->update(['is_deleted' => false]);

        return redirect()->back()->with('message', 'Topic reset successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Topic $topic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Topic $topic)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $moduleId, $topicId)
    {
        $validatedData = $request->validate([
            'topic_name' => 'required|string|max:50',
            'description' => 'nullable|string|max:100',
        ]);

        $topic = Topic::where('module_id', $moduleId)
            ->where('id', $topicId)
            ->first();

        if (!$topic) {
            return redirect()->back()->with('message', 'Topic isnt available');
        }

        $topic->update([
            'topic_name' => $validatedData['topic_name'],
            'description' => $validatedData['description'] ?? null,
        ]);

        return redirect()->back()->with('message', 'Topic updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $moduleId, $topicId)
    {
        $topic = Topic::where('module_id', $moduleId)
            ->where('id', $topicId)
            ->first();

        if (!$topic) {
            return redirect()->back()->with('message', 'Topic isnt available');
        }

        $topic->update(['is_deleted' => true]);

        return redirect()->back()->with('message', 'Topic deleted successfully');
    }
}
