<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\RoleResource;
use function PHPUnit\Framework\callback;

use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\PermissionGroupResource;

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
                'permissionGroup' => new PermissionGroupResource(resource:$permissionGroup),
                'roles'=>RoleResource::collection(resource:$roles),
            ]
        );
     }


     public function update(Request $request, PermissionGroup $permissionGroup)
    {
        $validated = $request->validate(rules:[
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'], // Add validation for description
        ]);

        try {
            DB::transaction(callback:function () use ($validated, $permissionGroup) {
                $permissionGroup->update(attributes:[
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                ]);
            });

            return redirect()
                ->route(route:'permission.edit', parameters:['permissionGroup' => $permissionGroup->id])
                ->with(key:'success', value:'Permission updated successfully');
        } catch (\Throwable $th) {
            Log::error(message:$th->getMessage() .'on Line no '. $th->getLine() .' in file ' . $th->getFile());
            return redirect()
                ->route(route:'permission.edit',parameters: ['permissionGroup' => $permissionGroup->id])
                ->with(key:'error', value:'Something is wrong..');
        }
    }

    public function add_role(Request $request, PermissionGroup $permissionGroup)
    {
        $permission = $request->permission;
        $permission = Permission::find($permission);
        if(!$permission){
            return response()->json(
                data:[
                    'message'=>'No Permission found'
                ],
                status:404
            );
        }
        $role = $request->role;
        $role = Role::find($role);
        if(!$role){
            return response()->json(
                data:[
                    'message'=>'No Role found'
                ],
                status:404
            );
        }

        try {
            if($request->checked){
                $role->givePermissionTo($permission);
                return response()->json(
                    data:[
                        'message'=>'Permission added successfully'
                    ],
                    status:200
                );
            }else{
                $role->revokePermissionTo($permission);
                return response()->json(
                    data:[
                        'message'=>'Permission revoke successfully'
                    ],
                    status:200
                );
            }

        } catch (\Throwable $th) {
            Log::error(message:$th->getMessage() .'on Line no '. $th->getLine() .' in file ' . $th->getFile());
            return response()->json(
                data:[
                    'message'=>'Something is wrong..'
                ],
                status:400
            );


        }

    }



}
