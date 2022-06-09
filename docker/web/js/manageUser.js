$(function() {
    //ハンバーガーメニュー
    var nav = document.getElementById("nav-wrapper");
    var hamburger = document.getElementById("js-hamburger-menu");
    var blackBg = document.getElementById("js-black-bg");

    //ハンバーガーメニューを動かすための処理
    hamburger.addEventListener("click", function() {
        nav.classList.toggle("open");
    });
    blackBg.addEventListener("click", function() {
        nav.classList.remove("open");
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
                    class: "usersTable",
                    func: "getUsersDataWithAscendingOrder",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#users-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="userCheckbox" id="usersCheckbox" value= ' +
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
        const number = $(this).attr("id");
        var $select = confirm("No." + number + "の投稿を削除してよろしいですか？");
        if ($select == false) {
            return;
        }
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "usersTable",
                    func: "userDeletePost",
                    seq_no: number,
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
        const number = $(this).attr("id");
        const userId = document.getElementById("user-id" + number).innerHTML;
        document.getElementById("edit-user-id").value = userId;
        document.getElementById("hidden-password-btn").value = number;
    });

    /**
     * ユーザー情報を編集した後、変更ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".change-edit-btn", function() {
        const sequence = document.getElementById("hidden-password-btn").value;
        const userId = document.getElementById("edit-user-id").value;
        const editPassword = document.getElementById("edit-password").value;
        const passConfirm = document.getElementById("edit-password-confirm").value;
        const errormessage = UserValidation(userId, editPassword, passConfirm);
        if (errormessage) {
            alert(errormessage);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "usersTable",
                    func: "editUserDataBySeqNo",
                    seq_no: sequence,
                    user_id: userId,
                    user_password: editPassword,
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
    function UserValidation(userId, editPassword, passConfirm) {
        let message = [];

        if (userId === "" || editPassword === "" || passConfirm === "") {
            message.push(
                " ユーザーID、パスワード、確認用パスワードのいずれかが未入力です。 \n"
            );
        }

        if (userId.length > 20 || !userId.match(/^[A-Za-z0-9]*$/)) {
            message.push(" ユーザーIDを20文字以下の半角英数字で入力してください。\n");
        }

        if (editPassword.length > 30 || !editPassword.match(/^[A-Za-z0-9]*$/)) {
            message.push(" パスワードを30文字以下の半角英数字で入力してください。\n");
        }

        if (passConfirm.length > 30 || !passConfirm.match(/^[A-Za-z0-9]*$/)) {
            message.push(
                " 確認用パスワードを30文字以下の半角英数字で入力してください。 \n"
            );
        }

        if (editPassword != passConfirm) {
            message.push(" パスワードと確認用パスワードを一致させてください。");
        }

        if (message.length > 0) {
            let errormessage = message.join("");
            return errormessage;
        }
    }

    /**
     * 複数選択削除ボタンの活性・非活性切り替え
     *
     * @return void
     */
    $("#bulk-user-delete-btn").prop("disabled", true);
    // チェックボックスがクリックされたとき
    $(document).on("change", ".userCheckbox", function() {
        // チェックされているチェックボックスの数
        if ($(".userCheckbox:checked").length > 0) {
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
        var array = [];
        // #userCheckboxの要素をnumbersに格納
        var deleteNumbers = document.getElementsByClassName("userCheckbox");
        for (i = 0; i < deleteNumbers.length; i++) {
            if (deleteNumbers[i].checked === true) {
                // 配列arrayにdeleteNumbersのvalueをpush
                array.push(deleteNumbers[i].value);
            }
        }
        $userConfirm = window.confirm(
            "No." + array + "の投稿を削除してよろしいですか？"
        );
        if ($userConfirm == false) {
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "usersTable",
                    func: "multiUsersDeletePost",
                    seq_numbers: array,
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