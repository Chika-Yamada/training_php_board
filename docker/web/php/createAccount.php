<?php

require_once('Validation.php');
require_once('../../db/usersTable.php');

// 登録ボタンが押された時
if (isset($_POST["signUp"])) {
    $userid = htmlspecialchars($_POST["userId"], ENT_QUOTES);
    $password = ($_POST["password"]);
    $passwordcheck = ($_POST["passwordCheck"]);
    $validationcheck = new Validation();
    $errormessage = $validationcheck->userRegistValidation($userid, $password, $passwordcheck);
    if (!empty($errormessage)) {
        echo "<script>alert('$errormessage')</script>";
    } else {
        $data = new usersTable();
        $data->userRegist($userid, $password);
    }
}
?>

<html>

<head>
    <link rel="stylesheet" href="/docker/web/css/createAccount.css">
</head>

<body>
    <div class="header-left">
        <header class="header-letter">
            Bulletin Board
        </header>
    </div>

    <div class="return-button">
        <input onclick="location.href='../../../index.php'" value="戻る">
    </div>

    <div class="login-screen upper">
        <h1>Bulltin Board</h1>
        <p>新規追加画面</p>
    </div>

    <div class="back-square">
        <div class="login-screen">
            <h2>新規追加</h2>
            <p>ユーザーIDとパスワードを登録してください。</p>
        </div>

        <form method="post" action="">
            <div class="createaccount-screen">
                <input type="text" name="userId" placeholder="ユーザーID">
            </div>
            <div class="login-screen">
                <input type="password" name="password" placeholder="パスワード">
                <input type="password" name="passwordCheck" placeholder="パスワード確認">
            </div>
            <div class="login-button">
                <input type="submit" name="signUp" value="登録する">
            </div>
        </form>
    </div>
</body>

</html>