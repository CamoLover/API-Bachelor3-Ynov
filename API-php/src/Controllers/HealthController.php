<?php

namespace App\Controllers;

use App\Database\Database;
use App\Services\ResponseService;

class HealthController
{
    public function health()
    {
        try {
            $startTime = microtime(true);
            
            $db = Database::getInstance();
            $dbStatus = $db->testConnection();
            
            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000, 2);

            $memoryUsage = round(memory_get_usage(true) / 1024 / 1024, 2);
            $memoryPeak = round(memory_get_peak_usage(true) / 1024 / 1024, 2);

            $data = [
                'serveur_api' => [
                    'status' => 'en ligne',
                    'temps_reponse' => $responseTime . 'ms',
                    'memoire_utilisee' => $memoryUsage . 'MB',
                    'pic_memoire' => $memoryPeak . 'MB',
                    'version_php' => phpversion()
                ],
                'base_de_donnees' => $dbStatus,
                'systeme' => [
                    'timestamp' => date('Y-m-d H:i:s'),
                    'timezone' => date_default_timezone_get(),
                    'uptime' => $this->getUptime()
                ]
            ];

            return ResponseService::success($data, 'Vérification de santé terminée avec succès', 200);
        } catch (\Exception $e) {
            return ResponseService::error('Erreur lors de la vérification de santé: ' . $e->getMessage(), 500);
        }
    }

    private function getUptime()
    {
        if (function_exists('sys_getloadavg') && file_exists('/proc/uptime')) {
            $uptime = file_get_contents('/proc/uptime');
            $uptime = explode(' ', $uptime)[0];
            $days = floor($uptime / 86400);
            $hours = floor(($uptime % 86400) / 3600);
            $minutes = floor(($uptime % 3600) / 60);
            return "{$days}j {$hours}h {$minutes}m";
        }
        return 'Non disponible';
    }
}