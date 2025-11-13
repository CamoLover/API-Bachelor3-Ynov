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

    public function index()
    {
        try {
            $page = max(1, (int)(isset($_GET['page']) ? $_GET['page'] : 1));
            $limit = 10;
            $offset = ($page - 1) * $limit;

            $countSql = "SELECT COUNT(*) as total FROM hobbies";
            $totalStmt = $this->db->prepare($countSql);
            $totalStmt->execute();
            $total = $totalStmt->fetch()['total'];

            $sql = "SELECT * FROM hobbies ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, \PDO::PARAM_INT);
            $stmt->execute();
            $hobbies = $stmt->fetchAll();

            $totalPages = ceil($total / $limit);

            $data = [
                'hobbies' => $hobbies,
                'pagination' => [
                    'page_actuelle' => $page,
                    'total_pages' => $totalPages,
                    'total_hobbies' => $total,
                    'limite_par_page' => $limit
                ]
            ];

            if ($page < $totalPages) {
                $data['pagination']['page_suivante'] = $page + 1;
            }
            if ($page > 1) {
                $data['pagination']['page_precedente'] = $page - 1;
            }

            return ResponseService::success($data, 'Hobbies récupérés avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des hobbies: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $sql = "SELECT * FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $hobby = $stmt->fetch();

            if (!$hobby) {
                return ResponseService::error('Hobby non trouvé', 404);
            }

            return ResponseService::success($hobby, 'Hobby récupéré avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération du hobby: ' . $e->getMessage(), 500);
        }
    }

    public function create()
    {
        try {
            $name = trim(\input('name', ''));
            $description = trim(\input('description', ''));
            $level = trim(\input('level', ''));
            $since = trim(\input('since', ''));

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

    public function update($id)
    {
        try {
            $sql = "SELECT * FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $hobby = $stmt->fetch();

            if (!$hobby) {
                return ResponseService::error('Hobby non trouvé', 404);
            }

            $name = \input('name') ? trim(\input('name')) : $hobby['name'];
            $description = \input('description') ? trim(\input('description')) : $hobby['description'];
            $level = \input('level') ? trim(\input('level')) : $hobby['level'];
            $since = \input('since') ? trim(\input('since')) : $hobby['since'];

            if (empty($name) || empty($description)) {
                return ResponseService::error('Les champs name et description sont obligatoires', 400);
            }

            $sql = "UPDATE hobbies SET name = :name, description = :description, level = :level, since = :since, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':level', $level);
            $stmt->bindParam(':since', $since);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            $sql = "SELECT * FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $updatedHobby = $stmt->fetch();

            return ResponseService::success($updatedHobby, 'Hobby mis à jour avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la mise à jour du hobby: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id)
    {
        try {
            $sql = "SELECT * FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $hobby = $stmt->fetch();

            if (!$hobby) {
                return ResponseService::error('Hobby non trouvé', 404);
            }

            $sql = "DELETE FROM hobbies WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            return ResponseService::success(null, 'Hobby supprimé avec succès', 204);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression du hobby: ' . $e->getMessage(), 500);
        }
    }
}

