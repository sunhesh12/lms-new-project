<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;


class Event extends Model
{
    use HasFactory;
    use HasApiTokens;
    protected $fillable = [
        'activity_id',
        'event_name',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'status',
        'description'
    ];
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
    public function users()
    {
        return $this->belongsToMany(PortalUser::class, 'event_user','event_id','user_id');
    }
}
