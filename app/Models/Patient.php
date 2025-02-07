<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */

     protected $fillable = [
        'hospital_id',
        'name',
        'gender',
        'dob',
        'address',
        'city',
        'district',
        'state',
        'pin_code',
        'phone'
     ];
}
