<?php

namespace Database\Factories;

use App\Models\PortalUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PortalUser>
 */
class PortalUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = PortalUser::class;
    public function definition()
    {
        return [
            'Full_Name' => $this->faker->name,
            'Age' => $this->faker->numberBetween(18, 60),
            'Email' => $this->faker->unique()->safeEmail,
            'Mobile_No' => $this->faker->unique()->phoneNumber,
            'Address' => $this->faker->address,
            //'Institution' => $this->faker->company,
            'Profile_Picture' => $this->faker->imageUrl(200, 200, 'people'),
            'Password' => Hash::make('password'), // Default password is "password"
            'Role' => $this->faker->randomElement(['admin', 'student', 'teacher']),
            'Status' => $this->faker->boolean(90), // 90% chance of being active
            'course_id' => $this->faker->optional()->numberBetween(1, 1), // Random course_id (1-10), can be null
        ];
    }
}
