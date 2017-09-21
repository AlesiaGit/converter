screen.orientation.lock('portrait');

var widget = document.getElementsByClassName('widget')[0];
var currentPos;
var selectedLoc = 'input';

var inputData = JSON.parse(localStorage.getItem('input')) || [];
var outputData = JSON.parse(localStorage.getItem('output')) || [];
var zones = JSON.parse(localStorage.getItem('zones')) || [];
var timezones;

var selectedCur = 'input';
var currencies = JSON.parse(localStorage.getItem('currencies')) || [];
var rates = JSON.parse(localStorage.getItem('rates')) || [];
var outputCurrency = JSON.parse(localStorage.getItem('output-currency')) || [];
var inputCurrency = JSON.parse(localStorage.getItem('input-currency')) || [];


function addZero(data) {
	if (data < 10) {
		return data = '0' + data;
	} else {
		return data;
	}
}


function offsetAbbreviation(data) {
	var hrs = Math.floor(data/60);
	var min = data - hrs*60;

	if (hrs > -10 && hrs < 0) {
		hrs = '-0' + Math.abs(hrs);
	} else if (hrs < 10 && hrs >= 0) {
		hrs = '+0' + hrs;
	} else if (hrs >= 10) {
		hrs = '+' + hrs;
	} else if (hrs <= -10) {
		hrs = '-' + hrs;
	}
	
	if (min < 10) {
		min = '0' + min;
	}

	return hrs + ':' + min;
}


function showMainScreen() {
	widget.innerHTML = '';

	var mainScreen = document.createElement('div');
	mainScreen.className = 'widget__main-screen main-screen';
	mainScreen.innerHTML = '<div class="main-screen__title-wrapper title-wrapper">\
	<div class="title-wrapper__title title-wrapper__title-top">Universal</div>\
	<div class="title-wrapper__title title-wrapper__title-bottom">Converter</div>\
	</div>\
	<div class="main-screen__menu-wrapper menu-wrapper">\
	<a href="#distance" class="menu-wrapper__menu menu-wrapper__menu-distance">Distance</a>\
	<a href="#time" class="menu-wrapper__menu menu-wrapper__menu-time">TimeZone</a>\
	<a href="#currency" class="menu-wrapper__menu menu-wrapper__menu-currency">Currency</a>\
	<a href="#temp" class="menu-wrapper__menu menu-wrapper__menu-temp">Temperature</a>\
	<a href="#fuel" class="menu-wrapper__menu menu-wrapper__menu-fuel">Fuel consumption</a>\
	</div>';

	widget.appendChild(mainScreen);

}

