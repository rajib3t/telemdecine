<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\RoleResource;
use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\PermissionGroupResource;
use App\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     *
     * @return  \Inertia\Response
     */
    public function index(Request $request)
    {
        $name = $request->name;
        $permissions = PermissionGroup::when($request->name, function($q, $name){
            $q->where('name','like',"%{$name}%");
        })
        ->paginate(10)->onEachSide(1);
        return Inertia::render(
            component:'Permissions/List',
            props:[
                'permissionsGroups'=>PermissionGroupResource::collection( $permissions)
            ]
        );
    }

    /**
     * Display the edit form for a specific permission.
     *
     * This method renders the permission edit page using Inertia.js, passing
     * the permission data as a resource to the frontend component.
     *
     * @param  \App\Models\PermissionGroup  $permission The permission model instance to edit
     * @return \Inertia\Response        Returns an Inertia response with the edit component and role data
     */

     public function edit(Request $request, PermissionGroup $permissionGroup)
     {
        $name = $request->name;
        $roles = Role::when($request->name, function($q) use ($name){
            $q->where('name','like',"%{$name}%");

        })->paginate(10)
        ->onEachSide(1);

        return Inertia::render(
            component:'Permissions/Edit',
            props:[
                'permissionGroup' => new PermissionGroupResource($permissionGroup),
                'roles'=>RoleResource::collection($roles),
            ]
        );
     }


     public function update(Request $request, PermissionGroup $permissionGroup)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'], // Add validation for description
        ]);

        try {
            DB::transaction(function () use ($validated, $permissionGroup) {
                $permissionGroup->update([
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                ]);
            });

            return redirect()
                ->route('permission.edit', ['permissionGroup' => $permissionGroup->id])
                ->with('success', 'Permission updated successfully');
        } catch (\Throwable $th) {
            return redirect()
                ->route('permission.edit', ['permissionGroup' => $permissionGroup->id])
                ->with('error', $th->getMessage());
        }
    }

    public function add_role(Request $request, PermissionGroup $permissionGroup)
    {
        $permission = $request->permission;
        $permission = Permission::find($permission);
        if(!$permission){
            return response()->json(
                [
                    'message'=>'No Permission found'
                ],
                404
            );
        }
        $role = $request->role;
        $role = Role::find($role);
        if(!$role){
            return response()->json(
                [
                    'message'=>'No Role found'
                ],
                404
            );
        }

        try {
            if($request->checked){
                $role->givePermissionTo($permission);
                return response()->json(
                    [
                        'message'=>'Permission added successfully'
                    ],
                    200
                );
            }else{
                $role->revokePermissionTo($permission);
                return response()->json(
                    [
                        'message'=>'Permission revoke successfully'
                    ],
                    200
                );
            }

        } catch (\Throwable $th) {
            return response()->json(
                [
                    'message'=>$th->getMessage() .'on Line no '. $th->getLine() .' in file ' . $th->getFile()
                ],
                400
            );
        }

    }



}
