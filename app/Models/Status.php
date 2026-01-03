<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Status extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'media_path',
        'media_type',
        'expires_at',
        'views_count',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected $appends = ['is_expired'];

    /**
     * Get the user that owns the status
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the views for the status
     */
    public function views(): HasMany
    {
        return $this->hasMany(StatusView::class);
    }

    /**
     * Check if status is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        return Carbon::now()->isAfter($this->expires_at);
    }

    /**
     * Scope to get only active (non-expired) statuses
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', Carbon::now());
    }

    /**
     * Scope to get expired statuses
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', Carbon::now());
    }

    /**
     * Check if user has viewed this status
     */
    public function isViewedBy($userId): bool
    {
        return $this->views()->where('user_id', $userId)->exists();
    }

    /**
     * Record a view by a user
     */
    public function recordView($userId)
    {
        if (!$this->isViewedBy($userId)) {
            $this->views()->create([
                'user_id' => $userId,
                'viewed_at' => Carbon::now(),
            ]);
            
            $this->increment('views_count');
        }
    }
}
