<?php

namespace App\Http\Controllers;

use App\Http\Resources\VisitResource;
use Inertia\Inertia;
use App\Models\Visit;
use Illuminate\Http\Request;

class DashboardController extends Controller
{


    public function index(){
        $visits = Visit::with(relations:['department','patients.visit'])->orderBy(column: 'id', direction: 'DESC')->whereToday('date')->get();



        return Inertia::render(
            component:'Dashboard',
            props:[
                'visits'=> VisitResource::collection(resource:$visits)
            ]

        );
    }
}
