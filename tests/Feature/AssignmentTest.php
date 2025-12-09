<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\Module;
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

        $this->assertFileExists(Storage::disk('public')->path('/uploads/resources/' . 'testfile.txt'));
    }

    public function test_update()
    {

        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $assignment = $module->assignments()->create([
            'title' => 'Test Assignment',
            'started' => '2027-12-10 16:43:19',
            'description' => 'Test assignment description',
            'deadline' => '2028-12-10 16:43:19',
        ]);

        $fakeFile = UploadedFile::fake()->create('testfile.txt', 2);

        $resource = $assignment->resources()->create([
            'url' => $fakeFile->getClientOriginalName(),
            'caption' => 'Sample caption',
        ]);

        $response = $this->post(route("assignment.update", $assignment->id), [
            'title' => 'Changed Test Assignment',
            'description' => 'Changed Test assignment description',
            'started' => '2028-10-12 16:43:19',
            'deadline' => '2029-12-10 16:43:19',
            'resource_id' => $resource->id,
            'resource_file' => UploadedFile::fake()->create('changed-testfile.txt', 1),
            'resource_caption' => 'Changed Test resource caption',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', true);

        $this->assertFileExists(Storage::disk('public')->path('/uploads/resources/' . 'changed-testfile.txt'));
    }

    public function test_delete_reset()
    {
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $assignment = $module->assignments()->create([
            'title' => 'Test Assignment',
            'started' => '2027-12-10 16:43:19',
            'description' => 'Test assignment description',
            'deadline' => '2028-12-10 16:43:19',
        ]);

        $fakeFile = UploadedFile::fake()->create('testfile.txt', 2);

        $assignment->resources()->create([
            'url' => $fakeFile->getClientOriginalName(),
            'caption' => 'Sample caption',
        ]);

        $response = $this->post(route("assignment.delete", $assignment->id));

        $response->assertRedirect();
        $response->assertSessionHas('not-found', false);
        $response->assertSessionHas('server-error', false);
        $response->assertSessionHas('success', true);

        $response = $this->post(route("assignment.reset", $assignment->id));

        $response->assertRedirect();
        $response->assertSessionHas('not-found', false);
        $response->assertSessionHas('server-error', false);
        $response->assertSessionHas('success', true);
    }
}
