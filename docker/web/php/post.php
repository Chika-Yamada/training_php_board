<?php
require_once('../../db/postsTable.php');

$posttable = new postsTable();
$result = $posttable->post();

//ログイン後の画面のリンクを取得した場合、ログインなしで開けてしまう事態を防ぐ
session_start();
if (!isset($_SESSION["userId"])) {
    header("Location: /");
}

?>

<html>

<head>
    <link rel="stylesheet" href="../css/post.css">
    <script src="https://kit.fontawesome.com/e330008995.js" crossorigin="anonymous"></script>
</head>

<body>
    <div class="header-left">
        <header class="header-letter">
            Bulletin Board
            <div class="nav-wrapper" id="nav-wrapper">
                <div class="hamburger-menu" id="js-hamburger-menu">
                    <span class="hamburger__line hamburger__line--1"></span>
                    <span class="hamburger__line hamburger__line--2"></span>
                    <span class="hamburger__line hamburger__line--3"></span>
                    <p>MENU</p>
                </div>
                <nav class="sp-nav">
                    <ul style="list-style: none;" id="modal-list">
                        <li class="modal-post" id="modal-show">投稿追加</li>
                        <li class="modal-user">ユーザー管理</li>
                        <li class="modal-logout"><a href="../../db/logout.php">ログアウト</a></li>
                    </ul>
                </nav>
                <div class="black-bg" id="js-black-bg"></div>
            </div>
    </div>
    </header>
    </div>
    <div class="post-wrapper" id="post-modal">
        <div class="modal">
            <div class="close-modal">
                <i class="fa fa-2x fa-times"></i>
            </div>
            <div id="post-form">
                <h2>投稿追加</h2>
                <p>投稿タイトル</p>
                <input class="post-title" id="post-title" type="text" name="post_title" placeholder="20文字以内で入力してください。">
                <p>投稿内容</p>
                <input class="post-detail" id="post-detail" name="post_detail" type="text">
                <div class="post-button">
                    <input type="submit" id="post-btn" value="投稿する">
                </div>
            </div>
        </div>
    </div>

    <table>
        <div class="post-delete">
            <div class="post-list">
                <h1>投稿一覧</h1>
            </div>
            <div class="delete-button">
                <button onclick="location.href=''">削除</button>
            </div>
        </div>
    </table>

    <table border="1">
        <tr>
            <th width="50" height="50">選択</th>
            <th width="50" height="50">No.</th>
            <th width="100" height="50">ユーザーID</th>
            <th width="100" height="50">投稿日時</th>
            <th width="300" height="50">項目(内容)</th>
            <th width="50" height="50">編集</th>
            <th width="50" height="50">削除</th>
        </tr>
        <tbody id="post-data">
        </tbody>
    </table>
</body>

</html>
<table border1>
</table>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="../js/post.js" type="text/javascript"></script>
</body>

</html>