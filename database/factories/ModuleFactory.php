<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ModuleFactory extends Factory
{
    public function definition()
    {
        return [
            'id' => Str::uuid(),
            'name' => $this->faker->randomElement([
                'Software Engineering',
                'Database Systems',
                'Machine Learning',
                'Human Computer Interaction',
                'Web Application Development'
            ]),
            'is_deleted' => 0,
            'credit_value' => $this->faker->randomElement(['2', '3', '4']),
            'maximum_students' => $this->faker->numberBetween(50, 200),
            'description' => $this->faker->sentence(8),
            'enrollment_key' => '1234',
        ];
    }
}
