<?php

require_once("ValidationUtil.php");

class Validation
{
    /**
     * 登録時のバリデーションチェック
     * 
     * @param int $user_id ユーザーID
     * @param int $password
     * @param int $password_check
     * 
     * @return string $errors 
     */
    public function registValidation($user_id, $password, $password_check)
    {
        $errors = '';

        if (empty($user_id) || empty($password) || empty($password_check)) {
            $errors .= "項目に未記入のものがあります。" . '\n';
        }

        if (!ValidationUtil::isHanEisu($user_id) || !ValidationUtil::isMaxLength($user_id, 20)) {
            $errors .= "IDは半角英数字で20文字以下にしてください。" . '\n';
        }

        if (!ValidationUtil::isHanEisu($password) || !ValidationUtil::isMaxLength($password, 30)) {
            $errors .= "パスワードは半角英数字で30文字以下にしてください。" . '\n';
        }

        if (!ValidationUtil::isHanEisu($password_check) || !ValidationUtil::isMaxLength($password_check, 30)) {
            $errors .= "確認用パスワードは半角英数字で30文字以下にしてください。" . '\n';
        }

        if ($password != $password_check) {
            $errors .= "パスワードと確認用パスワードが一致していません。";
        }
        if (!empty($errors)) {
            return $errors;
        }
    }

    /**
     * ログイン時のバリデーションチェック
     * 
     * @param int $login_user_id ユーザーID
     * @param int $login_password パスワード
     * 
     * @return string　$login_errors
     */
    public function loginValidation($login_user_id, $login_password)
    {
        $login_errors = '';
        $login_data = new UsersTable();
        $login_info = $login_data->SelectUserDataByUserId($login_user_id);

        if (empty($login_user_id) || empty($login_password)) {
            $login_errors .= "項目に未記入のものがあります。" . '\n';
        }

        if (!$login_info) {
            $login_errors .= 'ユーザーIDが存在しません。' . '\n';
        }

        if (password_verify($login_password, $login_info['password'])) {
            $_SESSION['userId'] = $login_info['user_id'];
        } else {
            $login_errors .= 'ユーザーIDかパスワードが正しくありません。' . '\n';
        }

        if (!empty($login_errors)) {
            return $login_errors;
        }
    }
}