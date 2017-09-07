class CurrenciesSearchScreen {

	constructor() {

		var widget = document.getElementsByClassName('widget')[0];
		this.searchScreen = document.createElement('div');
		this.searchScreen.className = 'cover__wrapper wrapper';
		this.searchScreen.innerHTML = '<div class="wrapper__search-field search-field search-field__currency">\
		<a class="search-field__btn back-btn back-btn__currency"></a>\
		<input type="text" class="search-field__input input__currency" placeholder="search..." autofocus>\
		<a class="search-field__btn close-btn close-btn__currency"></a>\
		</div>\
		<div class="wrapper__currency-list currencies" id="currency">\
		</div>';
		widget.appendChild(this.searchScreen);

		var keysArray = Object.keys(currencies);
		
		for (var i = 0; i < keysArray.length; i++) {

			var currencyItem = document.createElement('div');
			currencyItem.className = 'currency__item item';
			currencyItem.innerHTML = '\
			<div class="item__currency-abbreviation"></div>\
			<div class="item__currency-name"></div>';

			document.getElementById('currency').appendChild(currencyItem);

			document.getElementsByClassName('item__currency-abbreviation')[i].innerHTML = keysArray[i];

			for (var key in currencies) {
				if (key == keysArray[i]) {
					document.getElementsByClassName('item__currency-name')[i].innerHTML = currencies[key];
				}
			}
		}
		
		document.getElementsByClassName('close-btn')[0].addEventListener('click', this.hideSearchScreen);
		document.getElementById('currency').addEventListener('click', this.changeCurrency);

		document.getElementsByClassName('search-field__input')[0].addEventListener('input', this.rewriteList);
	}


	rewriteList() {
		document.getElementById('currency').innerHTML = '';
		var input = document.getElementsByClassName('search-field__input')[0].value;
		var value = input.toLowerCase();
		var updatedCurrencies = {};

		for (var key in currencies) {
			var keyLower = key.toLowerCase();
			var currenciesLower = currencies[key].toLowerCase();
			if (keyLower.search(value) >= 0 || currenciesLower.search(value) >= 0) {
				updatedCurrencies[key] = currencies[key];
			}
		}

		var keysArray = Object.keys(updatedCurrencies);
		
		for (var i = 0; i < keysArray.length; i++) {

			var currencyItem = document.createElement('div');
			currencyItem.className = 'currency__item item';
			currencyItem.innerHTML = '\
			<div class="item__currency-abbreviation"></div>\
			<div class="item__currency-name"></div>';

			document.getElementById('currency').appendChild(currencyItem);

			document.getElementsByClassName('item__currency-abbreviation')[i].innerHTML = keysArray[i];

			for (var key in updatedCurrencies) {
				if (key == keysArray[i]) {
					document.getElementsByClassName('item__currency-name')[i].innerHTML = updatedCurrencies[key];
				}
			}
		}

		document.getElementById('currency').addEventListener('click', this.changeCurrency);

	}


	changeCurrency() {
		var target = event.target;

		while (target.id != 'currency') {
			if (target.className == 'currency__item item') {

				var currencyAbbr = target.getElementsByClassName('item__currency-abbreviation')[0].innerHTML;
				var currencyName = target.getElementsByClassName('item__currency-name')[0].innerHTML;

				if (selectedCur == 'input') {
					inputCurrency = [currencyAbbr, currencyName];
					localStorage.setItem('input-currency', JSON.stringify(inputCurrency));
					new CurrencyConverter;
				} 

				if (selectedCur == 'output') {
					outputCurrency = [currencyAbbr, currencyName];
					localStorage.setItem('output-currency', JSON.stringify(outputCurrency));
					new CurrencyConverter;
				} 

				return;

			} else {

				target = target.parentNode;

			}
		}
	}


	hideSearchScreen() {
		widget.removeChild(document.getElementsByClassName('cover__wrapper')[0]);
	}

}
