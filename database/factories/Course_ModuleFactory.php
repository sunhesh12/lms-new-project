<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\Module;
use App\Models\Faculty;

class Course_ModuleFactory extends Factory
{
    public function definition()
    {
        return [
            'id' => Str::uuid(),
            'course_id' => Course::inRandomOrder()->first()->id ?? null,
            'module_id' => Module::inRandomOrder()->first()->id ?? null,
            'faculty_id' => Faculty::inRandomOrder()->first()->id ?? null,
            'semester' => $this->faker->randomElement(['Spring', 'Fall', 'Summer']),
            'year' => $this->faker->numberBetween(2023, 2026),
            'is_optional' => $this->faker->boolean(20), // 20% chance optional
        ];
    }
}
