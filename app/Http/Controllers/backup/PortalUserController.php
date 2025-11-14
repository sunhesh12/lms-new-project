<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Activity;
use App\Models\PortalUser;
use App\Http\Requests\AddPortalUserRequest;
use App\Http\Requests\UpdatePortalUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Exception;
use Illuminate\Http\Request;

class PortalUserController extends Controller
{
    public function all(Request $request)
    {
        try {
            $users = PortalUser::all(); // Fetch all users

            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Users retrieved successfully', $users);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getTeachingModules(Request $request, $id)
    {
        try {
            $user = PortalUser::find($id);

            if(!$user) return ResponseHelper::notFound('User not found');

            $modules = $user->teaches->makeHidden('pivot');

            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Modules retrieved successfully', $modules);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }


    public function students(Request $request)
    {
        try {
            $users = PortalUser::where("Role", "=", "student")->get(); // Fetch all users

            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Students retrieved successfully', $users);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function lecturers(Request $request)
    {
        try {
            $users = PortalUser::where("Role", "=", "lecturer")->get(); // Fetch all users

            // Use the ResponseHelper to return a success response
            return ResponseHelper::success('Students retrieved successfully', $users);
        } catch (Exception $e) {
            // Catch any general exceptions and use ResponseHelper for error response
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function create(AddPortalUserRequest $request): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
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
        $status = $request->input('status');
        $course_id = $request->input('course_id');
        $profile_picture = $request->file('profile_picture');

        // Create a new user
        try {
            $user = PortalUser::create([
                'full_Name' => $full_name,
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
            return ResponseHelper::success('User created successfully', $user);
        } catch (QueryException $qe) {
            // When a db query exception has occured
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            // When a general server exception has occured
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function delete($id, Request $request)
    {
        if (!$request->isMethod('delete')) {
            return ResponseHelper::methodInvalid();
        }

        try {
            PortalUser::where('id', $id)->delete();
            return ResponseHelper::success('User with id ' . $id . ' deleted successfully.');
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        }
    }

    public function update($id, UpdatePortalUserRequest $request)
    {
        // Ensure JSON is accepted
        if (!$request->accepts('application/json')) {
            return ResponseHelper::invalidMedia();
        }

        // Only allow PATCH requests
        if (!$request->isMethod('patch')) {
            return ResponseHelper::methodInvalid();
        }

        try {
            $usersData = $request->json()->all();

            // Check if the request is updating multiple users
            if (isset($usersData[0]) && is_array($usersData[0])) {
                // Batch update logic
                $updatedUsers = [];

                foreach ($usersData as $userData) {
                    $user = PortalUser::find($userData['id']);
                    if (!$user) {
                        continue;
                    }

                    if (isset($userData['full_name'])) {
                        $user->full_name = $userData['full_name'];
                    }
                    if (isset($userData['age'])) {
                        $user->age = $userData['age'];
                    }
                    if (isset($userData['email'])) {
                        $user->email = $userData['email'];
                    }
                    if (isset($userData['mobile_no'])) {
                        $user->mobile_no = $userData['mobile_no'];
                    }
                    if (isset($userData['address'])) {
                        $user->address = $userData['address'];
                    }
                    if (isset($userData['institution'])) {
                        $user->institution = $userData['institution'];
                    }
                    if (isset($userData['password'])) {
                        $user->password = bcrypt($userData['password']);
                    }
                    if (isset($userData['role'])) {
                        $user->role = $userData['role'];
                    }
                    if (isset($userData['status'])) {
                        $user->status = $userData['status'];
                    }
                    if (isset($userData['course_id'])) {
                        $user->course_id = $userData['course_id'];
                    }

                    $user->save();
                    $updatedUsers[] = $user;
                }

                return ResponseHelper::success('Users updated successfully', $updatedUsers);
            }

            // Single user update logic
            $user = PortalUser::findOrFail($id);
            if (!$user) {
                return ResponseHelper::notFound('User not found');
            }

            if ($request->json('full_name')) {
                $user->full_name = $request->json('full_name');
            }
            if ($request->json('age')) {
                $user->age = $request->json('age');
            }
            if ($request->json('email')) {
                $user->email = $request->json('email');
            }
            if ($request->json('mobile_no')) {
                $user->mobile_no = $request->json('mobile_no');
            }
            if ($request->json('address')) {
                $user->address = $request->json('address');
            }
            if ($request->json('institution')) {
                $user->institution = $request->json('institution');
            }
            if ($request->json('password')) {
                $user->password = bcrypt($request->json('password'));
            }
            if ($request->json('role')) {
                $user->role = $request->json('role');
            }
            if ($request->json('status')) {
                $user->status = $request->json('status');
            }
            if ($request->json('course_id')) {
                $user->course_id = $request->json('course_id');
            }

            $user->save();

            return ResponseHelper::success('User updated successfully', $user);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function read($id)
    {
        try {
            $user = PortalUser::find($id);
            if (!$user) {
                return ResponseHelper::notFound('User not found');
            }
            return ResponseHelper::success('User found', $user);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getFilteredInfo($id, $field)
    {
        try {
            // Find the user by ID
            $user = PortalUser::findOrFail($id);

            if (!isset($user->$field)) {
                return ResponseHelper::notFound('Field not found');
            }
            return ResponseHelper::success("$field retrieved successfully", [$field => $user->$field]);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            // Handle general server errors
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function getUserCourses($userId)
    {
        $user = PortalUser::find($userId);
        if (!$user) {
            return ResponseHelper::notFound('User not found');
        }
        return ResponseHelper::success('User course fetched successfully', $user->course);
    }

    public function getEnrolledModules($id)
    {
        try {
            // Find the user by ID
            $user = PortalUser::find($id);
            $modules = $user->enrolledModules();
            if (!$user) {
                return ResponseHelper::notFound('User not found');
            }
            return ResponseHelper::success('User enrolled modules fetched successfully', $modules);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            // Handle general server errors
            return ResponseHelper::serverError($e->getMessage());
        }
    }
}
