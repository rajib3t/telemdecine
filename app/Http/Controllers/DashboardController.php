<?php

namespace App\Http\Controllers;

use App\Http\Resources\VisitResource;
use Inertia\Inertia;
use App\Models\Visit;
use Illuminate\Http\Request;

class DashboardController extends Controller
{


    /**
     * Display the dashboard with today's visits
     *
     * @return \Inertia\Response
     */
    public function index(){
        // Get today's visits with related department and patient data
        $visits = Visit::with(relations:['department','patients.visit'])
                      ->orderBy(column: 'id', direction: 'DESC')
                      ->whereToday('date')
                      ->get();

        // Render the Dashboard component with visits data
        return Inertia::render(
            component:'Dashboard',
            props:[
                'visits'=> VisitResource::collection(resource:$visits)
            ]
        );
    }
}
