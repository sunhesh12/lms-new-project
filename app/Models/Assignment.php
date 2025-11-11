<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;
    //below function to filter quiz or assignment from activities table because both are in one table
    //Activity - 1.Assignment | 2. Quiz
    protected static function booted()
    {
        static::addGlobalScope('assignment', function ($query) {
            $query->where('type', 'assignment');
        });
    }
}
