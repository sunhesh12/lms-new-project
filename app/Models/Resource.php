<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Resource extends Model
{
    use HasFactory;

    protected $keyType = 'string';        // UUID stored as string
    public $incrementing = false;         // NOT auto-incrementing

    protected $fillable = [
        'id',
        'topic_id',
        'url',
        'caption',
        'is_deleted',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'resource_id', 'id');
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'resource_id', 'id');
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'resource_id', 'id');
    }
}
