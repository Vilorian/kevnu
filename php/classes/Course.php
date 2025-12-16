<?php
require_once __DIR__ . '/../config/database.php';

class Course {
    private $conn;
    private $table = 'courses';

    public $id;
    public $title;
    public $slug;
    public $description;
    public $short_description;
    public $instructor_id;
    public $category;
    public $price;
    public $duration;
    public $thumbnail;
    public $featured;
    public $difficulty;
    public $rating;
    public $total_students;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new course
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (title, slug, description, short_description, instructor_id, category, price, duration, thumbnail, featured, difficulty) 
                  VALUES (:title, :slug, :description, :short_description, :instructor_id, :category, :price, :duration, :thumbnail, :featured, :difficulty)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':slug', $this->slug);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':short_description', $this->short_description);
        $stmt->bindParam(':instructor_id', $this->instructor_id);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':duration', $this->duration);
        $stmt->bindParam(':thumbnail', $this->thumbnail);
        $stmt->bindParam(':featured', $this->featured);
        $stmt->bindParam(':difficulty', $this->difficulty);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    /**
     * Get all courses with optional filters
     */
    public function getAll($filters = []) {
        $query = "SELECT c.*, u.name as instructor_name, u.avatar as instructor_avatar 
                  FROM " . $this->table . " c 
                  LEFT JOIN users u ON c.instructor_id = u.id 
                  WHERE 1=1";

        $params = [];

        if (isset($filters['category']) && !empty($filters['category'])) {
            $query .= " AND c.category = :category";
            $params[':category'] = $filters['category'];
        }

        if (isset($filters['difficulty']) && !empty($filters['difficulty'])) {
            $query .= " AND c.difficulty = :difficulty";
            $params[':difficulty'] = $filters['difficulty'];
        }

        if (isset($filters['featured']) && $filters['featured'] === true) {
            $query .= " AND c.featured = 1";
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $query .= " AND (c.title LIKE :search OR c.description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $query .= " ORDER BY c.created_at DESC";

        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
            if (isset($filters['offset'])) {
                $query .= " OFFSET :offset";
            }
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if (isset($filters['limit'])) {
            $stmt->bindValue(':limit', (int)$filters['limit'], PDO::PARAM_INT);
            if (isset($filters['offset'])) {
                $stmt->bindValue(':offset', (int)$filters['offset'], PDO::PARAM_INT);
            }
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get course by ID
     */
    public function getById($id) {
        $query = "SELECT c.*, u.name as instructor_name, u.avatar as instructor_avatar, u.bio as instructor_bio 
                  FROM " . $this->table . " c 
                  LEFT JOIN users u ON c.instructor_id = u.id 
                  WHERE c.id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->id = $row['id'];
            $this->title = $row['title'];
            $this->slug = $row['slug'];
            $this->description = $row['description'];
            $this->short_description = $row['short_description'];
            $this->instructor_id = $row['instructor_id'];
            $this->category = $row['category'];
            $this->price = $row['price'];
            $this->duration = $row['duration'];
            $this->thumbnail = $row['thumbnail'];
            $this->featured = $row['featured'];
            $this->difficulty = $row['difficulty'];
            $this->rating = $row['rating'];
            $this->total_students = $row['total_students'];
            $this->created_at = $row['created_at'];
            return $row;
        }
        return false;
    }

    /**
     * Get course by slug
     */
    public function getBySlug($slug) {
        $query = "SELECT c.*, u.name as instructor_name, u.avatar as instructor_avatar, u.bio as instructor_bio 
                  FROM " . $this->table . " c 
                  LEFT JOIN users u ON c.instructor_id = u.id 
                  WHERE c.slug = :slug LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get course modules
     */
    public function getModules($course_id) {
        $query = "SELECT * FROM course_modules WHERE course_id = :course_id ORDER BY order_index ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':course_id', $course_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get course content for a module
     */
    public function getModuleContent($module_id) {
        $query = "SELECT * FROM course_content WHERE module_id = :module_id ORDER BY order_index ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':module_id', $module_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Generate slug from title
     */
    public static function generateSlug($title) {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        return $slug;
    }
}

