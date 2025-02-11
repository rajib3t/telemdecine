<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */

     protected $fillable = [
        'name', 'max_patients'
    ];


    /**
     * Get the visit days associated with the department.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany Department's visit days relationship
     */
    public function visitDays()
    {
        return $this->hasMany(DepartmentVisitDay::class);
    }


    public function visits()
    {
        return $this->hasMany(Visit::class);
    }

}
