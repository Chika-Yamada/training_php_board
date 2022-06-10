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

    //投稿追加モーダル表示・削除
    $("#modal-show").click(function() {
        $(".post-wrapper").fadeIn();
    });

    $(".close-modal").click(function() {
        $(".post-wrapper").fadeOut();
    });

    /**
     * 投稿追加のバリデーションチェック
     *
     * @return String | void
     */
    function PostValidation(POST_TITLE, POST_DETAIL) {
        let message = [];

        if (POST_TITLE === "" || POST_DETAIL === "") {
            message.push(" 投稿タイトルまたは投稿内容が未入力です。 \n");
        }

        if (POST_TITLE.length > 20) {
            message.push(" 投稿タイトルを20文字以下で入力してください。\n");
        }

        if (POST_DETAIL.length > 200) {
            message.push(" 投稿内容を200文字以下で入力してください。");
        }

        if (message.length > 0) {
            let errormessage = message.join("");
            return errormessage;
        }
    }

    /**
     * 投稿ボタンを押下した時の処理
     *
     * @return void
     */
    const postbtn = document.getElementById("post-btn");

    postbtn.addEventListener("click", function(event) {
        const POST_TITLE = document.getElementById("post-title").value;
        const POST_DETAIL = document.getElementById("post-detail").value;
        const ERRORS = PostValidation(POST_TITLE, POST_DETAIL);
        if (ERRORS) {
            alert(ERRORS);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "insertPostData",
                    post_title: POST_TITLE,
                    post_detail: POST_DETAIL,
                },
            })
            .done(function(data) {
                $(".post-wrapper").fadeOut();
                NAV.classList.remove("open");
                document.getElementById("post-title").value = "";
                document.getElementById("post-detail").value = "";
                $("#post-data").empty();
                getPostDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * 投稿一覧データ取得・表示メソッド
     *
     * @return void
     */
    function getPostDataBase() {
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "getPostDataWithAscendingOrder",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="check-box" id="check-box" value= ' +
                        value.seq_no +
                        "></td><td>" +
                        value.seq_no +
                        "</td><td>" +
                        value.user_id +
                        "</td><td>" +
                        value.post_date +
                        "</td><td id=post-contents" +
                        value.seq_no +
                        ">" +
                        value.post_title +
                        "<br>" +
                        value.post_contents +
                        '</td><td class="edit-btn" id=' +
                        value.seq_no +
                        '><i class="fa-solid fa-pen-to-square"></i></td><td class="delete-btn" id= ' +
                        value.seq_no +
                        ">&times;</td></tr>"
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    }
    $("#post-data").empty();
    getPostDataBase();

    /**
     * 削除ボタンを押した時の処理
     *
     * @return void
     */
    $(document).on("click", ".delete-btn", function() {
        const NUMBERS = $(this).attr("id");
        const SELECT = confirm(
            "No." + NUMBERS + "の投稿を削除してよろしいですか？"
        );
        if (SELECT === false) {
            return;
        }
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "deletePost",
                    seq_no: NUMBERS,
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                getPostDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    //投稿編集モーダル削除
    $(".close-modal").click(function() {
        $(".edit-wrapper").fadeOut();
    });

    /**
     * 編集ボタンを押した時の処理
     *
     * @return void
     */
    $(document).on("click", ".edit-btn", function() {
        //モーダル出現
        $(".edit-wrapper").fadeIn();

        //元々書いてあった内容をモーダル内に表示
        const NUMBERS = $(this).attr("id");
        const TITLE = document.getElementById("post-contents" + NUMBERS).innerHTML;
        let result = TITLE.split("<br>");
        document.getElementById("edit-title").value = result[0];
        document.getElementById("edit-detail").value = result[1];
        document.getElementById("hidden-edit-btn").value = NUMBERS;
    });

    /**
     * 編集した後、投稿ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".post-edit-btn", function() {
        const SEQUENCE = document.getElementById("hidden-edit-btn").value;
        const POST_TITLE = document.getElementById("edit-title").value;
        const POST_DETAIL = document.getElementById("edit-detail").value;
        const ERROR_MESSEGE = PostValidation(POST_TITLE, POST_DETAIL);
        if (ERROR_MESSEGE) {
            alert(ERROR_MESSEGE);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "editPostDataBySeqNo",
                    seq_no: SEQUENCE,
                    edit_title: POST_TITLE,
                    edit_detail: POST_DETAIL,
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                getPostDataBase();
                $(".edit-wrapper").fadeOut();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * 複数選択削除ボタンの活性・非活性切り替え
     *
     * @return void
     */
    $("#full-delete-btn").prop("disabled", true);
    // チェックボックスがクリックされたとき
    $(document).on("change", ".check-box", function() {
        // チェックされているチェックボックスの数
        if ($(".check-box:checked").length > 0) {
            // ボタンを活性化
            $("#full-delete-btn").prop("disabled", false);
        } else {
            // ボタン無効
            $("#full-delete-btn").prop("disabled", true);
        }
    });

    /**
     * 複数選択削除ボタンを押した時の処理
     *
     * @return void
     */
    $(document).on("click", "#full-delete-btn", function() {
        const ARR = [];
        // #checkBoxの要素をNUMBERSに格納
        const NUMBERS = document.getElementsByClassName("check-box");
        for (i = 0; i < NUMBERS.length; i++) {
            if (NUMBERS[i].checked === true) {
                // 配列ARRにNUMBERSのvalueをpush
                ARR.push(NUMBERS[i].value);
            }
        }
        $confirm = window.confirm("No." + ARR + "の投稿を削除してよろしいですか？");
        if ($confirm == false) {
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "multiDeletePost",
                    seq_numbers: ARR,
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                getPostDataBase();
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * 昇順ボタンを押した時、投稿内容を並び替える処理
     *
     * @return void
     */
    $(document).on("click", ".asc", function() {
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "getPostDataWithAscendingOrderByDate",
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="check-box" id="check-box" value= ' +
                        value.seq_no +
                        "></td><td>" +
                        value.seq_no +
                        "</td><td>" +
                        value.user_id +
                        "</td><td>" +
                        value.post_date +
                        "</td><td id=post-contents" +
                        value.seq_no +
                        ">" +
                        value.post_title +
                        "<br>" +
                        value.post_contents +
                        '</td><td class="edit-btn" id=' +
                        value.seq_no +
                        '><i class="fa-solid fa-pen-to-square"></i></td><td class="delete-btn" id= ' +
                        value.seq_no +
                        ">&times;</td></tr>"
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * 降順ボタンを押した時、投稿内容を並び替える処理
     *
     * @return void
     */
    $(document).on("click", ".desc", function() {
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "PostsTable",
                    func: "getPostDataWithDescendingOrderByDate",
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="check-box" id="check-box" value= ' +
                        value.seq_no +
                        "></td><td>" +
                        value.seq_no +
                        "</td><td>" +
                        value.user_id +
                        "</td><td>" +
                        value.post_date +
                        "</td><td id=post-contents" +
                        value.seq_no +
                        ">" +
                        value.post_title +
                        "<br>" +
                        value.post_contents +
                        '</td><td class="edit-btn" id=' +
                        value.seq_no +
                        '><i class="fa-solid fa-pen-to-square"></i></td><td class="delete-btn" id= ' +
                        value.seq_no +
                        ">&times;</td></tr>"
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });
});