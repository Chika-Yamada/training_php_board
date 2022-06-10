<?php

require_once('docker/web/php/Validation.php');
require_once('docker/db/UsersTable.php');

// ログインボタンが押された時
if (isset($_POST["login"])) {
    $login_userid = htmlspecialchars($_POST["loginUserId"]);
    $login_password = ($_POST["loginPassword"]);
    $login_validation_check = new Validation();
    $login_error_messege = $login_validation_check->loginValidation($login_userid, $login_password);
    if (!empty($login_error_messege)) {
        echo "<script>alert('$login_error_messege')</script>";
    } else {
        header('Location:docker/web/php/post.php');
    }
}

?>

<html>

<head>
    <link rel="stylesheet" href="/docker/web/css/index.css">
</head>

<body>
    <div class="header-left">
        <header class="header-letter">
            Bulletin Board
        </header>
    </div>

    <div class="login-screen upper">
        <h1>Bulletin Board</h1>
        <p>ログイン画面</p>
    </div>

    <div class="back-square">
        <div class="login-screen">
            <h2>ログイン</h2>
            <p>ユーザーIDとパスワードを登録してください。</p>
        </div>

        <form method="post" action="">
            <div class="login-screen">
                <input type="text" name="loginUserId" maxlength="20" placeholder="ユーザーID">
                <input type="password" name="loginPassword" maxlength="30" placeholder="パスワード">
            </div>

            <div class="login-button">
                <input type="submit" name="login" value="ログインする">
            </div>
        </form>

        <a href="/docker/web/php/createaccount.php" class="create">新規追加はこちら</a>

    </div>
</body>

</html>