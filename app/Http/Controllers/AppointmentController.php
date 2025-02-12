<?php

namespace App\Http\Controllers;

use App\Enums\VisitStatusEnum;
use App\Http\Resources\VisitResource;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * List of OPEN Visit which are ordered by ID in descending order.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Retrieve all open visits, ordered by ID in descending order
        $visits = Visit::orderBy(column: 'id', direction: 'DESC')
            ->where('status', VisitStatusEnum::Open)
            ->get();

        // Render the Appointments/List component using Inertia
        return Inertia::render(
            component: 'Appointments/List',
            props: [
                // Pass the visits data to the component, wrapped in a VisitResource collection
                'visits' => VisitResource::collection(resource: $visits)
            ]
        );
    }

    /**
     * Create a new appointment within the specific visit
     * @param \App\Models\Visit $visit
     *
     * @return \Inertia\Response
     */

    public function add_patients(Visit $visit)
    {
        // Render the Appointments/CreateTicket component using Inertia

        return Inertia::render(
            component:'Appointments/CreateTicket',
            props:[
                // Pass the visit data to the component, wrapped in a VisitResource collection

                'visit'=>new VisitResource($visit),
            ]
        );
    }


}
