<?php

namespace app\controllers;

class HomeController extends FrontendController
{
    public function index()
    {
        $meta = '<title>Home | '.APP_NAME.'</title>';
        $meta .= '<meta name="name" content="Home Page">';
        $meta .= '<meta name="robots" content="index, follow">';
        $meta .= '<meta property="og:type" content="website" />';
        $meta .= '<meta property="og:locale" content="en_US" />';
        $meta .= sprintf('<meta property="og:site_name" content="%s" />', APP_NAME);
        $meta .= sprintf('<link rel="canonical" href="%s" />', url('/'));

        app()->setHead($meta);

        return $this->renderView('home/index', []);
    }
}