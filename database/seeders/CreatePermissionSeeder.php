<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CreatePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'User',
            'Role',
            'Permission',
            'Patient'
        ];

        foreach($permissions as $permission) {
            DB::transaction(function () use ($permission) {
                    $permissionData =[
                        'name' => $permission,
                        'guard_name' => 'web',

                    ];
                    $permissionGroup = PermissionGroup::create($permissionData);
                        $permissionRead = Permission::create([
                                'name' => strtolower(string: str_replace(search: ' ', replace: '_', subject: $permission)).'.read',
                                'guard_name' => 'web',
                                'permission_group_id' => $permissionGroup->id,
                        ]);


                        $permissionWrite = Permission::create([
                            'name' => strtolower(string: str_replace(search: ' ', replace: '_', subject: $permission)).'.write',
                            'guard_name' => 'web',
                            'permission_group_id' => $permissionGroup->id,
                        ]);

            });
        }
    }
}
