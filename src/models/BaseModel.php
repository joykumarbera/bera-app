<?php

namespace app\models;

class BaseModel
{
    public $db;
    
    public function __construct()
    {
        $this->db = app()->db();
    }
}