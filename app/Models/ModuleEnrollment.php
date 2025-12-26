<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ModuleEnrollment extends Model
{
    use HasFactory;

    protected $table = 'module_enrollments';

    // UUID primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'student_id',
        'module_id',
        'status',
    ];

    // Auto-generate UUID when creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (! $model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function student()
    {
        return $this->belongsTo(student::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
