<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;

use function PHPUnit\Framework\callback;

class CreateUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'name' => 'Rajib Mondal',
            'email' => 'admin@gmail.com',
            'password' => Hash::make(value:'password')

        ];
        $roles = [
            [
                'name'=>'Admin',

            ],
            [
                'name'=>'Staff'
            ],
            [
                'name'=>'Technician'
            ]
        ];
        DB::transaction(callback:function () use($data, $roles ){
            foreach ($roles as $key => $value) {
                Role::create($value);
            }

            $res = User::create($data);
            $res->assignRole('Admin');
        });
    }
}
