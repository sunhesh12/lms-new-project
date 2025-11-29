<?php

namespace Tests\Feature;
use App\Models\Module;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ModuleTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_module_create(): void
    {

        $response = $this->post(route('module.create', []), [
            'name' => 'New Module',
            'credit_value' => 3,
            'maximum_students' => 30,
            'description' => 'Description for the new module.',
        ]);

        $response->assertRedirect();
    }

    public function test_module_update(): void
    {

        $this->withoutExceptionHandling();

        Storage::fake('public');

        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        // Create a fake image
        $fakeImage = UploadedFile::fake()->image('cover.jpg', 600, 600);

        $response = $this->patch(route('module.update', [$module->id]), [
            'name' => 'New Module',
            'credit_value' => 3,
            'maximum_students' => 30,
            'description' => 'Description for the new module.',
            'cover_image' => $fakeImage
        ]);

        // Assertions
        $response->assertRedirect(); // or ->assertStatus(302)
        $response->assertSessionHas('message', 'Module updated successfully');

    }

    public function test_module_delete()
    {
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $response = $this->delete(route('module.delete', [$module->id]));

        $response->assertRedirect();
    }
}
