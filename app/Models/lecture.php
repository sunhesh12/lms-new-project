<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class lecture extends Model
{
    use HasFactory;
    protected $table = 'lectures'; // Validated from migration
    
    // UUID Support
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'academic_level',
        'research_area',
        'lecture_type',
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

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'module_staff', 'lecture_id', 'module_id')
            ->withPivot('id', 'role')
            ->withTimestamps();
    }
}
