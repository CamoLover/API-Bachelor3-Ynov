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

            return ResponseService::success(['id' => $id], 'Post supprimé avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression du post: ' . $e->getMessage(), 500);
        }
    }

    public function latest()
    {
        try {
            $sql = "SELECT * FROM sacha_posts ORDER BY created_at DESC LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $latestPost = $stmt->fetch();

            if (!$latestPost) {
                return ResponseService::error('Aucun post disponible pour le moment', 404);
            }

            return ResponseService::success($latestPost, 'Dernier post récupéré avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération du dernier post: ' . $e->getMessage(), 500);
        }
    }

    public function statistics()
    {
        try {
            $sql = "SELECT COUNT(*) AS total_posts, COUNT(DISTINCT author) AS total_auteurs, MIN(created_at) AS premier_post, MAX(created_at) AS dernier_post FROM sacha_posts";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $stats = $stmt->fetch();

            if (!$stats || $stats['total_posts'] === 0) {
                return ResponseService::error('Aucune statistique disponible pour le moment', 404);
            }

            return ResponseService::success([
                'total_posts' => (int) $stats['total_posts'],
                'total_auteurs_uniques' => (int) $stats['total_auteurs'],
                'premier_post_le' => $stats['premier_post'],
                'dernier_post_le' => $stats['dernier_post']
            ], 'Statistiques récupérées avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }

    public function random()
    {
        try {
            $sql = "SELECT * FROM sacha_posts ORDER BY RANDOM() LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $post = $stmt->fetch();

            if (!$post) {
                return ResponseService::error('Aucun post disponible pour le moment', 404);
            }

            return ResponseService::success($post, 'Post aléatoire récupéré avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération d\'un post aléatoire: ' . $e->getMessage(), 500);
        }
    }

    public function byAuthor($author)
    {
        try {
            $decodedAuthor = urldecode($author);

            $sqlCount = "SELECT COUNT(*) as total FROM sacha_posts WHERE author = :author";
            $countStmt = $this->db->prepare($sqlCount);
            $countStmt->bindParam(':author', $decodedAuthor, \PDO::PARAM_STR);
            $countStmt->execute();
            $total = (int) $countStmt->fetch()['total'];

            if ($total === 0) {
                return ResponseService::error('Aucun post trouvé pour cet auteur', 404);
            }

            $sql = "SELECT * FROM sacha_posts WHERE author = :author ORDER BY created_at DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $decodedAuthor, \PDO::PARAM_STR);
            $stmt->execute();
            $posts = $stmt->fetchAll();

            return ResponseService::success([
                'auteur' => $decodedAuthor,
                'total_posts' => $total,
                'posts' => $posts
            ], 'Posts de l\'auteur récupérés avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la récupération des posts de l\'auteur: ' . $e->getMessage(), 500);
        }
    }

    public function createForAuthor($author)
    {
        try {
            $decodedAuthor = urldecode($author);
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }

            $text = isset($input['text']) ? trim($input['text']) : '';

            if (empty($decodedAuthor) || empty($text)) {
                return ResponseService::error('Les champs author (dans l\'URL) et text sont obligatoires', 400);
            }

            $sql = "INSERT INTO sacha_posts (author, text) VALUES (:author, :text)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $decodedAuthor);
            $stmt->bindParam(':text', $text);
            $stmt->execute();

            $id = $this->db->lastInsertId();

            $sql = "SELECT * FROM sacha_posts WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $newPost = $stmt->fetch();

            return ResponseService::success($newPost, 'Post ajouté pour l\'auteur', 201);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de l\'ajout d\'un post: ' . $e->getMessage(), 500);
        }
    }

    public function updateAuthor($author)
    {
        try {
            $decodedAuthor = urldecode($author);

            $sql = "SELECT COUNT(*) as total FROM sacha_posts WHERE author = :author";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $decodedAuthor, \PDO::PARAM_STR);
            $stmt->execute();
            $total = (int) $stmt->fetch()['total'];

            if ($total === 0) {
                return ResponseService::error('Aucun post trouvé pour cet auteur', 404);
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                parse_str(file_get_contents('php://input'), $input);
            }
            $newAuthor = isset($input['new_author']) ? trim($input['new_author']) : '';

            if (empty($newAuthor)) {
                return ResponseService::error('Le champ new_author est obligatoire', 400);
            }

            $sql = "UPDATE sacha_posts SET author = :new_author, updated_at = CURRENT_TIMESTAMP WHERE author = :author";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':new_author', $newAuthor);
            $stmt->bindParam(':author', $decodedAuthor);
            $stmt->execute();

            $sql = "SELECT * FROM sacha_posts WHERE author = :author ORDER BY created_at DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $newAuthor);
            $stmt->execute();
            $posts = $stmt->fetchAll();

            return ResponseService::success([
                'ancien_auteur' => $decodedAuthor,
                'nouvel_auteur' => $newAuthor,
                'total_posts' => count($posts),
                'posts' => $posts
            ], 'Auteur mis à jour avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la mise à jour de l\'auteur: ' . $e->getMessage(), 500);
        }
    }

    public function deleteByAuthor($author)
    {
        try {
            $decodedAuthor = urldecode($author);

            $sql = "SELECT COUNT(*) as total FROM sacha_posts WHERE author = :author";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $decodedAuthor, \PDO::PARAM_STR);
            $stmt->execute();
            $total = (int) $stmt->fetch()['total'];

            if ($total === 0) {
                return ResponseService::error('Aucun post trouvé pour cet auteur', 404);
            }

            $sql = "DELETE FROM sacha_posts WHERE author = :author";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':author', $decodedAuthor, \PDO::PARAM_STR);
            $stmt->execute();

            return ResponseService::success([
                'auteur_supprime' => $decodedAuthor,
                'total_posts_supprimes' => $total
            ], 'Posts de l\'auteur supprimés avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la suppression des posts de l\'auteur: ' . $e->getMessage(), 500);
        }
    }
}