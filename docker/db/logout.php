<?php
session_start();

//セッション変数を全て削除
$_SESSION = array();

//セッションの登録データを破壊
session_destroy();
header("Location: /");