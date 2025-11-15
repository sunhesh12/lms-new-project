<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

class homeController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Register');
    }
}
