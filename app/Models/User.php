<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users'; // or your custom table

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

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
}