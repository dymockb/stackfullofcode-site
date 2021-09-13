function getRecursiveWeather (lat, lng) {
	let weatherMarkers0 = [];
	let weatherMarkers1 = [];
	
	$.ajax({
	url: "libs/php/weatherbit16Day.php",
	type: "POST",
	dataType: "json",
	data: {
		locationLat: lat,
		locationLng: lng,
	},
	success: function(result) {
		console.log('weather', result.data);
		//if (!result.data.current) {
		//if (!result['status'].description == 'success') {
		//	abortfunction('openWeather Error');
		//}
		//let weatherDescription = result.data.current.weather[0].description;
		//document.getElementById("currentWeather").innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);	
		let lat;
		let lng;
		let temp;
		let weatherMarker;
		let popup;
		let marker;
		
		for (let w=0; w < 2; w ++) {
		console.log(w);
		for (let iweather = 0; iweather < result.data.features.length ; iweather ++) {

			let weather = result.data.features[iweather];
			if (w==0) {
				lat = weather.geometry.coordinates[1];
				lng = weather.geometry.coordinates[0];
				temp = weather.properties.temp;				
				popup = L.popup({
					className: 'wikiPopup'
				});

				popup.setContent('weather');

				weatherMarker = L.divIcon({
					className: 'weatherMarkerStyle',
					html: weather.properties.temp
				})
				
				marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time}).bindPopup(popup);			
				//
				weatherMarkers0.push(marker);
			
			} else {
				
				lat = 51;
				lng = 1;
				
				temp = weather.properties.temp;
				popup = L.popup({
					className: 'wikiPopup'
				});

				popup.setContent('weather');

				weatherMarker = L.divIcon({
					className: 'weatherMarkerStyle',
					html: weather.properties.temp
				})
				
				marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time}).bindPopup(popup);	
				//
				weatherMarkers1.push(marker);
			
			}
			
		}
		}
		
		console.log('wm0',weatherMarkers0);
		console.log('wm1',weatherMarkers1);
		
		let weatherMarkers3 = L.layerGroup();
		
		for (let l = 0; l < weatherMarkers0.length; l ++) {
			if (l==0) {
				console.log('time', weatherMarkers0[l].options.time);
			}
			let cityWeatherMarkers = L.layerGroup([],{time: weatherMarkers0[l].options.time});
			cityWeatherMarkers.addLayer(weatherMarkers0[l]);
			cityWeatherMarkers.addLayer(weatherMarkers1[l]);
			weatherMarkers3.addLayer(cityWeatherMarkers);
		}
		
		console.log('wm3',weatherMarkers3);
		//let allWeatherMarkers = weatherMarkers0.concat(weatherMarkers1);
		let weatherlayerGroup = weatherMarkers3;
		
		//console.log('jsontest',jsontest);
		//let testlayer = L.geoJson(jsontest);
		//let weatherlayer = L.geoJson(result.data);
		let sliderControl = L.control.sliderControl({
			position: "topright", 
			//layer: testlayer,
			layer: weatherlayerGroup,
			range: false,
			follow: 1
		});

		//Make sure to add the slider to the map ;-)
		mymap.addControl(sliderControl);
		
		//And initialize the slider
		sliderControl.startSlider();			
		
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('OpenWeather error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of Weatherbit ajax
}

function getWeather (lat, lng) {
	let weatherMarkers0 = [];
	let weatherMarkers1 = [];
	
	$.ajax({
	url: "libs/php/weatherbit16Day.php",
	type: "POST",
	dataType: "json",
	data: {
		locationLat: lat,
		locationLng: lng,
	},
	success: function(result) {
		console.log('weather', result.data);
		//if (!result.data.current) {
		//if (!result['status'].description == 'success') {
		//	abortfunction('openWeather Error');
		//}
		//let weatherDescription = result.data.current.weather[0].description;
		//document.getElementById("currentWeather").innerHTML = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);	
		let lat;
		let lng;
		let temp;
		let weatherMarker;
		let popup;
		let marker;
		
		for (let w=0; w < 2; w ++) {
		console.log(w);
		for (let iweather = 0; iweather < result.data.features.length ; iweather ++) {

			let weather = result.data.features[iweather];
			if (w==0) {
				lat = weather.geometry.coordinates[1];
				lng = weather.geometry.coordinates[0];
				temp = weather.properties.temp;				
				popup = L.popup({
					className: 'wikiPopup'
				});

				popup.setContent('weather');

				weatherMarker = L.divIcon({
					className: 'weatherMarkerStyle',
					html: weather.properties.temp
				})
				
				marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time}).bindPopup(popup);			
				//
				weatherMarkers0.push(marker);
			
			} else {
				
				lat = 51;
				lng = 1;
				
				temp = weather.properties.temp;
				popup = L.popup({
					className: 'wikiPopup'
				});

				popup.setContent('weather');

				weatherMarker = L.divIcon({
					className: 'weatherMarkerStyle',
					html: weather.properties.temp
				})
				
				marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time}).bindPopup(popup);	
				//
				weatherMarkers1.push(marker);
			
			}
			
		}
		}
		
		console.log('wm0',weatherMarkers0);
		console.log('wm1',weatherMarkers1);
		
		let weatherMarkers3 = L.layerGroup();
		
		for (let l = 0; l < weatherMarkers0.length; l ++) {
			if (l==0) {
				console.log('time', weatherMarkers0[l].options.time);
			}
			let cityWeatherMarkers = L.layerGroup([],{time: weatherMarkers0[l].options.time});
			cityWeatherMarkers.addLayer(weatherMarkers0[l]);
			cityWeatherMarkers.addLayer(weatherMarkers1[l]);
			weatherMarkers3.addLayer(cityWeatherMarkers);
		}
		
		console.log('wm3',weatherMarkers3);
		//let allWeatherMarkers = weatherMarkers0.concat(weatherMarkers1);
		let weatherlayerGroup = weatherMarkers3;
		
		//console.log('jsontest',jsontest);
		//let testlayer = L.geoJson(jsontest);
		//let weatherlayer = L.geoJson(result.data);
		sliderControl = L.Control.sliderControl({
			position: "topright", 
			//layer: testlayer,
			layer: weatherlayerGroup,
			range: false,
			follow: 1
		});

		//Make sure to add the slider to the map ;-)
		mymap.addControl(sliderControl);
		
		//And initialize the slider
		sliderControl.startSlider();			
		
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('OpenWeather error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of Weatherbit ajax
}