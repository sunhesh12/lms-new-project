<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = (string) config('services.groq.key', '');
    }

    public function generateResponse(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('Groq API key is missing.');
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

            $response = Http::timeout(25)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl, [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content')
                    ?? "I couldn't generate a response this time.";
            }

            if ($response->status() === 401) {
                Log::error('Groq API Error: Unauthorized (Invalid Key)');
                return "Configuration Error: The Groq API key is invalid.";
            }

            if ($response->status() === 429) {
                Log::error('Groq API Error: Rate Limit Exceeded');
                return "The AI is currently busy (Rate Limit). Please try again later.";
            }

            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return "The AI service is temporarily unavailable (Status: " . $response->status() . ").";

        } catch (\Throwable $e) {
            Log::error('Groq exception', ['error' => $e->getMessage()]);
            return "An internal error occurred.";
        }
    }
}
