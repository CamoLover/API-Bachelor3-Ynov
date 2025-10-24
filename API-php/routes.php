<?php
use Pecee\SimpleRouter\SimpleRouter as Router;

// Maintenance mode flag - 0 for normal operation, 1 for maintenance mode
define('MAINTENANCE_MODE', 1);

function maintenanceCheck() {
    if (MAINTENANCE_MODE === 1) {
        header('Location: /maintenance');
        exit;
    }
}

// Maintenance route
Router::get('/maintenance', function() {
    return 'The site is currently under maintenance. Please check back later.';
});

// Home route
Router::get('/', function() {
    maintenanceCheck();
    require './views/home.php';
});