<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;


class UserController extends Controller
{
    /**
     * Display a listing of the Users.
     *
     *
     * @return \Inertia\Response
     *
     */
    public function index(Request $request) {

        $name = $request->name;

        $users = User::when($request->name, function ($query, $name) {
            $query->where('name', 'like', '%'.$name.'%');

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
     * User Delete
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
