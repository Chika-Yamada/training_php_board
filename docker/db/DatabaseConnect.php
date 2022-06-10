<?php

session_start();

class DatabaseConnect
{
/**
     * データベースの接続用メソッド
     * 
     * @return mixed $db_info
     */
    public function connectDatabase()
    {
        $db_name = "pgsql:dbname=board_database; host=db; port=5555;";
        $user = 'root';
        $db_password = 'password';
        $db_info = new PDO($db_name, $user, $db_password);
        return $db_info;
    }
}
?>