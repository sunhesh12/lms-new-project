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
            'topics' => function ($query) use ($user) {
                $query->where('is_deleted', false)->with([
                    'resources' => function ($resourcesQuery) {
                        $resourcesQuery->where('is_deleted', false);
                    },
                    'assignments' => function ($assignmentsQuery) use ($user) {
                        $assignmentsQuery->where('is_deleted', false)->with(['submissions' => function($q) use ($user) {
                             $q->where('student_id', $user->id);
                        }]);
                    }
                ]);
            },
            'assignments' => function ($query) use ($user) {
                $query->where('is_deleted', false)->with(['resources', 'submissions' => function ($q) use ($user) {
                    $q->where('student_id', $user->id);
                }]);
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

        // Access Control
        $isStaff = $user->isAdmin() || $user->isLecturer();

        if (!$isStaff) {
            // Check enrollment for non-staff users
            // We use whereHas or join to check against the user_id on the student record
            $isEnrolled = $module->students()->where('students.user_id', $user->id)->exists();
            if (!$isEnrolled) {
                return redirect()->route('module.join_page', $id);
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
            'enrollment_key' => 'nullable|string|max:50',
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

    public function joinPage($moduleId)
    {
        $user = auth()->user();
        
        // Admin and lecturers should see the module directly, not the join page
        if ($user->isAdmin() || $user->isLecturer()) {
            return redirect()->route('module.show', $moduleId);
        }

        // All other users (students and regular users) can access the join page
        $module = Module::select('id', 'name', 'credit_value', 'description', 'cover_image_url', 'maximum_students', 'enrollment_key')
            ->with(['lecturers.user'])
            ->findOrFail($moduleId);

        // Check if already enrolled (for users with student records)
        if ($user->student && $module->students()->where('student_id', $user->student->id)->exists()) {
             return redirect()->route('module.show', $moduleId);
        }

        return Inertia::render('Modules/Join', [
            'module' => $module
        ]);
    }
}
