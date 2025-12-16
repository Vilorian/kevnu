<?php
require_once __DIR__ . '/../config/database.php';

class Commission {
    private $conn;
    private $table = 'commissions';

    public $id;
    public $name;
    public $email;
    public $phone;
    public $project_type;
    public $budget_range;
    public $description;
    public $timeline;
    public $features;
    public $status;
    public $quote_amount;
    public $notes;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new commission request
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (name, email, phone, project_type, budget_range, description, timeline, features, status) 
                  VALUES (:name, :email, :phone, :project_type, :budget_range, :description, :timeline, :features, :status)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':project_type', $this->project_type);
        $stmt->bindParam(':budget_range', $this->budget_range);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':timeline', $this->timeline);
        $stmt->bindParam(':features', $this->features);
        $stmt->bindParam(':status', $this->status);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    /**
     * Get all commissions (admin)
     */
    public function getAll($filters = []) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";

        if (isset($filters['status']) && !empty($filters['status'])) {
            $query .= " AND status = :status";
        }

        $query .= " ORDER BY created_at DESC";

        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
            if (isset($filters['offset'])) {
                $query .= " OFFSET :offset";
            }
        }

        $stmt = $this->conn->prepare($query);

        if (isset($filters['status']) && !empty($filters['status'])) {
            $stmt->bindParam(':status', $filters['status']);
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
     * Get commission by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->project_type = $row['project_type'];
            $this->budget_range = $row['budget_range'];
            $this->description = $row['description'];
            $this->timeline = $row['timeline'];
            $this->features = $row['features'];
            $this->status = $row['status'];
            $this->quote_amount = $row['quote_amount'];
            $this->notes = $row['notes'];
            $this->created_at = $row['created_at'];
            return $row;
        }
        return false;
    }

    /**
     * Update commission status
     */
    public function updateStatus($id, $status, $quote_amount = null, $notes = null) {
        $query = "UPDATE " . $this->table . " 
                  SET status = :status, updated_at = NOW()";

        if ($quote_amount !== null) {
            $query .= ", quote_amount = :quote_amount";
        }

        if ($notes !== null) {
            $query .= ", notes = :notes";
        }

        $query .= " WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);

        if ($quote_amount !== null) {
            $stmt->bindParam(':quote_amount', $quote_amount);
        }

        if ($notes !== null) {
            $stmt->bindParam(':notes', $notes);
        }

        return $stmt->execute();
    }
}

