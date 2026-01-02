<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users'; // or your custom table
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'address',
        'user_phone_no',
        'profile_pic',
        'user_dob',
        'faculty_id',
        'course_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['avatar_url', 'role'];

    public function getAvatarUrlAttribute()
    {
        if (!$this->profile_pic || $this->profile_pic === 'profile/default.png') {
            return null;
        }
        return asset('storage/' . $this->profile_pic);
    }

    public function student()
    {
        return $this->hasOne(student::class);
    }

    public function lecture()
    {
        return $this->hasOne(lecture::class);

    }

    public function systemAdmin()
    {
        return $this->hasOne(SystemAdmin::class);
    }

    public function faculty()
    {
        return $this->hasOne(Faculty::class);
    }

        public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'participants');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

        public function events()
    {
        return $this->hasMany(Event::class);
    }

        public function quizAttempts()
    {
        return $this->hasMany(quiz_attempt::class);
    }

    // Role checks
    public function isAdmin()
    {
        return $this->relationLoaded('systemAdmin') 
            ? $this->systemAdmin !== null 
            : $this->systemAdmin()->exists();
    }

    public function isLecturer()
    {
        return $this->relationLoaded('lecture') 
            ? $this->lecture !== null 
            : $this->lecture()->exists();
    }

    public function isStudent()
    {
        return $this->relationLoaded('student') 
            ? $this->student !== null 
            : $this->student()->exists();
    }

    public function getRoleAttribute()
    {
        if ($this->isAdmin()) return 'admin';
        if ($this->isLecturer()) return 'lecturer';
        if ($this->isStudent()) return 'student';
        return 'user';
    }

    public function unreadChatCount()
    {
        return $this->conversations()->with(['participants' => function($query) {
            $query->where('user_id', $this->id);
        }])->get()->sum(function ($conversation) {
            $participant = $conversation->participants->first();
            $lastReadAt = $participant ? $participant->last_read_at : '1970-01-01';
            
            return $conversation->messages()
                ->where('created_at', '>', $lastReadAt ?? '1970-01-01')
                ->where('user_id', '!=', $this->id)
                ->where(function ($query) {
                    $query->whereNull('deleted_by')
                          ->orWhereJsonDoesntContain('deleted_by', $this->id);
                })
                ->count();
        });
    }
}