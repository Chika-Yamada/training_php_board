<?php

require_once('DatabaseConnect.php');

class PostsTable
{
    /**
     * DBのデータ取得処理
     * 
     * @return mixed $db_info
     */
    public function getPostDataWithAscendingOrder()
    {
        try {
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $post_data = $connect_db->prepare("SELECT * FROM posts order by seq_no asc");
            $post_data->execute();
            $result = $post_data->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 今登録したデータ1件を取得する処理
     * 
     * @return mixed $db_info
     */
    public function getPostWhereMaxSeqNo()
    {
        try {
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $post_data = $connect_db->prepare("SELECT * FROM posts WHERE seq_no = (SELECT MAX(seq_no) FROM posts)");
            $post_data->execute();
            $result = $post_data->fetchAll();
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
        $_POST['post_title'];
        $_POST['post_detail'];

        try {
            $date = new DateTime();
            $now = $date->format('Y-m-d');

            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $stmt = $connect_db->prepare("INSERT INTO posts (user_id, post_date, post_title, post_contents) VALUES (:userId, :post_date, :post_title, :post_detail)");
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
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $delete_data = $connect_db->prepare("DELETE FROM posts WHERE seq_no=:seq_no;");
            $delete_data->bindvalue(':seq_no', $_POST['seq_no']);
            $delete_data->execute();
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
            
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $edit_data = $connect_db->prepare("UPDATE posts SET post_title=:edit_title, post_contents=:edit_detail, post_date=:post_date WHERE seq_no=:seq_no;");
            $edit_data->bindvalue(':seq_no', $_POST['seq_no']);
            $edit_data->bindvalue(':post_date', $now);
            $edit_data->bindvalue(':edit_title', $_POST['edit_title']);
            $edit_data->bindvalue(':edit_detail', $_POST['edit_detail']);
            $edit_data->execute();
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
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $multi_delete_data = $connect_db->prepare("DELETE FROM posts WHERE seq_no=:seq_no;");
            $params = $_POST['seq_numbers'];
            // 削除するレコードを1件ずつループ処理
            foreach ($params as $value) {
            // 配列の値を :seq_no にセットし、executeでSQLを実行
            $multi_delete_data->execute(array(':seq_no' => $value));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 投稿日を基準に昇順でDBのデータを取得
     * 
     * @return mixed $db_info
     */
    public function getPostDataWithAscendingOrderByDate()
    {
        try {
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $post_data = $connect_db->prepare("SELECT * FROM posts order by post_date asc");
            $post_data->execute();
            $result = $post_data->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 投稿日を基準に降順でDBのデータを取得
     * 
     * @return mixed $db_info
     */
    public function getPostDataWithDescendingOrderByDate()
    {
        try {
            $db_info = new DatabaseConnect();
            $connect_db = $db_info->connectDatabase();
            $post_data = $connect_db->prepare("SELECT * FROM posts order by post_date desc");
            $post_data->execute();
            $result = $post_data->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}