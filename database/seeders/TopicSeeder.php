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

        // Number of topics to generate
        $topicCount = rand(20, 40);

        Topic::factory()
            ->count($topicCount)
            ->create();

        $this->command->info("Seeded $topicCount topics across " . count($moduleIds) . " modules.");
    }
}
