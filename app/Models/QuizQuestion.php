<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'image_url', // ✨ Add new field
        'points',
    ];

        // ✨ Ensure this line correctly specifies the 'questions' table
    protected $table = 'quizquestions'; 

    public function quiz()
    {
        return $this->belongsTo(NewQuiz::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}