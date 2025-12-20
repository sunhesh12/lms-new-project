<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Seeder;
use Exception;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
                $conversation = Conversation::create([
            'type' => 'private'
        ]);

        $users = User::orderBy('created_at')->get();

        $user2 = User::orderBy('created_at')->skip(1)->first();
        $user4 = User::orderBy('created_at')->skip(3)->first();

        if (!$user2 || !$user4) {
            throw new Exception('Required users not found');
        }


        $conversation->participants()->create(['user_id' => $user2->id]);
        $conversation->participants()->create(['user_id' => $user4->id]);

        $conversation->messages()->create([
            'user_id' => $user2->id,
            'body' => 'Hey Bob! How is the chat app coming along?'
        ]);
        
        $conversation->messages()->create([
            'user_id' => $user4->id,
            'body' => 'Hey Alice, it works great! Real-time is awesome.'
        ]);
    }
}
