<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            [
                'course_name' => 'Information Systems',
                'credit_value' => 4,
                'maximum_students' => 60,
                'description' => 'Covers systems analysis, design, and business process modeling.',
            ],
            [
                'course_name' => 'Software Engineering',
                'credit_value' => 5,
                'maximum_students' => 70,
                'description' => 'Focuses on software design, development, testing, and project management.',
            ],
            [
                'course_name' => 'Computer Science',
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
