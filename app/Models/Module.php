<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Module extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'modules';

    protected $fillable = [
        'id',
        'name',
        'credit_value',
        'maximum_students',
        'is_deleted',
        'description',
        'enrollment_key',
        'cover_image_url',
    ];

    protected $casts = [
        'is_deleted' => 'boolean',
        'enrollment_key' => 'encrypted',
    ];

    // Auto-generate UUID when creating

    public function topics()
    {
        return $this->hasMany(Topic::class, 'module_id', 'id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'module_id', 'id');
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'module_id', 'id');
    }

    public function students()
    {
        return $this->belongsToMany(student::class, 'module_enrollments', 'module_id', 'student_id')
            ->withPivot('id', 'status')
            ->withTimestamps();
    }

    public function lecturers()
    {
        return $this->belongsToMany(lecture::class, 'module_staff', 'module_id', 'lecture_id')
            ->withPivot('id', 'role')
            ->withTimestamps();
    }
}
