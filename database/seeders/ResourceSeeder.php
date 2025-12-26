<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;
use App\Models\Topic;

class ResourceSeeder extends Seeder
{
    public function run()
    {
        $topics = Topic::all();

        if ($topics->isEmpty()) {
            $this->command->warn("No topics found. Please seed topics first.");
            return;
        }

        foreach ($topics as $topic) {
            // Generate 2–5 resources for each topic
            $count = rand(2, 5);

            Resource::factory()
                ->count($count)
                ->create([
                    'topic_id' => $topic->id,
                ]);
        }

        $this->command->info("Seeded resources for {$topics->count()} topics.");
    }
}
