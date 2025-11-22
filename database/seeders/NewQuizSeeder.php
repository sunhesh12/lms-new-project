<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quiz;
use App\Models\Topic;

class NewQuizSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure some topics exist before quizzes
        if (Topic::count() == 0) {
            Topic::factory()->count(5)->create();
        }

        // Create quizzes
        Quiz::factory()->count(10)->create();
    }
}
