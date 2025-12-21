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
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration' => 'integer',
        'passing_score' => 'integer',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(quiz_attempt::class);
    }

    public function getQuestionsCountAttribute(): int
    {
        return $this->questions()->count();
    }
}
