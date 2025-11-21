<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),

            // A quiz must belong to a topic
            'topic_id' => Topic::inRandomOrder()->value('id') ?? Topic::factory()->create()->id,

            'heading' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(6),

            'start_time' => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            'end_time' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),

            // Duration in minutes
            'duration_minutes' => $this->faker->numberBetween(10, 180),

            'is_deleted' => false,
        ];
    }
}
