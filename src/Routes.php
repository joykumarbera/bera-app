<?php

namespace app;

$router = app()->getRouter();

// frontend routes
$router->get('/', 'HomeController@index');

// auth routes
$router->get('/auth/login', 'AuthController@login');
$router->post('/auth/login', 'AuthController@handleLogin');
$router->get('/auth/logout', 'AuthController@logout', ['before' => ['AuthFilterMiddleWare']]);

// admin routes
$router->group('/admin', [
    'namespace' => '\\app\\controllers\\admin\\',
    'middlewares' => [
        'before' => [
            'AuthFilterMiddleWare'
        ]
    ]
],function($router) {
    $router->get('/dashboard', 'DashboardController@index');
});

// api routes
$router->group('/api', [
    'namespace' => '\\app\\controllers\\api\\',
],function($router) {
    $router->get('/users', 'UserController@index');
});
