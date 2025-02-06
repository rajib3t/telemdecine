<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a paginated list of users with optional filtering.
     *
     * This method handles the index page of users with the following features:
     * - Filters users by name and email if provided in the request
     * - Paginates results with 10 items per page
     * - Orders users by ID in descending order
     * - Renders the result using Inertia with the Users/List component
     *
     * @param  \Illuminate\Http\Request  $request  The HTTP request containing optional filters
     *                                            - name: string to filter users by name
     *                                            - email: string to filter users by email
     * @return \Inertia\Response         Returns an Inertia response with paginated users data
     *                                   transformed through UserResource
     */
    public function index(Request $request) {

        $name = $request->name;
        $email = $request->email;
        $users = User::when($request->name, function ($query, $name) {
            $query->where('name', 'like', '%'.$name.'%');

        })
        ->when($request->email, function($query, $email){
            $query->where('email', 'like', '%'.$email.'%');
        })
        ->orderBy('id', 'desc')
        ->paginate(10)->onEachSide(1);

        return Inertia::render(
            component:'Users/List',
            props:[
                'users' => UserResource::collection(resource:$users)
            ]
        );

    }


    /**
     * Show the form for creating a new user.
     *
     * @return \Inertia\Response
     *
     * This method:
     * 1. Retrieves all roles from the database
     * 2. Renders the user creation form using Inertia.js
     * 3. Passes the roles as a collection of RoleResource to the frontend component
     */
    public function create()
    {
        $roles = Role::all();
        return Inertia::render(
            component:'Users/Create',
            props:[
                'roles'=>RoleResource::collection($roles)
            ]
        );
    }


    /**
     * Store a newly created user in the database.
     *
     * This method validates user input, creates a new user record,
     * assigns the specified role to the user, and handles any errors
     * that may occur during the process.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Throwable When database transaction fails
     *
     * Validation Rules:
     * - name: Required, must be string
     * - email: Required, must be valid email, must be unique in users table
     * - role: Required
     * - password: Required, must be confirmed, must meet default password rules
     */
    public function  store(Request $request)
    {
        $validated = $request->validate(rules:[
            'name' =>['required','string'],
            'email'=>['required','email', 'unique:users,email'],
            'role' => ['required'],
            'password' =>  ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::transaction(function()use($validated){
                $user = User::create([
                    'name'=>$validated['name'],
                    'email'=>$validated['email'],
                    'password' => Hash::make($validated['password']),
                ]);

                $role = Role::find($validated['role']);
                $user->roles()->attach($role);

            });

            return Redirect::route('user.index')
                ->with(key:'success', value:'User Created Successfully');
        } catch (\Throwable $th) {
            Log::error(message:$th);
            return back()
                ->with(key:'error', value:'Something is wrong');

        }
    }


    /**
     * Show the form for editing the specified user.
     *
     * This method retrieves all available roles and renders the user edit form
     * using Inertia.js with the specified user and roles data.
     *
     * @param User $user The user model instance to be edited
     * @return \Inertia\Response Returns an Inertia response with the edit form view
     * @throws \Illuminate\Auth\Access\AuthorizationException If user is not authorized
     */
    public function edit(User $user)
    {
        $roles = Role::all();
        return Inertia::render(component:'Users/Edit', props:[
            'user'=>new UserResource($user),
            'roles'=>RoleResource::collection($roles)

        ]);

    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     *
     * This method handles the user update process:
     * - Validates the input data (name, email, role)
     * - Updates user's basic information (name and email)
     * - Syncs user's roles
     * - Wraps operations in a database transaction
     *
     * Validation Rules:
     * - name: Required, must be a string
     * - email: Required, must be valid email, must be unique except for current user
     * - role: Required
     *
     * @throws \Throwable When database transaction fails
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate(rules:[
            'name'=>['required','string'],
            'email'=>['required','email', 'unique:users,email,'.$user->id],
            'role'=>['required']

        ]);


        try {
            DB::transaction(function()use($validated, $user){
                $user->update(attributes:[
                    'name'=>$validated['name'],
                    'email'=>$validated['email']

                ]);

                $user->roles()->sync($validated['role']);


            });

            return Redirect::route(route:'user.edit', parameters:$user)
                ->with(key:'success', value:'User update successfully');

        } catch(\Throwable $th){
            Log::error(message:$th);
            return back()
                ->with(key:'error', value:'Something is wrong');
        }

    }

    public function update_password(Request $request , User $user)
    {
        $validated = $request->validate([

            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        try {
            DB::transaction(callback:function() use ($validated, $user){
                $user->update(attributes:[
                    'password'=>Hash::make(value:$validated['password'])
                ]);
            });
            return Redirect::route(route:'user.edit', parameters:$user)
                ->with(key:'success', value:'Password update successfully');
        } catch (\Throwable $th) {
            Log::error(message:$th->getMessage() . 'on the ' . $th->getFile() .' line no '.$th->getLine());
            return back()
                ->with(key:'error', value:'Something is wrong');
        }
    }


    /**
     * Remove the specified user from storage.
     *
     * Deletes the user and redirects to the user index page with pagination.
     * If the current page number exceeds the last available page after deletion,
     * redirects to the last available page.
     *
     * @param  \Illuminate\Http\Request  $request  The HTTP request instance
     * @param  \App\Models\User  $user  The user model instance to be deleted
     * @return \Illuminate\Http\RedirectResponse  Redirects to user index with success message
     */
     public function destroy(Request $request, User $user)
     {

         $user->delete();
         $paginator  = User::paginate(columns:['id'], perPage: 10);
         $page = $request->page;
         $redirectToPage = ($page <= $paginator->lastPage()) ? $page : $paginator->lastPage();



         return redirect()->route('user.index', ['page' => $redirectToPage])
         ->with('success', 'User Deleted Successfully');

     }
}
