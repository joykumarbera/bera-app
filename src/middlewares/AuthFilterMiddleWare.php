<?php

namespace app\middlewares;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use app\models\User;

class AuthFilterMiddleWare
{
    public function handle(Request $request, Response $response)
    {
        if( !isset($_SESSION['is_logged_in']) ) {
            redirect('/auth/login');
        }

        if( isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] !== 1 ) {
            redirect('/auth/login');
        }

        $userModel = new User();
        $user = $userModel->getUserById($_SESSION['user_info']['user_id']);
        app()->setUser($user);
        
        return true;
    }
}