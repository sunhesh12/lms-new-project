<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Status;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CleanExpiredStatuses extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'statuses:clean';

    /**
     * The console command description.
     */
    protected $description = 'Delete expired statuses and their media files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredStatuses = Status::expired()->get();
        
        $count = $expiredStatuses->count();
        
        foreach ($expiredStatuses as $status) {
            // Delete media file if exists
            if ($status->media_path) {
                Storage::disk('public')->delete($status->media_path);
            }
            
            $status->delete();
        }

        $this->info("Deleted {$count} expired statuses.");
        
        return 0;
    }
}
