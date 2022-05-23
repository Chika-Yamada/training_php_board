<?php

require_once('usersTable.php');

class postsTable
{
    /**
     * DBのデータ取得処理
     * 
     * @return mixed $dbinfo
     */
    public function post()
    {
        try {
            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $postdata = $connectdb->prepare("SELECT * FROM posts order by seq_no asc");
            $postdata->execute();
            $result = $postdata->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}