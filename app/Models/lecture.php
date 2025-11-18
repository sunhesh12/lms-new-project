<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class lecture extends Model
{
    use HasFactory;
    protected $fillable = [
        'academic_level',
        'research_area',
        'lecture_type',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
