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
        $this->apiKey = config('services.deepseek.key', '');
    }

    public function generateResponse(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('DeepSeek API key is missing.');
            return "System configuration error. Please contact the administrator.";
        }

        try {
            $systemPrompt = <<<PROMPT
You are a professional Academic Assistant for an LMS (Learning Management System).
Help students and lecturers with academic questions.
Explain concepts clearly and encourage learning.
Do not give direct answers to assignments without explanation.
If the question is non-academic, politely redirect to educational topics.
PROMPT;

            $response = Http::timeout(20)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ])
                ->post($this->baseUrl, [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 800,
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content')
                    ?? "I couldn't generate a response this time.";
            }

            Log::error('DeepSeek API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return "The AI service is temporarily unavailable. Please try again.";

        } catch (\Throwable $e) {
            Log::error('DeepSeek exception', ['error' => $e->getMessage()]);
            return "An internal error occurred while processing your request.";
        }
    }
}
