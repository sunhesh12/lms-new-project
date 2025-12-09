<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    public function resources()
    {
        return $this->hasMany(Resource::class, 'submission_id', 'id');
    }
}
