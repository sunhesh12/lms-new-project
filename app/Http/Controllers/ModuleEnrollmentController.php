<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\student;
use App\Models\ModuleEnrollment;
use Illuminate\Http\Request;

class ModuleEnrollmentController extends Controller
{
    public function store(Request $request, $moduleId)
    {
        $user = auth()->user();
        $studentId = $request->student_id;

        // If it's a student trying to self-enroll
        if ($user->isStudent()) {
            $studentId = $user->student->id;
        }

        if (!$studentId) {
             return redirect()->back()->with('error', 'Student ID is required');
        }

        $module = Module::findOrFail($moduleId);
        
        // Capacity check
        if ($module->maximum_students > 0 && $module->students()->count() >= $module->maximum_students) {
            return redirect()->back()->with('error', 'Module is full.');
        }

        // Enrollment Key Check
        if (!empty($module->enrollment_key)) {
            if ($request->enrollment_key !== $module->enrollment_key) {
                 return redirect()->back()->withErrors(['enrollment_key' => 'Invalid enrollment key']);
            }
        }

        ModuleEnrollment::updateOrCreate(
            ['module_id' => $moduleId, 'student_id' => $studentId],
            ['status' => 'active']
        );

        return redirect()->back()->with('message', 'Enrollment successful');
    }

    public function destroy($moduleId, $registrationId)
    {
        ModuleEnrollment::where('module_id', $moduleId)
            ->where('id', $registrationId)
            ->delete();

        return redirect()->back()->with('message', 'Student removed from module');
    }
}
