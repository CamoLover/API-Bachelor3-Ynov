<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/pecee/simple-router/helpers.php';
require_once __DIR__ . '/routes.php';

use Pecee\SimpleRouter\SimpleRouter;

SimpleRouter::start();

