<?php

require_once './vendor/autoload.php'; // Load Composer dependencies
require_once './public/function.php';
use Pecee\SimpleRouter\SimpleRouter as Router;

// Include the routes file
require_once './routes.php';

// Start the router
Router::start();
