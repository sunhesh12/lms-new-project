# Assignment Submission Issues Report

## Critical Issues

### 1. **Missing Deadline and Start Date Validation**
**Location:** `app/Http/Controllers/AssignmentController.php:68-126`

**Issue:** The `submit()` method does not check if:
- The assignment has started (`hasStarted()`)
- The assignment deadline has passed (`isPastDeadline()`)

**Impact:** Students can submit assignments before they start or after the deadline has passed.

**Fix Required:** Add validation before allowing submission:
```php
if (!$assignment->hasStarted()) {
    return redirect()->back()->with('error', 'Assignment has not started yet.');
}

if ($assignment->isPastDeadline()) {
    return redirect()->back()->with('error', 'Assignment deadline has passed.');
}
```

---

### 2. **Missing Module Enrollment Verification**
**Location:** `app/Http/Controllers/AssignmentController.php:68-126`

**Issue:** The submission method doesn't verify that the student is enrolled in the module containing the assignment.

**Impact:** Students could potentially submit assignments for modules they're not enrolled in (if they know the assignment ID).

**Fix Required:** Add enrollment check:
```php
$module = $assignment->module;
$isEnrolled = $module->students()->where('students.user_id', $user->id)->exists();

if (!$isEnrolled) {
    abort(403, 'You are not enrolled in this module.');
}
```

---

### 3. **Missing Assignment Soft-Delete Check**
**Location:** `app/Http/Controllers/AssignmentController.php:81`

**Issue:** Uses `findOrFail()` which doesn't check if the assignment is soft-deleted (`is_deleted = true`).

**Impact:** Students can submit to deleted assignments.

**Fix Required:** 
```php
$assignment = Assignment::where('id', $assignmentId)
    ->where('is_deleted', false)
    ->firstOrFail();
```

---

### 4. **Insufficient File Upload Security**
**Location:** `app/Http/Controllers/AssignmentController.php:75-86`

**Issues:**
- No file type/MIME type validation (only max size)
- Uses original filename which could contain malicious characters or paths
- No sanitization of filename

**Impact:** Security vulnerabilities including:
- Upload of executable files
- Path traversal attacks
- Filename injection

**Fix Required:** Add proper validation:
```php
'resource_file' => 'required|file|max:10240|mimes:pdf,doc,docx,txt,zip,rar',
```

And sanitize filename:
```php
$fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $validatedData['resource_file']->getClientOriginalName());
```

---

### 5. **Missing Directory Existence Check**
**Location:** `app/Http/Controllers/AssignmentController.php:84-86`

**Issue:** Code doesn't check if the upload directory exists before moving files.

**Impact:** File upload will fail if directory doesn't exist, causing errors.

**Fix Required:**
```php
$filePath = Storage::disk('public')->path('/uploads/submissions/');
if (!file_exists($filePath)) {
    mkdir($filePath, 0755, true);
}
```

---

### 6. **No Database Transaction Handling**
**Location:** `app/Http/Controllers/AssignmentController.php:88-120`

**Issue:** If resource creation succeeds but submission creation/update fails, the resource will be orphaned in the database.

**Impact:** Data inconsistency and orphaned resources.

**Fix Required:** Wrap in database transaction:
```php
DB::transaction(function () use ($assignment, $user, $resource, $validatedData) {
    // ... existing code ...
});
```

---

### 7. **No File Cleanup on Error**
**Location:** `app/Http/Controllers/AssignmentController.php:84-120`

**Issue:** If submission fails after file upload, the uploaded file remains on disk.

**Impact:** Disk space waste and orphaned files.

**Fix Required:** Add try-catch with file cleanup:
```php
try {
    // ... upload and create submission ...
} catch (Exception $e) {
    // Clean up uploaded file
    if (isset($fileName) && file_exists($filePath . $fileName)) {
        unlink($filePath . $fileName);
    }
    throw $e;
}
```

---

## Medium Priority Issues

### 8. **Duplicate Route Definition**
**Location:** `routes/web.php:60` and `routes/web.php:187`

**Issue:** Two routes defined for the same action:
- Line 60: `Route::post("/assignments/{assignmentId}/submit", ...)->name("assignment.submit");`
- Line 187: `Route::post('/assignments/{assignment}/submit', ...)->name('assignments.submit');`

**Impact:** Route name confusion, potential conflicts.

**Fix Required:** Remove one of the duplicate routes (preferably keep the one inside the auth middleware group).

---

### 9. **Duplicate Field Definition in Form**
**Location:** `resources/js/components/Forms/AssignmentForm.jsx:17,19`

**Issue:** `resource_file` is defined twice in the form data:
```javascript
resource_file: null,  // Line 17
// ...
resource_file: null,  // Line 19
```

**Impact:** Redundant code, potential confusion.

**Fix Required:** Remove one of the duplicate definitions.

---

### 10. **Resource Model Missing Fields in Fillable Array**
**Location:** `app/Models/Resource.php:16-22`

**Issue:** The Resource model's `$fillable` array doesn't include `assignment_id` and `submission_id`, even though these fields exist in the database (per migration `2025_12_08_88888_add_resource_topic_relation.php`).

**Impact:** Cannot properly set these relationships when creating resources, leading to incomplete data.

**Fix Required:** Add missing fields to fillable array:
```php
protected $fillable = [
    'id',
    'topic_id',
    'assignment_id',  // Add this
    'submission_id',  // Add this
    'url',
    'caption',
    'is_deleted',
];
```

**Note:** The Resource model's `submission()` relationship also appears incorrect - it uses `belongsTo(Submission::class, 'resource_id', 'id')` but should likely use `submission_id` as the foreign key.

---

### 11. **Inconsistent Error Handling**
**Location:** `app/Http/Controllers/AssignmentController.php:123-125`

**Issue:** Error message exposes exception message to user, which could leak sensitive information.

**Impact:** Information disclosure vulnerability.

**Fix Required:** Use generic error message:
```php
} catch (Exception $e) {
    \Log::error('Assignment submission failed: ' . $e->getMessage());
    return redirect()->back()->with('error', 'Failed to submit assignment. Please try again.');
}
```

---

### 12. **Missing File Size Validation in Frontend**
**Location:** `resources/js/components/Forms/AssignmentForm.jsx:55-59`

**Issue:** No client-side validation for file size before upload.

**Impact:** Poor user experience (user has to wait for upload to fail).

**Fix Required:** Add file size check before form submission.

---

## Low Priority Issues

### 13. **Missing Timestamp on Submission**
**Location:** `app/Http/Controllers/AssignmentController.php:114-119`

**Issue:** When creating a new submission, timestamps are auto-generated, but there's no explicit `submitted_at` field to track submission time separately from creation time.

**Impact:** Harder to track exact submission time vs. record creation time.

---

### 14. **No Rate Limiting on Submissions**
**Location:** `app/Http/Controllers/AssignmentController.php:68`

**Issue:** No rate limiting to prevent spam submissions.

**Impact:** Potential abuse, server resource consumption.

---

## Recommendations

1. **Add comprehensive validation** for assignment state (started, not past deadline, not deleted)
2. **Implement proper authorization** checks (module enrollment)
3. **Enhance file upload security** (type validation, filename sanitization)
4. **Use database transactions** for data consistency
5. **Implement proper error handling** with logging
6. **Add file cleanup** on errors
7. **Remove duplicate routes** and form fields
8. **Add client-side validation** for better UX

