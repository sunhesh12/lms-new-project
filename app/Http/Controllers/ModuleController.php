<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $module = Module::with('topics')->find($id);


        if (!$module) {
            return Inertia::render('404');
        }

        return Inertia::render('Modules/Main', [
            'module' => $module,
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $moduleId)
    {
        // Will return a 422 unprocessable entity response if validation fails
        $validatedData = $request->validate([
            'name' => 'string|max:100',
            'credit_value' => 'integer|min:0',
            'maximum_students' => 'integer|min:0',
            'description' => 'string|max:500',
            'cover_image_url' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // <= IMAGE VALIDATION
        ]);

        $module = Module::find($moduleId);

        if (!$module) {
            return redirect()->route('module.show')->with('error', 'No module found ');
        }

        // If the request contains a file
        if ($request->hasFile('cover_image_url')) {
            // Delete old image if exists
            if ($module->cover_image_url && file_exists(public_path('uploads/modules/' . $module->cover_image_url))) {
                unlink(public_path('uploads/modules/' . $module->cover_image_url));
            }

            // Generate unique name
            $fileName = time() . '_' . $request->cover_image_url->getClientOriginalName();

            // Save file to /public/uploads/modules
            $request->cover_image_url->move(public_path('uploads/modules'), $fileName);

            $validatedData['cover_image_url'] = $fileName;

        }

        if(empty($validatedData)) {
            return redirect()->route("module.show", $moduleId)->with('message', 'No changes made for module');
        }

        if(isset($validatedData['name'])) {
            $module->name = $validatedData['name'];
        }

        if(isset($validatedData['credit_value'])) {
            $module->credit_value = $validatedData['credit_value'];
        }

        if(isset($validatedData['maximum_students'])) {
            $module->maximum_students = $validatedData['maximum_students'];
        }

        if(isset($validatedData['description'])) {
            $module->description = $validatedData['description'];
        }

        return redirect()->route("module.show", $moduleId)->with('message', 'Module updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module, $moduleId)
    {
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $module->update(['is_deleted' => true]);

        return redirect()->back()->with('message', 'Module deleted successfully');
    }
}
