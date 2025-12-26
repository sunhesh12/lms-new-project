<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class student extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrolledModules()
    {
        return $this->belongsToMany(Module::class, 'module_enrollments', 'student_id', 'module_id')
            ->withPivot('id', 'status')
            ->withTimestamps();
    }
}
