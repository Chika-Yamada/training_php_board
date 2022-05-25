<?php
require_once('../../db/postsTable.php');

$posttable = new postsTable();
$result = $posttable->post();
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
                    <ul style="list-style: none;">
                        <li id="modal-show">投稿追加</li>
                        <li>ユーザー管理</li>
                        <li>ログアウト</li>
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
                <form action="#">
                    <p>投稿タイトル</p>
                    <input class="post-title" type="text" maxlength="20" placeholder="20文字以内で入力してください。">
                    <p>投稿内容</p>
                    <input class="post-detail" type="text" maxlength="200">
                    <div class="post-button">
                        <input type=”submit” value="投稿する">
                    </div>
                </form>
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