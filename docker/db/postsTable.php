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

    /**
     * 今登録したデータ1件を取得する処理
     * 
     * @return mixed $dbinfo
     */
    public function newPost()
    {
        try {
            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $postdata = $connectdb->prepare("SELECT * FROM posts WHERE seq_no = (SELECT MAX(seq_no) FROM posts)");
            $postdata->execute();
            $result = $postdata->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }


    /**
     * 内容を登録するメソッド
     * 
     * @return mixed 
     */
    public function createPost()
    {
        session_start();
        $_POST['post_title'];
        $_POST['post_detail'];

        try {
            $date = new DateTime();
            $now = $date->format('Y-m-d');

            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $stmt = $connectdb->prepare("INSERT INTO posts (user_id, post_date, post_title, post_contents) VALUES (:userId, :post_date, :post_title, :post_detail)");
            $stmt->bindvalue(':userId', $_SESSION['userId']);
            $stmt->bindvalue(':post_date', $now);
            $stmt->bindvalue(':post_title', $_POST['post_title']);
            $stmt->bindvalue(':post_detail', $_POST['post_detail']);
            $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}