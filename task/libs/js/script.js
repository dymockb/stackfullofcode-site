$('#btnRun').click(function() {

	$.ajax({
		url: "libs/php/getCountryInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#selCountry').val(),
			lang: $('#selLanguage').val()
		},
		success: function(result) {

			//console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtContinent').html('Continent: ' + result['data'][0]['continent']);
				$('#txtCapital').html('Capital: ' + result['data'][0]['capital']);
				$('#txtLanguages').html('Languages: ' + result['data'][0]['languages']);
				$('#txtPopulation').html('Population: ' + result['data'][0]['population']);
				$('#txtArea').html('Area: ' + result['data'][0]['areaInSqKm']);

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 

});

$('#btn2Run').click(function() {

	$.ajax({
		url: "libs/php/getNeighbours.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#selCountry2').val(),
		},
		success: function(result) {

			if (result.status.name == "ok") {

				$('#txtContinent2').html('Total Neighbours: ' + result['totNeighbours']);
				for (let x in Object.keys(result['data'])) {
					let textValue = result['data'][x]['countryName'];
					let node = document.createElement("p");
					node.innerHTML = textValue;
					let textNode = document.createTextNode(textValue);
					document.getElementById('txtContinent2').appendChild(node);
				}				
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 
});

$('#btn3Run').click(function() {
	
	$.ajax({
		url: "libs/php/getTimezone.php",
		type: 'POST',
		dataType: 'json',
		data: {
			latitude: $('#latitude').val(),
			longitude: $('#longitude').val()
		},
		success: function(result) {

			if (result.status.name == "ok") {

				console.log(result['data']);

				if (typeof(result['data']['timezoneId']) == "undefined") {
					$('#txtTimezone').html('Timezone ID: No results, please adjust lat/long');
					$('#txtCurrentTime').html('Current Time: No results, please adjust lat/long');
				} else {
					$('#txtTimezone').html('Timezone ID: ' + result['data']['timezoneId']);
					$('#txtCurrentTime').html('Current Time: ' + result['data']['time']);
				}
				//for (let x in Object.keys(result['data'])) {
				//	let textValue = result['data'][x]['countryName'];
				//	let node = document.createElement("p");
				//	node.innerHTML = textValue;
				//	let textNode = document.createTextNode(textValue);
				//	document.getElementById('txtContinent2').appendChild(node);
				// } 				
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 
});