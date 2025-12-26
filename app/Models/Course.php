<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $table = 'courses';

    // UUID primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'faculty_id',
    ];

    // Auto-generate UUID when creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (! $model->id) {
                $model->id = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

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
