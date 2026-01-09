<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class lecture extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'lectures'; // Validated from migration

    protected $fillable = [
        'id',
        'academic_level',
        'research_area',
        'lecture_type',
        'user_id',
    ];

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
