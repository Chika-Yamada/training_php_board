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
    function PostValidation(posttitle, postdetail) {
        let message = [];

        if (posttitle === "" || postdetail === "") {
            message.push(" 投稿タイトルまたは投稿内容が未入力です。 \n");
        }

        if (posttitle.length > 20) {
            message.push(" 投稿タイトルを20文字以下で入力してください。\n");
        }

        if (postdetail.length > 200) {
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
        const posttitle = document.getElementById("post-title").value;
        const postdetail = document.getElementById("post-detail").value;
        const errors = PostValidation(posttitle, postdetail);
        if (errors) {
            alert(errors);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "postsTable",
                    func: "insertPostData",
                    post_title: posttitle,
                    post_detail: postdetail,
                },
            })
            .done(function(data) {
                $(".post-wrapper").fadeOut();
                // $(".black-bg").fadeOut();
                nav.classList.remove("open");
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
                    class: "postsTable",
                    func: "getPostDataWithAscendingOrder",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox" class="checkbox" id="checkbox" value= ' +
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
        const number = $(this).attr("id");
        var $select = confirm("No." + number + "の投稿を削除してよろしいですか？");
        if ($select === false) {
            return;
        }
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "postsTable",
                    func: "deletePost",
                    seq_no: number,
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
        // $(".black-bg").fadeIn();

        //元々書いてあった内容をモーダル内に表示
        const number = $(this).attr("id");
        const title = document.getElementById("post-contents" + number).innerHTML;
        let result = title.split("<br>");
        document.getElementById("edit-title").value = result[0];
        document.getElementById("edit-detail").value = result[1];
        document.getElementById("hidden-edit-btn").value = number;
    });

    /**
     * 編集した後、投稿ボタンを押下した時の処理
     *
     * @return void
     */
    $(document).on("click", ".post-edit-btn", function() {
        const sequence = document.getElementById("hidden-edit-btn").value;
        const posttitle = document.getElementById("edit-title").value;
        const postdetail = document.getElementById("edit-detail").value;
        const errormessage = PostValidation(posttitle, postdetail);
        if (errormessage) {
            alert(errormessage);
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "postsTable",
                    func: "editPostDataBySeqNo",
                    seq_no: sequence,
                    edit_title: posttitle,
                    edit_detail: postdetail,
                },
            })
            .done(function(data) {
                $("#post-data").empty();
                getPostDataBase();
                $(".edit-wrapper").fadeOut();
                // $(".black-bg").fadeOut();
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
    $(document).on("change", ".checkbox", function() {
        // チェックされているチェックボックスの数
        if ($(".checkbox:checked").length > 0) {
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
        var arr = [];
        // #checkboxの要素をnumbersに格納
        var numbers = document.getElementsByClassName("checkbox");
        for (i = 0; i < numbers.length; i++) {
            if (checkbox[i].checked === true) {
                // 配列arrにnumbersのvalueをpush
                arr.push(numbers[i].value);
            }
        }
        $confirm = window.confirm("No." + arr + "の投稿を削除してよろしいですか？");
        if ($confirm == false) {
            return;
        }

        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "postsTable",
                    func: "multiDeletePost",
                    seq_numbers: arr,
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
});