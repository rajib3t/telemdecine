<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PatientVisit extends Pivot
{


    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;


    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'patient_visits';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'patient_id',
        'visit_id',
        'date',
        'description',
        'advice_transcription',
        'status',
        'created_by'
    ];






}
