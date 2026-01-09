<?php

namespace App\Services;

class AiProviderFactory
{
    public static function make(?string $provider = null)
    {
        $provider = $provider ?: config('services.ai.provider', env('AI_PROVIDER', 'deepseek'));

        switch (strtolower($provider)) {
            case 'gemini':
                return new GeminiService();
            case 'claude':
                return new ClaudeService();
            case 'openai':
                return new OpenAIService();
            case 'deepseek':
                return new DeepSeekService();
            case 'groq':
            default:
                return new GroqService();
        }
    }
}
