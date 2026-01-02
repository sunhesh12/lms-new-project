<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepSeekService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.deepseek.com/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.key') ?? env('DEEPSEEK_API_KEY', '');
    }

    public function generateResponse(string $prompt): ?string
    {
        if (empty($this->apiKey)) {
            Log::error('DeepSeek API key is not set.');
            return "I'm sorry, but my brain (API Key) is currently disconnected. Please contact the administrator.";
        }

        try {
            $systemPrompt = "You are a professional Academic Assistant for an LMS (Learning Management System). 
            Your goal is to help students and lecturers with academic queries, explain complex concepts, and provide study guidance.
            Keep your responses concise, professional, and encouraging.
            If a question is completely non-academic, politely guide the user back to educational topics.
            Do not provide direct answers for assignments without explanation; focus on helping the user learn.";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl, [
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? "I'm having trouble processing that right now.";
            }

            Log::error('DeepSeek API Error: ' . $response->body());
            return "I'm currently experiencing some technical difficulties. Please try again in a moment.";

        } catch (\Exception $e) {
            Log::error('DeepSeek Service Exception: ' . $e->getMessage());
            return "Something went wrong while I was thinking. Let's try that again.";
        }
    }
}
