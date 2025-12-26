<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_name',
        'credit_value',
        'practical_exam_count',
        'writing_exam_count',
        'archived'
    ];

    protected $hidden = ['pivot'];

    // Define the relationship with Course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Define the relationship with User (many-to-many if needed)
    public function users()
    {
        return $this->belongsToMany(PortalUser::class, 'user_modules', 'module_id', 'user_id')
            ->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_module');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function topics()  
    {
        return $this->hasMany(Topic::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(PortalUser::class, 'teaches', 'module_id', 'user_id')
            ->withTimestamps();
    }
}
