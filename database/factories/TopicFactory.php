<?php

namespace Database\Factories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TopicFactory extends Factory
{
    public function definition(): array
    {
        $sampleTitles = [
            'Introduction to Programming',
            'Database Design',
            'Software Testing Techniques',
            'Agile Methodologies',
            'Version Control with Git',
            'Web Development Basics',
            'Data Structures and Algorithms',
            'Operating Systems Overview',
            'Computer Networks',
            'Security Fundamentals',
            'Object-Oriented Programming',
            'Mobile App Development',
            'API Development and REST',
            'Frontend Frameworks',
            'Backend Development with Laravel',
            'Machine Learning Basics',
            'UI/UX Principles',
            'Cloud Computing',
            'DevOps Practices',
            'Deployment Strategies',
            'Software Maintenance',
            'Debugging Techniques',
            'Big Data Introduction',
            'Cybersecurity Essentials',
            'Blockchain Basics',
        ];

        $types = ['Lecture', 'Tutorial', 'Lab', 'Workshop'];

        return [
            'id' => Str::uuid(),
            'title' => $this->faker->unique()->randomElement($sampleTitles),
            'description' => $this->faker->sentence(8),
            'type' => $this->faker->randomElement($types),
            'is_visible' => $this->faker->boolean(80),
            'is_complete' => $this->faker->boolean(50),

            // Use an existing module OR create a new one
            'module_id' => Module::query()->inRandomOrder()->value('id') ?? Module::factory(),
        ];
    }
}
