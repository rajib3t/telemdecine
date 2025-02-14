<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'date', 'department_id', 'hospital_name', 'slot_number', 'status'
    ];


    public function department()
    {
        return $this->belongsTo(related:Department::class);
    }




    public function patients()
    {
        return $this->belongsToMany(related:Patient::class)->using(class:PatientVisit::class);

    }

}
