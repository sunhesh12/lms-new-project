<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Module;

class TopicFactory extends Factory
{
    public function definition()
    {
        return [
            'id' => Str::uuid(),
            'module_id' => Module::inRandomOrder()->first()->id ?? null,
            'topic_name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'is_deleted'=> false,
            'is_announcement'=> false
        ];
    }
}
