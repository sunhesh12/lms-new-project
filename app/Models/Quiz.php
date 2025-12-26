<?php

// app/Models/Quiz.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'passing_score',
        'is_active',
        'module_id',
        'allow_multiple_attempts',
        'max_attempts',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'allow_multiple_attempts' => 'boolean',
        'duration' => 'integer',
        'passing_score' => 'integer',
        'max_attempts' => 'integer',
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
