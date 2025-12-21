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
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['avatar_url'];

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

    public function system_admin()
    {
        return $this->hasOne(System_admin::class);
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

}