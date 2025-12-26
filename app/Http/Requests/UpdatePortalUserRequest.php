<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use App\Helpers\ResponseHelper;

class UpdatePortalUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define validation rules
     */
    public function rules(): array
    {
        $rules = [
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'age' => 'nullable|integer',
            'mobile_no' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:20',
            'course_id' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Max resolution is set here
        ];

        // Check if the request contains an array of users (batch update)
        if (is_array($this->json()->all()[0] ?? null)) {
            $rules = [
                '*' => [
                    'full_name' => 'nullable|string|max:255',
                    'email' => 'nullable|email|max:255',
                    'age' => 'nullable|integer',
                    'mobile_no' => 'nullable|string|max:50',
                    'address' => 'nullable|string|max:255',
                    'institution' => 'nullable|string|max:255',
                    'password' => 'nullable|string|max:255',
                    'status' => 'nullable|string|max:20',
                    'course_id' => 'nullable|string|max:255',
                    'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
                ]
            ];
        }

        return $rules;
    }

    /**
     * Custom validation error messages
     */
    public function messages()
    {
        return [
            'full_name.max' => 'Full name must not exceed 255 characters',
            'email.max' => 'Email must not exceed 255 characters',
            'mobile_no.max' => 'Mobile number must not exceed 50 characters',
            'address.max' => 'Address must not exceed 255 characters',
            'institution.max' => 'Institution must not exceed 255 characters',
            'password.max' => 'Password must not exceed 255 characters',
            'status.max' => 'Status must not exceed 20 characters',
            'course_id.max' => 'Course ID must not exceed 255 characters',
        ];
    }

    /*
    * Important note: without this function, for any validation error,
    * it reports a 404 error.
    */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            ResponseHelper::invalid($validator->errors()->all(), "Error while validating request")
        );
    }
}
