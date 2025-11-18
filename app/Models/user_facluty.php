<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_facluty extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'faculty_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function Faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
