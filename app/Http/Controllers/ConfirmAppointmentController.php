<?php

namespace App\Http\Controllers;

use App\Enums\VisitStatusEnum;
use App\Http\Resources\VisitResource;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfirmAppointmentController extends Controller
{
    public function index()
    {
        $visits = Visit::whereFuture('date')
                ->with(['patients.visit'])
                ->where('status', '=', VisitStatusEnum::Open)
                ->get();

        return Inertia(
            component:'Confirmations/List',
            props:[
                'visits'=>VisitResource::collection(resource:$visits)
            ]
        );

    }
}
