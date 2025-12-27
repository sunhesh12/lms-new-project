<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Module;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DummyAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = Module::where('is_deleted', false)->get();

        if ($modules->isEmpty()) {
            $this->command->info('No modules found. Please seed modules first.');
            return;
        }

        foreach ($modules as $module) {
            // 1. Past Assignment (Closed)
            Assignment::create([
                'module_id' => $module->id,
                'title' => 'Essay: Historical Analysis (Closed)',
                'description' => 'Write a 2000-word essay on the impact of the industrial revolution. This assignment is already due.',
                'started' => Carbon::now()->subDays(14),
                'deadline' => Carbon::now()->subDays(2), // Due 2 days ago
                'is_deleted' => false,
            ]);

            // 2. Active Assignment (Open)
            Assignment::create([
                'module_id' => $module->id,
                'title' => 'Lab Report: Experiment 4 (Active)',
                'description' => 'Submit your findings for the weekly lab session. Please include all graphs and raw data.',
                'started' => Carbon::now()->subDays(2),
                'deadline' => Carbon::now()->addDays(5), // Due in 5 days
                'is_deleted' => false,
            ]);

            // 3. Future Assignment (Upcoming)
            Assignment::create([
                'module_id' => $module->id,
                'title' => 'Final Project Proposal (Upcoming)',
                'description' => 'Submit your proposed topic for the final project. Approval required before proceeding.',
                'started' => Carbon::now()->addDays(7), // Starts in a week
                'deadline' => Carbon::now()->addDays(14),
                'is_deleted' => false,
            ]);
        }
    }
}
