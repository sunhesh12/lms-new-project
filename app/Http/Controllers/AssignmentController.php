<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Module;
use App\Models\Resource;
use App\Models\Submission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AssignmentController extends Controller
{
    public function create(Request $request, $moduleId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        // Log incoming request for debugging
        Log::info('Assignment creation request', [
            'module_id' => $moduleId,
            'user_id' => auth()->id(),
            'request_data' => $request->except(['resource_file']),
        ]);

        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:50',
                'description' => 'required|string|max:100',
                'started' => 'required|date_format:Y-m-d H:i:s',
                'deadline' => 'required|date_format:Y-m-d H:i:s|after:started',
                'resource_file' => 'required|file',
                'resource_caption' => 'required|string|max:50',
                'topic_id' => 'nullable|exists:topics,id',
            ]);

            Log::info('Validation passed', ['validated_data' => $validatedData]);

            $uploadedFileName = null;
            $filePath = null;

            $currentModule = Module::findOrFail($moduleId);

            // Prepare file upload
            $filePath = Storage::disk('public')->path('/uploads/resources/');
            
            // Ensure directory exists
            if (!file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }

            // Sanitize filename
            $originalFileName = $validatedData['resource_file']->getClientOriginalName();
            $sanitizedFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalFileName);
            $uploadedFileName = time() . '_' . $sanitizedFileName;

            // Use database transaction to ensure data consistency
            $result = DB::transaction(function () use ($validatedData, $filePath, $uploadedFileName, $currentModule) {
                // Move uploaded file
                if (!$validatedData['resource_file']->move($filePath, $uploadedFileName)) {
                    throw new Exception('Failed to move uploaded file');
                }

                Log::info('File uploaded successfully', ['filename' => $uploadedFileName]);

                // Create assignment
                $assignment = $currentModule->assignments()->create([
                    'title' => $validatedData['title'],
                    'started' => $validatedData['started'],
                    'description' => $validatedData['description'],
                    'deadline' => $validatedData['deadline'],
                    'topic_id' => $validatedData['topic_id'] ?? null,
                    'is_deleted' => false,
                ]);

                Log::info('Assignment created', ['assignment_id' => $assignment->id]);

                // Create resource for the assignment
                $resource = Resource::create([
                    'url' => $uploadedFileName,
                    'caption' => $validatedData['resource_caption'],
                    'assignment_id' => $assignment->id,
                ]);

                Log::info('Resource created', ['resource_id' => $resource->id]);

                return ['assignment' => $assignment, 'resource' => $resource];
            });

            Log::info('Assignment creation completed successfully', [
                'assignment_id' => $result['assignment']->id,
                'resource_id' => $result['resource']->id
            ]);

            return redirect()->back()
                ->with('success', true)
                ->with('message', 'Successfully created an assignment');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Clean up uploaded file if validation fails
            if (isset($uploadedFileName) && isset($filePath) && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'module_id' => $moduleId,
            ]);
            
            throw $e; // Re-throw to let Laravel handle validation errors
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Clean up uploaded file if module not found
            if (isset($uploadedFileName) && isset($filePath) && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            
            Log::error('Module not found', ['module_id' => $moduleId]);
            
            return redirect()->back()
                ->with('success', false)
                ->with('error', 'Module not found');
        } catch (Exception $e) {
            // Clean up uploaded file on any error
            if (isset($uploadedFileName) && isset($filePath) && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            
            // Log error for debugging
            Log::error('Assignment creation failed', [
                'module_id' => $moduleId,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with('success', false)
                ->with('error', 'Failed to create assignment: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function submit(Request $request, $assignmentId)
    {
        $user = auth()->user();
        if (!$user->isStudent()) {
            abort(403, 'Only students can submit assignments');
        }

        $validatedData = $request->validate([
            'resource_file' => 'required|file|max:10240|mimes:pdf,doc,docx,txt,zip,rar,ppt,pptx,xls,xlsx', // 10MB limit with file type validation
            'resource_caption' => 'nullable|string|max:100',
        ]);

        $uploadedFileName = null;
        $filePath = null;

        try {
            // Check if assignment exists and is not soft-deleted
            $assignment = Assignment::where('id', $assignmentId)
                ->where('is_deleted', false)
                ->firstOrFail();

            // Validate assignment has started
            if (!$assignment->hasStarted()) {
                return redirect()->back()->with('error', 'Assignment has not started yet.');
            }

            // Validate assignment deadline has not passed
            if ($assignment->isPastDeadline()) {
                return redirect()->back()->with('error', 'Assignment deadline has passed.');
            }

            // Check if student is enrolled in the module
            $module = $assignment->module;
            if (!$module) {
                return redirect()->back()->with('error', 'Assignment module not found.');
            }

            $isEnrolled = $module->students()->where('students.user_id', $user->id)->exists();
            if (!$isEnrolled) {
                abort(403, 'You are not enrolled in this module.');
            }

            // Prepare file upload
            $filePath = Storage::disk('public')->path('/uploads/submissions/');
            
            // Ensure directory exists
            if (!file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }

            // Sanitize filename to prevent path traversal and injection
            $originalFileName = $validatedData['resource_file']->getClientOriginalName();
            $sanitizedFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalFileName);
            $uploadedFileName = time() . '_' . $sanitizedFileName;

            // Use database transaction to ensure data consistency
            DB::transaction(function () use ($validatedData, $filePath, $uploadedFileName, $user, $assignment) {
                // Move uploaded file
                $validatedData['resource_file']->move($filePath, $uploadedFileName);

                // Create resource for the submission
                $resource = Resource::create([
                    'url' => $uploadedFileName,
                    'caption' => $validatedData['resource_caption'] ?? 'Submission: ' . $user->name,
                ]);

                // Check if student already has a submission for this assignment
                $existingSubmission = Submission::where('student_id', $user->id)
                    ->where('assignment_id', $assignment->id)
                    ->where('is_deleted', false)
                    ->first();

                if ($existingSubmission) {
                    // Update existing submission (soft delete old resource if needed)
                    if ($existingSubmission->resource) {
                        $existingSubmission->resource->is_deleted = true;
                        $existingSubmission->resource->save();
                    }
                    
                    // Update submission with new resource
                    $existingSubmission->resource_id = $resource->id;
                    $existingSubmission->grade = null; // Reset grade on resubmission
                    $existingSubmission->feedback = null; // Reset feedback on resubmission
                    $existingSubmission->save();

                    // Link resource to submission
                    $resource->submission_id = $existingSubmission->id;
                    $resource->save();
                } else {
                    // Create new submission record
                    $submission = Submission::create([
                        'student_id' => $user->id,
                        'assignment_id' => $assignment->id,
                        'resource_id' => $resource->id,
                        'is_deleted' => false,
                    ]);

                    // Link resource to submission
                    $resource->submission_id = $submission->id;
                    $resource->save();
                }
            });

            return redirect()->back()->with('message', 'Assignment submitted successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Clean up uploaded file if validation fails
            if ($uploadedFileName && $filePath && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Clean up uploaded file if assignment not found
            if ($uploadedFileName && $filePath && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            return redirect()->back()->with('error', 'Assignment not found.');
        } catch (Exception $e) {
            // Clean up uploaded file on any error
            if ($uploadedFileName && $filePath && file_exists($filePath . $uploadedFileName)) {
                @unlink($filePath . $uploadedFileName);
            }
            
            // Log error for debugging
            Log::error('Assignment submission failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'assignment_id' => $assignmentId,
                'exception' => $e
            ]);
            
            return redirect()->back()->with('error', 'Failed to submit assignment. Please try again.');
        }
    }

    public function update(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'string|max:100',
            'started' => 'date_format:Y-m-d H:i:s|after_or_equal:now',
            'deadline' => 'date_format:Y-m-d H:i:s|after_or_equal:now|after:started',
            'resource_id' => 'required|string', // For future support for multiple resources
            'resource_file' => 'file',
            'resource_caption' => 'string|max:50',
            'topic_id' => 'nullable|exists:topics,id',
        ]);

        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'No assignment found')->with('not-found', true);
            }

            if (isset($validatedData['title'])) {
                $currentAssignment->title = $validatedData['title'];
            }

            if (isset($validatedData['description'])) {
                $currentAssignment->description = $validatedData['description'];
            }

            if (isset($validatedData['started'])) {
                $currentAssignment->started = $validatedData['started'];
            }

            if (isset($validatedData['deadline'])) {
                $currentAssignment->deadline = $validatedData['deadline'];
            }

            if (array_key_exists('topic_id', $validatedData)) {
                $currentAssignment->topic_id = $validatedData['topic_id'];
            }

            if (isset($validatedData['resource_file']) || isset($validatedData['resource_caption']) || isset($validatedData['resource_id'])) {
                $resource = $currentAssignment->resources()->find($validatedData['resource_id']);

                if ($resource) {
                    if (isset($validatedData['resource_file'])) {
                        $filePath = Storage::disk('public')->path('/uploads/resources/');
                        $fileName = $validatedData['resource_file']->getClientOriginalName();

                        if (file_exists($filePath . $fileName)) {
                            unlink($filePath . $fileName);
                        }

                        $validatedData['resource_file']->move($filePath, $fileName);


                        $resource->url = $validatedData['resource_file'];
                    }

                    if (isset($validatedData['resource_caption'])) {
                        $resource->caption = $validatedData['resource_caption'];
                    }
                }

                $resource->save();

            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully updated assignment and resources');

        } catch (Exception $error) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured');
        }
    }

    public function delete(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }
        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'Assignment could not be found');
            }

            $currentAssignment->is_deleted = true;

            $resource = $currentAssignment->resources()->first();

            if ($resource) {
                $resource->is_deleted = true;
                $resource->save();
            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully deleted the assignment');

        } catch (Exception $exception) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured')->with('server-error', true)->with('error', $exception->getMessage());
        }

    }

    public function reset(Request $request, $assignmentId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }
        try {
            $currentAssignment = Assignment::find($assignmentId);

            if (!$currentAssignment) {
                return redirect()->back()->with('success', false)->with('message', 'Assignment could not be found');
            }

            $currentAssignment->is_deleted = false;

            $resource = $currentAssignment->resources()->first();

            if ($resource) {
                $resource->is_deleted = false;
                $resource->save();
            }

            $currentAssignment->save();

            return redirect()->back()->with('success', true)->with('message', 'Successfully deleted the assignment');

        } catch (Exception $exception) {
            return redirect()->back()->with('success', false)->with('message', 'Internal server error occured')->with('server-error', true)->with('error', $exception->getMessage());
        }
    }

    public function grading($moduleId, $assignmentId)
    {
        if (!auth()->user()->isLecturer() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $module = Module::with(['students.user'])->findOrFail($moduleId);
        $assignment = Assignment::findOrFail($assignmentId);
        
        $submissionsWithResources = \Illuminate\Support\Facades\DB::table('submissions')
            ->join('resources', 'submissions.resource_id', '=', 'resources.id')
            ->where('submissions.assignment_id', $assignmentId)
            ->where('submissions.is_deleted', false)
            ->select('submissions.*', 'resources.url as file_url', 'resources.caption as file_caption')
            ->get()
            ->keyBy('student_id');

        $studentsData = $module->students->map(function ($student) use ($submissionsWithResources) {
            $submission = $submissionsWithResources->get($student->user_id);

            return [
                'id' => $student->id, 
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'avatar' => $student->user->avatar,
                'submission' => $submission,
            ];
        });

        return \Inertia\Inertia::render('Assignments/Grading/Main', [
            'module' => $module,
            'assignment' => $assignment,
            'students' => $studentsData
        ]);
    }

    public function storeGrade(Request $request, $submissionId)
    {
        if (!auth()->user()->isLecturer() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string|max:1000',
        ]);

        \Illuminate\Support\Facades\DB::table('submissions')
            ->where('id', $submissionId)
            ->update([
                'grade' => $validated['grade'],
                'feedback' => $validated['feedback'],
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', true)->with('message', 'Grade saved successfully');
    }

}
