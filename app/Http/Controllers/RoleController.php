<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionGroupResource;
use App\Http\Resources\RoleResource;
use App\Models\PermissionGroup;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     *
     *
     * @return  \Inertia\Response
     */
    public function index(Request $request)
    {
        $name = $request->name;
        $roles = Role::when($request->name, function($q) use ($name){
            $q->where('name','like',"%{$name}%");

        })->paginate(10)
        ->onEachSide(1);

        return Inertia::render(
            component:'Roles/List',
            props:[
                'roles'=>RoleResource::collection($roles),

            ]


        );
    }

    /**
     * Display the edit form for a specific role.
     *
     * This method renders the role edit page using Inertia.js, passing
     * the role data as a resource to the frontend component.
     *
     * @param  \App\Models\Role  $role  The role model instance to edit
     * @return \Inertia\Response        Returns an Inertia response with the edit component and role data
     */
    public function edit(Request $request, Role $role)
    {
        $name = $request->name;
        $permissionGroups =  PermissionGroup::when($request->name, function($q, $name ){
            $q->where('name','like',"%{$name}%");
        })->paginate(10)
        ->onEachSide(1);

        return Inertia::render(
            component:'Roles/Edit',
            props:[
                'role'=>new RoleResource($role),
                'permissionGroups' => PermissionGroupResource::collection($permissionGroups)
            ]
        );
    }

    public function update(Request  $request, Role $role)
    {

        $request->validate([
            'name' => ['required', 'string', 'max:255'],

        ]);

        $res = DB::transaction(function () use ($request, $role){
            $data = [
                'name' => $request->name,
                'description'=>$request->description,

            ];
            $role->update(attributes:$data);
            return $role;
        });

        return Redirect::route(route:'role.edit', parameters:$res)
        ->with('success','Role updated successfully');

    }
}
