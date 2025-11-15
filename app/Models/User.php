<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    Use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'user_Phone_No',
        'profile_pic',
        'user_dob',
        'address',
        'password',
    ];
    protected $hidden = ['password'];
}
