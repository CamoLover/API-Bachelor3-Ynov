<?php

namespace App\Services;

class ResponseService
{
    public static function success($data = null, $message = 'Succès', $code = 200)
    {
        if (!headers_sent()) {
            http_response_code($code);
            header('Content-Type: application/json; charset=utf-8');
        }
        
        if ($code === 204) {
            exit;
        }
        
        $response = [
            'status' => 'succès',
            'code' => $code,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        if ($data !== null) {
            // Clean up UTF-8 encoding issues
            $response['data'] = self::cleanEncoding($data);
        }

        $json = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if ($json === false) {
            // Try with invalid UTF-8 replaced
            $response = self::cleanEncoding($response);
            $json = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        
        echo $json;
        exit;
    }

    public static function error($message = 'Erreur', $code = 500, $details = null)
    {
        if (!headers_sent()) {
            http_response_code($code);
            header('Content-Type: application/json; charset=utf-8');
        }
        
        $response = [
            'status' => 'erreur',
            'code' => $code,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        if ($details !== null) {
            $response['details'] = $details;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
    
    private static function cleanEncoding($data)
    {
        if (is_array($data)) {
            return array_map([self::class, 'cleanEncoding'], $data);
        } elseif (is_string($data)) {
            // Remove or replace invalid UTF-8 characters
            return mb_convert_encoding($data, 'UTF-8', 'UTF-8');
        }
        return $data;
    }
}