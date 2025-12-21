<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question',
        'options',
        'correct_answer',
        'points',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'integer',
        'points' => 'integer',
        'order' => 'integer',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function isCorrect(int $answer): bool
    {
        return $answer === $this->correct_answer;
    }
}