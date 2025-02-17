<?php

namespace App\Models;

use App\Enums\PatientVisitEnum;
use App\Enums\PatientGenderEnum;
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


     /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

     public function casts() :array
     {
        return [
            'gender' => PatientGenderEnum::class,
            'dob' => 'date'
        ];
     }

     public function visit()
     {
         return $this->belongsToMany(related:Visit::class)->using(class:PatientVisit::class)->withTimestamps()->withPivot(columns:['date','description','advice_transcription','status','created_by']);
     }


}
