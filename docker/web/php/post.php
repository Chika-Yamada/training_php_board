<?php
require_once('../../db/postsTable.php');

$posttable = new postsTable();
$result = $posttable->post();
?>

<html>

<head>
    <link rel="stylesheet" href="/docker/web/css/post.css">
    <script src="https://kit.fontawesome.com/e330008995.js" crossorigin="anonymous"></script>
</head>

<body>
    <div class="header-left">
        <header class="header-letter">
            Bulletin Board
        </header>
        <p>MENU</p>
        <header>
            <div class="hamburger-menu">
                <input type="checkbox" id="menu-btn-check">
                <label for="menu-btn-check" class="menu-btn"><span></span></label>
            </div>
        </header>
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
        <?php foreach ($result as $val) : ?>
        <tr>
            <td height="100"><input type="checkbox" id="post-btn-check"></td>
            <td height="100"><?php echo $val["seq_no"] ?></td>
            <td height="100"><?php echo $val["user_id"] ?></td>
            <td height="100"><?php echo $val["post_date"] ?></td>
            <td height="100"><?php echo $val["post_title"] . "<br>" . $val["post_contents"] ?></td>
            <td height="100"><i class="fa-solid fa-pen-to-square"></td>
            <td height="100">&times;</td>
        </tr>
        <?php endforeach ?>
    </table>

</body>

</html>
<table border1>
</table>
</body>

</html>