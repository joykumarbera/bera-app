<?php

namespace app\controllers\api;


class UserController
{
    public function index()
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Jhon Doe',
                'email' => 'jhon@gmail.com'
            ],
            [
                'id' => 2,
                'name' => 'Lina Paul',
                'email' => 'lina@gmail.com'
            ],
        ];
        echo json_encode($users);
    }
}
