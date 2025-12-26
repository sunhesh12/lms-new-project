<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;

class ModuleSeeder extends Seeder
{
    public function run()
    {
        // Seed 10 modules using the factory
        Module::factory()->count(20)->create();
    }
}
