<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Topic;

class NewTopicSeeder extends Seeder
{
    public function run(): void
    {
        Topic::factory()->count(30)->create(); // 30 random topics
    }
}
