<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Patient::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'hospital_id' => fake()->numberBetween(1, 100), // Assuming hospitals have IDs from 1-100
            'name' => fake()->name(),
            'gender' => fake()->randomElement(['Male', 'Female', 'Other']),
            'dob' => fake()->date('Y-m-d', '-1 year'),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'district' => fake()->city(), // Using city as district since faker doesn't have district
            'state' => fake()->state(),
            'pin_code' => fake()->numerify('######'), // 6-digit PIN code
            'phone' => fake()->numerify('##########'), // 10-digit phone number
        ];
    }

    /**
     * Indicate that the patient is male.
     */
    public function male(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'Male',
        ]);
    }

    /**
     * Indicate that the patient is female.
     */
    public function female(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'Female',
        ]);
    }

    /**
     * Indicate that the patient is a child (age < 18).
     */
    public function child(): static
    {
        return $this->state(fn (array $attributes) => [
            'dob' => fake()->dateTimeBetween('-17 years', '-1 year')->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the patient is an adult (age >= 18).
     */
    public function adult(): static
    {
        return $this->state(fn (array $attributes) => [
            'dob' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
        ]);
    }
}
