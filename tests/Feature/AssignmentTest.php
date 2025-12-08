<?php

namespace Tests\Feature;

use App\Models\Module;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AssignmentTest extends TestCase
{
    public function test_create()
    {
        $module = Module::first();

        $response = $this->post(route("assignment.create", $module->id), [
            'title' => 'Test Assignment',
            'description' => 'Test assignment description',
            'started' => '2027-12-10 16:43:19',
            'deadline' => '2028-12-10 16:43:19',
            'resource_file' => UploadedFile::fake()->create('testfile.txt', 2),
            'resource_caption' => 'Test resource caption',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', true);
    }
}
