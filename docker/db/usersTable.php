<?php

class usersTable
{

    public function db()
    {
        $dsn = "pgsql:dbname=board_database; host=db; port=5555;";
        $user = 'root';
        $dbpassword = 'password';
        $dbh = new PDO($dsn, $user, $dbpassword);
        return $dbh;
    }

    public function regist($userId, $passwordHash)
    {
        try {
            $dbo = $this->db();

            $sql = "SELECT * FROM users WHERE user_id=:userId;";
            $stmt = $dbo->prepare($sql);
            $stmt->bindValue(':userId', $userId);
            $stmt->execute();
            $users = $stmt->fetchAll();
            foreach ($users as $user) {
                if ($user['user_id']) {
                    $errors = '同じユーザーIDが存在します。';
                    return $errors;
                }
            }

            $sql = "INSERT INTO users(user_id, password) VALUES (:userId, :password)";
            $stmt = $dbo->prepare($sql);
            $stmt->bindValue(':userId', $userId);
            $stmt->bindValue(':password', $passwordHash);
            $stmt->execute();

            header('Location:/');
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}