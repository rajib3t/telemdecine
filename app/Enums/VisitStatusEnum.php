<?php

namespace App\Enums;

enum VisitStatusEnum: string
{
    case Open = 'OPEN';
    case Closed = 'CLOSED';
    case Cancelled = 'CANCELLED';
    case  Completed = 'COMPLETED';




    /**
     * Get the values with name of the enum
     *
     * @return array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'name', 'value');
    }

    /**
     * Get the keys of the enum
     *
     * @return array
     */
    public static function keys(): array
    {
        return array_column(self::cases(), 'value');
    }


}
