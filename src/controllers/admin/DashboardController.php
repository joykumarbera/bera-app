<?php

namespace app\controllers\admin;

use app\controllers\BaseController;

class DashboardController extends BaseController
{
    public function index()
    {
        return $this->renderView('dashboard/index', []);
    }
}