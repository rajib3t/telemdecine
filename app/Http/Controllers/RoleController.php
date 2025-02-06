<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Http\Resources\RoleResource;
use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\PermissionGroupResource;

class RoleController extends Controller
{


    /**
     * Display a paginated list of roles with optional name filtering.
     *
     * This method handles the index page for roles, allowing for:
     * - Pagination of roles (10 per page)
     * - Name-based filtering through query parameter
     * - Single page navigation on each side of current page
     *
     * @param  \Illuminate\Http\Request  $request The incoming HTTP request containing possible filter parameters
     * @return \Inertia\Response Returns an Inertia response with:
     *                           - 'roles' => Collection of paginated Role resources
     *
     * The roles are returned as a ResourceCollection using RoleResource
     * and rendered using the 'Roles/List' Inertia component
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
     * Show the form for creating a new role.
     *
     * Renders the 'Roles/Create' component using Inertia.
     *
     * @return \Inertia\Response Returns an Inertia response with the create role form
     */
    public function create()
    {
        return Inertia::render(
            component:'Roles/Create'
        );
    }

    /**
     * Store the new role
     *
     * @param  \Illuminate\Http\Request  $request The HTTP request instance
     * @return \Illuminate\Http\RedirectResponse
     *
     *  @throws \Illuminate\Validation\ValidationException When validation fails
     *  This method:
     * 1. Validates the incoming request data
     * 2. Add role within a database transaction
     * 3. Redirects back to the edit page with success message
     */
    public function store(Request $request)
    {
        $request->validate(rules:[
            'name'=>['required', 'string', 'max:255'],
        ]);

        try {
            $res = DB::transaction(function()use($request){
                return Role::create([
                    'name'=>$request->name,
                    'description'=>$request->description,
                ]);


            });
            return Redirect::route(route:'role.edit',parameters:['role'=>$res])
                ->with(key:'success',value:'Role Create Successfully');
        } catch (\Throwable $th) {
            //throw $th;
            return back()
                ->with(key:'error', value:$th->getMessage(). 'on line '.$th->getLine() .' file '.$th->getFile());
        }
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param  \Illuminate\Http\Request  $request The HTTP request instance
     * @param  \App\Models\Role  $role The role model instance to be edited
     * @return \Inertia\Response Returns an Inertia response with role and permission groups data
     *
     * This method handles the display of the role editing form.
     * It filters permission groups based on the name parameter if provided,
     * and returns an Inertia response with the role data and paginated permission groups.
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
                'permissionGroups' => Inertia::defer( fn ()=>PermissionGroupResource::collection($permissionGroups))
            ]
        );
    }

    /**
     * Update the specified role in storage.
     *
     * @param  \Illuminate\Http\Request  $request  The HTTP request containing role data
     * @param  \App\Models\Role  $role  The role model to be updated
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException When validation fails
     *
     * This method:
     * 1. Validates the incoming request data
     * 2. Updates the role within a database transaction
     * 3. Redirects back to the edit page with success message
     */
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



    /**
     * Add or revoke permission for a specific role
     *
     * @param \Illuminate\Http\Request $request Contains permission ID and checked status
     * @param \App\Models\Role $role Role model instance
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Throwable If permission operation fails
     *
     * Request parameters:
     * - permission: ID of the permission to add/revoke
     * - checked: boolean indicating whether to add (true) or revoke (false) the permission
     *
     * Response:
     * - 200: Permission successfully added/revoked
     * - 404: Permission not found in request
     * - 400: Error occurred during operation
     */
    public function add_permission(Request $request, Role $role)
    {
        $permission = $request->permission;

        if(!$permission){
            return response()->json(
                [
                    'message'=>'No Permission found'
                ],
                404
            );
        }
        try {
            $permission = Permission::find($permission);
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



    /**
     * Remove the specified role from storage.
     *
     * This method deletes a role and handles pagination for proper redirect:
     * 1. Deletes the specified role
     * 2. Recalculates pagination
     * 3. Determines the correct page to redirect to after deletion
     *
     * If current page exceeds the last available page after deletion,
     * redirects to the last available page instead.
     *
     * @param  \Illuminate\Http\Request  $request The incoming HTTP request
     * @param  \App\Models\Role  $role The role model to be deleted
     * @return \Illuminate\Http\RedirectResponse Redirects to role index with success message
     */
    public function destroy(Request $request, Role $role)
    {
        $role->delete();
        $paginator  = Role::paginate(columns:['id'], perPage: 10);
        $page = $request->page;
        $redirectToPage = ($page <= $paginator->lastPage()) ? $page : $paginator->lastPage();



        return redirect()->route('role.index', ['page' => $redirectToPage])
        ->with('success', 'Role Deleted Successfully');
    }
}
