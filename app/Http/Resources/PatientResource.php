<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hospital_id' => $this->hospital_id,
            'name' => $this->name,
            'gender' => $this->gender,
            'dob' => $this->dob,
            'address' => $this->address,
            'city' => $this->city,
            'district' => $this->district,
            'state' => $this->state,
            'pin_code' => $this->pin_code,
            'phone' => $this->phone,

        ];
    }
}
