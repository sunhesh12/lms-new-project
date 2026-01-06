<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use Notifiable, HasUuids, HasFactory;

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($user) {
            if ($user->isDirty('email')) {
                $user->email_bindex = self::generateBlindIndex($user->email);
            }
        });

        static::creating(function ($user) {
            if (empty($user->profile_pic) || $user->profile_pic === 'profile/default.png') {
                $defaults = [
                    'profile/student_m.png',
                    'profile/student_f.png',
                    'profile/lecturer_m.png',
                    'profile/lecturer_f.png'
                ];
                $user->profile_pic = $defaults[array_rand($defaults)];
            }
        });
    }

    public static function generateBlindIndex($value)
    {
        if (!$value)
            return null;
        return hash_hmac('sha256', strtolower($value), config('app.key'));
    }

    protected $table = 'users'; // or your custom table

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
        'two_factor_code',
        'two_factor_expires_at',
        'can_upload_feed',
        'upload_blocked_until',
        'email_bindex',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_expires_at' => 'datetime',
        'can_upload_feed' => 'boolean',
        'name' => 'encrypted',
        'email' => 'encrypted',
        'user_phone_no' => 'encrypted',
        'user_dob' => 'encrypted',
        'address' => 'encrypted',
    ];

    protected $appends = ['avatar_url', 'role'];

    public function getAvatarUrlAttribute()
    {
        if (!$this->profile_pic) {
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

    //     public function conversations()
    // {
    //     return $this->belongsToMany(Conversation::class, 'participants');
    // }
    public function conversations()
    {
        return $this->belongsToMany(\App\Models\Conversation::class, 'participants', 'user_id', 'conversation_id')->withTimestamps();
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
        return $this->hasMany(QuizAttempt::class);
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
        if ($this->isAdmin())
            return 'admin';
        if ($this->isLecturer())
            return 'lecturer';
        if ($this->isStudent())
            return 'student';
        return 'user';
    }

    public function unreadChatCount()
    {
        return $this->conversations()->with([
            'participants' => function ($query) {
                $query->where('user_id', $this->id);
            }
        ])->get()->sum(function ($conversation) {
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

    public function generateTwoFactorCode()
    {
        $this->two_factor_code = random_int(100000, 999999);
        $this->two_factor_expires_at = now()->addMinutes(10);
        $this->save();
    }

    public function resetTwoFactorCode()
    {
        $this->two_factor_code = null;
        $this->two_factor_expires_at = null;
        $this->save();
    }

    /**
     * Determine if the user is allowed to upload to feed/status.
     */
    public function canUploadFeed()
    {
        if (isset($this->can_upload_feed) && $this->can_upload_feed === false) {
            return false;
        }

        if ($this->upload_blocked_until && \Carbon\Carbon::parse($this->upload_blocked_until)->isFuture()) {
            return false;
        }

        return true;
    }
}