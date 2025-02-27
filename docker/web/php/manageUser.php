<html>

<head>
    <link rel="stylesheet" href="../css/manageUser.css">
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
                        <li class="modal-post" id="modal-show"><a href="post.php">投稿一覧</li>
                        <li class="modal-logout"><a href="../../db/logout.php">ログアウト</a></li>
                    </ul>
                </nav>
                <div class="black-bg" id="js-black-bg"></div>
            </div>
        </header>
    </div>
    </div>

    <table>
        <div class="post-delete">
            <div class="post-list">
                <h1>ユーザー管理</h1>
                <h2>ユーザー一覧</h2>
            </div>
            <div class="bulk-users-delete-button">
                <input type="submit" id="bulk-user-delete-btn" value="削除">
            </div>
        </div>
    </table>

    <table border="1">
        <tr>
            <th width="10" height="50">選択</th>
            <th width="10" height="50">No.</th>
            <th width="260" height="50">ユーザーID</th>
            <th width="10" height="50">編集</th>
            <th width="10" height="50">削除</th>
        </tr>
        <tbody id="users-data">
        </tbody>
    </table>
</body>

</html>

<!-- ユーザー情報編集用モーダル -->
<div class="edit-wrapper" id="user-modal">
    <div class="modal">
        <div class="close-modal">
            <i class="fa fa-2x fa-times"></i>
        </div>
        <div id="edit-form">
            <h2>ユーザー情報編集</h2>
            <p>ユーザーID</p>
            <input class="user-id" id="edit-user-id" type="text" name="edit-title" value="">
            <p>パスワード</p>
            <input id="hidden-password-btn" type="hidden">
            <input class="user-password" id="edit-password" name="edit-detail" type="password">
            <input class="user-password" id="edit-password-confirm" name="edit-detail" type="password">
            <div class="change-button">
                <input type="submit" class="change-edit-btn" id="change-btn" value="変更する">
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="../js/manageUser.js" type="text/javascript"></script>
</body>

</html>