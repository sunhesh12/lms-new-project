<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClaudeService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.anthropic.com/v1/complete'; // placeholder

    public function __construct()
    {
        $this->apiKey = (string) (config('services.claude.key') ?? env('CLAUDE_API_KEY', ''));
    }

    public function generateResponse(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('Claude API key is missing.');
            return "AI configuration error (Claude). Please contact admin.";
        }

        try {
            $resp = Http::withToken($this->apiKey)
                ->post($this->baseUrl, [
                    'model' => 'claude-v1',
                    'prompt' => $prompt,
                ]);

            if ($resp->successful()) {
                return $resp->json('completion') ?? 'No response.';
            }

            Log::error('Claude API error', ['status' => $resp->status(), 'body' => $resp->body()]);
            return 'Claude service unavailable.';
        } catch (\Throwable $e) {
            Log::error('Claude exception', ['error' => $e->getMessage()]);
            return 'An internal error occurred while contacting Claude.';
        }
    }
}
