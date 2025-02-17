<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Visit;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Enums\VisitStatusEnum;
use App\Http\Resources\VisitResource;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

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
        $visits = Visit::with(['department','patients.visit'])->orderBy(column: 'id', direction: 'DESC')
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
        // Load the visit with its relationships once and reuse
        $visit->load(['department', 'patients.visit']);  // Added .visit to properly load the visit relationship

        return Inertia::render(
            component:'Appointments/CreateTicket',
            props:[
                // Pass the visit data to the component, wrapped in a VisitResource collection

                'visit'=>new VisitResource($visit)
            ]
        );
    }



    public function addPatientToVisit(Request $request, Visit $visit)
    {
        try {
            $patient = Patient::findOrFail($request->patientId);

            // Check if patient is already attached to avoid duplicates
            if (!$visit->patients()->where('patient_id', $patient->id)->exists()) {
                $visit->patients()->attach($patient->id);

                return redirect()
                    ->route('appointment.add.patient', ['visit' => $visit])
                    ->with('success', 'Patient successfully added to visit');
            }

            return redirect()
                ->route('appointment.add.patient', ['visit' => $visit])
                ->with('error', 'Patient is already added to this visit');

        } catch (ModelNotFoundException $e) {
            Log::error($e);
            return redirect()
                ->route('appointment.add.patient', ['visit' => $visit])
                ->with('error', 'Patient not found');
        } catch (Exception $e) {
            Log::error($e);
            return redirect()
                ->route('appointment.add.patient', ['visit' => $visit])
                ->with('error', 'Failed to add patient to visit');
        }
    }


}
