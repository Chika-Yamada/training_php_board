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
        $(".post-wrapper").fadeOut();
    });

    /**
     * 投稿追加のバリデーションチェック
     *
     * @return void
     */
    function PostValidation(posttitle, postdetail) {
        let message = [];

        if (posttitle == "" || postdetail == "") {
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
                    func: "createPost",
                    post_title: posttitle,
                    post_detail: postdetail,
                },
            })
            .done(function(data) {
                $(".post-wrapper").fadeOut();
                getDatabase();
                $(".black-bg").fadeOut();
                nav.classList.toggle("open");
                document.getElementById("post-title").value = "";
                document.getElementById("post-detail").value = "";
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    });

    /**
     * 今投稿登録した1件のデータ取得・表示メソッド
     *
     * @return void
     */
    function getDatabase() {
        $.ajax({
                type: "POST",
                url: "../php/ajax.php",
                datatype: "json",
                data: {
                    class: "postsTable",
                    func: "newPost",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox"></td><td>' +
                        value.seq_no +
                        "</td><td>" +
                        value.user_id +
                        "</td><td>" +
                        value.post_date +
                        "</td><td>" +
                        value.post_title +
                        "<br>" +
                        value.post_contents +
                        '</td><td><i class="fa-solid fa-pen-to-square"></i></td><td>&times;</td></tr>'
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    }

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
                    func: "post",
                },
            })
            .done(function(data) {
                $.each(data, function(key, value) {
                    $("#post-data").append(
                        "<tr><td>" +
                        '<input type="checkbox"></td><td>' +
                        value.seq_no +
                        "</td><td>" +
                        value.user_id +
                        "</td><td>" +
                        value.post_date +
                        "</td><td>" +
                        value.post_title +
                        "<br>" +
                        value.post_contents +
                        '</td><td><i class="fa-solid fa-pen-to-square"></i></td><td class="delete-btn" id= ' +
                        value.seq_no +
                        ">&times;</td></tr>"
                    );
                });
            })
            .fail(function(data) {
                alert("通信失敗");
            });
    }
    getPostDataBase();

    /**
     * 削除ボタンを押した時の処理
     *
     * @return void
     */
    $(document).on("click", ".delete-btn", function() {
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
});