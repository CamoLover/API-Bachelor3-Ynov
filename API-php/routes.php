<?php
use Pecee\SimpleRouter\SimpleRouter as Router;

// Manually require our classes since composer autoload isn't working
require_once __DIR__ . '/src/Services/ResponseService.php';
require_once __DIR__ . '/src/Database/Database.php';
require_once __DIR__ . '/src/Controllers/HealthController.php';
require_once __DIR__ . '/src/Controllers/SachaController.php';
require_once __DIR__ . '/src/Controllers/NameController.php';

use App\Controllers\HealthController;
use App\Controllers\SachaController;
use App\Controllers\NameController;

// Maintenance mode flag - 0 for normal operation, 1 for maintenance mode
define('MAINTENANCE_MODE', 0);

function maintenanceCheck() {
    if (MAINTENANCE_MODE === 1) {
        header('Location: /maintenance');
        exit;
    }
}

// En-têtes CORS et JSON pour toutes les requêtes API
function setCorsHeaders() {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Health endpoint
Router::get('/health', function() {
    setCorsHeaders();
    $controller = new HealthController();
    return $controller->health();
});

// Sacha appreciation posts endpoints
Router::get('/sacha', function() {
    setCorsHeaders();
    $controller = new SachaController();
    $controller->index();
});

// Names demo endpoints
Router::get('/names', function() {
    setCorsHeaders();
    $controller = new NameController();
    return $controller->list();
});

Router::get('/names/random', function() {
    setCorsHeaders();
    $controller = new NameController();
    return $controller->random();
});

Router::post('/sacha/create', function() {
    setCorsHeaders();
    $controller = new SachaController();
    return $controller->create();
});

Router::get('/sacha/{id}', function($id) {
    setCorsHeaders();
    $controller = new SachaController();
    return $controller->show($id);
});

Router::put('/sacha/update/{id}', function($id) {
    setCorsHeaders();
    $controller = new SachaController();
    return $controller->update($id);
});

Router::delete('/sacha/delete/{id}', function($id) {
    setCorsHeaders();
    $controller = new SachaController();
    return $controller->delete($id);
});

// Maintenance route
Router::get('/maintenance', function() {
    return 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.';
});

// Home route
Router::get('/', function() {
    maintenanceCheck();
    return 'Bienvenue sur l\'API Bachelor 3 !';
});