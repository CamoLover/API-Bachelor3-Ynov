<?php

namespace App\Controllers;

use App\Database\Database;
use App\Services\ResponseService;

class HobbyController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            $name = isset($input['name']) ? trim($input['name']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';
            $level = isset($input['level']) ? trim($input['level']) : '';
            $since = isset($input['since']) ? trim($input['since']) : '';

            if (empty($name) || empty($description)) {
                return ResponseService::error('Les champs name et description sont obligatoires', 400);
            }

            $sql = "INSERT INTO hobbies (name, description, level, since) VALUES (:name, :description, :level, :since)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':level', $level);
            $stmt->bindParam(':since', $since);
            $stmt->execute();

            $id = $this->db->lastInsertId();
            
            $sql = "SELECT * FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $newHobby = $stmt->fetch();

            return ResponseService::success($newHobby, 'Hobby créé avec succès', 201);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la création du hobby: ' . $e->getMessage(), 500);
        }
    }
}

