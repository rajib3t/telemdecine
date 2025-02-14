<?php

namespace App\Enums;

enum PatientVisitEnum:string
{
    case PENDING = 'pending';
    case CONFIRM = 'confirm';
    case CANCEL = 'cancel';
    case ATTENDED = 'attended';




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
