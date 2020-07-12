$( document ).ready(function() {
    var end = new Date('07/12/2020 23:50');

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
            document.getElementById('countdown').innerHTML = 'EXPIRED!';

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