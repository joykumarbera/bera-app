<?php

namespace app\controllers;

class FrontendController extends BaseController
{
    protected function renderView($file, $data = [])
    {
        $view_dir = APP_DIR . '/src/views/frontend';
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

        include APP_DIR . '/src/theme/frontend/header.php';

        ?>
     
        <main class="mb-4">
            <div class="container px-1 px-lg-1">
                <div class="row justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <?php include $file_to_render; ?>
                    </div>
                </div>
            </div>
        </main>

        <?php
        include APP_DIR . '/src/theme/frontend/footer.php';
        echo ob_get_clean();
    }
}