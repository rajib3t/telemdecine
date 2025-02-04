<?php

use App\Http\Controllers\PermissionController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Models\Role;

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
 * User Route Group
 */
Route::group(
    attributes:[
        'middleware' => ['auth'],

    ],
    routes:function(){
        /**
         * User Routes
         * 1. GET /users - Show a list of users
         * 2. DELETE /users/{user} - Delete a user
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
                Route::delete(uri:'/{user}', action:'destroy')
                    ->name(name:'delete');
            }
        );
        /**
         * Role Routes
         * 1. GET /roles - Show a list of roles
         * 2. GET /roles/{role}/edit  - Show a form to edit a role
         * 3. PATCH /roles/{role} - Update a role
         *
         */
        Route::group(attributes:[
            'as'=>'role.',
            'prefix'=>'roles',
            'controller'=>RoleController::class

        ],routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
            Route::get(uri:'/{role}/edit', action:'edit')
                ->name(name:'edit');
            Route::patch(uri:'/{role}', action:'update')
                ->name(name:'update');

        });
        /**
         * Permissions Routes
         * 1. GET /permissions - Show list of permissions
         * 2. GET /permissions/{permission}/edit - Show a form to edit a permission
         * 3. PATCH /permissions/{permission} - Update a permission
         *
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

        });

    }
);


require __DIR__.'/auth.php';
