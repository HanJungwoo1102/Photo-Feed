$(window).ready(function(){
    var pageNum = 1;

    // 맨 처음 scroll event 가 발생하지 않기 때문에 loadCardData 바로 호출
    loadCardData(`https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_${pageNum}.json`);

    $(window).on('scroll',function(){
        if($(document).height()-150 <= $(window).scrollTop() + $(window).height()){
            loadCardData(`https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_${++pageNum}.json`);
        }
    });

    set_btn_only_scrap();
});


// get card data using ajax
function loadCardData(url_page){
    $.ajax({
        crossOrigin: true,
        url: url_page,
        dataType:'json',
        success: function(data) {
            makeCard(data);
            return true;
        },
        error: function(){
            $(window).off('scroll');
        }
    });
};
// make tag with json data
function makeCard(cardData){
    for(var i = 0 ; i<cardData.length ; i++ ){
        
        // cardcollection 에 카드 추가
        var card = $("<section/>").addClass("card").attr("id","id_"+cardData[i].id);
        
        var card_user_profile = $("<div/>").addClass("card_user_profile").append(`<img src="${cardData[i].profile_image_url}">`); 
        var card_user_name = $("<div/>").addClass("card_user_name").append(`<p>${cardData[i].nickname}</p>`);
        var card_photo = $("<div/>").addClass("card_photo").append(`<img src="${cardData[i].image_url}">`); 

        card.append(card_user_profile).append(card_user_name).append("<div class='clearbox'></div>").append(card_photo);

        set_card_btnScrap(card);

        $('.collection_card').append(card);
    }
};
// set scrap button
function set_card_btnScrap(card){

    var card_btnScrap = $("<div/>").addClass("card_btnScrap");
    if(localStorage.getItem(card.attr('id'))){
        // scrap 돼 있는 경우
        card_btnScrap.append(`<img src="./img/blue.png">`)
    }else{
        // scrap 안 돼 있는 경우
        card_btnScrap.append(`<img src="./img/on-img.png">`);
    }
    card.children('.card_photo').append(card_btnScrap);

    card.children('.card_photo').children('.card_btnScrap').click(function(){
        
        // scrap button click event        
        // 1. scrap 된 건지 안 된건지 체크
        // 2. 변경사항 localstorage 에 변경
        // 3. 이미지 변경

        var card_id = $(this).parent().parent().attr('id');
        if(localStorage.getItem( card_id )){
            localStorage.removeItem( card_id );
            $(this).find('img').attr('src',"./img/on-img.png");
            if($('#btn_only_scrap').hasClass('.only_scrap')){
                card.hide();
            }
        }else{
            localStorage.setItem(card_id , card);
            $(this).find('img').attr('src',"./img/blue.png");
        }
    })
};
// set only-scrapped-card button
function set_btn_only_scrap(){
    // click only scrapped card
    $('#btn_only_scrap').on('click',function(){
        // 1. 눌려 있던 건지 아닌지 상태 확인
        // 2. localstorage 에서 상태 확인
        // 3. 스크랩 되어 있지 않은 것들 다 hide
        if(!$('#btn_only_scrap').hasClass('.only_scrap')){
            // 눌려 있지 않을 때 누르면 scrap 한것만 보여주기
            $('#btn_only_scrap img').attr('src','./img/bt-checkbox-checked.png');
            for(var i=0;i<$('.card').length ; i++){
                console.log($('.card')[i].id);
                if(localStorage.getItem($('.card')[i].id)){
                    // local storage 에 있는 card 인 경우 (scrap)
                    $(`#${$('.card')[i].id}`).show();
                }else{
                    $(`#${$('.card')[i].id}`).hide();
                }
            }
        }else{
            // 눌려 있었을 때 누르면 전부 보여주기
            $('#btn_only_scrap img').attr('src','');
            for(var i=0;i<$('.card').length ; i++){
                if(!localStorage.getItem($('.card')[i].id)){
                    $(`#${$('.card')[i].id}`).show();
                }
            }
        }
        $('#btn_only_scrap').toggleClass('.only_scrap');
    });
};








// scrap 확인은 local storage 로 하기

// TODO

// 5. 화면 중앙
