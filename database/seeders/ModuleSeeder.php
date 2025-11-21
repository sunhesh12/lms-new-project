<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Course;
use App\Models\PortalUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ModuleSeeder extends Seeder
{
    public function run()
    {
        // Make sure there are some courses and portal users first
        $courses = Course::all();
        $teachers = PortalUser::where('Role', '=', 'lecturer')->get();

        // Optional check to avoid running without related data
        if ($courses->isEmpty() || $teachers->isEmpty()) {
            $this->command->warn('No courses or users found. Please seed those first.');
            return;
        }

        // Seed 10 modules
        for ($i = 1; $i <= 10; $i++) {
            $course = $courses->random(); // Random course

            $module = Module::create([
                'id' => Str::uuid(),
                'module_name' => 'Module ' . $i,
                'description' => 'This is the description for Module ' . $i,
                'credit_value' => rand(2, 5),
                'practical_exam_count' => rand(0, 2),
                'writing_exam_count' => rand(0, 2),
            ]);

            // Attach 1–3 random teachers
            $module->courses()->attach($course->id);
            $module->teachers()->attach($teachers->random(rand(1, 2))->pluck('id')->toArray());
        }
    }
}
