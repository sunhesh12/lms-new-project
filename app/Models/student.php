<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class student extends Model
{
    use HasFactory;

    // UUID Support
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'academic_year',
        'user_id',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

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
