<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Topic extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'topics';

    protected $fillable = [
        'id',
        'module_id',
        'topic_name',
        'description',
        'is_deleted',
        'is_announcement',
        'type'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

}
