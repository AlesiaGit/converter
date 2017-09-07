class TimeConverter {
	
	constructor() {
		
		var widget = document.getElementsByClassName('widget')[0];
		widget.innerHTML = '';

		this.timeScreen = document.createElement('div');
		this.timeScreen.className = 'widget__converter converter';
		this.timeScreen.innerHTML='\
		<div class="converter__top-wrapper">\
		<div class="top-wrapper__results-wrapper results-wrapper results-wrapper-time js-results">\
		<div class="results-wrapper__input-field input-field js-input-field" id="input">\
		<input class="input-field__input-data data js-input-data time-input-data" type="text" value="00-00-00 00:00" readonly>\
		<div class="visible-input-data">00-00-00 00-00</div>\
		<div class="input-field__input-data descr js-input-descr">Geolocation (GMT+00:00)</div>\
		</div>\
		<div class="results-wrapper__output-field output-field" id="output">\
		<div class="output-field__output-data data js-output-data time-output-data">0</div>\
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
		<td rowspan="3" class="grid__cell grid__cell-clear js-cell-clear" id="clear">C</td>\
		</tr>\
		<tr class="grid__row">\
		<td class="grid__cell">4</td>\
		<td class="grid__cell">5</td>\
		<td class="grid__cell">6</td>\
		</tr>\
		<tr class="grid__row">\
		<td class="grid__cell">1</td>\
		<td class="grid__cell">2</td>\
		<td class="grid__cell">3</td></tr>\
		<tr class="grid__row">\
		<td colspan="2" class="grid__cell">0</td>\
		<td class="grid__cell arrow-left" id="left"></td>\
		<td class="grid__cell arrow-right" id="right"></td>\
		</tr>\
		</table>\
		</div>';

		widget.appendChild(this.timeScreen);

		this.fillDataTimeScreen();
	}


	fillDataTimeScreen() {
		document.getElementsByClassName('js-cell-clear')[0].style.color = '#ff9800';
		document.getElementsByClassName('js-input-field')[0].style.borderBottomColor = '#ff9800';
		document.getElementsByClassName('js-input-field')[0].style.paddingBottom = '8%';
		document.getElementsByClassName('js-output-data')[0].style.paddingTop = '5%';

		if (inputData.length != 0) {
			this.getCurrentTime(inputData);
		} else {
			this.getGeolocation();
		}

		if (outputData.length != 0) {
			this.getCurrentTime(outputData);
		} else {
			document.getElementsByClassName('js-output-descr')[0].innerHTML = 'Tap to select a location';
			document.getElementsByClassName('js-output-data')[0].innerHTML = '00-00-00 00:00';
		}

		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		if (inputDiv.value.length > 14) {
			document.getElementsByClassName('js-input-data')[0].value = inputDiv.value.substring(0, 14);
		}
		
		document.getElementById('left').addEventListener('click', this.clickLeftRuler);
		document.getElementById('right').addEventListener('click', this.clickRightRuler);
		document.getElementById('input').addEventListener('click', this.changeInputLocation);
		document.getElementById('output').addEventListener('click', this.changeOutputLocation);
		document.getElementsByClassName('grid')[0].addEventListener('click', this.clickOnTimeCell);

	}


	getGeolocation() {
		if (!navigator.geolocation) {
			console.log('geolocation is not supported');
			return;
		}

		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			return fetch('https://cors-anywhere.herokuapp.com/http://api.timezonedb.com/v2/get-time-zone?key=AYFND6YNSLQO&format=json&by=position&lat=' + lat + '&lng=' + lng).then(function (req) {
				return req.json();
			}).then(function (data) {
				var timezoneName = data.zoneName.split('/').pop() + ', ' + data.countryName;
				var timezoneCurrentTime = data.formatted.substring(8, 10) + '-' + data.formatted.substring(5, 7) + '-' + data.formatted.substring(2, 4) + ' ' + data.formatted.substring(11, 16);
				var code = data.zoneName;

				if (data.abbreviation.length > 3) {
					var timezoneOffset = data.abbreviation.substring(0, 4) + ':' + data.abbreviation.substring(4, data.abbreviation.length);
				} else {
					timezoneOffset = data.abbreviation + ':00';
				}

				document.getElementsByClassName('js-input-descr')[0].innerHTML = timezoneName + '(GMT' + timezoneOffset + ')' || 'Geolocation unknown';
				document.getElementsByClassName('js-input-data')[0].value = timezoneCurrentTime;
				
				this.setBlinkingCaret();

				inputData = [timezoneName, timezoneOffset, code];
				localStorage.setItem('input', JSON.stringify(inputData));
			}.bind(this));
		}.bind(this));

	}


	getCurrentTime(data) {
		var timezoneName = data[0];
		var timezoneOffset = data[1];
		var zone = data[2];

		var d = new Date(Date.now());
		var timestamp = d.getTime()/1000;
		var offsetToMinutes;

		for (var key in timezones) {
			if (key == zone) {
				for (var i = 0; i < timezones[key].length; i++) {
					if (timezones[key][i]['time_start'] < timestamp) {
						offsetToMinutes = timezones[key][i]['zone_offset']/60;
						break;
					}
				}
			}
		}

		var time = new Date (d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours() + d.getTimezoneOffset()/60, d.getMinutes() + offsetToMinutes);

		var date = time.getDate();
		if (date < 10) {
    		date = '0' + date;
    	}   

		var month = time.getMonth();
		if (month < 10) {
    		month = '0' + month;
    	} 

		var year = time.getFullYear().toString().substr(2, 2);

		var hours = time.getHours();
		if (hours < 10) {
    		hours = '0' + hours;
    	} 

		var minutes = time.getMinutes();
		if (minutes < 10) {
    		minutes = '0' + month;
    	} 

		var timezoneCurrentTime = date + '-' + month + '-' + year + ' ' + hours + ':' + minutes;

		
		if (data == inputData) {
			document.getElementsByClassName('js-input-descr')[0].innerHTML = timezoneName + '(GMT' + timezoneOffset + ')';
			document.getElementsByClassName('js-input-data')[0].value = timezoneCurrentTime;
		} 

		if (data == outputData) {
			document.getElementsByClassName('js-output-descr')[0].innerHTML = timezoneName + '(GMT' + timezoneOffset + ')';
			document.getElementsByClassName('js-output-data')[0].innerHTML = timezoneCurrentTime;
		}

		this.setBlinkingCaret();
	}


	setBlinkingCaret() {
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var fake = document.getElementsByClassName('visible-input-data')[0];
		var str = inputDiv.value;

		inputDiv.selectionStart = 9;
		inputDiv.selectionEnd = 10;
		inputDiv.setSelectionRange(inputDiv.selectionStart, inputDiv.selectionEnd);

		currentPos = inputDiv.selectionStart;
		fake.innerHTML = str.substring(0, inputDiv.selectionStart) + '<span class="blink">' + str.substring(inputDiv.selectionStart, inputDiv.selectionStart + 1) + '</span>' + str.substring(inputDiv.selectionStart + 1, inputDiv.value.length);
	}


	changeInputLocation() {
		selectedLoc = 'input';
		new ShowSearchScreen;
	}


	changeOutputLocation() {
		selectedLoc = 'output';
		new ShowSearchScreen;
	}

	clickLeftRuler() {
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var fake = document.getElementsByClassName('visible-input-data')[0];
		var str = inputDiv.value;

		if (inputDiv.value.length > 14) {
			document.getElementsByClassName('js-input-data')[0].value = inputDiv.value.substring(0, 14);
		}

		if (currentPos == 3 || currentPos == 6 || currentPos == 9 || currentPos == 12) {
			currentPos -= 2;
		} else if (currentPos == 0) {
			currentPos = inputDiv.value.length - 1;
		} else {
			currentPos -= 1;
		}

		inputDiv.setSelectionRange(currentPos, currentPos + 1);
		fake.innerHTML = str.substring(0, currentPos) + '<span class="blink">' + str.substring(currentPos, currentPos + 1) + '</span>' + str.substring(currentPos + 1, inputDiv.value.length);

	}


	clickRightRuler() {
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var fake = document.getElementsByClassName('visible-input-data')[0];
		var str = inputDiv.value;

		if (inputDiv.value.length > 14) {
			document.getElementsByClassName('js-input-data')[0].value = inputDiv.value.substring(0, 14);
		}

		if (currentPos == 1 || currentPos == 4 || currentPos == 7 || currentPos == 10) {
			currentPos += 2;
		} else if (currentPos == inputDiv.value.length - 1) {
			currentPos = 0;
		} else {
			currentPos += 1;
		}

		inputDiv.setSelectionRange(currentPos, currentPos + 1);
		fake.innerHTML = str.substring(0, currentPos) + '<span class="blink">' + str.substring(currentPos, currentPos + 1) + '</span>' + str.substring(currentPos + 1, inputDiv.value.length);

	}


	clickOnTimeCell(event) {
		var inputDiv = document.getElementsByClassName('js-input-data')[0];
		var outputDiv = document.getElementsByClassName('js-output-data')[0];
		var inputDescr = document.getElementsByClassName('js-input-descr')[0];
		var outputDescr = document.getElementsByClassName('js-output-descr')[0];
		var fake = document.getElementsByClassName('visible-input-data')[0];
		var str = inputDiv.value;

		if (document.getElementsByClassName('js-input-data')[0].value.length > 14) {
			document.getElementsByClassName('js-input-data')[0].value = inputDiv.value.substring(0, 14);
		}

		var target = event.target;
		var cellToNum = parseInt(target.innerHTML);

		while (target != document.getElementsByClassName('grid')[0]) {

			if (target.className == 'grid__cell') {
	        
		        if (currentPos == 2 || currentPos == 5 || currentPos == 8 || currentPos == 11) {
		        	currentPos +=1;
		        	inputDiv.value = str.substring(0, currentPos) + target.innerHTML + str.substring(currentPos + 1, inputDiv.value.length);
		        	currentPos += 1;
		        } else if (currentPos == inputDiv.value.length - 1) {
		        	inputDiv.value = str.substring(0, currentPos) + target.innerHTML;
		        	currentPos = 0;
		        } else {
		        	inputDiv.value = str.substring(0, currentPos) + target.innerHTML + str.substring(currentPos + 1, inputDiv.value.length);
		        	currentPos += 1;
		        }
		       
		        str = inputDiv.value;
		        if (inputDiv.value.length > 14) {
					document.getElementsByClassName('js-input-data')[0].value = inputDiv.value.substring(0, 14);
				}
		       
		        var fakePos = currentPos;
		        if (fakePos == 2 || currentPos == 5 || currentPos == 8 || currentPos == 11) {
		        	fakePos +=1;
		        } else if (fakePos == inputDiv.value.length) {
		        	fake.innerHTML = '<span class="blink">' + str.substring(0, 1) + '</span>' + str.substring(1, inputDiv.value.length);
		        	fakePos = 1;
		        	return;
		        } 

		        fake.innerHTML = str.substring(0, fakePos) + '<span class="blink">' + str.substring(fakePos, fakePos + 1) + '</span>' + str.substring(fakePos + 1, inputDiv.value.length);

		        var date = parseInt(str.substring(0, 2));
		        var month = parseInt(str.substring(3, 5)) - 1;
		        var year = parseInt('20'+ str.substring(6, 8));
		        var hours = parseInt(str.substring(9, 11));
		        var minutes = parseInt(str.substring(12, str.length));
		      

		        var d = new Date(year, month, date, hours, minutes);

		        if (date != d.getDate() || month != d.getMonth() || year != d.getFullYear() || minutes != d.getMinutes() || hours != d.getHours()) {
		        	outputDiv.innerHTML = '**-**-** **:**';
		        } else {

		        	var timestamp = d.getTime()/1000;
		        	var outputZone = outputData[2];
		        	var inputZone = inputData[2];
		        	var inputOffsetMinutes;
		        	var outputOffsetMinutes;


		        	for (var key in timezones) {
						if (key == inputZone) {
							for (var i = 0; i < timezones[key].length; i++) {
								if (timezones[key][i]['time_start'] < timestamp) {
									inputOffsetMinutes = timezones[key][i]['zone_offset']/60;
									break;
								} else {
									inputOffsetMinutes = 0;
								}
							}
						}

						if (key == outputZone) {
							for (var i = 0; i < timezones[key].length; i++) {
								if (timezones[key][i]['time_start'] < timestamp) {
									outputOffsetMinutes = timezones[key][i]['zone_offset']/60;
									break;
								} else {
									outputOffsetMinutes = 0;
								}
							}
						}
					}

					var time = new Date (d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - inputOffsetMinutes + outputOffsetMinutes);

					var date = addZero(time.getDate());
					var month = addZero(time.getMonth() + 1);
					var year = time.getFullYear().toString().substr(2, 2);
					var hours = addZero(time.getHours());
					var minutes = addZero(time.getMinutes());
					
					outputDiv.innerHTML = date + '-' + month + '-' + year + ' ' + hours + ':' + minutes;

					document.getElementsByClassName('js-input-descr')[0].innerHTML = inputData[0] + '(GMT' + offsetAbbreviation(inputOffsetMinutes) + ')';
					document.getElementsByClassName('js-output-descr')[0].innerHTML = outputData[0] + '(GMT' + offsetAbbreviation(outputOffsetMinutes) + ')';

		        }

		        return;

		    } else if (target.id == 'clear') {

		    	inputDiv.value = '00-00-00 00:00';
		    	outputDiv.innerHTML = '**-**-** **:**';
		    	inputDiv.selectionStart = 9;
		    	inputDiv.selectionEnd = 10;
		    	inputDiv.setSelectionRange(inputDiv.selectionStart, inputDiv.selectionEnd);
		    	currentPos = inputDiv.selectionStart;
		    	str = inputDiv.value;

		    	fake.innerHTML = str.substring(0, inputDiv.selectionStart) + '<span class="blink">' + str.substring(inputDiv.selectionStart, inputDiv.selectionStart + 1) + '</span>' + str.substring(inputDiv.selectionStart + 1, inputDiv.value.length);

		    	return;

		    } else {

		    	target = target.parentNode;
		    }
		}
	}

}