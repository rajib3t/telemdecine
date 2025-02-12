<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\callback;
use App\Http\Resources\DepartmentResource;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)

    {
        $name = $request->name;
        $departments = Department::with(relations:'visitDays')->when(value:$request->name, callback:function($q, $name){
            $q->where('name','like',"%{$name}%");
        })
        ->paginate(perPage:10);
        return Inertia::render(
            component:'Departments/List',
            props:[
                'departments'=> DepartmentResource::collection(resource:$departments),
                'filters'=>$request->all()
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render(
            component:'Departments/Create',


        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate(rules:[
            'name'=>['required', 'string'],
            'max_patients' => ['required', 'integer'],
            'days' => ['required', 'array']
        ]);

        try {
            $res = DB::transaction(callback:function () use($validate){
                $data = [
                    'name'=>$validate['name'],
                    'max_patients'=>$validate['max_patients']

                ];

                $res = Department::create($data);
                foreach ($validate['days'] as $key => $value) {
                    $res->visitDays()->create([
                        'day'=>$value,

                    ]);

                }

                return $res;

            });

            return redirect()->route(route:'department.edit', parameters:$res)->with(key:'success', value:'Department created successfully');

        } catch (\Throwable $th) {
            Log::error(message: $th->getMessage(). 'on line '.$th->getLine() .' file '.$th->getFile());

            return back()
                ->with(key:'error', value: 'Something went wrong');
        }
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        return Inertia::render(
            component:'Departments/Edit',
            props:[
                'department'=>new DepartmentResource(resource:$department),

            ]
            );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        $validate = $request->validate(rules:[
            'name'=>['required', 'string'],
            'max_patients' => ['required', 'integer'],
            'days' => ['required', 'array']
        ]);


        try {
            DB::transaction(callback:function () use($validate, $department){
                $data = [
                    'name'=>$validate['name'],
                    'max_patients'=>$validate['max_patients']
                ];


                $department->update(attributes:$data);
                $department->visitDays()->delete();
                foreach ($validate['days'] as $key => $value) {
                    $department->visitDays()->create(attributes:[
                        'day'=>$value,

                    ]);

                }

            });

            return redirect()->route(route:'department.edit', parameters:$department)->with(key:'success', value:'Department updated successfully');


        } catch (\Throwable $th) {
            Log::error(message: $th->getMessage(). 'on line '.$th->getLine() .' file '.$th->getFile());

            return back()
                ->with(key:'error', value: 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Department $department)
    {
        $department->delete();
         $paginator  = Department::paginate(columns:['id'], perPage: 10);
         $page = $request->page;
         $redirectToPage = ($page <= $paginator->lastPage()) ? $page : $paginator->lastPage();



         return redirect()->route(route:'department.index', parameters:['page' => $redirectToPage])
         ->with(key:'success', value:'Department Deleted Successfully');
    }


    public function getDepartment(Department $department)
    {
        $days = $department->visitDays()->select('day')
        ->pluck('day')
        ->toArray();
        $week = [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];

        $filteredWeek = array_intersect($week, $days);
        $days = array_keys($filteredWeek);
        return response()
            ->json($days);
    }
}
