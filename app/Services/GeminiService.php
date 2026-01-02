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
        $this->apiKey = config('services.gemini.key') ?? env('GEMINI_API_KEY', '');
    }

    public function generateResponse(string $prompt): ?string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API key is not set.');
            return "I'm sorry, but my brain (API Key) is currently disconnected. Please contact the administrator.";
        }

        try {
            $systemPrompt = "You are a professional Academic Assistant for an LMS (Learning Management System). 
            Your goal is to help students and lecturers with academic queries, explain complex concepts, and provide study guidance.
            Keep your responses concise, professional, and encouraging.
            If a question is completely non-academic, politely guide the user back to educational topics.
            Do not provide direct answers for assignments without explanation; focus on helping the user learn.";

            $response = Http::post($this->baseUrl . '?key=' . $this->apiKey, [
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
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm having trouble processing that right now.";
            }

            Log::error('Gemini API Error: ' . $response->body());
            return "I'm currently experiencing some technical difficulties. Please try again in a moment.";

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return "Something went wrong while I was thinking. Let's try that again.";
        }
    }
}
