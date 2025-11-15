<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'submitted_answers',
        'score',
        'percentage_score',
        'is_passed',
    ];

    protected $casts = [
        'submitted_answers' => 'json',
    ];

    public function quiz()
    {
        return $this->belongsTo(NewQuiz::class);
    }

    public function user()
    {
        return $this->belongsTo(PortalUser::class, 'user_id');
    }
}