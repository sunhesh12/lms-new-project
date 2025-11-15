<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;
    protected $fillable = ['module_id', 'topic', 'description'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
