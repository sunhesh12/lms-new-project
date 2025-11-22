<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quizzes';

    // UUID primary key
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'topic_id',
        'heading',
        'description',
        'start_time',
        'end_time',
        'duration_minutes',
        'is_deleted',
    ];

    // Relationship
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
