<?php

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('APP_DIR', __DIR__);
define('APP_BASE_URL', $_ENV['APP_URL']);
define('APP_UPLOAD_DIR', APP_DIR . '/public/uploads');
define('APP_NAME', 'Bera & Code');

session_name('bera_session');
session_start();

$app =  new \app\App();

function app() {
    global $app;

    return $app;
}

// load common helper
require_once APP_DIR . '/src/helpers/common-helper.php';

require_once APP_DIR . '/src/Routes.php'; 

app()->start();