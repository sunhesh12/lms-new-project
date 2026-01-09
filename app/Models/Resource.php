<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Resource extends Model
{
    use HasFactory, HasUuids;

    // UUID stored as string

    protected $fillable = [
        'id',
        'topic_id',
        'assignment_id',
        'submission_id',
        'url',
        'caption',
        'is_deleted',
    ];

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'resource_id', 'id');
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id', 'id');
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'resource_id', 'id');
    }
}
