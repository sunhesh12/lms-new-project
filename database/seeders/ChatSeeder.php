<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        // $user1 = User::factory()->create([
        //     'name' => 'Alice',
        //     'email' => 'alice@example.com',
        //     'password' => bcrypt('password'),
        // ]);

        // $user2 = User::factory()->create([
        //     'name' => 'Sofia Lehner',
        //     'email' => 'zhaley@example.net',
        //     'password' => bcrypt('password123'),
        // ]);

        $conversation = Conversation::create([
            'type' => 'private'
        ]);

        // $conversation->participants()->create(['user_id' => $user1->id]);
        // $conversation->participants()->create(['user_id' => $user2->id]);

        $conversation->messages()->create([
            'user_id' => '69dd48a9-d84c-11f0-9d10-581122893bd3',
            'body' => 'Hey Bob! How is the chat app coming along?'
        ]);
        
        $conversation->messages()->create([
            'user_id' => '69dd4a7a-d84c-11f0-9d10-581122893bd3',
            'body' => 'Hey Alice, it works great! Real-time is awesome.'
        ]);
    }
}
