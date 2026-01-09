<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = (string) (config('services.gemini.key') ?? env('GEMINI_API_KEY', ''));
    }

    /**
     * Generate a text response from Gemini.
     * Returns a user-friendly string on success or a helpful message on failure.
     */
    public function generateResponse(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API key is not set.');
            return "AI configuration error: Gemini API key missing. Please contact the administrator.";
        }

        try {
            $systemPrompt = "You are a professional Academic Assistant for an LMS (Learning Management System). "
                . "Provide concise, helpful academic guidance and avoid giving direct answers to assignment questions without explanation.";

            $payload = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemPrompt . "\n\nUser Question: " . $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ]
            ];

            $response = Http::post($this->baseUrl . '?key=' . $this->apiKey, $payload);

            if ($response->successful()) {
                $data = $response->json();

                $text = null;
                if (!empty($data['candidates']) && is_array($data['candidates'])) {
                    $candidate = $data['candidates'][0] ?? null;
                    if ($candidate && !empty($candidate['content']['parts'])) {
                        $text = $candidate['content']['parts'][0]['text'] ?? null;
                    }
                }

                return $text ?? "I'm having trouble generating a response right now.";
            }

            Log::error('Gemini API Error', ['status' => $response->status(), 'body' => $response->body()]);
            return "Gemini service unavailable. Please try again later.";

        } catch (\Throwable $e) {
            Log::error('Gemini Service Exception', ['error' => $e->getMessage()]);
            return "An internal error occurred while contacting the Gemini service.";
        }
    }
}
