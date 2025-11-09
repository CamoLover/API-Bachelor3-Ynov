<?php

namespace App\Controllers;

use App\Database\Database;
use App\Services\ResponseService;
use Pecee\Http\Request;

class SachaController
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

            $countSql = "SELECT COUNT(*) as total FROM sacha_posts";
            $totalStmt = $this->db->prepare($countSql);
            $totalStmt->execute();
            $total = $totalStmt->fetch()['total'];

            $sql = "SELECT * FROM sacha_posts ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, \PDO::PARAM_INT);
            $stmt->execute();
            $posts = $stmt->fetchAll();

            $totalPages = ceil($total / $limit);

            $data = [
                'posts' => $posts,
                'pagination' => [
                    'page_actuelle' => $page,
                    'total_pages' => $totalPages,
                    'total_posts' => $total,
                    'limite_par_page' => $limit
                ]
            ];

            if ($page < $totalPages) {
                $data['pagination']['page_suivante'] = $page + 1;
            }
            if ($page > 1) {
                $data['pagination']['page_precedente'] = $page - 1;
            }

            return ResponseService::success($data, 'Posts récupérés avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des posts: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $post = $stmt->fetch();

            if (!$post) {
                return ResponseService::error('Post non trouvé', 404);
            }

            return ResponseService::success($post, 'Post récupéré avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération du post: ' . $e->getMessage(), 500);
        }
    }

    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            $author = isset($input['author']) ? $input['author'] : '';
            $text = isset($input['text']) ? $input['text'] : '';

            if (empty($author) || empty($text)) {
                return ResponseService::error('Les champs author et text sont obligatoires', 400);
            }

            $sql = "INSERT INTO sacha_posts (author, text) VALUES (:author, :text)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':text', $text);
            $stmt->execute();

            $id = $this->db->lastInsertId();
            
            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $newPost = $stmt->fetch();

            return ResponseService::success($newPost, 'Post créé avec succès', 201);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la création du post: ' . $e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        try {
            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $post = $stmt->fetch();

            if (!$post) {
                return ResponseService::error('Post non trouvé', 404);
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            $author = isset($input['author']) ? $input['author'] : $post['author'];
            $text = isset($input['text']) ? $input['text'] : $post['text'];

            if (empty($author) || empty($text)) {
                return ResponseService::error('Les champs author et text sont obligatoires', 400);
            }

            $sql = "UPDATE sacha_posts SET author = :author, text = :text, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':text', $text);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $updatedPost = $stmt->fetch();

            return ResponseService::success($updatedPost, 'Post mis à jour avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la mise à jour du post: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id)
    {
        try {
            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $post = $stmt->fetch();

            if (!$post) {
                return ResponseService::error('Post non trouvé', 404);
            }

            $sql = "DELETE FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();

            return ResponseService::success(null, 'Post supprimé avec succès', 204);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression du post: ' . $e->getMessage(), 500);
        }
    }
}