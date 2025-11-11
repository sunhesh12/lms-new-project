<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LectureMaterial extends Model
{
    use HasFactory;

    protected $table = 'lecture_materials';
    protected $primaryKey = 'id';

    protected $fillable = [
        'topic_id',
        'material_type',   // e.g. pdf, docx, ppt, link
        'material_title',  // display title
        'material_url',    // if it's an external link
        'file_path',       // if it's a stored file in Laravel storage
        'file_size',       // file size in bytes
        'mime_type',       // MIME type of uploaded file
    ];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}