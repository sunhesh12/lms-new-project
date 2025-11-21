<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;

class NewModuleSeeder extends Seeder
{
    public function run(): void
    {
        Module::factory()->count(10)->create();
    }
}
