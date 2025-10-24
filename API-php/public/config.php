<?php 
/*
Ce fichier contient les paramètres de configuration du projet

───────────────────────────────────────────────────────────────────────────────────────────────
─██████████████─██████████████─██████──────────██████─██████████████─██████████─██████████████─
─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░██████████──██░░██─██░░░░░░░░░░██─██░░░░░░██─██░░░░░░░░░░██─
─██░░██████████─██░░██████░░██─██░░░░░░░░░░██──██░░██─██░░██████████─████░░████─██░░██████████─
─██░░██─────────██░░██──██░░██─██░░██████░░██──██░░██─██░░██───────────██░░██───██░░██─────────
─██░░██─────────██░░██──██░░██─██░░██──██░░██──██░░██─██░░██████████───██░░██───██░░██─────────
─██░░██─────────██░░██──██░░██─██░░██──██░░██──██░░██─██░░░░░░░░░░██───██░░██───██░░██──██████─
─██░░██─────────██░░██──██░░██─██░░██──██░░██──██░░██─██░░██████████───██░░██───██░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██──██░░██████░░██─██░░██───────────██░░██───██░░██──██░░██─
─██░░██████████─██░░██████░░██─██░░██──██░░░░░░░░░░██─██░░██─────────████░░████─██░░██████░░██─
─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░██──██████████░░██─██░░██─────────██░░░░░░██─██░░░░░░░░░░██─
─██████████████─██████████████─██████──────────██████─██████─────────██████████─██████████████─
───────────────────────────────────────────────────────────────────────────────────────────────
*/
$PROD = 0; // 0 = projet en développement, 1 = projet en production

$PROJECT_ID = 0; // Identifiant du projet
define('PROJECT_NAME', basename(realpath(dirname(__DIR__).'/../'))); // Nom du projet = Nom du répertoire sur le serveur de source
define('PROJECT_TITLE', 'CPNTE'); // Titre du projet 
define('PROJECT_VERSION', '1.0.0'); // Version du projet

if ($PROD == 1) {
    define('dbServer', 'localhost'); // l'IP du serveur de base de données (le plus souvent "localhost")
    define('dbUser', ''); // le nom d'utilisateur de la base de données
    define('dbPassword', ''); // le mot de passe de la base de données
    define('dbName', ''); // le nom de la base de données ou ce trouve les tables associé au projet
} else if ($PROD == 0) {
    define('dbServer', 'localhost'); 
    define('dbUser', ''); 
    define('dbPassword', '');
    define('dbName', ''); 
} else {
    echo "Erreur : La variable \$PROD doit être égale à 0 ou 1";
    exit;
}