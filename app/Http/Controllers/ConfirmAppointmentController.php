<?php

namespace App\Http\Controllers;

use App\Enums\VisitStatusEnum;
use App\Http\Resources\VisitResource;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfirmAppointmentController extends Controller
{
    /**
     * Display a list of future visits that need confirmation
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get future visits that are open
        $visits = Visit::whereFuture('date')
                ->with(['department','patients.visit']) // Eager load related data
                ->where('status', '=', VisitStatusEnum::Open)
                ->orderBy('id','DESC')
                ->get();

        // Return Inertia view with visits data
        return Inertia::render(
            component:'Confirmations/List',
            props:[
                'visits'=>VisitResource::collection(resource:$visits)
            ]
        );
    }

    /**
     * Display a specific visit's patient list
     *
     * @param Visit $visit The visit model instance
     * @return \Inertia\Response Returns Inertia view with visit data
     */
    public function patientList(Visit $visit)
    {
        // Eager load the visit relationships including department and nested patient data
        $visit->load(relations:['department', 'patients.visit']);  // Added .visit to properly load the visit relationship

        // Return Inertia view with the visit data as a resource
        return Inertia::render(
            component:'Confirmations/PatientList',
            props:[
                'visit'=> new VisitResource(resource:$visit)
            ]
        );
    }
}
