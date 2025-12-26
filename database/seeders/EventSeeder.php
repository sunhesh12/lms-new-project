<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user, or create one if none exists
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'id' => \Illuminate\Support\Str::uuid(), // Generate UUID
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'), // Default password
            ]);
        }

        // Sample events for the current month
        $events = [
            [
                'user_id' => $user->id,
                'title' => 'Team Meeting',
                'description' => 'Weekly team sync-up meeting',
                'date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'start_time' => '09:00',
                'end_time' => '10:00',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Project Deadline',
                'description' => 'Final submission for Q4 project',
                'date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'start_time' => '17:00',
                'end_time' => '18:00',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Client Presentation',
                'description' => 'Present new product features to client',
                'date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'start_time' => '14:00',
                'end_time' => '15:30',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Code Review',
                'description' => 'Review pull requests with senior developer',
                'date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'start_time' => '11:00',
                'end_time' => '12:00',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Lunch Break',
                'description' => 'Team lunch at the new restaurant',
                'date' => Carbon::now()->addDays(4)->format('Y-m-d'),
                'start_time' => '12:30',
                'end_time' => '13:30',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Training Session',
                'description' => 'Laravel advanced features workshop',
                'date' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'start_time' => '10:00',
                'end_time' => '16:00',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Sprint Planning',
                'description' => 'Plan tasks for the next sprint',
                'date' => Carbon::now()->addDays(1)->format('Y-m-d'),
                'start_time' => '09:30',
                'end_time' => '11:00',
            ],
            [
                'user_id' => $user->id,
                'title' => 'Birthday Party',
                'description' => "Colleague's birthday celebration",
                'date' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'start_time' => '18:00',
                'end_time' => '20:00',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

        $this->command->info('Events seeded successfully!');
    }
}