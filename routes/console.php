<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

\Illuminate\Support\Facades\Schedule::command('assignments:send-reminders')->daily();
\Illuminate\Support\Facades\Schedule::command('statuses:clean')->everyMinute();
