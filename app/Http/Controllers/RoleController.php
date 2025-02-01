<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     *
     * @return void
     */
    public function index(Request $request)
    {
        $roles = Role::when($request->name, function($q) use ($request){
            $q->where('name','like',"%{$request->name}%");

        })->paginate(10)
        ->onEachSide(1);

        return Inertia::render(
            component:'Role/Index',
            props:[
                'roles'=>RoleResource::collection($roles),

            ]


        );
    }
}
