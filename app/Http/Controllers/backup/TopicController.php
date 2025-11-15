<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\LectureMaterial;
use App\Models\Topic;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function uploadLectureMaterial(Request $request, $topicId)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'material_title' => 'required|string|max:255',
        ]);

        $file = $request->file('file');
        $path = $file->store("materials/{$topicId}", 'public');

        $material = LectureMaterial::create([
            'topic_id' => $topicId,
            'material_type' => 'file',
            'material_title' => $request->material_title,
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return response()->json(['success' => true, 'data' => $material]);
    }

    public function toggleVisibility($topic_id)
    {
        try {
            $topic = Topic::findOrFail($topic_id); // Ensure the topic exists
            $topic->update(['is_visible' => !$topic->is_visible]); // Toggle visibility
            $topic->refresh();

            return ResponseHelper::success('Visibility updated successfully.', ['is_visible' => $topic->is_visible]);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function markAsComplete($topic_id)
    {
        try {
            $topic = Topic::findOrFail($topic_id); // Ensure the topic exists
            $topic->update(['is_complete' => true]); // Mark as complete

            return ResponseHelper::success('Topic marked as complete successfully.');
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function updateMaterials(Request $request, $topicId, $materialId)
    {
        try {
            $material = LectureMaterial::where('id', $materialId)
                ->where('topic_id', $topicId)
                ->firstOrFail();

            $validated = $request->validate([
                'material_type' => 'nullable|string|in:document,video,link',
                'material_title' => 'sometimes|string|max:255',
                'material_url' => 'nullable|string',
            ]);

            $material->update($validated);

            return ResponseHelper::success('Lecture material updated successfully.', [
                'material' => $material,
            ]);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Lecture material not found for the specified topic.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while updating the lecture material.', $e->getMessage());
        }
    }

    public function deleteMaterials($topicId, $materialId)
    {
        try {
            $material = LectureMaterial::where('id', $materialId)
                ->where('topic_id', $topicId)
                ->firstOrFail();

            $material->delete();

            return ResponseHelper::success('Lecture material deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Lecture material not found for the specified topic.');
        } catch (Exception $e) {
            return ResponseHelper::serverError('An error occurred while deleting the lecture material.', $e->getMessage());
        }
    }

    public function addLectureMaterial(Request $request, $topicId)
    {
        try {
            $topic = Topic::findOrFail($topicId);

            $validated = $request->validate([
                'material_type' => 'required|string|in:document,video,link', // Restrict to specific types
                'material_title' => 'required|strin g|max:255',
                'material_url' => 'nullable|string',
            ]);

            $material = $topic->lectureMaterials()->create([
                'material_type' => $validated['material_type'],
                'material_title' => $validated['material_title'],
                'material_url' => $validated['material_url'],
            ]);

            return ResponseHelper::success('Lecture Material added successfully.', $material);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function archiveTopic(Request $request, $id)
    {
        try {

            $topic = Topic::find($id);

            if (!$topic) {
                return ResponseHelper::notFound('Topic not found');
            }

            $topic->update([
                'is_visible' => false, // Set archived to true
            ]);

            $topic->save();

            return ResponseHelper::success('Topic archived successfully', null);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (ModelNotFoundException $mnfe) {
            return ResponseHelper::notFound('Topic not found');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }

    public function unarchiveTopic(Request $request, $id)
    {
        try {

            $topic = Topic::find($id);

            if (!$topic) {
                return ResponseHelper::notFound('Topic not found');
            }

            $topic->update([
                'is_visible' => true, // Set archived to true
            ]);

            $topic->save();

            return ResponseHelper::success('Topic unarchived successfully', null);
        } catch (QueryException $qe) {
            return ResponseHelper::serverError($qe->getMessage());
        } catch (ModelNotFoundException $mnfe) {
            return ResponseHelper::notFound('Topic not found');
        } catch (Exception $e) {
            return ResponseHelper::serverError($e->getMessage());
        }
    }



}
