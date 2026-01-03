<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StatusView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'status_id',
        'user_id',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    /**
     * Get the status that was viewed
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    /**
     * Get the user who viewed
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
