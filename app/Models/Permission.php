<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as BasePermission;
class Permission extends BasePermission
{
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
