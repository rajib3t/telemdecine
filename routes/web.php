<?php

use App\Http\Controllers\PermissionController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;


/**
 * Redirect to the dashboard if the user is authenticated
 */
Route::redirect('/', '/dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


/**
 * Profile routes
 *
 * 1. GET /profile - Show the profile form
 * 2. PATCH /profile - Update the user's profile
 *
 */
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * User Authentication Routes
 *
 */
Route::group(
    attributes:[
        'middleware' => ['auth'],

    ],
    routes:function(){
        /**
         * User Routes
         * 1. GET /users - Show a list of users
         * 2. GET /users/create - To create user form page
         * 4. POST /users - Store a new user
         * 5. GET /users/{user}/edit - Show form to edit a user
         * 6. PATCH /users/{user} - Update a user
         * 7. PATCH /users/{user}/password-update - Update password
         * 8. DELETE /users/{user} - Delete a user
         */
        Route::group(
            attributes:[
                'as'=>'user.',
                'prefix'=>'users',
                'controller'=>UserController::class
            ],
            routes:function(){
                Route::get(uri:'/', action:'index')
                    ->name(name:'index');
                Route::get(uri:'create', action:'create')
                    ->name(name:'create');
                Route::post(uri:'store', action:'store')
                    ->name(name:'store');
                Route::get(uri:'{user}/edit', action:'edit')
                    ->name(name:'edit');
                Route::patch(uri:'{user}', action:'update')
                    ->name(name:'update');
                Route::patch(uri:'{user}/password-update', action:'update_password')
                    ->name(name:'password.update');
                Route::delete(uri:'/{user}', action:'destroy')
                    ->name(name:'delete');
            }
        );
        /**
         * Role Routes
         * 1. GET /roles - Show a list of roles
         * 2. Get /roles/create - Show form for create a new role
         * 3. POST /roles/store - Store new role
         * 4. GET /roles/{role}/edit  - Show a form to edit a role
         * 5. PATCH /roles/{role} - Update a role
         * 6. PATCH /roles/{role}/add-permission - add permission to the role
         * 7. DELETE /roles/{role} -
         */
        Route::group(attributes:[
            'as'=>'role.',
            'prefix'=>'roles',
            'controller'=>RoleController::class

        ],routes:function(){
            Route::get(uri:'/', action:'index')

                ->name(name:'index');
            Route::get(uri:'create', action:'create')
                ->name(name:'create');
            Route::post(uri:'store', action:'store')
                ->name(name:'store');
            Route::get(uri:'/{role}/edit', action:'edit')
                ->name(name:'edit');
            Route::patch(uri:'/{role}', action:'update')
                ->name(name:'update');
            Route::patch(uri:'{role}/add-permission', action:'add_permission')
                ->name(name:'add.permission');
            Route::delete(uri:'/{role}', action:'destroy')
                ->name(name:'delete');

        });
        /**
         * Permissions Routes
         * 1. GET /permissions - Show list of permissions
         * 2. GET /permissions/{permission}/edit - Show a form to edit a permission
         * 3. PATCH /permissions/{permission} - Update a permission
         * 4. PATCH /permissions/{permission}/add-role - add role to the permission
         */
        Route::group(attributes:[
            'as'=>'permission.',
            'prefix'=>'permissions',
            'controller'=>PermissionController::class
        ], routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
            Route::get(uri:'/{permissionGroup}/edit', action:'edit')
                ->name(name:'edit');
            Route::patch(uri:'/{permissionGroup}', action:'update')
                ->name(name:'update');
            Route::patch(uri:'{permissionGroup}/add-role', action:'add_role')
                ->name(name:'add.role');

        });

    }
);


require __DIR__.'/auth.php';
