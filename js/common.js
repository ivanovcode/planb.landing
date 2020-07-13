$( document ).ready(function() {
    var end = new Date('07/13/2020 8:32');

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