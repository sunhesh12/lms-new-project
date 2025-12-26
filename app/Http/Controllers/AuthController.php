<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\AddPortalUserRequest;
use App\Http\Controllers\PortalUserController;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\SignInRequest;
use App\Models\PortalUser;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{

    public function signin(SignInRequest $request)
    {
        try {
            $user = PortalUser::where('email', $request->input('email'))->first();

            if ($user && Hash::check($request->input('password'), $user->password)) {
                $token = $user->createToken('auth_token')->plainTextToken;

                return ResponseHelper::success(
                    'Login successful',
                    [
                        'user' => $user,
                        'token' => $token,
                    ]
                );
            }

            return ResponseHelper::unauthorized("Invalid credentials");
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while logging in.' . $e->getMessage());
        }
    }

    public function signout(Request $request)
    {
        try {
            // Revoke all tokens associated with the user
            $request->user()->tokens()->delete();

            return ResponseHelper::success('Logged out successfully.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while logging out.' . $e->getMessage());
        }
    }


    public function signup(AddPortalUserRequest $request): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
    {
        // Only submission is via form
        if (!$request->accepts('multipart/form-data')) {
            return ResponseHelper::invalidMedia();
        }

        // Only allow POST requests
        if (!$request->isMethod('post')) {
            return ResponseHelper::methodInvalid();
        }
        // Must be sent via a form submission
        $full_name = $request->input('full_name');
        $age = $request->input('age');
        $email = $request->input('email');
        $mobile = $request->input('mobile_no');
        $address = $request->input('address');
        //$institution = $request->input('institution');
        $password = $request->input('password');
        $role = $request->input('role');
        $status = '1';
        $course_id = $request->input('course_id');
        $profile_picture = $request->file('profile_picture');

        // Create a new user
        try {
            $user = PortalUser::create([
                'full_name' => $full_name,
                'age' => $age,
                'email' => $email,
                'mobile_no' => $mobile,
                'address' => $address,
                //'Institution' => $institution,
                'profile_picture' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s',
                'password' => $password,
                'role' => 'student',
                'status' => $status,
                'course_id' => $course_id
            ]);

            // Generate a personal access token for the user
            $token = $user->createToken('auth_token')->plainTextToken;
            $user->courses()->attach($request->course_id);

            return ResponseHelper::success('User created successfully', [
                'user' => $user,
                'token' => $token,
            ]);
        } catch (QueryException $qe) {
            // When a db query exception has occured
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            // When a general server exception has occured
            return ResponseHelper::serverError($e->getMessage());
        }
    }
}
