<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
                Route::get('/', 'index')
                    ->name('index');
                Route::delete('/{user}', 'destroy')
                    ->name(name:'delete');
            }
        );

    }
);


require __DIR__.'/auth.php';
