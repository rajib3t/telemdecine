<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
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
            'date' => Carbon::parse($this->date)
                           ->setTimezone('Asia/Kolkata')
                           ->format('D M j Y'),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'hospital_name' => $this->hospital_name,
            'slot_number' => $this->slot_number,
            'status' => $this->status,
            'patients' => PatientResource::collection($this->whenLoaded('patients'))
        ];
    }
}
