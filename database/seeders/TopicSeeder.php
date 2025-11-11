<?php

namespace Database\Seeders;

use App\Models\Topic;
use App\Models\Module;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    public function run()
    {
        $moduleIds = Module::pluck('id')->toArray();

        if (empty($moduleIds)) {
            $this->command->warn("No modules found. Please seed modules first.");
            return;
        }

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
            'Blockchain Basics'
        ];

        $types = ['Lecture', 'Tutorial', 'Lab', 'Workshop'];

        $topicCount = min(rand(20, 40), count($sampleTitles));


        for ($i = 1; $i <= 10; $i++) {
            Topic::create([
                'title' => fake()->unique()->randomElement($sampleTitles),
                'description' => fake()->sentence(8),
                'type' => fake()->randomElement($types),
                'is_visible' => fake()->boolean(80), // 80% chance true
                'is_complete' => fake()->boolean(50),
                'module_id' => fake()->randomElement($moduleIds)
            ]);
        }

        $this->command->info("Seeded $topicCount topics across " . count($moduleIds) . " modules.");
    }
}
