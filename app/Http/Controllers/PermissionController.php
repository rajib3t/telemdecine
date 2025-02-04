<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PermissionGroupResource;
use Illuminate\Support\Facades\Redirect;

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

     public function edit(PermissionGroup $permissionGroup)
     {

        return Inertia::render(
            component:'Permissions/Edit',
            props:[
                'permissionGroup' => new PermissionGroupResource($permissionGroup),

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
}
