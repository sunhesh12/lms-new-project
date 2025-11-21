<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            [
                'id' => Str::uuid(),
                'name' => 'Information Systems',
                'credit_value' => 4,
                'maximum_students' => 60,
                'description' => 'Covers systems analysis, design, and business process modeling.',
            ],
            [   
                'id' => Str::uuid(),
                'name' => 'Software Engineering',
                'credit_value' => 5,
                'maximum_students' => 70,
                'description' => 'Focuses on software design, development, testing, and project management.',
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Computer Science',
                'credit_value' => 5,
                'maximum_students' => 80,
                'description' => 'Explores algorithms, data structures, and core computer science principles.',
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
