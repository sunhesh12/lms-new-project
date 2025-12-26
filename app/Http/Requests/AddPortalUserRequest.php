<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Helpers\ResponseHelper;

class AddPortalUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'age' => 'required|integer',
            'mobile_no' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            //'status' => 'required|integer|max:1',
            'course_id' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Max resolution is set here
        ];
    }

    public function messages()
    {
        return [
            // Required errors
            'full_name.required' => 'Full name is required',
            'email.required' => 'Email is required',
            'age.required' => 'Age is required',
            'mobile_no.required' => 'Mobile number is required',
            'address.required' => 'Address is required',
            //'institution.required' => 'Institution is required',
            'password.required' => 'Password is required',
            //'status.required' => 'Status is required',
            'course_id.required' => 'Course ID is required',
            'profile_picture.required' => 'Profile picture is required',

            // Len errors
            'full_name.max' => 'Full name must not exceed 255 characters',
            'email.max' => 'Email must not exceed 255 characters',
            'mobile_no.max' => 'Mobile number must not exceed 50 characters',
            'address.max' => 'Address must not exceed 255 characters',
            //'institution.max' => 'Institution must not exceed 255 characters',
            'password.max' => 'Password must not exceed 255 characters',
            //'status.max' => 'Status must not exceed 20 characters',
            'course_id.max' => 'Course ID must not exceed 255 characters',
        ];
    }

    /*
    * Important note: without this function for any validation errro
    * it reports a 404 error.
    */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            ResponseHelper::invalid($validator->errors()->all(), "Error while validating request")
        );
    }
}
