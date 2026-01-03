<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use GuzzleHttp\Client;

class AiProviderController extends Controller
{
    public function index()
    {
        try {
            $providers = AiProvider::orderBy('name')->get();
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to fetch AI providers in index: ' . $e->getMessage());
            $providers = collect();
        }

        return Inertia::render('Admin/AiProviders', [
            'providers' => $providers,
        ]);
    }

    public function list()
    {
        try {
            $providers = AiProvider::where('enabled', true)->get(['id','name','identifier','base_url']);
            return response()->json($providers);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to list AI providers: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'identifier' => 'required|string|unique:ai_providers,identifier',
            'api_key' => 'nullable|string',
            'base_url' => 'nullable|url',
            'enabled' => 'boolean',
        ]);

        $provider = AiProvider::create($data);
        return redirect()->back();
    }

    public function update(Request $request, AiProvider $aiProvider)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'api_key' => 'nullable|string',
            'base_url' => 'nullable|url',
            'enabled' => 'boolean',
        ]);

        $aiProvider->update($data);
        return redirect()->back();
    }

    public function destroy(AiProvider $aiProvider)
    {
        $aiProvider->delete();
        return redirect()->back();
    }

    public function health(AiProvider $aiProvider)
    {
        $client = new Client(['timeout' => 5]);
        $headers = [];
        if ($aiProvider->api_key) {
            $headers['Authorization'] = 'Bearer ' . $aiProvider->api_key;
        }

        try {
            $url = $aiProvider->base_url ?: $this->defaultPingUrl($aiProvider->identifier);
            $resp = $client->request('GET', $url, ['headers' => $headers]);
            $ok = $resp->getStatusCode() >= 200 && $resp->getStatusCode() < 300;
            return response()->json(['ok' => $ok, 'status' => $resp->getStatusCode()]);
        } catch (\Exception $e) {
            Log::error('AI Provider health check failed: ' . $e->getMessage());
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    protected function defaultPingUrl($identifier)
    {
        return match ($identifier) {
            'openai' => 'https://api.openai.com/v1/models',
            'gemini' => $aiProviderBase = 'https://gemini.labs.google/v1/models',
            'claude' => 'https://api.anthropic.com/v1/models',
            default => '/' ,
        };
    }
}
