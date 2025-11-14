<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'topic_id',
        'name',
        'path',
        'type',
        'size',
    ];
}
