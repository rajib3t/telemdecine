<?php

namespace App\Enums;

enum PatientGenderEnum : string
{
    case MALE = 'MALE';
    case FEMALE = 'FEMALE';
    case OTHER = 'OTHER';


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
