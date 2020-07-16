$( document ).ready(function() {
    var end = new Date('07/16/2020 23:32');

    monthA = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
    document.getElementById('date').innerHTML = end.getDate() + ' ' + monthA[end.getMonth()];

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {

            clearInterval(timer);
            document.getElementById('countdown').innerHTML = 'Прием заявок завершен!';
            $('.btn-send-order').addClass('disabled');
            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        document.getElementById('countdown').innerHTML = ('0' + days).slice(-2) + ' дней, ';
        document.getElementById('countdown').innerHTML += ('0' + hours).slice(-2) + ':';
        document.getElementById('countdown').innerHTML += ('0' + minutes).slice(-2) + ':';
        document.getElementById('countdown').innerHTML += ('0' + seconds).slice(-2);
    }
    timer = setInterval(showRemaining, 1000);
});
$(document).ready(function() {
  $("a.scroll_to").click(function() {
    var elementClick = $(this).attr("href")
    var destination = $(elementClick).offset().top;
    jQuery("html:not(:animated),body:not(:animated)").animate({
      scrollTop: destination
    }, 800);
  });
  $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
          $('#to_top').fadeIn();
      } else {
          $('#to_top').fadeOut();
      }
  });
  $('#to_top').click(function () {
      $('body,html').animate({
          scrollTop: 0
      }, 400);
      return false;
  });
  
  $( "body" ).on( "click", ".modal_form_next", function() {
    if($(this).parent().parent().find('.modal_form_checkbox input').prop('checked')) { 
      $('.modal_form_step_1').hide();
      $('.modal_form_step_2').show();
    } else {
      window.alert('Дайте свое согласие на обработку данных!');
    }
  });
  $( "body .mobile_menu").on( "click", ".mobile_menu_btn", function(e) {
    $('.mobile_menu_block').addClass('mobile_open');
  });
  $( "body .mobile_menu .mobile_menu_block").on( "click", "a", function(e) {
    $('.mobile_menu_block').removeClass('mobile_open');
  });

  if ($(window).width() <= 401) {
    $('.bx_2_slide').bxSlider({pager:false,touchEnabled:false,infiniteLoop:false,minSlides:1,maxSlides:1,});
  } else if ($(window).width() < 481) { 
    $('.bx_2_slide').bxSlider({pager:false,touchEnabled:false,infiniteLoop:false,minSlides:2,maxSlides:2,slideWidth:200});
  } else if ($(window).width() > 480)  {
  }
  
  if ($(window).width() <= 480) {
    $('.bx_1_slide').bxSlider({pager:false,touchEnabled:false,infiniteLoop:false,minSlides:1,maxSlides:1,});
  }
});