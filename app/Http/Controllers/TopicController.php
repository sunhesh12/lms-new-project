<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Resource;
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
            //'resources' => 'array|nullable',
            'resources.*.id' => 'string|nullable', // Only required for updating a module (hidden input)
            'resources.*.is_deleted' => 'boolean',
            'resources.*.file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:2048',
            'resources.*.caption' => 'nullable|string|max:100',
        ]);

        //dd($validatedData);

        $module = Module::find($moduleId);

        if (!$module) {
            return redirect()->back(404)->with('message', 'Topic doesent belonging to a module successfully');
        }

        $topic = $module->topics()->create([
            'topic_name' => $validatedData['topic_name'],
            'description' => $validatedData['description'] ?? null,
        ]);

        if (!empty($validatedData['resources'])) {
            foreach ($validatedData['resources'] as $resource) {
                if (isset($resource['file'])) {
                    $fileName = time() . '_' . $resource['file']->getClientOriginalName();

                    // Saving the file
                    $resource['file']->move(public_path('/uploads/resources'), $fileName);

                    $topic->resources()->create([
                        'url' => $fileName,
                        'caption' => $resource['caption']
                    ]);
                }
            }
        }

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
            'resources' => 'array|nullable',
            'resources.*.id' => 'required|string', // Only required for updating a module (hidden input)
            'resources.*.is_deleted' => 'required|boolean',
            'resources.*.file' => 'required|file|mimes:jpg,jpeg,png,pdf,docx|max:2048',
            'resources.*.caption' => 'required|string|max:100',
        ]);

        $topic = Topic::where('module_id', $moduleId)
            ->where('id', $topicId)
            ->first();

        if (!$topic) {
            return redirect()->back()->with('message', 'Topic isnt available');
        }

        // Updating topic details
        $topic->update([
            'topic_name' => $validatedData['topic_name'],
            'description' => $validatedData['description'] ?? null,
        ]);

        //dd($validatedData);

        // Update / delete / add resources
        if (!empty($validatedData['resources'])) {

            foreach ($validatedData['resources'] as $resource) {

                if (isset($resource['id'])) {

                    // Resource update

                    $existingResource = Resource::where('id', $resource['id'])->first();

                    if (!$existingResource) {
                        // Create the new resource

                        if (isset($resource['file'])) {
                            if (file_exists(public_path('/uploads/resources/' . $resource['file']))) {
                                unlink(public_path('/uploads/resources/' . $resource['file']));
                            }

                            $fileName = time() . '_' . $resource['file']->getClientOriginalName();

                            // Saving the file
                            $resource['file']->move(public_path('/uploads/resources'), $fileName);

                            $newResource = Resource::create([
                                'id' => $resource['id'],
                                'topic_id' => $topic->id,
                                'caption' => $resource['caption'],
                                'url' => $fileName,
                            ]);

                            $newResource->save();
                        }
                    } else {
                        if (isset($resource['is_deleted'])) {
                            if ($resource['is_deleted'] == true) {
                                $existingResource->is_deleted = true;
                            }
                        }

                        if (isset($resource['caption'])) {
                            $existingResource->caption = $resource['caption'];
                        }

                        if (isset($resource['file'])) {
                            if (isset($existingResource->url)) {
                                // TODO: Please make the existing file deleted after the file update. Current method only update file path on the DB
                                if (file_exists(public_path('/uploads/resources/' . $existingResource->url))) {
                                    unlink(public_path('/uploads/resources/' . $existingResource->url));
                                }
                            }

                            $fileName = time() . '_' . $resource['file']->getClientOriginalName();

                            // Saving the file
                            $resource['file']->move(public_path('/uploads/resources'), $fileName);

                            $existingResource->url = $fileName;
                        }
                        $existingResource->save();
                    }

                }
            }
        }

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
