<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'url',
        'caption',
        'is_deleted',
    ];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
