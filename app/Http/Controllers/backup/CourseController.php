<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\CreateCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Exception;

class CourseController extends Controller
{
    public function listModules($course_id)
    {
        $course=Course::find($course_id);

        if(!$course) {
            return ResponseHelper::notFound('Course not found');
        }
        
        return ResponseHelper::success("Modules returned successfully",$course->modules);
    }

    public function attachModules(Request $request, $course_id)
    {
        $course = Course::find($course_id);
        $moduleIds = $request->module_ids; // Expecting an array of module IDs
        $course->modules()->attach($moduleIds);

        return ResponseHelper::success("Module attached successfully", $course->modules);
    }

    public function detachModules(Request $request, $course_id)
    {
        $course = Course::find($course_id);
        $moduleIds = $request->module_ids;
        $detachedModules = $course->modules()
            ->whereIn('modules.id', $moduleIds) // Explicitly specify the table name
            ->get();

        if ($detachedModules->isEmpty()) {
            return ResponseHelper::notFound('No matching modules found to detach');
        }
        $course->modules()->detach($moduleIds);

        return ResponseHelper::success("modules deleted successfully",$detachedModules);
    }

    public function getCourseById($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return ResponseHelper::notFound('Course not found');
        }

        return ResponseHelper::success('Course fetched successfully', $course);
    }

    public function createCourse(CreateCourseRequest $request)
    {
        // Only submission is via form
        if (!$request->accepts('multipart/form-data')) {
            return ResponseHelper::invalidMedia();
        }

        // Only allow POST requests
        if (!$request->isMethod('post')) {
            return ResponseHelper::methodInvalid();
        }

        $course_name = $request->input('course_name');
        $description = $request->input('description');
        $credit_value = $request->input('credit_value');
        $maximum_students = $request->input('maximum_students');
        
        try {
            $course = Course::create([
                'course_name' => $course_name,
                'description' => $description,
                'credit_value' => $credit_value,
                'maximum_students' => $maximum_students
            ]);

            return ResponseHelper::success('Course created successfully', $course);
        } catch(QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            // When a general server exception has occured
            return ResponseHelper::serverError($e->getMessage());
        }
    }


}
