<?php
require_once __DIR__ . '/../config/database.php';

class Enrollment {
    private $conn;
    private $table = 'enrollments';

    public $id;
    public $user_id;
    public $course_id;
    public $progress_percentage;
    public $enrolled_at;
    public $completed_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Enroll user in a course
     */
    public function enroll() {
        // Check if already enrolled
        if ($this->isEnrolled($this->user_id, $this->course_id)) {
            return false;
        }

        $query = "INSERT INTO " . $this->table . " (user_id, course_id) VALUES (:user_id, :course_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':course_id', $this->course_id);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            
            // Update course student count
            $updateQuery = "UPDATE courses SET total_students = total_students + 1 WHERE id = :course_id";
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':course_id', $this->course_id);
            $updateStmt->execute();

            return true;
        }
        return false;
    }

    /**
     * Check if user is enrolled
     */
    public function isEnrolled($user_id, $course_id) {
        $query = "SELECT id FROM " . $this->table . " WHERE user_id = :user_id AND course_id = :course_id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':course_id', $course_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Get user enrollments
     */
    public function getUserEnrollments($user_id) {
        $query = "SELECT e.*, c.title, c.slug, c.thumbnail, c.category, c.difficulty, c.rating,
                         u.name as instructor_name
                  FROM " . $this->table . " e
                  JOIN courses c ON e.course_id = c.id
                  JOIN users u ON c.instructor_id = u.id
                  WHERE e.user_id = :user_id
                  ORDER BY e.enrolled_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update progress
     */
    public function updateProgress($enrollment_id, $progress_percentage) {
        $query = "UPDATE " . $this->table . " 
                  SET progress_percentage = :progress_percentage 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':progress_percentage', $progress_percentage);
        $stmt->bindParam(':id', $enrollment_id);

        return $stmt->execute();
    }

    /**
     * Mark content as completed
     */
    public function markContentCompleted($enrollment_id, $content_id) {
        // Check if already marked
        $checkQuery = "SELECT id FROM progress WHERE enrollment_id = :enrollment_id AND content_id = :content_id";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':enrollment_id', $enrollment_id);
        $checkStmt->bindParam(':content_id', $content_id);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            // Update existing
            $query = "UPDATE progress SET completed = 1, completed_at = NOW() 
                      WHERE enrollment_id = :enrollment_id AND content_id = :content_id";
        } else {
            // Insert new
            $query = "INSERT INTO progress (enrollment_id, content_id, completed, completed_at) 
                      VALUES (:enrollment_id, :content_id, 1, NOW())";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':enrollment_id', $enrollment_id);
        $stmt->bindParam(':content_id', $content_id);
        $stmt->execute();

        // Recalculate progress percentage
        $this->recalculateProgress($enrollment_id);
    }

    /**
     * Recalculate enrollment progress
     */
    private function recalculateProgress($enrollment_id) {
        // Get total content count for the course
        $enrollmentQuery = "SELECT course_id FROM enrollments WHERE id = :enrollment_id";
        $enrollmentStmt = $this->conn->prepare($enrollmentQuery);
        $enrollmentStmt->bindParam(':enrollment_id', $enrollment_id);
        $enrollmentStmt->execute();
        $enrollment = $enrollmentStmt->fetch(PDO::FETCH_ASSOC);

        if (!$enrollment) return;

        $course_id = $enrollment['course_id'];

        // Get total content items
        $totalQuery = "SELECT COUNT(*) as total 
                       FROM course_content cc
                       JOIN course_modules cm ON cc.module_id = cm.id
                       WHERE cm.course_id = :course_id";
        $totalStmt = $this->conn->prepare($totalQuery);
        $totalStmt->bindParam(':course_id', $course_id);
        $totalStmt->execute();
        $total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

        if ($total == 0) return;

        // Get completed content items
        $completedQuery = "SELECT COUNT(*) as completed 
                           FROM progress p
                           JOIN course_content cc ON p.content_id = cc.id
                           JOIN course_modules cm ON cc.module_id = cm.id
                           WHERE p.enrollment_id = :enrollment_id 
                           AND p.completed = 1 
                           AND cm.course_id = :course_id";
        $completedStmt = $this->conn->prepare($completedQuery);
        $completedStmt->bindParam(':enrollment_id', $enrollment_id);
        $completedStmt->bindParam(':course_id', $course_id);
        $completedStmt->execute();
        $completed = $completedStmt->fetch(PDO::FETCH_ASSOC)['completed'];

        $progress_percentage = ($completed / $total) * 100;

        // Update enrollment progress
        $this->updateProgress($enrollment_id, $progress_percentage);

        // If 100% complete, mark as completed
        if ($progress_percentage >= 100) {
            $completeQuery = "UPDATE enrollments SET completed_at = NOW() WHERE id = :enrollment_id";
            $completeStmt = $this->conn->prepare($completeQuery);
            $completeStmt->bindParam(':enrollment_id', $enrollment_id);
            $completeStmt->execute();
        }
    }
}

