<?php

// app/Models/Quiz.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    // UUID Support - Disabled to match DB Schema (Integer ID)
    // public $incrementing = false;
    // protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'duration',
        'passing_score',
        'is_active',
        'module_id',
        'allow_multiple_attempts',
        'max_attempts',
        'deadline',
    ];
    // protected static function boot()
    // {
    //     parent::boot();
    //     static::creating(function ($model) {
    //         if (empty($model->id)) {
    //             $model->id = (string) \Illuminate\Support\Str::uuid();
    //         }
    //     });
    // }

    protected $casts = [
        'is_active' => 'boolean',
        'allow_multiple_attempts' => 'boolean',
        'duration' => 'integer',
        'passing_score' => 'integer',
        'max_attempts' => 'integer',
        'deadline' => 'datetime',
    ];

    public function module(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function getQuestionsCountAttribute(): int
    {
        return $this->questions()->count();
    }
}
