class ShowSearchScreen {

	constructor() {

		var widget = document.getElementsByClassName('widget')[0];
		this.searchScreen = document.createElement('div');
		this.searchScreen.className = 'cover__wrapper wrapper';
		this.searchScreen.innerHTML = '<div class="wrapper__search-field search-field search-field__location">\
		<a class="search-field__btn back-btn back-btn__location"></a>\
		<input type="text" class="search-field__input input__location" placeholder="search..." autofocus>\
		<a class="search-field__btn close-btn close-btn__location"></a>\
		</div>\
		<div class="wrapper__locations-list locations" id="locations">\
		</div>';
		widget.appendChild(this.searchScreen);

		var zones = JSON.parse(localStorage.getItem('zones')) || [];

		for (var i = 0; i < zones.length; i++) {
			var locationItem = document.createElement('div');
			locationItem.className = 'locations__item item';
			locationItem.innerHTML = '\
			<div class="item__loc-name"></div>\
			<div class="item__loc-zone"></div>\
			<div class="item__loc-gmt"></div>';

			document.getElementById('locations').appendChild(locationItem);

			document.getElementsByClassName('item__loc-name')[i].innerHTML =  zones[i]['countryName'];
			document.getElementsByClassName('item__loc-zone')[i].innerHTML = zones[i]['zoneName'];

			var hours = Math.floor(zones[i].gmtOffset/3600);
			var minutes = 60*(zones[i].gmtOffset/3600 - hours);

			if (minutes == 0) {
				minutes = '00';
			} else if (minutes < 10) {
				minutes = '0' + minutes;
			}

			if (hours >= 0 && hours < 10) {
				hours = '+0' + hours;
			} else if (hours < 0 && hours > -10) {
				hours = '-0' + Math.abs(hours);
			} else if (hours >= 10) {
				hours = '+' + hours;
			}

			var gmt = hours + ':' + minutes;
			document.getElementsByClassName('item__loc-gmt')[i].innerHTML = 'GMT' + gmt;

		}
		
		this.getTimezones();

		document.getElementsByClassName('close-btn')[0].addEventListener('click', this.hideSearchScreen);
		document.getElementById('locations').addEventListener('click', this.requestTime);

		document.getElementsByClassName('search-field__input')[0].addEventListener('input', this.rewriteList);
	}


	rewriteList() {
		document.getElementById('locations').innerHTML = '';
		var input = document.getElementsByClassName('search-field__input')[0].value;
		var value = input.toLowerCase();
		var tempZones = [];
		var zones = JSON.parse(localStorage.getItem('zones')) || [];

		var anotherZones = zones.filter(function(elem) {
			var country = elem['countryName'].toLowerCase();
			var zone = elem['zoneName'].toLowerCase();
			if (zone.search(value) >= 0 || country.search(value) >= 0) {
				return elem;
			}

		});

		for (var i = 0; i < anotherZones.length; i++) {

			var locationItem = document.createElement('div');
			locationItem.className = 'locations__item item';
			locationItem.innerHTML = '\
			<div class="item__loc-name"></div>\
			<div class="item__loc-zone"></div>\
			<div class="item__loc-gmt"></div>';

			document.getElementById('locations').appendChild(locationItem);

			document.getElementsByClassName('item__loc-name')[i].innerHTML =  anotherZones[i]['countryName'];
			document.getElementsByClassName('item__loc-zone')[i].innerHTML = anotherZones[i]['zoneName'];

			
			var hours = Math.floor(anotherZones[i].gmtOffset/3600);
			var minutes = 60*(anotherZones[i].gmtOffset/3600 - hours);

			if (minutes == 0) {
				minutes = '00';
			} else if (minutes < 10) {
				minutes = '0' + minutes;
			}

			if (hours >= 0 && hours < 10) {
				hours = '+0' + hours;
			} else if (hours < 0 && hours > -10) {
				hours = '-0' + Math.abs(hours);
			} else if (hours >= 10) {
				hours = '+' + hours;
			}

			var gmt = hours + ':' + minutes;

			document.getElementsByClassName('item__loc-gmt')[i].innerHTML = 'GMT' + gmt;

		}


		document.getElementById('locations').addEventListener('click', this.requestTime);

	}



	requestTime() {
		var target = event.target;

		while (target.id != 'locations') {
			if (target.className == 'locations__item item') {

				var country = target.getElementsByClassName('item__loc-name')[0].innerHTML;
				var city = (target.getElementsByClassName('item__loc-zone')[0].innerHTML).split('/').pop();
				var offset =  (target.getElementsByClassName('item__loc-gmt')[0].innerHTML).split('GMT').pop();
				var zone = target.getElementsByClassName('item__loc-zone')[0].innerHTML;

				var descr = city + ', ' + country;

				if (selectedLoc == 'input') {
					inputData = [descr, offset, zone];
					localStorage.setItem('input', JSON.stringify(inputData));
					new TimeConverter(inputData);

				} 

				if(selectedLoc == 'output') {
					outputData = [descr, offset, zone];
					localStorage.setItem('output', JSON.stringify(outputData));

					new TimeConverter;
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


	getTimezones() {

		return fetch('https://cors-anywhere.herokuapp.com/https://api.timezonedb.com/v2/list-time-zone?key=AYFND6YNSLQO&format=json').then(function (req) {
			return req.json();
		}).then(function (data) {

			zones = data.zones;

			for (var i = 0; i < data.zones.length; i++) {
				var locationItem = document.createElement('div');
				locationItem.className = 'locations__item item';
				locationItem.innerHTML = '\
				<div class="item__loc-name"></div>\
				<div class="item__loc-zone"></div>\
				<div class="item__loc-gmt"></div>';

				document.getElementById('locations').appendChild(locationItem);

				document.getElementsByClassName('item__loc-name')[i].innerHTML =  data.zones[i].countryName;
				document.getElementsByClassName('item__loc-zone')[i].innerHTML = data.zones[i].zoneName;

				var hours = Math.floor(data.zones[i].gmtOffset/3600);
				
				var minutes = 60*(data.zones[i].gmtOffset/3600 - hours);
				if (minutes == 0) {
					minutes = '00';
				} else if (minutes < 10) {
					minutes = '0' + minutes;
				}

				if (hours >= 0 && hours < 10) {
					hours = '+0' + hours;
				} else if (hours < 0 && hours > -10) {
					hours = '-0' + Math.abs(hours);
				} else if (hours >= 10) {
					hours = '+' + hours;
				}
				
				var gmt = hours + ':' + minutes;
				document.getElementsByClassName('item__loc-gmt')[i].innerHTML = 'GMT' + gmt;

				localStorage.setItem('zones', JSON.stringify(zones));

			}
		});
	}


}
