<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_name',
        'type',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'instructions',
        'question_count',
        'module_id'
    ];
    public function events()
    {
        return $this->hasMany(Event::class);
    }
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
    public function questions()
    {
        return $this->hasMany(Question::class, 'quiz_id'); // One quiz has many questions
    }

    public function participants()
    {
        return $this->belongsToMany(PortalUser::class, 'participants', 'activity_id', 'user_id')
            ->withPivot('submission', 'marks', 'is_done')
            ->withTimestamps();
    }

}
