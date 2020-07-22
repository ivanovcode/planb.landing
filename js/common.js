function addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

function debouncer(fn, timeout) {
    var timeoutID , timeout = timeout || 200;
    return function () {
        var scope = this , args = arguments;
        clearTimeout( timeoutID );
        timeoutID = setTimeout( function () {
            fn.apply( scope , Array.prototype.slice.call( args ) );
        } , timeout );
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function myObjDown(event) {
    if (el !== event.target) return;
}

function validateReg(txt, re) {
    return re.test(txt);
}

function validateFio(e) {
    let value = e.value.trim();
    let minlength = e.getAttribute("minlength");

    let re = /^[а-яa-zА-ЯA-ZёЁ][а-яa-zА-ЯA-ZёЁ\-]{0,}\s[а-яa-zА-ЯA-ZёЁ][а-яa-zА-ЯA-ZёЁ\-]{1,}\s[а-яa-zА-ЯA-ZёЁ][а-яa-zА-ЯA-ZёЁ\-]{1,}?$/;

    if(value.length < minlength || !validateReg(value, re)) {
        return false;
    }
    return true;
}

function validatePhone(e) {
    let value = e.value.trim();
    value = value.replace(/[^+\d]/g, '');
    let minlength = e.getAttribute("minlength");

    let re = /^((\+7|7|8)+([0-9]){10})$/;

    if(value.length < minlength || !validateReg(value, re)) {
        return false;
    }

    return true;
}

function validateEmail(e) {
    let value = e.value.trim();
    let minlength = e.getAttribute("minlength");

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(value.length < minlength || !validateReg(value, re)) {
        return false;
    }

    return true;
}

function validateSegment(e) {
    let re = /^\s*(\S\s*){3,20}$/;

    if(e && validateReg(e.value, re)) {
        return true;
    }
    return false;
}

function validateAgree(e) {
    if (e.checked) {
        return true;
    }
    return false;
}

function validateInn(e) {
    let value = e.value.trim();
    let re = /^([0-9_-]){10,12}$/;

    if(!validateReg(value, re)) {
        return false;
    }

    return true;
}

function validateReport(e) {
    let value = e.value.trim();
    value = value.replace(/\s/g, '');
    let re = /^.\d{1,13},\d{1,13},\d{1,13}$/;

    if(!validateReg(value, re)) {
        return false;
    }

    return true;
}

function validateFiles(files) {
    let inputFileNodes = document.querySelectorAll('input[type="file"]');
    let result = true;
    [].forEach.call(inputFileNodes, function (inputFileNode) {
        let inputFileNodeName = inputFileNode.getAttribute('name');
        if (typeof files[inputFileNodeName] === "undefined") {
            console.log(files[inputFileNodeName]);
            result = false;
        }
    });
    return result;
}

function validateStep1(item) {
    let fio_el = document.querySelectorAll('[name=fio]')[0];
    let phone_el = document.querySelectorAll('[name=phone]')[0];
    let email_el = document.querySelectorAll('[name=email]')[0];
    let segment_el = document.querySelector('input[name="modal_form_radio"]:checked');
    let agree_el = document.querySelectorAll('[name=agree]')[0];
    let btn_next_el = document.getElementsByClassName("btn-next")[0];

    let validFio = validateFio(fio_el);
    let validPhone = validatePhone(phone_el);
    let validEmail = validateEmail(email_el);
    let validSegment = validateSegment(segment_el);
    let validAgree = validateAgree(agree_el);

    item.parentElement.className = item.parentElement.className.replace(/(^|\s)status-\S+/g, '');

    if(validFio) {
        fio_el.parentElement.classList.add('status-success');
    }

    if(validPhone) {
        phone_el.parentElement.classList.add('status-success');
    }

    if(validEmail) {
        email_el.parentElement.classList.add('status-success');
    }

    if(validFio && validPhone && validEmail && validSegment && validAgree) {
        btn_next_el.classList.remove("disabled");
    } else {
        btn_next_el.classList.add("disabled");
    }
}

function validateStep2(item, files) {
    let inn_el = document.querySelectorAll('[name=inn]')[0];
    let report_el = document.querySelectorAll('[name=report]')[0];
    let btn_submit_el = document.getElementsByClassName("btn-submit")[0];

    let validFiles = validateFiles(files);
    let validInn = validateInn(inn_el);
    let validReport = validateReport(report_el);

    item.parentElement.className = item.parentElement.className.replace(/(^|\s)status-\S+/g, '');

    if(validInn) {
        inn_el.parentElement.classList.add('status-success');
    }

    if(validReport) {
        report_el.parentElement.classList.add('status-success');
    }

    if(validInn && validReport && validFiles) {
        btn_submit_el.classList.remove("disabled");
    } else {
        btn_submit_el.classList.add("disabled");
    }
}


document.addEventListener("DOMContentLoaded", function(event) {
    let step1_el = document.getElementsByClassName("step1")[0];
    let inputNodes = step1_el.getElementsByClassName("modal_form_input");
    let radioNodes = document.querySelectorAll('input[name="modal_form_radio"]');
    let checkboxNode = document.querySelectorAll('input[name="agree"]')[0];

    addListenerMulti(checkboxNode, 'change ', debouncer(function(e){
        validateStep1(checkboxNode);
    }));

    [].forEach.call(radioNodes, function (item) {
        addListenerMulti(item, 'change ', debouncer(function(e){
            validateStep1(item);
        }));
    });

    [].forEach.call(inputNodes, function (item) {
        let input = item.querySelector('input');
        addListenerMulti(input, 'change keyup paste', debouncer(function(e){
            validateStep1(input);
        }));
    });
});

document.addEventListener("DOMContentLoaded", function(event) {
    var files = {};
    let step2_el = document.getElementsByClassName("step2")[0];
    let btnNodes = document.getElementsByClassName("btn-upload");
    let btnSubmit = document.getElementsByClassName("btn-submit")[0];
    let inputNodes = step2_el.getElementsByClassName("input");

    [].forEach.call(btnNodes, function (btnNode) {
        let inputFileNode = btnNode.previousElementSibling;
        let inputFileNodeName = inputFileNode.getAttribute('name');
        addListenerMulti(btnNode, 'click', debouncer(function(e){
            let btnNodePlaceholder = btnNode.getAttribute('data-placeholder');
            if (typeof files[inputFileNodeName] !== "undefined") {
                btnNode.classList.remove('file-active');
                btnNode.innerHTML = btnNodePlaceholder;
                delete files[inputFileNodeName];
            }
            inputFileNode.click();
        }));
        addListenerMulti(inputFileNode, 'change', debouncer(function(e){
            let inputFileNodeName = e.target.getAttribute("name");
            let file = e.target.files[0];
            let allowedExtensions;
            let error_el = document.getElementsByClassName("error-container")[0];
            let alert_el = document.getElementsByClassName("alert")[0];


            if(file) {
                switch (inputFileNodeName) {
                    case 'form':
                        allowedExtensions = /(\.doc|\.docx)$/i;
                        break;
                    case 'report_2017':
                    case 'report_2018':
                    case 'report_2019':
                    case 'presentation':
                        allowedExtensions = /(\.pdf)$/i;
                        break;
                    default:
                        allowedExtensions = false
                }

                if (allowedExtensions !== false && allowedExtensions.exec(file.name) && file.size <= 50*1024*1024) {
                    files[inputFileNodeName] = file;
                    btnNode.innerHTML = file.name; /*file.name file.size file.type*/
                    btnNode.classList.add('file-active');
                }

                if (allowedExtensions === false || !allowedExtensions.exec(file.name)) {
                    alert_el.innerHTML = "Выбран не верный тип файла, попробуйте снова."
                    error_el.classList.add('active');
                }

                if(file.size > 50*1024*1024) {
                    alert_el.innerHTML = "Превышен допустимый лимит файла 50 МБ, попробуйте снова. "
                    error_el.classList.add('active');
                }

                setTimeout(function tick() {
                    error_el.classList.remove('active');
                }, 2000);
            }
            validateStep2(inputFileNode, files);
        }));
    });

    [].forEach.call(inputNodes, function (inputNode) {
        addListenerMulti(inputNode, 'change keyup paste', debouncer(function(e){
            validateStep2(inputNode, files);
        }));
    });

    addListenerMulti(btnSubmit, 'click', debouncer(function(e){
        e.preventDefault();
        let formData = new FormData();
        let request = new XMLHttpRequest();
        let modal_2_el = document.getElementsByClassName("modal_form_step_2")[0];
        let modal_3_el = document.getElementsByClassName("modal_form_step_3")[0];
        let modal_3_content = modal_3_el.getElementsByClassName("modal_content")[0];

        formData.append("fio", $("input[name='fio']").val());
        formData.append("phone", $("input[name='phone']").val());
        formData.append("email", $("input[name='email']").val());
        formData.append("segment", $("input[name='modal_form_radio']:checked").val());
        formData.append("inn", $("input[name='inn']").val());
        formData.append("report", $("input[name='report']").val());

        Object.keys(files).forEach(function(key) {
            formData.append("files[]", files[key]);
            formData.append("filenames[]", key);
        });

        request.open('post', 'send.php');

        request.upload.addEventListener('progress', function(e) {
            var percent_complete = (e.loaded / e.total)*100;
        });

        request.addEventListener('load', function(e) {
            let success = true;
            let response;



            if(request.status !== 200 || !IsJsonString(request.responseText)) {
                success = false;
            } else {
                response = JSON.parse(request.responseText);
                if(!response.success){
                    success = false;
                }
            }

            if(success) {
                modal_3_content.innerHTML = 'Заявка отправлена - Спасибо!<br> С Вами свяжется наш менеджер для уточнения деталей.';
            } else {
                modal_3_content.innerHTML = 'Ошибка!<br> Попробуйте еще раз, если ошибка повторится обратитесь на email: <a href="mailto:ask@business.technograd.moscow">ask.business@technograd.moscow</a>';
            }

            modal_2_el.style.display = 'none';
            modal_3_el.style.display = 'block';
        });

        request.send(formData);
    }));
});



$( document ).ready(function() {
    var end = new Date('07/22/2020 23:32');

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
    var phoneMask = IMask(
        document.getElementById('phone'), {
            mask: '+{7}(000)000-00-00'
        });

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