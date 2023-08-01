<?php

function setFlash($key, $message) {
    $falsh_key = '_flash' . $key;
    $_SESSION[$falsh_key] = $message; 
}

function hasFlash($key) {
    $falsh_key = '_flash' . $key;
    return isset($_SESSION[$falsh_key]);
}

function getFlash($key) {
    $falsh_key = '_flash' . $key;

    if(isset($_SESSION[$falsh_key])) {
        $message = $_SESSION[$falsh_key];
        unset($_SESSION[$falsh_key]);

        return $message;
    }
}

function showError($error) {
    ?>
    <small style="color:red;"><?= $error ?></small>
    <?php
}

/**
 * Redirect to a url
 * 
 * @param string $url
 */
function redirect($url) {
    $final_url = $_ENV['APP_URL'] . $url;
    header('Location: '.$final_url);
    die;
}

/**
 * Construct app url
 * 
 * @param string $url
 */
function url($url) {
    return $_ENV['APP_URL'] . $url;
}

function dd($data, $is_var_dump = false) {
    echo '<pre>';
    if($is_var_dump) {
        var_dump($data);
    } else {
        print_r($data);
    }
    echo '</pre>';
    die;
}

/**
 * Get page limit and offset by page no
 * 
 * @param int $page_no
 * @param int $limit
 * @return array
 */
function getLimitOffset($page_no, $limit = 10) {
    if($limit > 10) {
        $limit = 10;
    }

    if(is_null($page_no)) {
        $page_no = 1;
    }

    $offset = ($page_no - 1) * intval($limit);

    return [$limit, $offset];
}