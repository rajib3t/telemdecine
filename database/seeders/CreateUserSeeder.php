<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

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

        DB::transaction(callback:function () use($data){
            return User::create($data);
        });
    }
}
