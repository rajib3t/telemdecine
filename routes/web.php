<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ConfirmAppointmentController;
use App\Http\Controllers\PatientController;
use App\Models\Patient;

/**
 * Redirect to the dashboard if the user is authenticated
 */
Route::redirect('/', '/dashboard');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


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
 * Middleware auth
 */
Route::group(
    attributes:[
        'middleware' => ['auth'],

    ],
    routes:function(){
        /**
         * Dashboard routes
         * 1. GET /dashboard - Show the dashboard
         */
        Route::group(attributes:[
            'as'=>'dashboard.',
            'prefix'=>'dashboard',
            'controller'=>DashboardController::class
        ],routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
        });

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
                Route::get(uri:'get', action:'getUsers')
                    ->name(name:'get');
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
        /**
         * Department Routes
         * 1. GET /departments - Show list of departments
         * 2. GET /departments/create - Show form for create a new department
         * 3. POST /departments/store - To store new department into database
         * 4. GET /department/{department}/edit - Show form for edit department
         * 5. PATCH /departments/{department} - Update a department
         * 6. DELETE /departments/{department} - Delete a department
         * 7. GET /departments/get-department/{department} - Get department by id and response with json
         */
        Route::group(attributes:[
            'as'=>'department.',
            'prefix'=>'departments',
            'controller'=>DepartmentController::class
        ], routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
            Route::get(uri:'create', action:'create')
                ->name(name:'create');
            Route::post(uri:'store', action:'store')
                ->name(name:'store');
            Route::get(uri:'{department}/edit', action:'edit')
                ->name(name:'edit');
            Route::patch(uri:'{department}', action:'update')
                ->name(name:'update');
            Route::delete(uri:'/{department}', action:'destroy')
                ->name(name:'delete');
            Route::get(uri:'get-department/{department}', action:'getDepartment')
                ->name(name:'get');

        });

        /**
         * Visit Route
         * 1. GET /visits
         * 2. GET /visits/create - Show form to create a new visit
         * 3. POST /visits/store - Store a new visit
         * 4. GET /visits/{visit}/edit - Show edit form for visit
         * 5. PATCH /visits/{visit} - Update a visit
         * 6. DELETE /visits/{visit} - Delete a visit
         */
        Route::group(attributes:[
            'as'=>'visit.',
            'prefix'=>'visits',
            'controller'=>VisitController::class
        ], routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
            Route::get(uri:'create', action:'create')
                ->name(name:'create');
            Route::post(uri:'store', action:'store')
                ->name(name:'store');
            Route::get(uri:'{visit}/edit', action:'edit')
                ->name(name:'edit');
            Route::patch(uri:'{visit}', action:'update')
                ->name(name:'update');
            Route::delete(uri:'/{visit}', action:'destroy')
                ->name(name:'delete');

        });

        /**
         * Appointments Routes
         * 1. GET /appointments - To view all open visits for add appointments
         * 2. GET /appointments/{visit}/add-patients - Add patient to the specific visit
         * 3. POST /appointments/{visit}/add-patient-into-visit - Add new patient into database
         */
        Route::group(attributes:[
            'as'=>'appointment.',
            'prefix'=>'appointments',
            'controller'=>AppointmentController::class
        ], routes:function(){
            Route::get(uri:'/', action:'index')
                ->name(name:'index');
            Route::get(uri:'{visit}/add-patients', action:'add_patients')
                ->name(name:'add.patient');
            Route::post(uri:'{visit}/add-patient-into-visit', action:'addPatientToVisit')
                ->name(name:'add.into.visit');

        });

        /**
         * Patients Routes
         * 1. GET /patients/get - Return json patient data for autocomplete
         * 2. POST /patients/store - Store new patient into database
         */
        Route::group(attributes:[
            'as'=>'patient.',
            'prefix'=>'patients',
            'controller'=>PatientController::class
        ], routes:function(){
            Route::get(uri:'get', action:'get_patients')
                ->name(name:'get');
            Route::post(uri:'store', action:'store')
                ->name(name:'store');

        });

        /**
         * Confirm Appointment Routes
         * 1. GET /confirm-appointment - Show the confirm appointment page
         * 2. GET /confirm-appointment/{visit}/patient-list - Show patient list for specific visit
         */
        Route::group(attributes:[
            'as'=>'confirm.appointment.',
            'prefix'=>'confirm-appointment',
            'controller'=>ConfirmAppointmentController::class
        ],routes:function(){
            Route::get(uri:'/', action:'index')
            ->name(name:'index');
            Route::get(uri:'{visit}/patient-list', action:'patientList')
            ->name(name:'patient.list');
        });

    }
);


require __DIR__.'/auth.php';
