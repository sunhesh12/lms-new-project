<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openai.com/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.openai.key', env('OPENAI_API_KEY', ''));
    }

    public function generateResponse(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is missing.');
            return "AI configuration error (OpenAI). Please contact admin.";
        }

        try {
            $resp = Http::withToken($this->apiKey)
                ->post($this->baseUrl, [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are an academic assistant.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 800,
                ]);

            if ($resp->successful()) {
                return $resp->json('choices.0.message.content') ?? 'No response.';
            }

            Log::error('OpenAI API error', ['status' => $resp->status(), 'body' => $resp->body()]);
            return 'OpenAI service unavailable.';
        } catch (\Throwable $e) {
            Log::error('OpenAI exception', ['error' => $e->getMessage()]);
            return 'An internal error occurred while contacting OpenAI.';
        }
    }
}
