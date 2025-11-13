<?php

namespace App\Database;

use PDO;
use PDOException;

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        try {
            $this->connection = new PDO('sqlite:' . __DIR__ . '/../../data/database.sqlite');
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->initSchema();
        } catch (PDOException $e) {
            throw new \Exception("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->connection;
    }

    private function initSchema()
    {
        // Table sacha_posts
        $sql = "
            CREATE TABLE IF NOT EXISTS sacha_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author VARCHAR(255) NOT NULL,
                text TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ";
        
        $this->connection->exec($sql);

        // Table skills
        $sqlSkills = "
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                level VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ";
        
        $this->connection->exec($sqlSkills);
    }

    public function testConnection()
    {
        try {
            $start = microtime(true);
            $this->connection->query('SELECT 1');
            $end = microtime(true);
            return [
                'status' => 'succès',
                'temps_reponse' => round(($end - $start) * 1000, 2) . 'ms'
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'erreur',
                'message' => $e->getMessage()
            ];
        }
    }
}