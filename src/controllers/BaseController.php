<?php

namespace app\controllers;

abstract class BaseController
{
    /**
     * @var $is_theme_required bool
     */
    public $is_theme_required;

    public function __construct()
    {
        $this->is_theme_required = true;
        $this->init();
    }

    public function init()
    {

    }

    protected function renderView($file, $data = [])
    {
        $view_dir = APP_DIR . '/src/views/admin';
        $file_to_render = $view_dir . DIRECTORY_SEPARATOR . $file . '.php';

        if( !file_exists($file_to_render) ) {
            throw new \Exception(
                sprintf('View file %s does not exist', $file)
            );
        }
        
        $data = array_merge( ['errors' => []], $data);

        ob_start();

        extract($data);
        if($this->is_theme_required === false) {
            include $file_to_render;
            echo ob_get_clean();
            return;
        }

        include APP_DIR . '/src/theme/admin/header.php';
        ?>

        <div class="container-fluid">
            <div class="row">

                <?php include APP_DIR . '/src/theme/admin/sidebar.php' ?>

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    
                    <?php if(hasFlash('success')) : ?>
                        <div class="alert alert-success mt-1" role="alert">
                            <?= getFlash('success') ?>
                        </div>
                    <?php endif ?>

                    <?php if(hasFlash('error')) : ?>
                        <div class="alert alert-danger mt-1" role="alert">
                            <?= getFlash('error') ?>
                        </div>
                    <?php endif ?>

                    <?php include $file_to_render; ?>

                </main>
            </div>
        </div>

        <?php
        include APP_DIR . '/src/theme/admin/footer.php';
        echo ob_get_clean();
    }
}