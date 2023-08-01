<?php

namespace app\models;

use Cocur\Slugify\Slugify;

class User extends BaseModel
{
    public function getUserById($user_id)
    {
        // logic to find user from database by user id

        return [
            'id' => 1,
            'email' => 'user@gmai.com'
        ];
    }
}