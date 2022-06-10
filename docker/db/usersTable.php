<?php

require_once('DatabaseConnect.php');

class UsersTable
{

    /**
     * ユーザーの新規登録処理
     * 
     * @param string $user_id　ユーザーID
     * @param string $password パスワード
     * 
     * @return void
     */
    public function insertUserDataByUserId($user_id, $password)
    {
        try {
            $db_info = new DatabaseConnect();
            $db_connect = $db_info->connectDatabase();
            $sql = "SELECT * FROM users WHERE user_id=:userId;";
            $stmt = $db_connect->prepare($sql);
            $stmt->bindValue(':userId', $user_id);
            $stmt->execute();
            $users = $stmt->fetchAll();
            foreach ($users as $user) {
                if ($user['user_id']) {
                    $errors = '同じユーザーIDが存在します。';
                    return $errors;
                }
            }

            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users(user_id, password) VALUES (:userId, :password)";
            $stmt = $db_connect->prepare($sql);
            $stmt->bindValue(':userId', $user_id);
            $stmt->bindValue(':password', $password_hash);
            $stmt->execute();

            header('Location:/');
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * ログイン処理
     * 
     * @param string $user_id　ユーザーID
     *
     * @return mixed $login_data
     */
    public function SelectUserDataByUserId($loginuserid)
    {
        try {
            $db_info = new DatabaseConnect();
            $sql = "SELECT * FROM users WHERE user_id=:userId";
            $db_connect = $db_info->connectDatabase();
            $login_connect = $db_connect->prepare($sql);
            $login_connect->bindValue(':userId', $loginuserid);
            $login_connect->execute();
            $login_data = $login_connect->fetch();
            return $login_data;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    /**
     * DBのユーザーデータ取得処理
     * 
     * @return mixed $db_info
     */
    public function getUsersDataWithAscendingOrder()
    {
        try {
            $db_info = new DatabaseConnect();
            $db_connect = $db_info->connectDatabase();
            $postdata = $db_connect->prepare("SELECT * FROM users order by seq_no asc;");
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
    public function deleteUserDataBySeqNo()
    {
        $_POST['seq_no'];
        try {
            $db_info = new DatabaseConnect();
            $db_connect = $db_info->connectDatabase();
            $deletedata = $db_connect->prepare("DELETE FROM users WHERE seq_no=:seq_no;");
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
    public function UpdateUserDataBySeqNo()
    {
        $_POST['seq_no'];
        $_POST['user_id'];
        $_POST['user_password'];
        try {
            $db_info = new DatabaseConnect();
            $db_connect = $db_info->connectDatabase();
            $password_hash = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
            $edit_data = $db_connect->prepare("UPDATE users SET user_id=:user_id, password=:user_password WHERE seq_no=:seq_no;");
            $edit_data->bindvalue(':seq_no', $_POST['seq_no']);
            $edit_data->bindvalue(':user_id', $_POST['user_id']);
            $edit_data->bindvalue(':user_password', $password_hash);
            $edit_data->execute();
            foreach ($edit_data as $user) {
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
    public function deleteMultiUsersDataBySeqNo()
    {
        $_POST['seq_numbers'];
        try {
            $db_info = new DatabaseConnect();
            $db_connect = $db_info->connectDatabase();
            $multi_users_delete_data = $db_connect->prepare("DELETE FROM users WHERE seq_no=:seq_no;");
            $params = $_POST['seq_numbers'];
            // 削除するレコードを1件ずつループ処理
            foreach ($params as $value) {
            // 配列の値を :seq_no にセットし、executeでSQLを実行
            $multi_users_delete_data->execute(array(':seq_no' => $value));
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}