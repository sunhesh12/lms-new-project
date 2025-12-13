<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::factory()->create([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
        ]);

        $user2 = User::factory()->create([
            'name' => 'Bob',
            'email' => 'bob@example.com',
            'password' => bcrypt('password'),
        ]);

        $conversation = Conversation::create([
            'type' => 'private'
        ]);

        $conversation->participants()->create(['user_id' => $user1->id]);
        $conversation->participants()->create(['user_id' => $user2->id]);

        $conversation->messages()->create([
            'user_id' => $user1->id,
            'body' => 'Hey Bob! How is the chat app coming along?'
        ]);
        
        $conversation->messages()->create([
            'user_id' => $user2->id,
            'body' => 'Hey Alice, it works great! Real-time is awesome.'
        ]);
    }
}
