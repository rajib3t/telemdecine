<?php

namespace App\Http\Controllers;

use App\Enums\VisitStatusEnum;
use App\Http\Resources\VisitResource;
use Inertia\Inertia;
use App\Models\Visit;
use App\Models\Department;
use App\Models\DepartmentVisitDay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

use function PHPUnit\Framework\callback;

class VisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $departments = Department::pluck('name', 'id')->toArray();
        $visits = Visit::paginate(10)
            ->onEachSide(1);
        return Inertia::render(
            component:'Visits/List',
            props:[
                'visits'=>VisitResource::collection(resource:$visits),
                'departments'=>$departments,
                'filters'=>$request->all(),

            ]

        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::pluck('name', 'id')->toArray();
        $days = DepartmentVisitDay::select('day')
        ->groupBy('day')
        ->pluck('day')
        ->toArray();

    $week = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];

    $filteredWeek = array_intersect($week, $days);
    $days = array_keys($filteredWeek);

        return Inertia::render(
            component:'Visits/Create',
            props:[
                'departments'=>$departments,
                'days'=>$days
            ]

        );
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate(rules:[
            'department_id'=>'required',
            'date'=>'required|date',
            'hospital_name'=>'required',
            'slot_number' =>'required',

        ]);

        try {
            $res = DB::transaction(callback:function () use ($validate){
                $data = [
                    'department_id'=>$validate['department_id'],
                    'date'=>$validate['date'],
                    'hospital_name'=>$validate['hospital_name'],
                    'slot_number' =>$validate['slot_number'],
                    'status'=>VisitStatusEnum::Open
                ];
                $visit = Visit::create($data);

                return $visit;
            });

            return Redirect::route(route:'visit.edit', parameters:['visit'=>$res])
                ->with(key:'success', value:'Visit created successfully');

        } catch (\Throwable $th) {
            Log::info(message:$th->getMessage() . ' on the line ' . $th->getLine() . ' in file '. $th->getFile());
            return back()
                ->with(key:'error', value:'Something went wrong');
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Visit $visit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Visit $visit)
    {
        $departments = Department::pluck('name', 'id')->toArray();
        return Inertia::render(
            component:'Visits/Edit',
            props:[
                'visit'=>new VisitResource(resource:$visit),
                'departments'=>$departments,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Visit $visit)
    {
        $validate = $request->validate(rules:[
            'department_id'=>'required',
            'date'=>'required|date',
            'hospital_name'=>'required',
            'slot_number' =>'required',

        ]);

        try {
            $res = DB::transaction(callback:function () use ($validate, $visit){
                $data = [
                    'department_id'=>$validate['department_id'],
                    'date'=>$validate['date'],
                    'hospital_name'=>$validate['hospital_name'],
                    'slot_number' =>$validate['slot_number'],
                    'status'=>VisitStatusEnum::Open
                ];
                $res = $visit->update(attributes:$data);

                return $res;
            });

            return Redirect::route(route:'visit.edit', parameters:['visit'=>$visit])
                ->with(key:'success', value:'Visit Updated successfully');

        } catch (\Throwable $th) {
            Log::info(message:$th->getMessage() . ' on the line ' . $th->getLine() . ' in file '. $th->getFile());
            return back()
                ->with(key:'error', value:'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Visit $visit)
    {
        //
    }
}
