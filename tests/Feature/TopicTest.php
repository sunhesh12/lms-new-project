<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Module;
use Tests\TestCase;

class TopicTest extends TestCase
{
    public $moduleId = "04501d99-6de3-4821-9a12-8416179c6fb1";
    public $topicId = "1ac58ef4-5042-4248-a196-6ec7e2e305a0";

    /**
     * A basic feature test example.
     */
    // public function test_example(): void
    // {
    //     $response = $this->get('/');

    //     $response->assertStatus(200);
    // }

    public function test_topic_create(): void
    {
        // Creating a test module for testing
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        if(!$module) {
            dd("No module found");
        }

        $response = $this->post(route('topic.create', [$module->id]), [
            'topic_name' => 'New Topic',
            'description' => 'Description for the new topic.',
        ]);

        $response->assertStatus(200);
    }

    public function test_topic_update(): void
    {
        // Creating a test module for testing
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $topic = $module->topics()->create([
            'topic_name' => 'Initial Topic',
            'description' => 'Initial description.',
        ]);

        $response = $this->patch(route('topic.update', [$module->id, $topic->id]), [
            'topic_name' => 'Updated Topic Name',
            'description' => 'Updated description for the topic.',
        ]);

        $response->assertStatus(200);
    }

    public function test_topic_delete(): void
    {
        $module = Module::factory()->create([
            'name' => 'Test Module',
            'description' => 'This is a test module.',
        ]);

        $topic = $module->topics()->create([
            'topic_name' => 'Topic to be deleted',
            'description' => 'Description for the topic to be deleted.',
        ]);

        $response = $this->delete(route('topic.delete', [$module->id, $topic->id]));

        $response->assertStatus(200);
    }
}
