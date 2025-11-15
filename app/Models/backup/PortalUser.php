<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class PortalUser extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\PortalUserFactory> */
    use HasFactory, HasApiTokens, Notifiable;
    protected $table = 'portal_users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'Id',
        'full_name',
        'age',
        'email',
        'mobile_no',
        'address',
        'password',
        'role',
        'status',
        'course_id',
        'profile_picture'
    ];

    // public function course()
    // {
    //     return $this->Many(Course::class, 'enrollments', 'user_id', 'course_id')->withTimestamps();
    // }

    // Each student belongs to one course
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id'); // 'Course_Id' is the foreign key in portal_users table
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_user', 'user_id', 'event_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'user_id');
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'participants', 'user_id', 'activity_id')
            ->withPivot('submission', 'marks', 'is_done')
            ->withTimestamps();
    }

    public function teaches()
    {
        return $this->belongsToMany(Module::class, 'teaches', 'user_id', 'module_id')
            ->withTimestamps();
    }

    public function enrolledModules()
    {
        return $this->course ? $this->course->modules : collect(); // Safe fallback
    }
}
