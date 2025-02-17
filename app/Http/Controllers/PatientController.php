<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Enums\PatientGenderEnum;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\PatientResource;
use function PHPUnit\Framework\callback;

class PatientController extends Controller
{


    public function get_patients(Request $request)
    {
        $search = $request->search;
        $patients = Patient::whereAny([
            'hospital_id',
            'name',
            'phone'
        ], 'like', "%{$search}%")
        ->get();

        if($patients->isEmpty()){
            return response()->json(data:[
                "message" => "No Patient Found",
                'patients'=>[],
                "status" => false,

            ], status:200);
        }else{
            return response()
                ->json(data:[
                    'message' => 'Patient Found',
                    'patients' => PatientResource::collection(resource:$patients),
                    "status" => true,
                ], status:200);
        }

    }

    public function store(Request $request)
    {

        $validated = $request->validate(rules:[
            'hospital_id' => ['required', 'unique:patients,hospital_id'],
            'name' => 'required|string',
            'phone' => ['required', 'numeric', 'unique:patients,phone'],
            'district' => 'required|string',
            'gender' => ['required', 'string', Rule::enum(type:PatientGenderEnum::class)],
            'dob' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'state' => ['nullable', 'string'],
            'pin_code' => ['nullable', 'string'],
        ]);


        try {
            $patient = DB::transaction(callback:function () use ($validated) {
                return Patient::create([
                    ...$validated,
                    'gender' => strtoupper($validated['gender'])
                ]);
            });

            return response()->json(data:[
                'message' => 'Patient Created Successfully',
                'patient' => new PatientResource(resource:$patient),
                'status' => true
            ], status:201);

        } catch (\Throwable $th) {
            Log::error(message:'Patient creation failed: ' . $th->getMessage());

            return response()->json(data:[
                'message' => 'Failed to create patient',
                'status' => false
            ], status:409);
        }
    }


}
