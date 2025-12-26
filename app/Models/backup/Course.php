<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Department;

class Course extends Model
{
    use HasFactory, HasApiTokens;
    protected $primaryKey = 'id';
    protected $table = 'courses';

    protected $hidden = ['pivot'];

    protected $fillable = [
        'course_name',
        'credit_value',
        'maximum_students',
        'description'
    ];
    // Define the relationship with Module
    //    public function module()
    //    {
    //        return $this->hasMany(Module::class);
    //    }

    // Define the relationship with User (many-to-many)
    public function users()
    {
        return $this->belongsToMany(PortalUser::class, 'enrollments', 'course_id', 'user_id')->withTimestamps();
    }
    //    public function portalUsers(): \Illuminate\Database\Eloquent\Relations\HasMany
    //    {
    //        return $this->hasMany(PortalUser::class, 'course_id', 'id'); // Foreign key is 'course_id' in portal_users, primary key is 'id' in courses
    //    }
    // Each course has many students
    public function portalUsers()
    {
        return $this->hasMany(PortalUser::class, 'course_id'); // Foreign key in portal_users
    }


    public function modules()
    {
        return $this->belongsToMany(Module::class, 'course_module');
    }
}
