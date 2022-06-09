<?php

class usersTable
{
    /**
     * データベースの接続用メソッド
     * 
     * @return mixed $dbinfo
     */
    public function connectDatabase()
    {
        $dbname = "pgsql:dbname=board_database; host=db; port=5555;";
        $user = 'root';
        $dbpassword = 'password';
        $dbinfo = new PDO($dbname, $user, $dbpassword);
        return $dbinfo;
    }


    /**
     * ユーザーの新規登録処理
     * 
     * @param string $userid　ユーザーID
     * @param string $password パスワード
     * 
     * @return void
     */
    public function userRegist($userid, $password)
    {
        try {
            $dbconnect = $this->connectDatabase();

            $sql = "SELECT * FROM users WHERE user_id=:userId;";
            $stmt = $dbconnect->prepare($sql);
            $stmt->bindValue(':userId', $userid);
            $stmt->execute();
            $users = $stmt->fetchAll();
            foreach ($users as $user) {
                if ($user['user_id']) {
                    $errors = '同じユーザーIDが存在します。';
                    return $errors;
                }
            }

            $passwordhash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users(user_id, password) VALUES (:userId, :password)";
            $stmt = $dbconnect->prepare($sql);
            $stmt->bindValue(':userId', $userid);
            $stmt->bindValue(':password', $passwordhash);
            $stmt->execute();

            header('Location:/');
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * ログイン処理
     * 
     * @param string $userid　ユーザーID
     * @param string $password パスワード
     *
     * @return mixed $logindata
     */
    public function userLogin($loginuserid)
    {
        try {
            $dbconnect = $this->connectDatabase();
            $sql = "SELECT * FROM users WHERE user_id=:userId";
            $loginconnect = $dbconnect->prepare($sql);
            $loginconnect->bindValue(':userId', $loginuserid);
            $loginconnect->execute();
            $logindata = $loginconnect->fetch();
            return $logindata;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * DBのユーザーデータ取得処理
     * 
     * @return mixed $dbinfo
     */
    public function getUsersDataWithAscendingOrder()
    {
        try {
            $connectdb = $this->connectDatabase();
            $postdata = $connectdb->prepare("SELECT * FROM users order by seq_no asc;");
            $postdata->execute();
            $result = $postdata->fetchAll();
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * ユーザー情報を削除するメソッド
     * 
     * @return mixed $result
     */
    public function userDeletePost()
    {
        $_POST['seq_no'];
        try {
            $connectdb = $this->connectDatabase();
            $deletedata = $connectdb->prepare("DELETE FROM users WHERE seq_no=:seq_no;");
            $deletedata->bindvalue(':seq_no', $_POST['seq_no']);
            $deletedata->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * ユーザー情報を編集するメソッド
     * 
     * @return void
     */
    public function editUserDataBySeqNo()
    {
        $_POST['seq_no'];
        $_POST['user_id'];
        $_POST['user_password'];
        try {
            $connectdb = $this->connectDatabase();
            $passwordhash = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
            $editdata = $connectdb->prepare("UPDATE users SET user_id=:user_id, password=:user_password WHERE seq_no=:seq_no;");
            $editdata->bindvalue(':seq_no', $_POST['seq_no']);
            $editdata->bindvalue(':user_id', $_POST['user_id']);
            $editdata->bindvalue(':user_password', $passwordhash);
            $editdata->execute();
            foreach ($editdata as $user) {
                if ($user['user_id']) {
                    $errors = '同じユーザーIDが存在します。';
                    return $errors;
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * 複数のユーザー情報を削除するメソッド
     * 
     * @return int $result
     */
    public function multiUsersDeletePost()
    {
        $_POST['seq_numbers'];
        try {
            $connectdb = $this->connectDatabase();
            $multiUsersdeletedata = $connectdb->prepare("DELETE FROM users WHERE seq_no=:seq_no;");
            $params = $_POST['seq_numbers'];
            // 削除するレコードを1件ずつループ処理
            foreach ($params as $value) {
            // 配列の値を :seq_no にセットし、executeでSQLを実行
            $multiUsersdeletedata->execute(array(':seq_no' => $value));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}