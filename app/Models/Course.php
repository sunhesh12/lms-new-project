<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Course extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, HasUuids;

    protected $table = 'courses';

    protected $fillable = [
        'id',
        'name',
        'description',
        'faculty_id',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'course_modules', 'course_id', 'module_id')
            ->withPivot('id', 'semester', 'year', 'is_optional')
            ->withTimestamps();
    }
}
