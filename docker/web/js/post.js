$(function(){

/**
* 投稿追加のバリデーションチェック
*    
* @return void
*/
const postbtn = document.getElementById('post-btn');

function PostValidation(){
    const posttitle = document.getElementById('post-title');
    const postdetail = document.getElementById('post-detail');

postbtn.addEventListener('click', function(event) {
    let message = [];

    if(posttitle.value =="" || postdetail.value==""){
        message.push(" 投稿タイトルまたは投稿内容が未入力です。 \n");
    }

    if(posttitle.value.length > 20){
        message.push(" 投稿タイトルを20文字以下で入力してください。\n");
    }

    if(postdetail.value.length > 200){
        message.push(" 投稿内容を200文字以下で入力してください。");
    }
    
    if(message.length > 0){
        let errormessage = message.join("");
        alert(errormessage);}
    });
}
PostValidation();

/**
 * 投稿一覧データ取得メソッド
 * 
 * @return void
 */
function getPostDataBase(){
    $.ajax({
        type:'POST',
        url:'../php/ajax.php',
        datatype:'json',
        data:{
            'class':'postsTable',
            'func':'post',
        },
        })
        .done(function(data){
            $.each(data,function(key,value){
                $('#post-data').append('<tr><td>'+'<input type="checkbox"></td><td>'+value.seq_no + '</td><td>' +value.user_id + '</td><td>' + value.post_date + '</td><td>'+ value.post_title +'<br>'+value.post_contents+'</td><td><i class="fa-solid fa-pen-to-square"></i></td><td>&times;</td></tr>'
        )});
        }).fail(function (data){
            alert('通信失敗');
        })
    }
    getPostDataBase();

//　ハンバーガーメニュー
    var nav = document.getElementById('nav-wrapper');
    var hamburger = document.getElementById('js-hamburger-menu');
    var blackBg = document.getElementById('js-black-bg');

//ハンバーガーメニューを動かすための処理
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('open')});
    blackBg.addEventListener('click', function () {
        nav.classList.remove('open');
        });
});

//モーダル表示・削除
$('#modal-show').click(function() {
    $('.post-wrapper').fadeIn();
    });

$('.close-modal').click(function() {
    $('.post-wrapper').fadeOut();
    });