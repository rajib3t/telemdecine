<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentVisitDay extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'department_id',
        'day'
    ];


    /**
     * Get the department that this visit day belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
