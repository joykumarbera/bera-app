<?php

namespace app\controllers;

use app\models\Auth;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use app\ValidationTrait;

class AuthController extends BaseController
{
    use ValidationTrait;

    public function init()
    {
        $this->is_theme_required = false;
    }

    public function login()
    {
        return $this->renderView('auth/login');
    }

    public function handleLogin(Request $request, Response $response)
    {
        $rules = [
            'email' => [
                ['name' => 'required'],
                [
                    'name' => 'custom',
                    'checker' => function($email) {
                        if(filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                            return 'Please enter a valid email';
                        }

                        return true;
                    }
                ],
                [
                    'name' => 'custom',
                    'checker' => function($email) {
                        $db = app()->db();
                        $user = $db->findOne('bera_user', ['email' => $email]);
                        if(is_null($user)) {
                            return 'Email does not exist';
                        }

                        return true;
                    }
                ]
            ],
            'password' => [
                ['name' => 'required'],
                [
                    'name' => 'custom',
                    'checker' => function($password) {
                        $pass_len = strlen($password);
                        if($pass_len < 8) {
                            return 'Password must be grater than 8 char';
                        }

                        return true;
                    }
                ]
            ],
        ];

        $data = [
            'email' => $request->get('email'),
            'password' => $request->get('password')
        ];

        if(!$this->validate($data, $rules)) {
            return $this->renderView('auth/login', [
                'errors' => $this->getErrors()
            ]);
        }

        // procces login

        $model = new Auth();

        try {
            $model->initLogin($data['email'], $data['password']);
            setFlash('success', 'Login successfull');
            redirect('/admin/dashboard');
        } catch( \Exception $e ) {
            print_r($e->getMessage());
            setFlash('error', $e->getMessage());
            redirect('/auth/login');
        }
    }

    public function logout()
    {
        session_destroy();
        redirect('/auth/login');
    }
}