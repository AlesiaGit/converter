class CurrencyConverter {
	
	constructor() {
		var widget = document.getElementsByClassName('widget')[0];
		widget.innerHTML = '';

		this.converterScreen = document.createElement('div');
		this.converterScreen.className = 'widget__converter converter';
		this.converterScreen.innerHTML='\
		<div class="converter__top-wrapper">\
		<div class="top-wrapper__switch-wrapper switch-wrapper">\
		<div class="switch-wrapper__input-units js-input-units"></div>\
		<input type="checkbox" class="switch-wrapper__switch js-switch" checked>\
		<div class="switch-wrapper__output-units js-output-units"></div>\
		</div>\
		<div class="top-wrapper__results-wrapper results-wrapper js-results">\
		<div class="results-wrapper__input-field input-field js-input-field" id="input">\
		<input class="input-field__input-data data js-input-data" type="text" placeholder="0" value="0" readonly>\
		<div class="input-field__input-data descr js-input-descr"></div>\
		</div>\
		<div class="results-wrapper__output-field output-field" id="output">\
		<div class="output-field__output-data data js-output-data">0</div>\
		<div class="output-field__output-data descr js-output-descr"></div>\
		</div>\
		</div>\
		</div>\
		<div class="converter__grid-wrapper grid">\
		<table class="grid__table">\
		<tr class="grid__row">\
		<td class="grid__cell">7</td>\
		<td class="grid__cell">8</td>\
		<td class="grid__cell">9</td>\
		<td rowspan="2" class="grid__cell grid__cell-clear js-cell-clear">C</td>\
		</tr>\
		<tr class="grid__row">\
		<td class="grid__cell">4</td>\
		<td class="grid__cell">5</td>\
		<td class="grid__cell">6</td>\
		</tr>\
		<tr class="grid__row">\
		<td class="grid__cell">1</td>\
		<td class="grid__cell">2</td>\
		<td class="grid__cell">3</td>\
		<td rowspan="2" class="grid__cell grid__cell-back js-cell-back"></td>\
		</tr>\
		<tr class="grid__row">\
		<td colspan="2" class="grid__cell">0</td>\
		<td class="grid__cell js-separator">.</td>\
		</tr>\
		</table>\
		</div>';

		widget.appendChild(this.converterScreen);

		this.fillCurrencyData();
		this.requestExchangeRate();
	}

	fillCurrencyData() {
		document.getElementsByClassName('js-input-data')[0].style.color = '#b2dfdb';
		document.getElementsByClassName('js-cell-clear')[0].style.color = '#b2dfdb';
		document.getElementsByClassName('js-cell-back')[0].style.backgroundColor = '#b2dfdb';
		document.getElementsByClassName('js-switch')[0].style.backgroundColor = '#b2dfdb';
		document.getElementsByClassName('js-input-field')[0].style.borderBottomColor = '#b2dfdb';
		
		if (currencies.length == 0) {
			this.getCurrencyList();
		}
		

		if (inputCurrency.length == 0) {
			inputCurrency = ['USD', 'United States Dollar'];
			localStorage.setItem('input-currency', JSON.stringify(inputCurrency));
		}
			document.getElementsByClassName('js-input-units')[0].innerHTML = inputCurrency[0];
			document.getElementsByClassName('js-input-descr')[0].innerHTML = inputCurrency[1];


		if (outputCurrency.length == 0) {
			outputCurrency = ['USD', 'United States Dollar'];
			localStorage.setItem('output-currency', JSON.stringify(outputCurrency));
		}
			document.getElementsByClassName('js-output-units')[0].innerHTML = outputCurrency[0];
			document.getElementsByClassName('js-output-descr')[0].innerHTML = outputCurrency[1];
		

		document.getElementsByClassName('grid')[0].addEventListener('click', this.clickOnCell);
		document.getElementsByClassName('js-switch')[0].addEventListener('change', this.switchData);
		document.getElementById('input').addEventListener('click', this.changeInputCurrency);
		document.getElementById('output').addEventListener('click', this.changeOutputCurrency);

		
	}

	getCurrencyList() {
			return fetch('https://cors-anywhere.herokuapp.com/http://apilayer.net/api/list?access_key=8fbefe0ac43633ea8ecb3b0436235ac1').then(function (req) {
			return req.json();
		}).then(function (data) {
			currencies = data.currencies;
			localStorage.setItem('currencies', JSON.stringify(currencies));
		}.bind(this));
	}


	requestExchangeRate() {
		return fetch('https://cors-anywhere.herokuapp.com/http://www.apilayer.net/api/live?access_key=8fbefe0ac43633ea8ecb3b0436235ac1&format=1').then(function (req) {
			return req.json();
		}).then(function (data) {
			rates = data.quotes;
			localStorage.setItem('rates', JSON.stringify(rates));
		}.bind(this));
	}

	changeOutputCurrency() {
		selectedCur = 'output';
		new CurrenciesSearchScreen;
	}

	changeInputCurrency() {
		selectedCur = 'input';
		new CurrenciesSearchScreen;
	}

	switchData() {
		var checkedDefault = document.getElementsByClassName('js-switch')[0].checked;
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var outputDiv = document.getElementsByClassName('js-output-data')[0];
		var index = inputDiv.value.split('').indexOf('.');

		if (index >= 0 && inputDiv.value.length - index > 1) {
			var decimal = inputDiv.value.length - index - 1;

		} else {
			decimal = 0;
		}

		var outputCurrency = JSON.parse(localStorage.getItem('output-currency')) || ['USD', 'United States Dollar'];
		var rate;
		for (var key in rates) {
			if (key == 'USD' + outputCurrency[0]) {
				rate = rates[key];
			}
		}

		if (checkedDefault == true) {
			document.getElementsByClassName('js-input-descr')[0].innerHTML = inputCurrency[1];
			document.getElementsByClassName('js-input-units')[0].innerHTML = inputCurrency[0];
			document.getElementsByClassName('js-output-descr')[0].innerHTML = outputCurrency[1];
			document.getElementsByClassName('js-output-units')[0].innerHTML = outputCurrency[0];
			outputDiv.innerHTML = (parseFloat(inputDiv.value)*rate).toFixed(decimal);

		} else {
			document.getElementsByClassName('js-input-descr')[0].innerHTML = outputCurrency[1];
			document.getElementsByClassName('js-input-units')[0].innerHTML = outputCurrency[0];
			document.getElementsByClassName('js-output-descr')[0].innerHTML = inputCurrency[1];
			document.getElementsByClassName('js-output-units')[0].innerHTML = inputCurrency[0];
			outputDiv.innerHTML = (parseFloat(inputDiv.value)/rate).toFixed(decimal);
		}
	}

	clickOnCell(event) {
		var checkedDefault = document.getElementsByClassName('js-switch')[0].checked; 
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var outputDiv = document.getElementsByClassName('js-output-data')[0];
		var outputDescr = document.getElementsByClassName('js-output-descr')[0];
		var data = inputDiv.value;
		var index = inputDiv.value.split('').indexOf('.');


		if (event.target.innerHTML == 'C') {
			inputDiv.value = '0';
			outputDiv.innerHTML = '0';

		} else if (event.target.innerHTML == '' && data.length <= 1) {
			inputDiv.value = '0';
			outputDiv.innerHTML = '0';

		} else if (event.target.innerHTML == '') {
			inputDiv.value = data.slice(0, -1);

		} else if (event.target.innerHTML == '.' && index >= 0) {
			inputDiv.value = inputDiv.value;

		} else if (event.target.innerHTML == '.' && inputDiv.value == 0) {
			inputDiv.value = '0.';

		} else if (inputDiv.value == '0') {
			inputDiv.value = event.target.innerHTML;

		} else {
			inputDiv.value = data + event.target.innerHTML;
		}


		if (index >= 0 && inputDiv.value.length - index > 1) {
			var decimal = inputDiv.value.length - index - 1;
		} else {
			decimal = 0;
		}

		var outputCurrency = JSON.parse(localStorage.getItem('output-currency')) || [];
		var rate;
		for (var key in rates) {
			if (key == 'USD' + outputCurrency[0]) {
				rate = rates[key];
			}
		}

		if (checkedDefault == true) {
			outputDiv.innerHTML = (parseFloat(inputDiv.value)*rate).toFixed(decimal);
		} else {
			outputDiv.innerHTML = (parseFloat(inputDiv.value)/rate).toFixed(decimal);
		}
	}
}