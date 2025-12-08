<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Module;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AssignmentController extends Controller
{
    public function create(Request $request, $moduleId)
    {

        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:100',
            'started' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now',
            'deadline' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now|after:started',
            'resource_file' => 'required|file',
            'resource_caption' => 'required|string|max:50',
        ]);

        try {
            $currentModule = Module::find($moduleId);

            if (!$currentModule) {
                return redirect()->back(404)->with('success', false)->with('error', 'Module not found');
            }

            if (file_exists('/uploads/resources/' . $validatedData['resource_file'])) {
                unlink('/uploads/resources/' . $validatedData['resource_file']);
            }

            $fileName = time() . '_' . $validatedData['resource_file']->getClientOriginalName();

            $validatedData['resource_file']->move(public_path('/uploads/resources'), $fileName);

            $assignment = $currentModule->assignments()->create([
                'title' => $validatedData['title'],
                'started' => $validatedData['started'],
                'description' => $validatedData['description'],
                'deadline' => $validatedData['deadline'],
            ]);

            $assignment->save();

            $resource = Resource::create([
                'url' => $fileName,
                'caption' => $validatedData['resource_caption'],
                'assignment_id' => $assignment->id
            ]);

            $resource->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully created a topic');
        } catch (error) {
            // For any unknown error (with the database etc.)
            return redirect()->back()->with('success', false)->with('messsage', 'Internal server error');
        }
    }
}
