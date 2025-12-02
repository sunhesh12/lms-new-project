<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Topic;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'url' => $this->faker->url(),
            'caption' => $this->faker->sentence(),
            'is_deleted' => false,

            // pick an existing topic OR create one if none exist
            'topic_id' => Topic::query()->inRandomOrder()->value('id') ?? Topic::factory(),
        ];
    }
}
