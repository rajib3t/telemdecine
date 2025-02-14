<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory  ;
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



     public function visit()
     {
         return $this->belongsToMany(related:Visit::class)->using(class:PatientVisit::class);
     }


}
