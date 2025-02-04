<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as BasePermission;
class Permission extends BasePermission
{
    /**
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'permission_group_id'
    ];


    /**
    * Get the group that owns the permission.
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function group()
    {
        return $this->belongsTo(related: PermissionGroup::class);
    }

}
