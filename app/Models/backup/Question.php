<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = ['quiz_id', 'question_number', 'question', 'question_type', 'answer', 'options'];

    // A question belongs to a quiz
    public function quiz()
    {
        return $this->belongsTo(Activity::class, 'quiz_id');
    }

    // Accessor for options
    public function getOptionsAttribute($value)
    {
        return json_decode($value, true); // Convert options from JSON to array
    }

    // Mutator for options
    public function setOptionsAttribute($value)
    {
        $this->attributes['options'] = json_encode($value); // Convert options array to JSON
    }



}
