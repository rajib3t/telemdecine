<?php

use App\Enums\PatientVisitEnum;
use App\Models\Patient;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patient_visit', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger(column:'patient_id');
            $table->unsignedBigInteger(column:'visit_id');
            $table->date(column:'date')->nullable();
            $table->text(column:'description')->nullable();
            $table->text(column:'advice_transcription')->nullable();
            $table->enum(column:'status', allowed:PatientVisitEnum::keys())->default(PatientVisitEnum::Pending);
            $table->unsignedBigInteger(column:'created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visits');
    }
};
