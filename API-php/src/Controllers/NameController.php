<?php

namespace App\Controllers;

use App\Services\ResponseService;

class NameController
{
    /**
     * Liste simple de prénoms utilisés pour la démo.
     *
     * @var string[]
     */
    private array $names = [
        'Sacha',
        'Marine',
        'Alexis',
        'Nina',
        'Lucas',
        'Fatou',
        'Ibrahim',
        'Chloé',
        'Noah',
        'Lina'
    ];

    /**
     * Retourne un prénom aléatoire parmi la liste.
     */
    public function random()
    {
        if (empty($this->names)) {
            return ResponseService::error('Aucun prénom disponible', 404);
        }

        $name = $this->names[array_rand($this->names)];

        return ResponseService::success([
            'name' => $name
        ], 'Prénom généré avec succès', 200);
    }

    /**
     * Retourne la liste complète des prénoms disponibles.
     */
    public function list()
    {
        if (empty($this->names)) {
            return ResponseService::error('Aucun prénom à afficher', 404);
        }

        return ResponseService::success([
            'names' => $this->names,
            'total' => count($this->names)
        ], 'Liste des prénoms récupérée avec succès', 200);
    }
}

