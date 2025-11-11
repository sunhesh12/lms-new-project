<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAnswer extends Model
{
    use HasFactory;

    // ✨ Explicitly define the table name to 'answers'

    protected $fillable = [
        'quizquestion_id', // Must match the foreign key in the migration
        'answer_text',
        'is_correct',
    ];
    protected $table = 'quizanswers'; 
    public function question()
    {
        // Define the belongsTo relationship, specifying 'quizquestion_id' as the foreign key
        return $this->belongsTo(QuizQuestion::class, 'quizquestion_id');
    }
}
