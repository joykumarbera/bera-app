<?php

namespace app\middlewares;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class TransfromToJsonMiddleware
{
    public function handle(Request $request, Response $response)
    {
        if ($request->getContentType() != 'json' || !$request->getContent()) {
            http_response_code(400);
            header('Content-Type:application/json');

            echo json_encode([
                'status' => false,
                'message' => "request body must be in json format"
            ]);

            return false;
        }

        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            header('Content-Type:application/json');

            echo json_encode([
                'status' => false,
                'message' => 'invalid json body: ' . json_last_error_msg()
            ]);

            return false;
        }

        $request->attributes->replace(is_array($data) ? $data : array());

        return true;
    }
}