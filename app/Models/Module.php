<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Module extends Model
{
    use HasFactory;

    protected $table = 'modules';

    // UUID SUPPORT
    public $incrementing = false;   // because id is UUID
    protected $keyType = 'string';  // UUID stored as string

    protected $fillable = [
        'id',
        'name',
        'credit_value',
        'maximum_students',
        'description',
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
}
