<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                    'patients' => PatientResource::collection($patients),
                    "status" => true,
                ], status:200);
        }

    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'hospital_id' => ['required', 'unique:patients,hospital_id'],
            'name' => 'required|string',
            'phone' => ['required','numeric', 'unique:patients,phone'],
            'district' => 'required|string',

        ]);

        try {
           $res =  DB::transaction(callback:function () use($request){
                $data = [
                    'hospital_id'=>$request->hospital_id,
                    'name'=>$request->name,
                    'gender'=>$request->gender,
                    'dob'=>$request->dob,
                    'address' => $request->address,
                    'city'=>$request->city,
                    'district'=>$request->district,
                    'state'=>$request->state,
                    'pin_code'=>$request->pin_code,
                    'phone'=>$request->phone,
                ];
                return $patient = Patient::create($data);
            });
            return response()->json(data:[
                'message' => 'Patient Created',
                'patient'=>new PatientResource(resource:$res),
                "status" => true,
            ], status:201);


        } catch (\Throwable $th) {
            return response()->json(data:[
                'message' => 'Patient Not Created',
                "status" => false,
            ], status:409);

        }

    }


}
