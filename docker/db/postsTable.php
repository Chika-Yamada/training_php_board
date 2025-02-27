<?php

require_once('usersTable.php');

class postsTable
{
    /**
     * DBのデータ取得処理
     * 
     * @return mixed $dbinfo
     */
    public function getPostDataWithAscendingOrder()
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
    public function getPostWhereMaxSeqNo()
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
    public function insertPostData()
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

    /**
     * 登録情報を削除するメソッド
     * 
     * @return mixed $result
     */
    public function deletePost()
    {
        $_POST['seq_no'];
        try {
            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $deletedata = $connectdb->prepare("DELETE FROM posts WHERE seq_no=:seq_no;");
            $deletedata->bindvalue(':seq_no', $_POST['seq_no']);
            $deletedata->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 登録情報を編集するメソッド
     * 
     * @return void
     */
    public function editPostDataBySeqNo()
    {
        $_POST['seq_no'];
        $_POST['edit_title'];
        $_POST['edit_detail'];
        try {
            $date = new DateTime();
            $now = $date->format('Y-m-d');
            
            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $editdata = $connectdb->prepare("UPDATE posts SET post_title=:edit_title, post_contents=:edit_detail, post_date=:post_date WHERE seq_no=:seq_no;");
            $editdata->bindvalue(':seq_no', $_POST['seq_no']);
            $editdata->bindvalue(':post_date', $now);
            $editdata->bindvalue(':edit_title', $_POST['edit_title']);
            $editdata->bindvalue(':edit_detail', $_POST['edit_detail']);
            $editdata->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 複数の登録情報を削除するメソッド
     * 
     * @return int $result
     */
    public function multiDeletePost()
    {
        $_POST['seq_numbers'];
        try {
            $dbinfo = new usersTable();
            $connectdb = $dbinfo->connectDatabase();
            $multideletedata = $connectdb->prepare("DELETE FROM posts WHERE seq_no=:seq_no;");
            $params = $_POST['seq_numbers'];
            // 削除するレコードを1件ずつループ処理
            foreach ($params as $value) {
            // 配列の値を :seq_no にセットし、executeでSQLを実行
            $multideletedata->execute(array(':seq_no' => $value));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}