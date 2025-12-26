<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with('faculty')->get();
        return \Inertia\Inertia::render('Course', [
            'courses' => $courses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'faculty_id' => 'required|exists:faculties,id',
        ]);

        Course::create($validated);

        return redirect()->back()->with('message', 'Course created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $course = Course::with(['faculty', 'modules'])->findOrFail($id);
        return \Inertia\Inertia::render('Course/Show', [
            'course' => $course
        ]);
    }
}
