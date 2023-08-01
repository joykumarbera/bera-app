<?php

namespace app;

use Bera\Db\Db;
use Bera\Db\Exceptions\DbErrorException;
use bera\router\Router;

class App
{
    protected $db;

    protected $router;

    public static $user;

    private $head;

    public function __construct()
    {
        $debugMode = ( isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] == 'dev' ) ? true : false;

        try {
            $this->db = new Db(
                $_ENV['DB_NAME'], 
                $_ENV['DB_HOST'], 
                $_ENV['DB_USER'],
                $_ENV['DB_PASSWORD']
                , null, $debugMode);
        } catch( DbErrorException $e  ) {
            echo $e->getMessage();
            die;
        }

        $this->router = new Router();
    }

    /**
     * Set template head tags
     * 
     * @param string $head
     */
    public function setHead($head)
    {
        $this->head = $head;
    }

    /**
     * Get head
     * 
     * @return string
     */
    public function getHead()
    {
        return $this->head;
    }

    /**
     * Acccess auth user
     * 
     * @param object|array $user
     */
    public static function setUser($user)
    {
        self::$user = $user;
    }

    public function db()
    {
        return $this->db;
    }

    public function getRouter()
    {
        return $this->router;
    }

    public function start()
    {
        $this->router->dispatch();
    }
}