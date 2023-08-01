<?php

namespace app\models;

class Auth extends BaseModel
{
    public function initLogin($email, $password)
    {
        // here is your login code logic

        $_SESSION['is_logged_in'] = 1;
        $_SESSION['user_info'] = [
            'user_id' => '1',
            'name' => 'Jhon',
            'email' => 'jhon@gmail.com'
        ];

        return true;
    }
}