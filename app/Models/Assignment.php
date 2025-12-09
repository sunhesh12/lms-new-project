<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Assignment extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'description',
        'started',
        'deadline',
        'resource_id',
        'module_id',
    ];

    protected $casts = [
        'is_deleted' => 'boolean',
        'started' => 'datetime',
        'deadline' => 'datetime',
    ];

    protected $hidden = [
        'is_deleted',
    ];

    /**
     * Boot the model.
     */
   protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (! $model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the module that owns the assignment.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the resource associated with the assignment.
     */
    public function resources()
    {
        return $this->hasMany(Resource::class, 'assignment_id', 'id');
    }

    /**
     * Get all submissions for this assignment.
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'assignment_id', 'id');
    }

    /**
     * Scope to include soft deleted records.
     */
    public function scopeWithDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope('notDeleted');
    }

    /**
     * Scope to get only soft deleted records.
     */
    public function scopeOnlyDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope('notDeleted')->where('is_deleted', true);
    }

    /**
     * Soft delete the assignment.
     */
    public function softDelete(): bool
    {
        $this->is_deleted = true;
        return $this->save();
    }

    /**
     * Restore a soft deleted assignment.
     */
    public function restore(): bool
    {
        $this->is_deleted = false;
        return $this->save();
    }

    /**
     * Check if the assignment is past its deadline.
     */
    public function isPastDeadline(): bool
    {
        return $this->deadline && now()->isAfter($this->deadline);
    }

    /**
     * Check if the assignment has started.
     */
    public function hasStarted(): bool
    {
        return !$this->started || now()->isAfter($this->started);
    }

    /**
     * Check if the assignment is currently active (started and not past deadline).
     */
    public function isActive(): bool
    {
        return $this->hasStarted() && !$this->isPastDeadline();
    }

    /**
     * Get submissions for a specific student.
     */
    public function submissionsForStudent(string $studentId): HasMany
    {
        return $this->submissions()->where('student_id', $studentId);
    }

    /**
     * Check if a student has submitted this assignment.
     */
    public function hasStudentSubmitted(string $studentId): bool
    {
        return $this->submissions()->where('student_id', $studentId)->exists();
    }

    /**
     * Get the count of submissions.
     */
    public function getSubmissionCountAttribute(): int
    {
        return $this->submissions()->count();
    }
}