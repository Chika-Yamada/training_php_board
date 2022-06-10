$(function() {
    //ハンバーガーメニュー
    const NAV = document.getElementById("nav-wrapper");
    const HAMBURGER = document.getElementById("js-hamburger-menu");
    const BLACK_BG = document.getElementById("js-black-bg");

    //ハンバーガーメニューを動かすための処理
    HAMBURGER.addEventListener("click", function() {
        NAV.classList.toggle("open");
    });
    BLACK_BG.addEventListener("click", function() {
        NAV.classList.remove("open");
    });

    //モーダル表示・削除
    $("#modal-show").click(function() {
        $(".post-wrapper").fadeIn();
    });

    $(".close-modal").click(function() {
        $(".edit-wrapper").fadeOut();
    });

    /**
     * ユーザー一覧データ取得・表示メソッド
     *
     * @return void
     */
    function getUsersDataBase() {
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "UsersTable",
                    func: "getUsersDataWithAscendingOrder",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#users-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="user-checkbox" id="users-checkbox" value= ' +
                        value.seq_no +
                        "></td><td>" +
                        value.seq_no +
                        "</td><td id=user-id" +
                        value.seq_no +
                        ">" +
                        value.user_id +
                        '</td><td class="edit-btn" id=' +
                        value.seq_no +
                        '><i class="fa-solid fa-pen-to-square"></i></td><td class="user-delete-btn" id= ' +
                        value.seq_no +
                        ">&times;</td></tr>"
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    }
    getUsersDataBase();

    /**
     * ユーザー一覧の削除ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".user-delete-btn", function() {
        const NUMBER = $(this).attr("id");
        const SELECT = confirm(
            "No." + NUMBER + "のユーザーを削除してよろしいですか？"
        );
        if (SELECT == false) {
            return;
        }
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "UsersTable",
                    func: "deleteUserDataBySeqNo",
                    seq_no: NUMBER,
                },
            })
            .done(function(data) {
                $("#users-data").empty();
                getUsersDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * ユーザー編集ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".edit-btn", function() {
        //モーダル出現
        $(".edit-wrapper").fadeIn();
        $(".black-bg").fadeIn();

        //元々書いてあった内容をモーダル内に表示
        const NUMBER = $(this).attr("id");
        const USER_ID = document.getElementById("user-id" + NUMBER).innerHTML;
        document.getElementById("edit-user-id").value = USER_ID;
        document.getElementById("hidden-password-btn").value = NUMBER;
    });

    /**
     * ユーザー情報を編集した後、変更ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".change-edit-btn", function() {
        const SEQUENCE = document.getElementById("hidden-password-btn").value;
        const USER_ID = document.getElementById("edit-user-id").value;
        const EDIT_PASSWORD = document.getElementById("edit-password").value;
        const PASS_CONFIRM = document.getElementById("edit-password-confirm").value;
        const ERRORMESSEGE = UserValidation(USER_ID, EDIT_PASSWORD, PASS_CONFIRM);
        if (ERRORMESSEGE) {
            alert(ERRORMESSEGE);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "UsersTable",
                    func: "UpdateUserDataBySeqNo",
                    seq_no: SEQUENCE,
                    user_id: USER_ID,
                    user_password: EDIT_PASSWORD,
                },
            })
            .done(function(data) {
                $(".edit-wrapper").fadeOut();
                $(".black-bg").fadeOut();
                document.getElementById("edit-user-id").value = "";
                document.getElementById("edit-password").value = "";
                document.getElementById("edit-password-confirm").value = "";
                $("#users-data").empty();
                getUsersDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * ユーザー情報変更のバリデーションチェック
     *
     * @return String | void
     */
    function UserValidation(USER_ID, EDIT_PASSWORD, PASS_CONFIRM) {
        let message = [];

        if (USER_ID === "" || EDIT_PASSWORD === "" || PASS_CONFIRM === "") {
            message.push(
                " ユーザーID、パスワード、確認用パスワードのいずれかが未入力です。 \n"
            );
        }

        if (USER_ID.length > 20 || !USER_ID.match(/^[A-Za-z0-9]*$/)) {
            message.push(" ユーザーIDを20文字以下の半角英数字で入力してください。\n");
        }

        if (EDIT_PASSWORD.length > 30 || !EDIT_PASSWORD.match(/^[A-Za-z0-9]*$/)) {
            message.push(" パスワードを30文字以下の半角英数字で入力してください。\n");
        }

        if (PASS_CONFIRM.length > 30 || !PASS_CONFIRM.match(/^[A-Za-z0-9]*$/)) {
            message.push(
                " 確認用パスワードを30文字以下の半角英数字で入力してください。 \n"
            );
        }

        if (EDIT_PASSWORD != PASS_CONFIRM) {
            message.push(" パスワードと確認用パスワードを一致させてください。");
        }

        if (message.length > 0) {
            let ERROR_MESSEGE = message.join("");
            return ERROR_MESSEGE;
        }
    }

    /**
     * 複数選択削除ボタンの活性・非活性切り替え
     *
     * @return void
     */
    $("#bulk-user-delete-btn").prop("disabled", true);
    // チェックボックスがクリックされたとき
    $(document).on("change", ".user-checkbox", function() {
        // チェックされているチェックボックスの数
        if ($(".user-checkbox:checked").length > 0) {
            // ボタンを活性化
            $("#bulk-user-delete-btn").prop("disabled", false);
        } else {
            // ボタン無効
            $("#bulk-user-delete-btn").prop("disabled", true);
        }
    });

    /**
     * 複数選択削除ボタンを押した時の処理
     *
     * @return void
     */
    $(document).on("click", "#bulk-user-delete-btn", function() {
        const ARRAY = [];
        // #user-checkboxの要素をDELETE_NUMBERSに格納
        const DELETE_NUMBERS = document.getElementsByClassName("user-checkbox");
        for (i = 0; i < DELETE_NUMBERS.length; i++) {
            if (DELETE_NUMBERS[i].checked === true) {
                // 配列ARRAYにDELETE_NUMBERSのvalueをpush
                ARRAY.push(DELETE_NUMBERS[i].value);
            }
        }
        $user_confirm = window.confirm(
            "No." + ARRAY + "のユーザーを削除してよろしいですか？"
        );
        if ($user_confirm == false) {
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "UsersTable",
                    func: "deleteMultiUsersDataBySeqNo",
                    seq_numbers: ARRAY,
                },
            })
            .done(function(data) {
                $("#users-data").empty();
                getUsersDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });
});