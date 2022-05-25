<?php

$class = $_POST['class'];
$func = $_POST['func'];

require_once "../../db/{$class}.php";

$db = new $class();
$result = $db->$func();

header("Content-type: application/json; charset=UTF-8");
echo json_encode($result);
exit;