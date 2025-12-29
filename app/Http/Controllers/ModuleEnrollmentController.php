<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\student;
use App\Models\ModuleEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleEnrollmentController extends Controller
{
    public function store(Request $request, $moduleId)
    {
        // return Inertia::render('Modules/Join');
        $user = auth()->user();
        $module = Module::findOrFail($moduleId);
        
        // Determine if this is admin/lecturer adding a student or self-enrollment
        $isAdminEnrollment = $request->student_id && ($user->isAdmin() || $user->isLecturer());
        
        // STEP 1: Validate enrollment key FIRST (for self-enrollment only)
        if (!$isAdminEnrollment && !empty($module->enrollment_key)) {
            // Check if key already validated in session
            $sessionKey = "module_{$moduleId}_key_validated";
            
            if (!session($sessionKey)) {
                // Validate enrollment key before doing anything else
                $request->validate([
                    'enrollment_key' => 'required|string'
                ]);
                
                if ($request->enrollment_key !== $module->enrollment_key) {
                    return redirect()->back()->withErrors([
                        'enrollment_key' => 'Invalid enrollment key. Please try again.'
                    ]);
                }
                
                // Store validated key in session so we don't ask again
                session([$sessionKey => true]);
            }
        }
        
        // STEP 2: Determine student ID
        if ($isAdminEnrollment) {
            // Admin/lecturer enrolling a specific student
            $studentId = $request->student_id;
        } else {
            // Student self-enrolling - create student record if needed
            if (!$user->student) {
                $user->student()->create([
                    'academic_year' => date('Y'),
                ]);
                $user->load('student');
            }
            $studentId = $user->student->id;
        }

        if (!$studentId) {
            return redirect()->back()->with('error', 'Student ID is required');
        }
        
        // STEP 3: Check if already enrolled
        $existing = ModuleEnrollment::where('module_id', $moduleId)
            ->where('student_id', $studentId)
            ->first();

        if ($existing) {
            return redirect()->back()->with('message', 'Already enrolled in this module');
        }
        
        // STEP 4: Check capacity
        if ($module->maximum_students > 0 && $module->students()->count() >= $module->maximum_students) {
            return redirect()->back()->with('error', 'Module is full. No seats available.');
        }

        // STEP 5: Create enrollment (only after all validations pass)
        ModuleEnrollment::create([
            'module_id' => $moduleId,
            'student_id' => $studentId,
            'status' => 'active'
        ]);

        // Redirect to module page after successful enrollment
        if ($isAdminEnrollment) {
            return redirect()->back()->with('message', 'Student enrolled successfully');
        } else {
            return redirect()->route('module.show', $moduleId)->with('message', 'Successfully enrolled in module!');
        }
    }

    public function destroy($moduleId, $registrationId)
    {
        ModuleEnrollment::where('module_id', $moduleId)
            ->where('id', $registrationId)
            ->delete();

        return redirect()->back()->with('message', 'Student removed from module');
    }

    /**
     * Remove all enrollments from a module (Admin only)
     */
    public function destroyAll($moduleId)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !$user->isLecturer()) {
            abort(403, 'Unauthorized');
        }

        $count = ModuleEnrollment::where('module_id', $moduleId)->count();
        ModuleEnrollment::where('module_id', $moduleId)->delete();

        return redirect()->back()->with('message', "Removed {$count} student(s) from module");
    }

    /**
     * Get available students for enrollment (excludes already enrolled students)
     */
    public function availableStudents(Request $request, $moduleId)
    {
        // Only admin/lecturers can search for students to enroll
        $user = auth()->user();
        if (!$user->isAdmin() && !$user->isLecturer()) {
            abort(403, 'Unauthorized');
        }

        $query = $request->query('query', '');
        $module = Module::findOrFail($moduleId);
        
        // Get IDs of already enrolled students
        $enrolledStudentIds = $module->students()->pluck('students.id');
        
        // Search students NOT already enrolled
        $availableStudents = student::with('user')
            ->whereNotIn('id', $enrolledStudentIds)
            ->whereHas('user', function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(50)
            ->get();
        
        return response()->json($availableStudents);
    }
}
