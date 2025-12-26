<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ModuleController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isStudent()) {
            $enrolledIds = $user->student->enrolledModules()->pluck('modules.id')->toArray();
            
            $enrolled_modules = $user->student->enrolledModules()
                ->where('is_deleted', false)
                ->get();
                
            $available_modules = Module::where('is_deleted', false)
                ->whereNotIn('id', $enrolledIds)
                ->get();

            return Inertia::render('Modules/Index', [
                'enrolled_modules' => $enrolled_modules,
                'available_modules' => $available_modules
            ]);
        } else {
            // For teachers/admins, show all active modules
            $modules = Module::where('is_deleted', false)->get();
            return Inertia::render('Modules/Index', [
                'modules' => $modules
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'credit_value' => 'required|integer|min:0',
            'maximum_students' => 'required|integer|min:0',
            'description' => 'required|string|max:500',
        ]);

        $module = Module::create($request->all());

        return redirect()->route('module.show', $module->id)->with('message', 'Module created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = auth()->user();
        
        $module = Module::with([
            'topics' => function ($query) {
                $query->where('is_deleted', false)->with([
                    'resources' => function ($resourcesQuery) {
                        $resourcesQuery->where('is_deleted', false);
                    }
                ]);
            },
            'assignments' => function ($query) {
                $query->where('is_deleted', false);
            },
            'quizzes' => function ($query) {
                $query->where('is_active', true);
            },
            'students' => function ($query) {
                $query->with('user');
            },
            'lecturers' => function ($query) {
                $query->with('user');
            }
        ])->where('is_deleted', false)->find($id);

        if (!$module) {
            return Inertia::render('404');
        }

        // Student access check: must be enrolled
        if ($user->isStudent()) {
            $isEnrolled = $module->students()->where('student_id', $user->student->id)->exists();
            if (!$isEnrolled) {
                return redirect()->route('modules.index')->with('error', 'You are not enrolled in this module.');
            }
        }

        return Inertia::render('Modules/Main', [
            'module' => $module,
        ]);
    }

    /**
     * Manage module staff (Lecturers/Assistants).
     */
    public function manageStaff(Request $request, $moduleId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $request->validate([
            'lecture_id' => 'required|exists:lectures,id',
            'role' => 'required|string|in:lecturer,assistant',
            'action' => 'required|string|in:add,remove',
        ]);

        $module = Module::findOrFail($moduleId);

        if ($request->action === 'add') {
            $module->lecturers()->syncWithoutDetaching([
                $request->lecture_id => ['role' => $request->role]
            ]);
        } else {
            $module->lecturers()->detach($request->lecture_id);
        }

        return redirect()->back()->with('message', 'Staff updated successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $moduleId)
    {
        if (auth()->user()->isStudent()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'name' => 'string|max:100',
            'credit_value' => 'integer|min:0',
            'maximum_students' => 'integer|min:0',
            'description' => 'string|max:500',
            'cover_image_url' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $module = Module::findOrFail($moduleId);

        // If the request contains a file
        if ($request->hasFile('cover_image_url')) {
            $filePath = Storage::disk('public')->path('/uploads/modules/');
            $fileName = $validatedData['cover_image_url']->getClientOriginalName();

            // Delete old image if exists
            if ($module->cover_image_url && file_exists($filePath . $fileName)) {
                // unlink($filePath . $fileName); // Keep for safety or implement proper deletion
            }

            $request->cover_image_url->move($filePath, $fileName);
            $validatedData['cover_image_url'] = $fileName;
        }

        $module->update($validatedData);

        return redirect()->route("module.show", $moduleId)->with('message', 'Module updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($moduleId)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $module = Module::findOrFail($moduleId);
        $module->update(['is_deleted' => true]);

        return redirect()->route('modules.index')->with('message', 'Module deleted successfully');
    }
}
