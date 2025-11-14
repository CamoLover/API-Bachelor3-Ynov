<?php

namespace App\Controllers;

use App\Database\Database;
use App\Services\ResponseService;
use Pecee\Http\Request;

class SkillsController
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

            $countSql = "SELECT COUNT(*) as total FROM skills";
            $totalStmt = $this->db->prepare($countSql);
            $totalStmt->execute();
            $total = $totalStmt->fetch()['total'];

            $sql = "SELECT * FROM skills ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, \PDO::PARAM_INT);
            $stmt->execute();
            $skills = $stmt->fetchAll();

            $totalPages = ceil($total / $limit);

            $data = [
                'skills' => $skills,
                'pagination' => [
                    'page_actuelle' => $page,
                    'total_pages' => $totalPages,
                    'total_skills' => $total,
                    'limite_par_page' => $limit
                ]
            ];

            if ($page < $totalPages) {
                $data['pagination']['page_suivante'] = $page + 1;
            }
            if ($page > 1) {
                $data['pagination']['page_precedente'] = $page - 1;
            }

            return ResponseService::success($data, 'Skills récupérés avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des skills: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $sql = "SELECT * FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $skill = $stmt->fetch();

            if (!$skill) {
                return ResponseService::error('Skill non trouvé', 404);
            }

            return ResponseService::success($skill, 'Skill récupéré avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération du skill: ' . $e->getMessage(), 500);
        }
    }

    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            $name = isset($input['name']) ? $input['name'] : '';
            $level = isset($input['level']) ? $input['level'] : '';
            $category = isset($input['category']) ? $input['category'] : '';

            if (empty($name) || empty($level) || empty($category)) {
                return ResponseService::error('Les champs name, level et category sont obligatoires', 400);
            }

            // Validation du level
            $validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            if (!in_array($level, $validLevels)) {
                return ResponseService::error('Le niveau doit être: Beginner, Intermediate, Advanced ou Expert', 400);
            }

            // Validation de la catégorie
            $validCategories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Mobile', 'Autre'];
            if (!in_array($category, $validCategories)) {
                return ResponseService::error('La catégorie doit être: Backend, Frontend, Database, DevOps, Mobile ou Autre', 400);
            }

            $sql = "INSERT INTO skills (name, level, category) VALUES (:name, :level, :category)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':level', $level);
            $stmt->bindParam(':category', $category);
            $stmt->execute();

            $id = $this->db->lastInsertId();
            
            $sql = "SELECT * FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $newSkill = $stmt->fetch();

            return ResponseService::success($newSkill, 'Skill créé avec succès', 201);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la création du skill: ' . $e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        try {
            $sql = "SELECT * FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $skill = $stmt->fetch();

            if (!$skill) {
                return ResponseService::error('Skill non trouvé', 404);
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            $name = isset($input['name']) ? $input['name'] : $skill['name'];
            $level = isset($input['level']) ? $input['level'] : $skill['level'];
            $category = isset($input['category']) ? $input['category'] : $skill['category'];

            if (empty($name) || empty($level) || empty($category)) {
                return ResponseService::error('Les champs name, level et category sont obligatoires', 400);
            }

            // Validation du level si fourni
            if (isset($input['level'])) {
                $validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                if (!in_array($level, $validLevels)) {
                    return ResponseService::error('Le niveau doit être: Beginner, Intermediate, Advanced ou Expert', 400);
                }
            }

            // Validation de la catégorie si fournie
            if (isset($input['category'])) {
                $validCategories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Mobile', 'Autre'];
                if (!in_array($category, $validCategories)) {
                    return ResponseService::error('La catégorie doit être: Backend, Frontend, Database, DevOps, Mobile ou Autre', 400);
                }
            }

            $sql = "UPDATE skills SET name = :name, level = :level, category = :category, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':level', $level);
            $stmt->bindParam(':category', $category);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            $sql = "SELECT * FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $updatedSkill = $stmt->fetch();

            return ResponseService::success($updatedSkill, 'Skill mis à jour avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la mise à jour du skill: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id)
    {
        try {
            $sql = "SELECT * FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $skill = $stmt->fetch();

            if (!$skill) {
                return ResponseService::error('Skill non trouvé', 404);
            }

            $sql = "DELETE FROM skills WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            return ResponseService::success(['id' => $id], 'Skill supprimé avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression du skill: ' . $e->getMessage(), 500);
        }
    }
}

