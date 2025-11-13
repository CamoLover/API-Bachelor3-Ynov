<?php

namespace App\Controllers;

use App\Database\Database;
use App\Services\ResponseService;
use PDO;

class NameController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Récupère un prénom aléatoire
     */
    public function random()
    {
        try {
            $stmt = $this->db->query('SELECT * FROM names ORDER BY RANDOM() LIMIT 1');
            $name = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$name) {
                return ResponseService::error('Aucun prénom disponible', 404);
            }

            return ResponseService::success(
                ['name' => $name],
                'Prénom généré avec succès',
                200
            );
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération d\'un prénom aléatoire: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupère la liste des prénoms
     */
    public function list()
    {
        try {
            $stmt = $this->db->query('SELECT * FROM names ORDER BY name');
            $names = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ResponseService::success(
                [
                    'names' => $names,
                    'total' => count($names)
                ],
                'Liste des prénoms récupérée avec succès',
                200
            );
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des prénoms: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Crée un nouveau prénom
     */
    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }

            $name = trim($input['name'] ?? '');

            if (empty($name)) {
                return ResponseService::error('Le nom est obligatoire', 400);
            }

            $stmt = $this->db->prepare('INSERT INTO names (name) VALUES (:name)');
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->execute();

            $id = $this->db->lastInsertId();
            $newName = $this->findById($id);

            return ResponseService::success(
                ['name' => $newName],
                'Prénom ajouté avec succès',
                201
            );
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) { // SQLite duplicate key
                return ResponseService::error('Ce prénom existe déjà', 409);
            }
            return ResponseService::error('Erreur lors de l\'ajout du prénom: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Met à jour un prénom existant
     */
    public function update($id)
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }

            $name = trim($input['name'] ?? '');

            if (empty($name)) {
                return ResponseService::error('Le nom est obligatoire', 400);
            }

            // Vérifie si le nom existe déjà
            $stmt = $this->db->prepare('SELECT id FROM names WHERE name = :name AND id != :id');
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->fetch()) {
                return ResponseService::error('Ce prénom existe déjà', 409);
            }

            $stmt = $this->db->prepare('UPDATE names SET name = :name, updated_at = CURRENT_TIMESTAMP WHERE id = :id');
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                return ResponseService::error('Prénom non trouvé', 404);
            }

            $updatedName = $this->findById($id);
            return ResponseService::success(
                ['name' => $updatedName],
                'Prénom mis à jour avec succès',
                200
            );
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la mise à jour du prénom: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Supprime un prénom
     */
    public function delete($id)
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM names WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                return ResponseService::error('Prénom non trouvé', 404);
            }

            return ResponseService::success(
                null,
                'Prénom supprimé avec succès',
                200
            );
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression du prénom: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupère un prénom par son ID
     */
    private function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM names WHERE id = :id');
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::PARAM_STR);
    }
}
