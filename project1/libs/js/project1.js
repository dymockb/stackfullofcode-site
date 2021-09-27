//PROBS: W. SAHARA (ESH), LINE 1865 (can't get capital)

// weather : 
//	chart for avg temp and rain - http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/month/GBR (tas / pr)
//https://www.chartjs.org/docs/latest/
// current temp heatmap & current weather icons

// news:
// articles in accordion

// freedom status: - need to load excel file to server

// local landmarks - show on map

//NEXT - list of layers to remove, call function with select dropdown / home button.  CORRECT text modal error when layers fail.

//check going to russia, fiji and w. sahara

// let amenityClusterMarkers, touristMarkers, shopMarkers, amenityMarkers

// let sliderControl, fijiUpdated, russiaUpdated, layersControl,

//let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
//let collapseList = collapseElementList.map(function (collapseEl) {
//  return new bootstrap.Collapse(collapseEl)
//});

//let previewCounter = 0;
//let poiMarkers = [];


let totalLayers = 8; 
//	*						*						*						*				*					*							*									*
//border, wikipedia, capitalmarker, webcams, airports, citiesLayer, cityCirclesLayer, landmarkClusterMarkers
//(weather layer controlled by toggle)

let selectDropDown;
let layersAdded = 0;
let layerNames = [];
let overlaysObj = {};
let overlaysCounter = 0;
let overlayProbs = 0;
let problemLayers = "";
let layersOnAndOff = [];
let controlsOnAndOff = [];
let charts = 0;
let userISOa3;
let locationPermission = true;

let dropdownList = [];
let weatherOn = false;
let calendarNum = 0;
let flagA2;

let baseLayerName, capitalMarker, timer, currentCountry, selectedCountry, currentCountryPolygons, countryBorders, setMax, heatmapColor;

let selectedCountryLayer, wikiClusterMarkers, webcamClusterMarkers, citiesLayer, cityCirclesLayer, weatherLayer, touristLayer, webcamLayer, shopLayer, weatherEasyButton
//layers defined within functions: capitalMarker

let rainChart, celciusChart, calendar

selectDropDown = document.getElementById("floatSelect");

let l1 = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>',
	//,	 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
	apikey: '9ca86110cb774876b0aa502ba7e84b04',
	maxZoom: 22
});

let l2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
	// &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

let l3 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
	// &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

let mymap = L.map("mapid", {
	worldCopyJump: true,
	zoomControl: false,
	center: [51.505, -0.09],
  zoom: 2,
	layers: [l1],
	maxZoom: 15
});

let baseMaps = {
	"Atlas": l1,
	"Watercolour": l2,
	"Terrain": l3
}

new L.Control.Zoom({
	position: "bottomright"
}).addTo(mymap);

L.easyButton('fa-home', function() {

	if (locationPermission == true) {
		
		if (weatherOn == true) {
		document.getElementById('weatherToggle').click();
		}
		
		switchCountry(layersOnAndOff, controlsOnAndOff);
		displayCountry(userISOa3);
	} else {
		document.getElementById('needLocation').click();					
	}
	
}).addTo(mymap);

L.easyButton('fa-info-circle', function() {
	document.getElementById('infoSym').click();
}).addTo(mymap);

L.easyButton('fa-rss-square', function() {

	document.getElementById('newsArticles').click();
	
}).addTo(mymap);

L.easyButton('fa-temperature-low', function() {
	document.getElementById('weatherBtn').click();
}).addTo(mymap);

L.easyButton('fa-calendar-day', function() {
	document.getElementById('holidayBtn').click();
	$('[data-bs-toggle="tooltip"]').tooltip();
	let openCalendarTimer = setTimeout(function(){

		//these 2 used
		//document.getElementById('clickCalendar').click();
		//$('[data-bs-toggle="tooltip"]').tooltip();	
		
		//$('[data-bs-toggle="popover"]').popover();

  
	
	//var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  //var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  //  return new bootstrap.Popover(popoverTriggerEl)
  //})
	//console.log('ppl',popoverList);
	
		
		clearTimeout(openCalendarTimer);
	},300);
	
}).addTo(mymap);

/*
L.easyButton('fa-cloud-sun', function(e) {
	//document.getElementById('weatherBtn').click();

	console.log(e._currentState);
	if (weatherOn == false) {
		e._currentState.icon.firstChild.setAttribute('style', 'color: #ffd68b');
		for (let i = 0; i < layersOnAndOff.length; i ++) {
			if (layersOnAndOff[i] != selectedCountryLayer) {
				mymap.removeLayer(layersOnAndOff[i]);				
			}

		}
		//#0291c3
		weatherOn = true;
		//document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #ffcd72');
		//this.setAttribute('style', 'color: #ffcd72');
		redrawHeatMap(heatmapData, heatmapColor);
		weatherLayer.addTo(mymap);
	} else {
		weatherOn = false;
		e._currentState.icon.firstChild.setAttribute('style', 'color: #0291c3');
		for (let i = 0; i < layersOnAndOff.length; i ++) {
			if (layersOnAndOff[i] != selectedCountryLayer){
				layersOnAndOff[i].addTo(mymap);
			}
		}		
		let undrawObj = {max: 20, data: []};
		//this.setAttribute('style', 'color: #5a5959'); //#5a5959
		//document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #5a5959'); //#5a5959
		redrawHeatMap(undrawObj, heatmapColor);
		mymap.removeLayer(weatherLayer);
	}
	
}).addTo(mymap);
*/

let cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 1,
  "maxOpacity": 0.8,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count',
	gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '.1': 'white',
    //'.5': 'white',
    '.95': 'red'
  }
};

let heatmapLayer = new HeatmapOverlay(cfg);

let heatmapData = {
	max: 10,
	data: []
};

heatmapLayer.setData(heatmapData);

function redrawHeatMap(heatmapData, color) {
	
	heatmapLayer.addTo(mymap)
	cfg['gradient'] = {'.1' : 'white', '.95': color};
	heatmapLayer._heatmap.configure(cfg);  // call private method but do not changethe original code
	heatmapLayer._reset();
	heatmapLayer.setData(heatmapData);

}

function onLocationFound(e) {
  let radius = e.accuracy;
  let {lat,lng} = e.latlng;
  let mylat = lat;
  let mylng = lng;
	
	$.ajax({
		url: "libs/php/openCage.php",
		type: "POST",
		dataType: "json",
		data: {
			lat: mylat,
			lng: mylng,
		},
		success: function(result) {
			
			userISOa3 = result.data.results[0].components["ISO_3166-1_alpha-3"];
			
			
			let userCountryBounds = result.data.results[0].bounds;
			displayCountry(userISOa3);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
}

function onLocationError(e) {
  console.log(e.message);
	locationPermission = false;

	function recursiveRandom(countriesParam) {
		let randCountry = countryBorders[Math.floor(Math.random()*countryBorders.length)];
		console.log(randCountry);
		console.log('random country: ', randCountry.name, randCountry.A3code);
		if (randCountry.name == 'Kosovo' || randCountry.name == 'N. Cyprus' || randCountry.name == 'Somaliland' || randCountry.A3code == 'ESH'){
			recursiveRandom(countriesParam);
		} else {

			displayCountry(randCountry.A3code);

		};
	}

	recursiveRandom(countryBorders);

}

function addOverlays(overlaysObj) {
	
	//if (layersAdded == totalLayers && overlayProbs == 0) {
	if (layersAdded == totalLayers) {
		let layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
		controlsOnAndOff.push(layersControl);
		
	} else if 
	/*
	(layersAdded == totalLayers && overlayProbs > 0) {
		let layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
		controlsOnAndOff.push(layersControl);
		
		console.log('controls on and off', controlsOnAndOff);
		console.log('layers on and off', layersOnAndOff);
		
		document.getElementById("layerErrorText").innerHTML = problemLayers;
		document.getElementById("dataError").click();
		
	} else if 
	*/
	(overlaysCounter < 30 ){
		
		overlaysCounter++;
		
		let overlayAgain = setTimeout(function () {
			
			addOverlays(overlaysObj);
			clearTimeout(overlayAgain);
		},1500);
		
	} else {
		
		//document.getElementById("layerErrorText").innerHTML = problemLayers;
		document.getElementById("dataError").click();
		throw new Error('API error - reload page');
		
	}

}

function countryBordersFunc(response) {
	
	countryBorders = response;
	
	for (let i = 0; i < countryBorders.length; i++) {
		if (countryBorders[i].A3code != 'ESH'){
			let textValue = countryBorders[i].name;
			let node = document.createElement("option");
			node.innerHTML = textValue;
			//node.setAttribute("value", textValue);
			node.setAttribute("value", countryBorders[i].A3code);		
			//dropdownList.push(textValue);
			//document.getElementById("selectCountries").appendChild(node);
			document.getElementById("floatSelect").appendChild(node);
		}
	}	
	
	mymap.locate().on("locationfound", onLocationFound).on("locationerror", onLocationError);			

} // end of countryBordersFunc

function switchCountry(layersToChange, controlsToChange){
	
	
	document.getElementById('weatherDataLoading').setAttribute('style', 'display: inline');
	//document.getElementById('weatherToggle').setAttribute('style', 'display: none');
	document.getElementById('wrap').innerHTML = "";
	
	calendarNum++;
	
	document.getElementById('listView').checked = true;
	document.getElementById('holidaysError').innerHTML = '';
	document.getElementById('listOfHolidays').innerHTML = '';
	document.getElementById('listOfHolidays').setAttribute('style', 'display: block');
	document.getElementById('calendarFieldset').setAttribute('style', 'display: block');
	let calendarDiv = document.createElement('div');
	let calendarSibling = document.createElement('div');
	calendarDiv.setAttribute('id', `calendar${calendarNum}`);
	calendarDiv.setAttribute('style', 'clear:both');
	
	document.getElementById('wrap').appendChild(calendarDiv);
	document.getElementById('wrap').appendChild(calendarSibling);
	
	//document.getElementById('wrap').innerHTML = `
	//						<div id='calendar${calendarNum}'></div>
	//						<div style='clear:both'></div>`
	
	//document.getElementById('accordion').innerHTML = "";
	document.getElementById('newsDiv').innerHTML = "";
	
	clearTimeout(timer);
	
	for (let s = 0; s < layersToChange.length; s++) {
		mymap.removeLayer(layersOnAndOff[s]);
	}
	for (let c = 0; c < controlsToChange.length; c ++) {
		mymap.removeControl(controlsToChange[c]);
	}
	
	
	layersAdded = 0;
	layerNames = [];
	overlaysObj = {};
	overlayProbs = 0;
	overlaysCounter = 0;
	
	layersOnAndOff = [];
	controlsOnAndOff = [];
	heatmapData.data = [];
	
}

//function abortfunction (string) {
//	console.log('Abort Function - string passed: ',string);
//	document.getElementById("dataError").click();
//	throw new Error('API error - reload page');
//}

function placeBorder(isoa3Code){ // add 2 layers: selectedCountryLayer, wikiClusterMarkers
	
	$.ajax({
		url: "libs/php/getPolygon.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {
						
			let country = result.data;
			let geojsonLayer = L.geoJson(country);
			let bounds = geojsonLayer.getBounds().pad(0.1);
			
//			if (!fijiUpdated) {
				if (isoa3Code == 'FJI') {
					bounds._southWest.lng += 360;
					fijiUpdated = true;
					console.log(bounds);
				}
//			}
//			if (!russiaUpdated) {
				if (isoa3Code == 'RUS') {
					bounds._southWest.lng += 360;
					russiaUpdated = true;
					console.log(bounds);
				}
//			}
				
			let northEast = bounds._northEast;
			let southWest = bounds._southWest;
			
			fitBoundsArr = [];

			let { lat, lng } = northEast;

			fitBoundsArr.push([lat, lng]);

			let corner1 = L.latLng(lat, lng);
			({ lat, lng } = southWest);

			fitBoundsArr.push([lat, lng]);

			let corner2 = L.latLng(lat, lng);
			let viewportBounds = L.latLngBounds(corner1, corner2);
			
	    //currentCountry = result.data["properties"].name;		

			if (result.data["geometry"]["type"] == 'MultiPolygon') {
        currentCountryPolygons = result.data["geometry"]["coordinates"];
      } else {
        currentCountryPolygons = [result.data["geometry"]["coordinates"]];
      }
			

			
			selectedCountryLayer = L.geoJSON();
			
			borderLines = L.geoJSON(country, {
				style: function(feature) {
						return {
							color: 'green',
							fillOpacity: 0
					}
				}
			});

			borderLines.addTo(selectedCountryLayer);
			selectedCountryLayer.addTo(mymap);

			mymap.fitBounds(viewportBounds, {});
			
			overlaysObj['Border'] = selectedCountryLayer;
			layersAdded++;
			layersOnAndOff.push(selectedCountryLayer);
			layerNames.push('selectedCountryLayer');

      document.getElementById("countryModalTitle").innerHTML = currentCountry;			
			getWikipedia(currentCountry, bounds);	
			
			/*
			console.log('2', isoa3Code);
			$.ajax({
				url: "libs/php/freedomHouse.php",
				type: "POST",
				dataType: "json",
				data: {
					countryCode: isoa3Code
				},
				success: function(result) {
					console.log('freedom result:',result);
			
					mymap.flyToBounds(viewportBounds, {
							duration: 1.5
					});
					
					let countryColor;
					let freedomText;
					let freedomClass;
					
					if (result.data.Status == 'F') {
						countryColor = '#04bb04';
						freedomText = 'Free';
						freedomClass = 'free';
					} else if (result.data.Status == 'NF') {
						countryColor = 'red';
						freedomText = 'Not Free'
						freedomClass = 'notFree';
					}	else if (result.data.Status == 'PF') {
						countryColor = 'orange';
						freedomText = 'Partly Free'
						freedomClass = 'partlyFree';
					} else {
						countryColor = 'grey';
						freedomText = 'No freedom data';
						freedomClass = 'nofreedomData'
					}
					
					borderLines = L.geoJSON(country, {
						style: function(feature) {
								return {
									color: countryColor,
									fillOpacity: 0
							}
						}
					});
					
					document.getElementById('freedomInfoNode').setAttribute('class', `fas fa-info-circle ${freedomClass}`);
	
					document.getElementById('countryFreedom').innerHTML = freedomText;
					document.getElementById('countryFreedom').setAttribute('class', `modal-title ${freedomClass}`);
					//document.getElementById('countryFreedom').appendChild(infoNode);

					borderLines.addTo(selectedCountryLayer);
					selectedCountryLayer.addTo(mymap);
					overlaysObj['Border'] = selectedCountryLayer;
					layersAdded++;
					layersOnAndOff.push(selectedCountryLayer);
					layerNames.push('selectedCountryLayer');
					
					getWikipedia(currentCountry, bounds);									
					
				},
				error: function(jqXHR, textStatus, errorThrown) {

					console.log('freedom house error')
					console.log(textStatus);
					console.log(errorThrown);
				}
				}); //end of freedomHouse ajax
				*/
		},
		error: function (jqXHR, textStatus, errorThrown) {
			layersAdded++;
			overlayProbs++;
			console.log('selectedCountryLayer error');
			console.log(textStatus);
			console.log(errorThrown);
			},
	});
	
}

function openCageCapital(capital, isoA2){
	$.ajax({
		url: "libs/php/openCageCapital.php",
		type: "POST",
		dataType: "json",
		data: {
			capital: encodeURI(capital),
			isoA2: isoA2,
		},
		success: function(result) {
			console.log('cage capital', result);
			if (!result.data.results) {
				abortfunction('openCageCapital Error');
			}

			let chooseCities = [];
			let chooseCity;

			function findBestConfidence(listOfCountries) {
				let confidence = 10;
				let selected = listOfCountries[0];
				for (let i = 0; i < listOfCountries.length; i++) {
					if (listOfCountries[i].confidence < confidence) {
						selected = listOfCountries[i];
						confidence = listOfCountries.confidence;
					} else {
						continue
					}
				}
				return selected;
			}

			if (result.data.results.length == 1) {
				chooseCity = result.data.results[0];
			} else {
				for (let i = 0; i < result.data.results.length; i++) {
					if (result.data.results[i].components._type == "city" || result.data.results[i].components.city == capital) {
						chooseCities.push(result.data.results[i]);
					}
				}
				if (chooseCities.length) {
					chooseCity = findBestConfidence(chooseCities);
				} else {
					chooseCity = findBestConfidence(result.data.results);
				}
			}

			let lat = chooseCity.geometry.lat;
			let lng = chooseCity.geometry.lng;
			let capitalPopup = L.popup({autoPan: false, autoClose: false, closeOnClick: false});
			let node = document.createElement("button");
			node.innerHTML = capital;
			node.setAttribute("type", "button");
			node.setAttribute("class", "badge rounded-pill bg-secondary");
			node.setAttribute("data-toggle", "modal");
			node.setAttribute("style", "font-size: 1rem");
			node.setAttribute("data-target", "#viewCountry");
			capitalPopup.setContent(node);
			
			capitalMarkerIcon = L.divIcon({
				className: 'capitalMarkerIcon'
			});
			
			capitalMarker = L.marker([lat, lng], {
				icon: capitalMarkerIcon
			}).bindPopup(capitalPopup);
			
			capitalMarker.getPopup().on('remove', function () {
				mymap.removeLayer(capitalMarker);
			});
			
			capitalMarker.addTo(mymap).openPopup();
			layersAdded++
			layersOnAndOff.push(capitalMarker);
			overlaysObj['Capital'] = capitalMarker;
			
			getTimezone(lat, lng);

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			console.log(errorThrown);
		}
		}); //end of OpenCage  Capital ajax
}

function worldBankInfo(isoa3Code){ //add 1 layer: capital marker, also get unsplash images & timezone
	$.ajax({
	url: "libs/php/worldBankCapital.php",
	type: "POST",
	dataType: "json",
	data: {
		isoA3: isoa3Code
	},
	success: function(result) {
		console.log('world bank result:', result.data);
		let capital = result.data[1][0].capitalCity;
		lat = result.data[1][0].latitude;
		lng = result.data[1][0].longitude;
		let capitalPopup = L.popup({autoPan: false, autoClose: false, closeOnClick: false});
		let node = document.createElement("button");
		node.innerHTML = capital;
		node.setAttribute("type", "button");
		node.setAttribute("class", "badge rounded-pill bg-secondary");
		node.setAttribute("data-toggle", "modal");
		node.setAttribute("style", "font-size: 1rem");
		node.setAttribute("data-target", "#viewCountryModal");
		
		capitalPopup.setContent(node);
		
		capitalMarkerIcon = L.divIcon({
			className: 'capitalMarkerIcon'
		});
		
		capitalMarker = L.marker([lat, lng], {
			icon: capitalMarkerIcon
		}).bindPopup(capitalPopup);
		
		capitalMarker.getPopup().on('remove', function () {
			mymap.removeLayer(capitalMarker);
		});
		
		capitalMarker.addTo(mymap).openPopup();
		layersAdded++;
		layersOnAndOff.push(capitalMarker);
		overlaysObj['Capital'] = capitalMarker;
		layerNames.push('capitalMarker');
		
		document.getElementById("capital").innerHTML = result.data[1][0].capitalCity;
		
		//console.log('get timezone');
		getTimezone(lat, lng);
		
		//let countryName = result.data[1][0].name;
		//unsplashImages(countryName);
		
	},
	error: function(jqXHR, textStatus, errorThrown) {
		layersAdded++;
		let errorLayer = L.layerGroup();
		overlaysObj['Capital (no data)'] = errorLayer;
		layersOnAndOff.push(errorLayer);
		console.log('worldBank capital error')
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of World Bank Capital ajax
}

function unsplashImages(countryName) { //
	
	$.ajax({
	url: "libs/php/unsplashImages.php",
	type: "POST",
	dataType: "json",
	data: {
		qString: countryName
	},
	success: function(result) {
		console.log('images result:',result);

		for (let i = 0; i < result.data.length; i ++) {
			
			let activeImage = i == 0 ? 'active' : '';
			//let activeImage = '';
			let carouselNode = document.createElement('div');
			carouselNode.setAttribute('class', `carousel-item ${activeImage}`);
			let innerNode = document.createElement('div');
			innerNode.setAttribute('class', 'imgSlide newImagesOnly');
			let imgNode = document.createElement('img');
			imgNode.setAttribute('class', 'd-block w-100');
			imgNode.setAttribute('src', result.data[i].img);
			//imgNode.setAttribute('src','https://images.unsplash.com/photo-1486299267070-83823f5448dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNjA4MDh8MHwxfHNlYXJjaHwxfHx1bml0ZWQlMjBraW5nZG9tfGVufDB8fHx8MTYzMjE0NDI4NQ&ixlib=rb-1.2.1&q=80&w=400');
	
			imgNode.setAttribute('alt', 'countryImg');
			innerNode.appendChild(imgNode);
			carouselNode.appendChild(innerNode);
			
			document.getElementById('carouselSlides').appendChild(carouselNode);
		
		}
		
	},
	error: function(jqXHR, textStatus, errorThrown) {

		console.log('unsplash images error')
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of unsplash Images ajax
	
	/*
	`<div class="carousel-item">
						<div class="imgSlide">
							<img class="d-block w-100" src="https://images.unsplash.com/photo-1486299267070-83823f5448dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNjA4MDh8MHwxfHNlYXJjaHwxfHx1bml0ZWQlMjBraW5nZG9tfGVufDB8fHx8MTYzMjE0NDI4NQ&ixlib=rb-1.2.1&q=80&w=400" alt="First slide">
						</div>
					</div>`
	*/	


}

function getWebcams (isoA2code) { // add 1 layer: webcams

		mymap.createPane('webcamPopupPane');
		mymap.getPane('webcamPopupPane').style.zIndex = 600;
		
		$.ajax({
		url: "libs/php/windyWebcams.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoA2code
		},
		success: function (result) {
			
		console.log('webcams', result.data);
		
		if (result.data.length > 0) {
		let webcamMarkers = [];
		for (let r = 0; r < result.data.length; r ++) {
				
			let lat = result.data[r].lat;
			let lng = result.data[r].lng;
			//let webcamPopup = L.popup({autoPan: false, autoClose: false, closeOnClick: false});
			let webcamPopup = L.popup({
				autoPan: true, 
				autoClose: false,
				className: 'wikiPopup',
				pane: 'webcamPopupPane'
				});
			let webcamTooltip = L.tooltip({
				className: 'webcamTooltip',
				sticky: true,
				direction: 'top'
				});
			let node = document.createElement("div");
			node.setAttribute('class', 'tooltipContainer');
			//let node = document.createElement("button");
			//node.setAttribute("type", "button");
			//node.setAttribute("data-toggle", "modal");
			//node.setAttribute("style", "font-size: 1rem");
			//node.setAttribute("data-target", "#webcamModal");
			let previewNode = document.createElement('img');
			previewNode.setAttribute("class", "webcamPreview");
			previewNode.setAttribute('src', result.data[r].thumbnail);
			
			let webcamTitleNode = document.createElement('div');
			webcamTitleNode.setAttribute('class', 'webcamTooltipPara');
			//webcamTitleNode.setAttribute('style', 'overflow-wrap: normal; width: 200px')
			webcamTitleNode.innerHTML = result.data[r].title;

			node.appendChild(webcamTitleNode);
			node.appendChild(previewNode);
			
			webcamTooltip.setContent(node);
			
			let popupWebcamDiv = document.createElement('div');
			
			let popupWebcam = document.createElement('iframe');
			popupWebcam.setAttribute('src', result.data[r].embed);
			
			let popupWebcamTitle = document.createElement('p');
			popupWebcamTitle.setAttribute('class', 'webcamPopupPara');
			popupWebcamTitle.innerHTML = result.data[r].title;
			
			popupWebcamDiv.appendChild(popupWebcamTitle)
			popupWebcamDiv.appendChild(popupWebcam);
			webcamPopup.setContent(popupWebcamDiv);
			
			//webcamMarkerIcon = L.divIcon({	className: 'cursorClass fas fa-video'});
			
			let webcamMarkerIcon = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-video',
			markerColor: 'green-light',
			iconColor: 'white',
			shape: 'square',
			prefix: 'fas',
			//shadowUrl: ''
			//shadowSize: [40, 0]
			});
			
			let tooltip = L.tooltip({
				className: 'wikiPopup cursorClass',
				sticky: true
			});

			//tooltip.setContent(airport.name);

			//let marker = L.marker([airport.lat, airport.lng], {icon: airportMarker}).bindTooltip(tooltip);			
			
			
			webcamMarker = L.marker([lat, lng], {
					icon: webcamMarkerIcon,
					className: 'cursorClass',
				
			//		shadowSize: [40, 0]
			//}).bindPopup(webcamPopup);
			}).bindTooltip(webcamTooltip).bindPopup(webcamPopup);
			
			webcamMarker.on('mouseover', function (e) {
        //this.openPopup();
        });
				
      webcamMarker.on('mouseout', function (e) {
				//this.closePopup();
       });
			 
		
		webcamMarker.on('click', function (e) {
			this.closeTooltip();
		 });

			/*
			webcamMarker.on('click', function (e) {
				document.getElementById('webcamTitle').innerHTML = result.data[r].title;
				document.getElementById('embedWebcam').setAttribute('src', result.data[r].embed);
				document.getElementById('webcamBtn').click();
			
       });
			*/
			webcamMarkers.push(webcamMarker);

		}

		webcamClusterMarkers = L.markerClusterGroup({
			iconCreateFunction: function(cluster) {
				let childCount = cluster.getChildCount();
				let c = ' webcam-marker-cluster-';
				if (childCount < 10) {
					c += 'small';
				} else if (childCount < 100) {
					c += 'medium';
				} else {
					c += 'large';
				}
					
				return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
			},
			showCoverageOnHover: false
		});

		for (let i = 0; i < webcamMarkers.length; i++) {
			webcamClusterMarkers.addLayer(webcamMarkers[i]);
		}
		
			//webcamLayer = L.layerGroup(webcamMarkers);
			//webcamLayer.addTo(mymap);		
			webcamClusterMarkers.addTo(mymap);
			//overlaysObj['Webcams'] = webcamLayer;
			overlaysObj['Webcams'] = webcamClusterMarkers;
			layersAdded++;
			layersOnAndOff.push(webcamClusterMarkers);
		} else {
			overlaysObj['Webcams (no data)'] = L.layerGroup();
			layersAdded++;
		}
	},
	error: function (jqXHR, textStatus, errorThrown) {
		let errorLayer = L.layerGroup;
		overlaysObj['Webcams (no data)'] = errorLayer;
		layersOnAndOff.push(errorLayer);
		layersAdded++;
		overlayProbs++;
		console.log('webcam layer error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 
}

function getGeonamesAirports (isoA2) { // add 1 layer: airportClusterMarkers
										
	$.ajax({
		url: "libs/php/geonamesAirports.php",
		type: "POST",
		dataType: "json",
		data: {
			country: isoA2
		},
	success: function (result) {
				
		let airportMarkers = [];

		let airportMarker = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-plane-departure',
			markerColor: 'cyan',
			iconColor: 'white',
			shape: 'square',
			prefix: 'fas'
		});
		
		for (let iairport = 0; iairport < result.data.geonames.length ; iairport ++) {

			let airport = result.data.geonames[iairport];
			
			let tooltip = L.tooltip({
				className: 'wikiPopup',
				sticky: true
			});

			tooltip.setContent(airport.name);

			let marker = L.marker([airport.lat, airport.lng], {icon: airportMarker}).bindTooltip(tooltip);			
			
			airportMarkers.push(marker);

		}

		airportClusterMarkers = L.markerClusterGroup({
			iconCreateFunction: function(cluster) {
				let childCount = cluster.getChildCount();
				let c = ' airport-marker-cluster-';
				if (childCount < 10) {
					c += 'small';
				} else if (childCount < 100) {
					c += 'medium';
				} else {
					c += 'large';
				}
					
				return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
			},
			showCoverageOnHover: false
		});

		for (let i = 0; i < airportMarkers.length; i++) {
			airportClusterMarkers.addLayer(airportMarkers[i]);
		}
			
		airportClusterMarkers.addTo(mymap);
		overlaysObj['Airports'] = airportClusterMarkers;
		layersAdded++;
		layersOnAndOff.push(airportClusterMarkers);
		layerNames.push('airportClusterMarkers');

	},
	error: function (jqXHR, textStatus, errorThrown) {
		layersAdded++;
		overlayProbs++;
		let errorLayer = L.layerGroup;
		overlaysObj['Airports (no data)'] = errorLayer;
		layersOnAndOff.push(errorLayer);
		console.log('airports error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
}

function getGeonamesCities(isoA2) { // 3 layers added: cityCirclesLayer (and Cities Layer), landmarkClusterMarkers; (weatherLayer created but controlled by toggle)

	$.ajax({
		url: "libs/php/geonamesSearchCities.php",
		type: "POST",
		dataType: "json",
		data: {
			country: isoA2
		},
	success: function (result) {
		
		let citiesMarkers = [];
		let citiesCircles = [];
			
		for (let icity = 0; icity < result.data.length; icity++) {
			let city = result.data[icity];

			let cityTooltip = L.tooltip({
				className: 'wikiPopup',
				sticky: true
			});
			
			/*
			let cityMarker = L.ExtraMarkers.icon({
				icon: 'fa-number',
				markerColor: 'green',
				shape: 'square',
				//prefix: 'fas',
				number: 'A',
				//innerHTML: '<span>what is this</span>',
				shadowSize: [0, 0]
			});
			
			*/

			cityMarker = L.divIcon({
				className: 'cityMarkerStyle cursorClass badge rounded-pill bg-secondary-cm',
				html: city.name
			});
		
			let radius;
			let cityCircle;
			if (city.population) {
				cityTooltip.setContent(city.name + ' - Population: ' + parseInt(city.population).toLocaleString('en-US'));
				radius = city.population/100 > 20000 ? 20000 : city.population/100;	
				cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindTooltip(cityTooltip);
			} else {
				cityTooltip.setContent(city.name + ' - Population unknown'	);
				radius = 200;							
				cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindTooltip(cityTooltip);
			}

			let marker = L.marker([city.lat, city.lng], {icon: cityMarker}).bindTooltip(cityTooltip);
			citiesMarkers.push(marker);
			citiesCircles.push(cityCircle);
		
		} // end of result.data loop
					
		citiesLayer = L.layerGroup(citiesMarkers);
		cityCirclesLayer = L.layerGroup(citiesCircles);
		
		//citiesLayer is added / removed by cityCirclesLayer (don't include layersOnAndOff)
		citiesLayer.addTo(mymap);
		layersAdded++;
		
		cityCirclesLayer.addTo(mymap);
		overlaysObj['Cities'] = cityCirclesLayer;
		layersAdded++;
		layersOnAndOff.push(cityCirclesLayer);
		
		mymap.on('zoomend', function() {
			//zoomCount++;
			if (mymap.hasLayer(cityCirclesLayer)) {
				if (mymap.hasLayer(citiesLayer)) {
					if (mymap.getZoom() >= 7 ) {
						if (baseLayerName != 'Watercolour') {
							mymap.removeLayer(citiesLayer);
						}
					}
				} else {
					if (mymap.getZoom() <=6) {
								citiesLayer.addTo(mymap);
					}
				}
			}																
		});
		
		let slicedCitiesMarkers = [...citiesMarkers];
		
		function getRandom(arr, size) {
			let copy = arr.slice(0), rand = [];
			//for (let i = 0; i < size && i < copy.length; i++) {
			for (let i = 0; i < size; i++) {
				let index = Math.floor(Math.random() * copy.length);
				rand.push(copy.splice(index, 1)[0]);
			}
			return rand;
		}
		
		let maxCities = slicedCitiesMarkers.length < 20 ? slicedCitiesMarkers.length : 20;
		
		let randomMarkers;
		
		if (maxCities < 20) {
			randomMarkers = slicedCitiesMarkers;
		} else {
			randomMarkers = getRandom(slicedCitiesMarkers, maxCities);
		}
				
		landmarkList = [];
		landmarkIDs = [];
		landmarkTypes = [];

		//hereLandmarks(randomMarkers, landmarkIDs, landmarkTypes);
		hereLandmarks(randomMarkers);
		
		let currentWeatherData = [];
		
		function getCurrentWeather(locations) {
			
			if (locations.length > 0) {
				
				document.getElementById("progressBar").setAttribute('style', 'visibility: initial');
				document.getElementById("progressBar").setAttribute('style', `width: ${progressWidth}%;`);
				progressWidth += increment;
				
				let {lat, lng} = locations[0].getLatLng();
				
				$.ajax({
					//url: "libs/php/weatherbitCurrent.php",
					url: "libs/php/openWeather.php",
					type: "POST",
					dataType: "json",
					data: {
						locationLat: lat,
						locationLng: lng,
					},
					success: function(result) {
						
						currentWeatherData.push(result);
						let weatherTimeout = setTimeout(function(){
							getCurrentWeather(locations.slice(1));
							clearTimeout(weatherTimeout);
						},100)

					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('weatherbit error');
						console.log(textStatus);
						console.log(errorThrown);
					}
					}); //end of Weatherbit ajax
			
			} else {
				
				//document.getElementById("progressBar").setAttribute('style', "width: 100%;");

				let progressTimer = setTimeout(function() {
					document.getElementById("progressBar").setAttribute('style', "width: 0%; visibility: hidden");
					document.getElementById('weatherDataLoading').setAttribute('style', 'display: none');
					//document.getElementById('weatherToggle').setAttribute('style', 'display: inherit');
					clearTimeout(progressTimer);
					}, 1000);
				

				//document.getElementById('viewCountryBtn').setAttribute('style', 'display: inherit');

				let maxTemp = -100;				
				for (mt = 0; mt < currentWeatherData.length; mt++) {
						maxTemp = currentWeatherData[mt]['data']['temp'] > maxTemp ? currentWeatherData[mt]['data']['temp'] : maxTemp;
					}

				if (maxTemp < 15 ){
					heatmapData.max = 15;
					heatmapColor = 'blue';
				} else if (maxTemp < 30) {
					heatmapData.max = 30;
					heatmapColor = 'orange';
				} else if (maxTemp < 45) {
					heatmapData.max = 45;
					heatmapColor = 'red';	
				}
									
				let weatherMarkers = []

				for (let hm = 0; hm < currentWeatherData.length; hm ++){
								
					let lat = currentWeatherData[hm]['data']['lat'];
					let lng = currentWeatherData[hm]['data']['lng'];
					let temp = Math.floor(currentWeatherData[hm]['data']['temp']);
										
					let outerNode = document.createElement('div');
					let imgDivNode = document.createElement('div');
					imgDivNode.setAttribute('class','weatherIconNode');

					let imgNode = document.createElement('img');
					imgNode.setAttribute('src', `img/weatherIcons/${currentWeatherData[hm]['data']['icon']}.png`);
					imgNode.setAttribute('class', 'weatherIconImgNode');

					let textNode = document.createElement('div');

					let supNode = document.createElement('sup');
					supNode.innerHTML = 'o';
					
					let span1 = document.createElement('span');
					let span2 = document.createElement('span');
					let span3 = document.createElement('span');
					
					span1.innerHTML = temp;
					
					span2.appendChild(supNode);

					span1.appendChild(span2);
					
					span3.innerHTML = 'C';
					span1.appendChild(span3);
					
					textNode.setAttribute('class', 'weatherIconNode weatherTextNode');
					textNode.appendChild(span1);	

					imgDivNode.appendChild(imgNode);
					outerNode.appendChild(imgDivNode);
					outerNode.appendChild(textNode);

					let	weatherMarker = L.divIcon({
						className: 'weatherMarkerStyle',
						html: outerNode,
						iconSize: [20,20]
					})

					let marker = L.marker([lat, lng], {icon: weatherMarker});
					
					weatherMarkers.push(marker);

					let point = {};

					point['lat'] = lat;
					point['lng'] = lng;

					if (maxTemp < 15 ){
						point['count'] = 15 - temp;
					} else {
						point['count'] = temp;
					}
						
					heatmapData.data.push(point);
					
				}
			


				weatherLayer = L.layerGroup(weatherMarkers);
				
				
				weatherEasyButton = L.easyButton('fa-cloud-sun', function(e) {
					//document.getElementById('weatherBtn').click();

					console.log(e._currentState);
					if (weatherOn == false) {
						e._currentState.icon.firstChild.setAttribute('style', 'color: #ffd68b');
						for (let i = 0; i < layersOnAndOff.length; i ++) {
							if (layersOnAndOff[i] != selectedCountryLayer) {
								mymap.removeLayer(layersOnAndOff[i]);				
							}

						}
						//#0291c3
						weatherOn = true;
						//document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #ffcd72');
						//this.setAttribute('style', 'color: #ffcd72');
						redrawHeatMap(heatmapData, heatmapColor);
						weatherLayer.addTo(mymap);
					} else {
						weatherOn = false;
						e._currentState.icon.firstChild.setAttribute('style', 'color: #0291c3');
						for (let i = 0; i < layersOnAndOff.length; i ++) {
							if (layersOnAndOff[i] != selectedCountryLayer){
								layersOnAndOff[i].addTo(mymap);
							}
						}		
						let undrawObj = {max: 20, data: []};
						//this.setAttribute('style', 'color: #5a5959'); //#5a5959
						//document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #5a5959'); //#5a5959
						redrawHeatMap(undrawObj, heatmapColor);
						mymap.removeLayer(weatherLayer);
					}
					
				});
				
				weatherEasyButton.addTo(mymap);
				
				controlsOnAndOff.push(weatherEasyButton);
				

				//not added here - controlled by toggle
				//weatherLayer.addTo(mymap);
				
				/*
				if (maxTemp < 15) {
					heatmapColor = 'blue';
					
				} else if (maxTemp < 30) {
					heatmapColor = 'orange';							
					
				} else if (maxTemp < 40) {
					heatmapColor = 'red';							
	
				}
			
				*/
				
				}
			
		}
		
		let markersToGet = 15;
		let increment = 100 / markersToGet; 
		let progressWidth = 100 / markersToGet; 
		getCurrentWeather(randomMarkers.slice(0,markersToGet));	
		//getCurrentWeather(randomMarkers);			

	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('geonames search error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	//end of geonames cities
} // end of getGeonames cities functions

function hereLandmarks(markerlist) { // called inside getGeonamesCities. 1 layer added: landmarkClusterMarkers

	if (markerlist.length > 10) {
		
		let { lat, lng } = markerlist[0].getLatLng();
		
		$.ajax({
		url: "libs/php/hereLandmarks.php",
		type: "POST",
		dataType: "json",
		data: {
			markerLat: lat,
			markerLng: lng,
			//lmIDs: landmarkIDs
		},
			success: function (result) {
				
				for (let lm = 0; lm < result.data.length; lm++) {
					landmarkIDs.push(result.data[lm].Location.Name);
					landmarkTypes.push(result.data[lm].Location.LocationType);
					
					if (result.data[lm].Location.LocationType == 'park') {
						let landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-tree',
							prefix: 'fas',
							markerColor: 'green',
							iconColor: 'white',
							shape: 'square'
						});

						let tooltip = L.tooltip({
							className: 'wikiPopup',
							sticky: true
						});
						
						tooltip.setContent(result.data[lm].Location.Name);

						let marker = L.marker([result.data[lm].Location.DisplayPosition.Latitude, result.data[lm].Location.DisplayPosition.Longitude], 
						{icon: landmarkMarker}).bindTooltip(tooltip);

						landmarkList.push(marker);

					} else if (result.data[lm].Location.LocationType == 'hospital') {

						let landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-clinic-medical',
							prefix: 'fas',
							markerColor: 'red',
							iconColor: 'white',
							shape: 'square'
						});						
						
						let tooltip = L.tooltip({
							className: 'wikiPopup',
							sticky: true
						});
						
						tooltip.setContent(result.data[lm].Location.Name);

						let marker = L.marker([result.data[lm].Location.DisplayPosition.Latitude, result.data[lm].Location.DisplayPosition.Longitude], 
						{icon: landmarkMarker}).bindTooltip(tooltip);

						landmarkList.push(marker);
					
					} else if (result.data[lm].Location.LocationType == 'river') {
						
						let landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-water',
							prefix: 'fas',
							markerColor: 'blue',
							iconColor: 'white',
							shape: 'square'
						});	
						
						let tooltip = L.tooltip({
							className: 'wikiPopup',
							sticky: true
						});
						
						tooltip.setContent(result.data[lm].Location.Name);

						let marker = L.marker([result.data[lm].Location.DisplayPosition.Latitude, result.data[lm].Location.DisplayPosition.Longitude], 
						{icon: landmarkMarker}).bindTooltip(tooltip);

						landmarkList.push(marker);
						
					} else if (result.data[lm].Location.LocationType == 'universityCollege') {
						
						let landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-university',
							prefix: 'fas',
							markerColor: 'purple',
							iconColor: 'white',
							shape: 'square'
						});							

						let tooltip = L.tooltip({
							className: 'wikiPopup',
							sticky: true
						});
						
						tooltip.setContent(result.data[lm].Location.Name);

						let marker = L.marker([result.data[lm].Location.DisplayPosition.Latitude, result.data[lm].Location.DisplayPosition.Longitude], 
						{icon: landmarkMarker}).bindTooltip(tooltip);

						landmarkList.push(marker);
					
					} else {
						console.log("NOTHING!!!");
					}
					
				}	
			
					
				hereLandmarks(markerlist.slice(1));
				
			},
			error: function (jqXHR, textStatus, errorThrown) {

				if (landmarkList.length > 0) {
					console.log('landmarks error');
					landmarkClusterMarkers = L.markerClusterGroup({
					iconCreateFunction: function(cluster) {
						let childCount = cluster.getChildCount();
						let c = ' landmark-marker-cluster-';
						if (childCount < 10) {
							c += 'small';
						} else if (childCount < 100) {
							c += 'medium';
						} else {
							c += 'large';
						}

						return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
					},
					showCoverageOnHover: false
				});
				
				for (let i = 0; i < landmarkList.length; i++) {
					landmarkClusterMarkers.addLayer(landmarkList[i]);
				}
				
				landmarkClusterMarkers.addTo(mymap);
				overlaysObj['Landmarks'] = landmarkClusterMarkers;
				layersAdded++;
				layersOnAndOff.push(landmarkClusterMarkers);
				layerNames.push('landmarkClusterMarkers');
					
				} else {
					console.log('landmarks error - no data');
					layersAdded++;
					let errorLayer = L.layerGroup();
					overlaysObj['Landmarks (no data)'] = errorLayer;
					layersOnAndOff.push(errorLayer);

					console.log(textStatus);
					console.log(errorThrown);
				}
			},
		}); // end of hereLandmarks ajax

	} else {
		
					if (landmarkList.length > 0) {
					landmarkClusterMarkers = L.markerClusterGroup({
					iconCreateFunction: function(cluster) {
						let childCount = cluster.getChildCount();
						let c = ' landmark-marker-cluster-';
						if (childCount < 10) {
							c += 'small';
						} else if (childCount < 100) {
							c += 'medium';
						} else {
							c += 'large';
						}

						return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
					},
					showCoverageOnHover: false
				});
				
				for (let i = 0; i < landmarkList.length; i++) {
					landmarkClusterMarkers.addLayer(landmarkList[i]);
				}
				
				landmarkClusterMarkers.addTo(mymap);
				overlaysObj['Landmarks'] = landmarkClusterMarkers;
				layersAdded++;
				layersOnAndOff.push(landmarkClusterMarkers);
				layerNames.push('landmarkClusterMarkers');
					
				} else {
					console.log('landmarks - no data');
					layersAdded++;
					let errorLayer = L.layerGroup();
					overlaysObj['Landmarks (no data)'] = errorLayer;
					layersOnAndOff.push(errorLayer);
				}
		
		/* old contents of else
		landmarkClusterMarkers = L.markerClusterGroup({
		iconCreateFunction: function(cluster) {
			let childCount = cluster.getChildCount();
			let c = ' landmark-marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
		},
		showCoverageOnHover: false
	});
	
	for (let i = 0; i < landmarkList.length; i++) {
		landmarkClusterMarkers.addLayer(landmarkList[i]);
	}
	
	landmarkClusterMarkers.addTo(mymap);
	overlaysObj['Landmarks'] = landmarkClusterMarkers;
	layersAdded++;
	layersOnAndOff.push(landmarkClusterMarkers);
	layerNames.push('landmarkClusterMarkers');
*/
	}
	
}

function getWikipedia (currentCountry, bounds) { // called inside place border add 1 layer: wikiClusterMarkers; 2 x Ajax 
	
		$.ajax({
		url: "libs/php/geonamesWiki.php",
		type: "POST",
		dataType: "json",
		data: {
			country: encodeURI(currentCountry),
			maxRows: '25'
		},
		success: function(result) {
			
			let listOfMarkers = [];
			let listOfTitlesPlace = [];

			let polygons = currentCountryPolygons;
			let newPolygons = []
			for (let p = 0; p < polygons.length; p++) {
				let polygonToEdit = polygons[p][0]
				let updatePolygon = [];
				for (let u = 0; u < polygonToEdit.length; u++) {
					let newPoint = []
					newPoint.push(polygonToEdit[u][1]);
					newPoint.push(polygonToEdit[u][0]);
					updatePolygon.push(newPoint);
				}
				newPolygons.push(updatePolygon);
			}
			for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
				let placeArticle = result.data.geonames[oneArt];
				let wikiurl = 'http://' + `${placeArticle.wikipediaUrl}`;
				let placeTooltip = L.tooltip({
					className: 'wikiPopup',
					sticky: true,
					url: placeArticle.wikipediaUrl
				});

				placeTooltip.setContent(`<span>${placeArticle.title}</br>(Double click to view article)</span>`);
																	
				let wikiMarker = L.ExtraMarkers.icon({
					extraClasses: 'cursorClass',
					icon: 'fa-wikipedia-w',
					markerColor: 'blue',
					iconColor: 'white',
					shape: 'square',
					prefix: 'fab',
					//shadowSize: [40, 0]
				});
																	
				let marker = L.marker([placeArticle.lat, placeArticle.lng], {icon: wikiMarker}).bindTooltip(placeTooltip);
				
				marker.on('dblclick', function(e) {
					
					document.getElementById('targetLink').setAttribute('href', 'http://' + e.target._tooltip.options.url);
					document.getElementById('targetLink').click();
				})
				
				for (let n = 0; n < newPolygons.length; n++) {
					let onePolygon = L.polygon(newPolygons[n]);
					if (onePolygon.contains(marker.getLatLng())) {
						listOfMarkers.push(marker);
						listOfTitlesPlace.push(placeArticle.title);
					}
				}
			}
			
		$.ajax({
			url: "libs/php/geonamesWikibbox.php",
			type: "POST",
			dataType: "json",
			data: {
				north: bounds['_northEast'].lat,
				south: bounds['_southWest'].lat,
				east: bounds['_northEast'].lng,
				west: bounds['_southWest'].lng
			},
			success: function(result) {
				console.log('bbox result', result.data);
				let listOfTitlesbbox = []

				for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
					let article = result.data.geonames[oneArt];
					let wikiurl = `http://${article.wikipediaUrl}`;
					let tooltip = L.tooltip({
						className: 'wikiPopup',
						sticky: true,
						url: article.wikipediaUrl
					});

					tooltip.setContent(`<span>${article.title}</br>(Double click to view article)</span>`);
					
					let wikiMarker = L.ExtraMarkers.icon({
						extraClasses: 'cursorClass',
						icon: 'fa-wikipedia-w',
						markerColor: 'blue',
						iconColor: 'white',
						shape: 'square',
						prefix: 'fab',
						//shadowSize: [40, 0]
					});
					
					let marker = L.marker([article.lat, article.lng], {icon: wikiMarker}).bindTooltip(tooltip);
					
					marker.on('dblclick', function(e) {
						
						document.getElementById('targetLink').setAttribute('href', 'http://' + e.target._tooltip.options.url);
						document.getElementById('targetLink').click();
					})
					
					for (let n = 0; n < newPolygons.length; n++) {
						let onePolygon = L.polygon(newPolygons[n]);
						if (onePolygon.contains(marker.getLatLng())) {
							if (!listOfTitlesPlace.includes(article.title)) {
								if (!listOfTitlesbbox.includes(article.title)) {
									listOfMarkers.push(marker);
									listOfTitlesbbox.push(article.title);
								} 
							} 
						} 
					} 
				} // end of result.data.geonames loop
				
				wikiClusterMarkers = L.markerClusterGroup({
					iconCreateFunction: function(cluster) {
						let childCount = cluster.getChildCount();
						let c = ' wiki-marker-cluster-';
						if (childCount < 10) {
							c += 'small';
						} else if (childCount < 100) {
							c += 'medium';
						} else {
							c += 'large';
						}

						return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
					},
					showCoverageOnHover: false
				});

				for (let i = 0; i < listOfMarkers.length; i++) {
					wikiClusterMarkers.addLayer(listOfMarkers[i]);
				}
				
				//newPolygons = [];
				wikiClusterMarkers.addTo(mymap);
				overlaysObj['Wikipedia Articles'] = wikiClusterMarkers;
				layersAdded++;
				layersOnAndOff.push(wikiClusterMarkers);
				layerNames.push('wikiClusterMarkers');
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				layersAdded++;
				overlayProbs++;
				let errorLayer = L.layerGroup();
				overlaysObj['Wikipedia (no data)'] = errorLayer;
				layersOnAndOff.push(errorLayer);
				console.log('geonamesWikibbox error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		}); //end of geonamesWikibbox
	},
	error: function(jqXHR, textStatus, errorThrown) {
		layersAdded++;
		overlayProbs++;
		let errorLayer = L.layerGroup();
		overlaysObj['Wikipedia (no data)'] = errorLayer;
		layersOnAndOff.push(errorLayer);
		console.log('geonamesWikierror');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of geonamesWiki ajax
	
}



//background functions:

function countryBasics(isoA2){ // add 1 layer: capitalMarker; call getXR & openCageCapital
		$.ajax({
		url: "libs/php/geonamesCountryInfo.php",
		type: "GET",
		dataType: "json",
		data: {
			countryCode: isoA2
		},
		success: function (result) {
			console.log('geonames CountryInfo result',result.data);
			document.getElementById("population").innerHTML = parseInt(result.data.geonames[0].population).toLocaleString('en-US');
			document.getElementById("currency").innerHTML = result.data.geonames[0].currencyCode;
			document.getElementById("population").innerHTML = parseInt(result.data.geonames[0].population).toLocaleString('en-US');
			document.getElementById("currency").innerHTML = result.data.geonames[0].currencyCode;

			
			let currency = result.data.geonames[0].currencyCode;					
			//console.log('isoa2',isoA2);
			openCageCapital(result.data.geonames[0].capital, isoA2);
			
			$.ajax({
				url: "libs/php/oneRestCountry.php",
				type: "GET",
				dataType: "json",
				data: {
					countryCode: isoA2
				},
				success: function (result) {
					console.log('restcountries result',result.data);			
					let nativeName = result.data[0];
					//.name.nativeName.official
					let currencyName = result.data[0].currencies[currency].name;						
					document.getElementById("currencyName").innerHTML = currencyName.length > 0 ? currencyName : '';
					document.getElementById('flagIMG').setAttribute('src', `https://www.countryflags.io/${flagA2}/flat/64.png`);
					
					getXR(currency);
					
					
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log('geonames CountryInfo error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			}); //end of One Rest Country ajax
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('geonames CountryInfo error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	}); //end of geonames ajax

}

function getTimezone (lat,lng) {
	
		$.ajax({
		url: "libs/php/timeZone.php",
		type: "POST",
		dataType: "json",
		data: {
			lat: lat,
			lng: lng,
		},
		success: function(result) {
			
			console.log('timezone result', result.data);
			//document.getElementById('timezone').innerHTML = result.data.timezoneId;
			document.getElementById('localTime').innerHTML = result.data.time.slice(-5);
			
			let timeString = result.data.time.slice(-5);
			
			function startTime(timeString) {
				function checkTime(i) {
					if (i < 10) {
						i = "0" + i;
					} // add zero in front of numbers < 10
					return i;
				}
				let now = new Date();
				let h = parseInt(timeString.slice(0,2));
				let m = parseInt(timeString.slice(3));
				let s = checkTime(now.getSeconds());
											
				let minutesMax = 60;
				let hoursMax = 24;
				
				if (s == '00') {
					if (m == 59) {
						if (h == 23) {
							h = 0;
						} else {
							h+=1
						}
						m = 0;
					} else {
						m+= 1										
					}
				}
					
				let hStr = checkTime(h);
				let mStr = checkTime(m);
				timeString = hStr + ':' + mStr
				
				document.getElementById("localTime").innerHTML = 'Local time: ' + hStr + ":" + mStr + ":" + s;
				timer = setTimeout(function() {
					startTime(timeString);
				}, 1000);
			}
			
			startTime(timeString);
			
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('timezone error');
		console.log(textStatus);
		console.log(errorThrown);
		}
	}); //end of timeZone ajax
	
} 

function getNews(isoA2code) {
	document.getElementById('newsModalTitle').innerHTML = 'Loading news...'
	$.ajax({
		url: "libs/php/newsAPI.php",
		type: "GET",
		dataType: "json",
		data: {
			countryCode: isoA2code
		},
	success: function (result) {
		console.log('news result',result);
				
		let translatedObjs = []
		let countOfArticles = 5;
		
		function createAccordianArticle(oneArt) {
			
			let cardDiv = document.createElement('div');
			

			let bodyDiv = document.createElement('div');
			let sourceDiv = document.createElement('div');
			let linkDiv = document.createElement('a');
			let descDiv = document.createElement('div');
			let imgDiv = document.createElement('img');
			let extLinkIcon = document.createElement('i');
			let imgWrap = document.createElement('a');
			
			descDiv.setAttribute('class', 'news-description');
			extLinkIcon.setAttribute('class', 'fas fa-external-link-alt');
				
			linkDiv.appendChild(extLinkIcon);

			imgWrap.setAttribute('href', oneArt.url);
			imgWrap.setAttribute('target', '_blank');
						
			let titleDiv = document.createElement('div');
			titleDiv.innerHTML = oneArt.title;
			
			linkDiv.setAttribute('href', oneArt.url);
			linkDiv.setAttribute('target', '_blank');
			linkDiv.setAttribute('class', 'newsLink')
			
			descDiv.innerHTML = oneArt.description;
			descDiv.appendChild(linkDiv);	
			
			let articleImg = oneArt.urlToImage == null ? 'img/noImage.png' : oneArt.urlToImage;
			imgDiv.setAttribute('src',articleImg);
			//if (oneArt.urlToImage.includes('noImage')){
			if (oneArt.urlToImage == null){
				imgDiv.setAttribute('style', 'display: none');
			}
			imgDiv.setAttribute('class','newsImage');
			
			imgWrap.appendChild(imgDiv);
			
			let hzRw = document.createElement('hr');
			
			bodyDiv.appendChild(imgWrap);
			bodyDiv.appendChild(titleDiv);

			bodyDiv.appendChild(descDiv);
			bodyDiv.appendChild(hzRw);
			
		
			document.getElementById('newsDiv').appendChild(bodyDiv);
								
		}			
		
		
		function recursiveTranslate(articlesToTranslate) {

			
			if (articlesToTranslate.length > 0) {
				
				document.getElementById('newsProgressBar').setAttribute('style', `width: ${newsProgressIncrement}%`);			
				newsProgressIncrement += newsIncrement
							
				function recursiveContent(content) {
					
					if (content.length > 0) {
						
						let contentObj = content[0];
						
						$.ajax({
						url: "libs/php/translate.php",
						type: "GET",
						dataType: "json",
						data: {
							//text: 'HELLO'
						text: contentObj.text
						},
						success: function (result) {
						
						if (result.data.code == 200) {
						
							if (contentObj.type == 'description') {

									translatedObj['description'] = result.data.translated_text 
									translatedObj['EN_source'] = contentObj.text == result.data.translated_text ? true : false;							
								
							} else if (contentObj.type == 'title') {
								
									translatedObj['title'] = result.data.translated_text 
									translatedObj['EN_source'] = contentObj.text == result.data.translated_text ? true : false;							
								
							}
						
						} else {
							console.log('translate error code', result.data.code);
						}
						
						//translations.push(result);
						let translateTimer = setTimeout(function() {
							recursiveContent(content.slice(1));
							clearTimeout(translateTimer)
						}, 500);


					},
						error: function (jqXHR, textStatus, errorThrown) {
						console.log('translate error');
						console.log(textStatus);
						console.log(errorThrown);
					}
					}); 
					
					} else {
						
						translatedObjs.push(translatedObj);
						if (translatedObjs[0].EN_source == true) {
							console.log('english text');
							for (let c = 0; c < countOfArticles; c++){
								createAccordianArticle(result.data[c]);
								if (c == countOfArticles-1) {
									document.getElementById('newsProgressBar').setAttribute('style', "width: 100%; display: none !important");
									document.getElementById('newsModalTitle').innerHTML = 'Latest News';
								}
							}
						} else {
							document.getElementById('newsModalTitle').innerHTML = 'Translating news...';
							recursiveTranslate(articlesToTranslate.slice(1));
						}
					}
					
				}

				let articleText = articlesToTranslate[0].description;
				let titleText =  articlesToTranslate[0].title;
				
				let content = [
				{
					type: 'description',
					text: articleText
				},
				{
					type: 'title',
					text: titleText
				}
				];
				
				let translatedObj = {};
				translatedObj['url'] = articlesToTranslate[0].url;
				translatedObj['urlToImage'] = articlesToTranslate[0].urlToImage == null ? null : articlesToTranslate[0].urlToImage; // img URL to be updated on tsohost
				translatedObj['source'] = articlesToTranslate[0].source.name;
				
				recursiveContent(content);

				} else {
					
					document.getElementById('newsProgressBar').setAttribute('style', "width: 100%; display: none !important");

					if (translatedObjs.length == 0) {

						document.getElementById('newsModalTitle').innerHTML = 'No articles found for this country.'
							
					} else {
						
						if (translatedObjs[0].EN_source == false) {
							document.getElementById('newsModalTitle').innerHTML = 'Latest News (translated)';
						} else if (translatedObjs[0].EN_source == true){
							document.getElementById('newsModalTitle').innerHTML = 'Latest News';
						}
		
		/*	
		function createAccordianArticle(oneArt, target) {
			
			let cardDiv = document.createElement('div');
			

			let bodyDiv = document.createElement('div');
			let sourceDiv = document.createElement('div');
			let linkDiv = document.createElement('a');
			let descDiv = document.createElement('div');
			let imgDiv = document.createElement('img');
			let extLinkIcon = document.createElement('i');
			let imgWrap = document.createElement('a');
			
			descDiv.setAttribute('class', 'news-description');
			extLinkIcon.setAttribute('class', 'fas fa-external-link-alt');
				
			linkDiv.appendChild(extLinkIcon);

			imgWrap.setAttribute('href', oneArt.url);
			imgWrap.setAttribute('target', '_blank');
						
			let titleDiv = document.createElement('div');
			titleDiv.innerHTML = oneArt.title;
			
			linkDiv.setAttribute('href', oneArt.url);
			linkDiv.setAttribute('target', '_blank');
			linkDiv.setAttribute('class', 'newsLink')
			
			descDiv.innerHTML = oneArt.description;
			descDiv.appendChild(linkDiv);	
			
			imgDiv.setAttribute('src',oneArt.imgURL);
			if (oneArt.imgURL.includes('noImage')){
				imgDiv.setAttribute('style', 'display: none');
			}
			imgDiv.setAttribute('class','newsImage');
			
			imgWrap.appendChild(imgDiv);
			
			let hzRw = document.createElement('hr');
			
			bodyDiv.appendChild(imgWrap);
			bodyDiv.appendChild(titleDiv);

			bodyDiv.appendChild(descDiv);
			bodyDiv.appendChild(hzRw);
			
		
			document.getElementById('newsDiv').appendChild(bodyDiv);
								
		}		
		*/
						
						for (let oneArt = 0; oneArt < translatedObjs.length; oneArt++) {
							
							let fields = ['title', 'description'];
							
							for (let f = 0; f < fields.length; f++) {

								if (!translatedObjs[oneArt][fields[f]]) {
										translatedObjs[oneArt][fields[f]] = '';
									}
								}
							
							createAccordianArticle(translatedObjs[oneArt], oneArt);

						}
					}
		
				}
				
		
		}
		 
		
		
		
		//let countOfArticles = 5;
		let newsProgressIncrement = 100/countOfArticles;
		let newsIncrement = 100/countOfArticles;
		
		recursiveTranslate(result.data.slice(0,countOfArticles));
		
	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('news error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
	
}

function weatherChartRain(isoa3Code) {
	
		$.ajax({
		url: "libs/php/weatherChartRain.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {
									
			let chartData = [];
			let min = result.data[0].data;
			
			for (let c = 0; c < result.data.length; c++) {
				chartData.push(result.data[c].data);
				min = min < result.data[c].data ? min : result.data[c].data;
			}
			
			let ctx = document.getElementById('rainChart').getContext('2d');
			rainChart = new Chart(ctx, {
					type: 'bar',
					data: {
							//labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],							
							labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
							datasets: [{
									label: 'Average Monthly Rainfall (mm)',
									data: chartData,	
									//data: [12, 19, 3, 5, 2, 3],
									backgroundColor: [
											//'rgba(255, 99, 132, 0.2)',
											'rgba(54, 162, 235, 0.2)',
											//'rgba(255, 206, 86, 0.2)',
											//'rgba(75, 192, 192, 0.2)',
											//'rgba(153, 102, 255, 0.2)',
											//'rgba(255, 159, 64, 0.2)'
									],
									borderColor: [
											//'rgba(255, 99, 132, 1)',
											'rgba(54, 162, 235, 1)',
											//'rgba(255, 206, 86, 1)',
											//'rgba(75, 192, 192, 1)',
											//'rgba(153, 102, 255, 1)',
											//'rgba(255, 159, 64, 1)'
									],
									borderWidth: 1
							}]
					},
					options: {
							scales: {
									y: {
											//beginAtZero: true
											min: 0
									}
							}
					}
			});
			charts++;	
		},
		error: function (jqXHR, textStatus, errorThrown) {
				layersAdded++;
				problemLayers += 'Rain';
				overlayProbs++;
				console.log('get weather rain chart error');
				console.log(textStatus);
				console.log(errorThrown);
			},
	});
	
}

function weatherChartCelcius(isoa3Code) {
	
		$.ajax({
		url: "libs/php/weatherChartCelcius.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {
						
			console.log('Celcius chart',result)
			
			let chartData = [];
			let minTemp = 100;
			
			for (let c = 0; c < result.data.length; c++) {
				chartData.push(result.data[c].data);
				minTemp = minTemp < result.data[c].data ? minTemp : result.data[c].data;
			}
			
			let ctx = document.getElementById('celciusChart').getContext('2d');
			celciusChart = new Chart(ctx, {
					type: 'bar',
					data: {
							//labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],						
							labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
							datasets: [{
									label: 'Average Monthly Temperature (Celcius)',
									data: chartData,	
									//data: [12, 19, 3, 5, 2, 3],
									backgroundColor: [
											'rgba(255, 99, 132, 0.2)'
											//'rgba(54, 162, 235, 0.2)',
											//'rgba(255, 206, 86, 0.2)',
											//'rgba(75, 192, 192, 0.2)',
											//'rgba(153, 102, 255, 0.2)',
											//'rgba(255, 159, 64, 0.2)'
									],
									borderColor: [
											'rgba(255, 99, 132, 1)'
											//'rgba(54, 162, 235, 1)',
											//'rgba(255, 206, 86, 1)',
											//'rgba(75, 192, 192, 1)',
											//'rgba(153, 102, 255, 1)',
											//'rgba(255, 159, 64, 1)'
									],
									borderWidth: 1
							}]
					},
					options: {
							scales: {
									y: {
											//beginAtZero: true
											min: minTemp - 3
									}
							}
					}
			});
			charts++;					
		},
		error: function (jqXHR, textStatus, errorThrown) {
				layersAdded++;
				problemLayers += 'Celcius';
				overlayProbs++;
				console.log('get weather celcius chart error');
				console.log(textStatus);
				console.log(errorThrown);
			},
	});
	
}

function getHolidays(isoA2code){
	//https://api.getfestivo.com/v2/holidays?country=GB&year=2020&api_key=c38b1964c079cb2190283574dde8f0d7
	
	let newDate = new Date();
	let year = newDate.getFullYear();
	
	$.ajax({
		url: "libs/php/getHolidays.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoA2code,
			currentYear: year
		},
		success: function (result) {
			console.log('holidays', result.data);			
			if (result.data.status != 404 ) {
				
			
			let holidays = result.data;
			
			let holidayDays = []
			
			let displayYear;
			
			for (let h = 0; h < holidays.length; h++) {
				let holidayObj = {}
				

				holidayObj['title'] = holidays[h].name;
				let y = holidays[h].date.slice(0,4);
					if (h == 0) {
						displayYear = y;
					}
				let m = holidays[h].date.slice(5,7);
				let d = holidays[h].date.slice(8,10);
	
				holidayObj['start'] = new Date(y, m-1, d);
				holidayObj['localName'] = holidays[h].localName == holidays[h].name ? '' : `(${holidays[h].localName})`;
				holidayDays.push(holidayObj);

			}
		
			let holidayTable = document.createElement('table');
			holidayTable.setAttribute('class', 'table');
			let holidayTableHead = document.createElement('thead');
			
			let holidayTableHeadRow = document.createElement('tr');
			
			//let tableHeadings = ['Date', 'Holiday', 'Local name'];
			let tableHeadings = ['Date', 'Holiday'];
			
			for (let t = 0; t < tableHeadings.length; t ++) {
				let tableHeading = document.createElement('th');
				tableHeading.setAttribute('scope', 'col');
				tableHeading.innerHTML = tableHeadings[t];
				holidayTableHeadRow.appendChild(tableHeading);
			}
			
			holidayTableHead.appendChild(holidayTableHeadRow);
			holidayTable.appendChild(holidayTableHead);
			
			let holidayTableBody = document.createElement('tbody');
			
			for (let r = 0; r < holidays.length; r++) {
				let holidayTableBodyRow = document.createElement('tr');

				//let dateData = [holidays[r].date, holidays[r].name, holidays[r].localName];
				let dateData = [new Date(holidays[r].date).toDateString().slice(4), holidays[r].name];
				//let dateData = [holidays[r].date, holidays[r].name];
				for (let d = 0; d < dateData.length; d++){
					if (d == 0) {
						let dateHeading = document.createElement('th');
						dateHeading.setAttribute('scope', 'row');
						dateHeading.innerHTML = dateData[d];
						holidayTableBodyRow.appendChild(dateHeading);
					} else {
						let dateText = document.createElement('td');
						dateText.innerHTML = dateData[d];
						if (holidays[r].name != holidays[r].localName) {
							let localNameInfo = document.createElement('i');
							localNameInfo.setAttribute('class', 'fa fa-info-circle');
							localNameInfo.setAttribute('data-bs-toggle','tooltip');
							localNameInfo.setAttribute('data-bs-placement','bottom');
							localNameInfo.setAttribute('data-bs-original-title', 'Local name: ' + holidays[r].localName);
							localNameInfo.setAttribute('type','button');
							dateText.appendChild(localNameInfo);							
						}
						holidayTableBodyRow.appendChild(dateText);
					}
				}
				holidayTableBody.appendChild(holidayTableBodyRow);
			}
			
			holidayTable.appendChild(holidayTableBody);
			
			document.getElementById('listOfHolidays').appendChild(holidayTable);
			
			/*
			document.getElementById('listOfHolidays').innerHTML = `<table class="table">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Holiday</th>
      <th scope="col">Local name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Sep 1 2021</th>
      <td>Something</td>
			<td>somefing</td>	
    </tr>
    <tr>
      <th scope="row">Sep 2 2021</th>
      <td>Something else text goes on and on and on and on</td>
			<td>somefung</td>	
    </tr>
  </tbody>
</table>`;
			
			*/
			//var date = new Date();
			//var d = date.getDate();
			//var m = date.getMonth();
			//var y = date.getFullYear();

			/*  className colors
			className: default(transparent), important(red), chill(pink), success(green), info(blue)
			*/

			/* initialize the external events

			$('#external-events div.external-event').each(function() {

				// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
				// it doesn't need to have a start or end
				var eventObject = {
					title: $.trim($(this).text()) // use the element's text as the event title
				};

				// store the Event Object in the DOM element so we can get to it later
				$(this).data('eventObject', eventObject);

				// make the event draggable using jQuery UI
				$(this).draggable({
					zIndex: 999,
					revert: true,      // will cause the event to go back to its
					revertDuration: 0  //  original position after the drag
				});

			});
			*/
			
			/* initialize the calendar
			-----------------------------------------------------------------*/

			calendar =  $(`#calendar${calendarNum}`).fullCalendar({
				header: {
					left: 'title',
					center: 'agendaDay,agendaWeek,month',
					right: 'prev,next today'
				},
				editable: false, //was true
				firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
				selectable: false, //was true
				defaultView: 'month',

				axisFormat: 'h:mm',
				columnFormat: {
									month: 'ddd',    // Mon
									week: 'ddd d', // Mon 7
									day: 'dddd M/d',  // Monday 9/7
									agendaDay: 'dddd d'
							},
							titleFormat: {
									month: 'MMMM yyyy', // September 2009
									week: "MMMM yyyy", // September 2009
									day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
							},
				allDaySlot: false,
				selectHelper: true, //was true
				
				/*
				select: function(start, end, allDay) {
					var title = prompt('Event Title:');
					if (title) {
						calendar.fullCalendar('renderEvent',
							{
								title: title,
								start: start,
								end: end,
								allDay: allDay
							},
							true // make the event "stick"
						);
					}
					calendar.fullCalendar('unselect');
				},
				*/
				
				//works when selectable is true
				select: function(start, end, allDay) {
					console.log('something');
				},
				events: holidayDays,				
				droppable: false, // this allows things to be dropped onto the calendar !!!
				
				/*
				drop: function(date, allDay) { // this function is called when something is dropped

					// retrieve the dropped element's stored Event Object
					var originalEventObject = $(this).data('eventObject');

					// we need to copy it, so that multiple events don't have a reference to the same object
					var copiedEventObject = $.extend({}, originalEventObject);

					// assign it the date that was reported
					copiedEventObject.start = date;
					copiedEventObject.allDay = allDay;

					// render the event on the calendar
					// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
					$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

					// is the "remove after drop" checkbox checked?
					if ($('#drop-remove').is(':checked')) {
						// if so, remove the element from the "Draggable Events" list
						$(this).remove();
					}
				},
				*/

				/*
				[
					{
						title: 'All Day Event',
						start: new Date(y, m, 1)
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d-3, 16, 0),
						allDay: false,
						className: 'info'
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d+4, 16, 0),
						allDay: false,
						className: 'info'
					},
					{
						title: 'Meeting',
						start: new Date(y, m, d, 10, 30),
						allDay: false,
						className: 'important'
					},
					{
						title: 'Lunch',
						start: new Date(y, m, d, 12, 0),
						end: new Date(y, m, d, 14, 0),
						allDay: false,
						className: 'important'
					},
					{
						title: 'Birthday Party',
						start: new Date(y, m, d+1, 19, 0),
						end: new Date(y, m, d+1, 22, 30),
						allDay: false,
					},
					{
						title: 'Click for Google',
						start: new Date(y, m, 28),
						end: new Date(y, m, 29),
						url: 'http://google.com/',
						className: 'success'
					}
				],
				*/
			});
			
			} else {
				
				console.log('no holidays found');
				//document.getElementById(`calendar${calendarNum}`).innerHTML = 'No holidays found';
				document.getElementById('calendarFieldset').setAttribute('style', 'display: none');
				document.getElementById('listOfHolidays').setAttribute('style', 'display: none');
				document.getElementById('holidaysError').innerHTML = 'No holidays found';
				
			}			
				
		},
		error: function (jqXHR, textStatus, errorThrown) {
				//layersAdded++;// ONLY ADD LAYER IF LAYER ACTUALLY ADDED
				problemLayers += 'Holidays';
				overlayProbs++;
				console.log('holidays error');
				console.log(textStatus);
				console.log(errorThrown);
			},
	});
}

function getXR(currency){

	$.ajax({
		url: "libs/php/openExchange.php",
		type: "POST",
		dataType: "json",
		data: {
			symbol: currency
		},
		success: function (result) {
			console.log('exchange rate result', result);

			let currency = result.symbol;
			document.getElementById("exchangeRate").innerHTML = result.data[1].toFixed(2) + ' ' + currency + ' = 1 USD';
				
				/*				
				$.ajax({
					url: "libs/php/xrSymbols.php",
					type: "POST",
					dataType: "json",
					data: {
						symbol: currency
					},
					success: function (result) {
						console.log('xr symbols result', result);
						document.getElementById("currencyName").innerHTML = result.data[1].length > 0 ? result.data[1] : '';

					},
					error: function (jqXHR, textStatus, errorThrown) {
						// error code
						console.log('OpenExchange error');
						console.log(textStatus);
						console.log(errorThrown);
					}
					}); // end of xrSymbols ajax	
					*/
		},
		error: function (jqXHR, textStatus, errorThrown) {
			// error code
			console.log('OpenExchange error');
			console.log(textStatus);
			console.log(errorThrown);
		}
	}); // end of OpenExchange ajax			
  
}

function resetSlideShow(){
	document.getElementById('carouselSlides').innerHTML = "";
}


function displayCountry(isoa3Code) {
	addOverlays(overlaysObj);
	resetSlideShow();
	 if (charts > 0) {
		rainChart.destroy();
		celciusChart.destroy(); 
	 }
	
	selectDropDown['value'] = isoa3Code;
	
	//if (typeof capitalMarker == "object") {
  //  capitalMarker.remove();
  //}
	
	//let bounds;
	let isoA2;
	
	for (let io = 0; io < countryBorders.length; io++){
	 if (countryBorders[io].A3code == isoa3Code) {
		 currentCountry = countryBorders[io].name;
		 isoA2 = countryBorders[io].A2code;
		 flagA2 = countryBorders[io].A2code;
	 }
	}
	
	//Add layers:

	placeBorder(isoa3Code);	//2 layers		
	countryBasics(isoA2); //1 layer - opencage capital	
	//worldBankInfo(isoa3Code); //1 layer, also unsplash images and timezone
	getWebcams(isoA2);  // 1 layer
	getGeonamesAirports(isoA2); // 1 layer
	getGeonamesCities(isoA2); //3 layers (cities and cityCirles), also weatherlayer but controlled by toggle


	//Background data
	

	getHolidays(isoA2);
	weatherChartCelcius(isoa3Code);
	weatherChartRain(isoa3Code);
	getNews(isoA2);
	unsplashImages(currentCountry);

} // end of DISPLAY COUNTRY 

//EVENT HANDLERS

selectDropDown.addEventListener("change", function (event) {

	selectedCountry = event.target.value;
	
	if (weatherOn == true) {
		document.getElementById('weatherToggle').click();
	}
	
	switchCountry(layersOnAndOff, controlsOnAndOff);
			
	displayCountry(selectedCountry);
	
}, false)

$('#calendarView').click(function(event){
		//console.log('this',this);
		//console.log('this.value',this.value);	
		//console.log('event',event);
		document.getElementById('listOfHolidays').setAttribute('style', 'display: none');
		document.getElementById(`calendar${calendarNum}`).setAttribute('style', 'display: block');
		document.getElementById('clickCalendar').click();
		$('[data-bs-toggle="tooltip"]').tooltip();
});

$('#listView').click(function(event){
		//console.log('this',this);
		//console.log('this.value',this.value);	
		//console.log('event',event)
		document.getElementById(`calendar${calendarNum}`).setAttribute('style', 'display: none');
		document.getElementById('listOfHolidays').setAttribute('style', 'display: block');
		$('[data-bs-toggle="tooltip"]').tooltip();
});

$('#weatherToggle').click(function (){
		
	if (weatherOn == false) {
		for (let i = 0; i < layersOnAndOff.length; i ++) {
			if (layersOnAndOff[i] != selectedCountryLayer) {
				mymap.removeLayer(layersOnAndOff[i]);				
			}

		}
		//#0291c3
		weatherOn = true;
		document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #ffcd72');
		redrawHeatMap(heatmapData, heatmapColor);
		weatherLayer.addTo(mymap);
	} else {
		weatherOn = false;
		for (let i = 0; i < layersOnAndOff.length; i ++) {
			if (layersOnAndOff[i] != selectedCountryLayer){
				layersOnAndOff[i].addTo(mymap);
			}
		}		
		let undrawObj = {max: 20, data: []};
		document.getElementById('weatherToggleIcon').setAttribute('style', 'color: #5a5959'); //#5a5959
		redrawHeatMap(undrawObj, heatmapColor);
		mymap.removeLayer(weatherLayer);
	}
	
});

	
mymap.on('overlayadd', function(e) {
  if (e.name == 'Capital') {
		capitalMarker.openPopup();
  };
	if (e.name == 'Cities') {
		if (baseLayerName == 'Watercolour') {
			citiesLayer.addTo(mymap);			
		} else if (mymap.getZoom() <= 6){
			citiesLayer.addTo(mymap);
			//layerCheck = 1;
		}
	};
	if (e.name == 'Tourist Spots') {
		if (touristMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No tourist spots were found for this country';
			document.getElementById('emptyLayer').click();
		};
	};
	if (e.name == 'Shops') {
		if (shopMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No shops were found for this country';
			document.getElementById('emptyLayer').click();
		};
	};
	if (e.name == 'Amenities') {
		if (amenityMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No amenities were found for this country';
			document.getElementById('emptyLayer').click();
		};
	};
});

mymap.on('overlayremove', function(e) {
	if (e.name == 'Cities') {
		mymap.removeLayer(citiesLayer);	
	}
});

mymap.on('baselayerchange', function(e) {
	baseLayerName = e.name;
	if (e.name == 'Atlas') {
		if (mymap.hasLayer(citiesLayer)) {
			if (mymap.getZoom() >= 7) {
				mymap.removeLayer(citiesLayer);
			}
		}
	};
	if (e.name == 'Watercolour') {
		if (mymap.hasLayer(cityCirclesLayer)) {
			if (!mymap.hasLayer(citiesLayer)) {
				if (mymap.getZoom() >= 7) {
					citiesLayer.addTo(mymap);
				}
			}
		}
	}
});

window.onload = (event) => {	
	if ($('#preloader').length) {
		$('#preloader').delay(1000).fadeOut('slow', function () {
			$(this).remove();
			console.log("Window loaded", event);
		
			$(document).ready(function () {
				
				/*
				let floatDiv = document.createElement('div');
				floatDiv.setAttribute('id', 'floatDiv');

				let floatSelect = document.createElement('select');
				floatSelect.setAttribute('id', 'floatSelect');
				floatSelect.setAttribute('class', 'form-select');
				floatSelect.setAttribute('name', 'country');

				let floatOptions = document.createElement('option');
				floatOptions.innerHTML = 'Select a country';
				//floatOptions.setAttribute('disabled');
				//floatOptions.setAttribute('selected');
				floatOptions.setAttribute('value', '');
				
				floatSelect.appendChild(floatOptions);	
				
				let formSwitch = document.createElement('div');
				formSwitch.setAttribute('class', 'form-check form-switch');
				formSwitch.setAttribute('style', 'display: flex; align-items: center');
				
				let inputSwitch = document.createElement('input');
				inputSwitch.setAttribute('class', 'form-check-input cursorClass');
				inputSwitch.setAttribute('id', 'weatherToggle22');
				inputSwitch.setAttribute('type', 'checkbox');
				
				formSwitch.appendChild(inputSwitch);
				
				let weatherLoad = document.createElement('div');
				let weatherLoadText = document.createElement('span');
				weatherLoadText.innerHTML = 'Loading...';
				let weatherLoadIcon = document.createElement('i');
				weatherLoadIcon.setAttribute('class', 'fas fa-cloud-sun');
				weatherLoad.appendChild(weatherLoadText);
				weatherLoad.appendChild(weatherLoadIcon);

				//<span id="weatherDataLoading">Loading...</span><i class="fas fa-cloud-sun"></i>
								
				floatDiv.appendChild(floatSelect);				
				floatDiv.appendChild(formSwitch);
				floatDiv.appendChild(weatherLoad);

				document.getElementById('mapid').appendChild(floatDiv);
				
				selectDropDown = document.getElementById("floatSelect");
				
				
				selectDropDown.addEventListener("change", function (event) {

					selectedCountry = event.target.value;
					
					if (weatherOn == true) {
						document.getElementById('weatherToggle').click();
					}
					
					switchCountry(layersOnAndOff, controlsOnAndOff);
							
					displayCountry(selectedCountry);
					
				}, false)
				
				*/
				function recursiveLoad () {
					console.log('load attempt'); 
					 
					$.ajax({
					url: "libs/php/getCountryBorders.php",
					type: "GET",
					dataType: "json",
					data: {},
					success: function (result) {
						
						countryBordersFunc(result.data);
						
					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('country borders error');
							console.log(textStatus);
							console.log(errorThrown);
							let recursiveLoadTimer = setTimeout(function () {
									recursiveLoad();
									clearTimeout(recursiveLoadTimer);
							}, 3000)

						},
					});
				}

				recursiveLoad();
				
			});
		});
	};
} //END OF WINDOW ON LOAD


// UNUSED FUNCS

function geonamesPoiFunc(markerlist) {
		
	if (markerlist.length > 0) {
		
		let { lat, lng } = markerlist[0].getLatLng();
		
		//document.getElementById("viewCountryText").innerHTML = markerlist[0].options.icon.options.html;
		
		$.ajax({
		url: "libs/php/geonamesPOI.php",
		type: "GET",
		dataType: "json",
		data: {
			poilat: lat,
			poilng: lng
		},
			success: function (result) {
																		
				if (result.data.length != 0) {
					for (let ipoi = 0; ipoi < result.data.poi.length; ipoi ++) {
						let onePoi = result.data.poi[ipoi];
						poiMarkers.push(onePoi);
					}
				}
				geonamesPoiFunc(markerlist.slice(1));															
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//document.getElementById('closeFetchingData').click();
				abortfunction('poi error');
				console.log('POI error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		}); // end of geonamesPOI ajax

	} else {
		
		//keep at center ajax
	
		document.getElementById('closeFetchingData').click();
	
		touristMarkers = [];
		shopMarkers = [];
		amenityMarkers = [];
		let amenityTypes = [];
		let poiTypes = []
		
		let touristMarker = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-map',
			markerColor: 'pink',
			shape: 'square',
			prefix: 'far',
			shadowSize: [0, 0]
		});
																														
		let shopMarker = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-shopping-bag',
			markerColor: 'green',
			iconColor: 'white',
			shape: 'square',
			prefix: 'fas',
			shadowSize: [0, 0]
		});
		
		let amenityMarker = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-star',
			markerColor: 'orange',
			iconColor: 'black',
			shape: 'star',
			prefix: 'fas',
			shadowSize: [0, 0]
		});
		
		for (let imarker = 0; imarker < poiMarkers.length; imarker ++) {
			let oneMarker = poiMarkers[imarker];
			if (!poiTypes.includes(oneMarker.typeClass)) {
				poiTypes.push(oneMarker.typeClass);
			};
			if (oneMarker.name != "") {
				if (oneMarker.typeClass == 'tourism') {
					let poiPopup = L.popup({
						className: 'wikiPopup'
					});
					poiPopup.setContent(oneMarker.name);
					let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: touristMarker}).bindPopup(poiPopup);
					touristMarkers.push(poiMarker);																		
				} else if (oneMarker.typeClass == 'shop') {
					let poiPopup = L.popup({
						className: 'wikiPopup'
					});
					poiPopup.setContent(oneMarker.name);
					let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: shopMarker}).bindPopup(poiPopup);
					shopMarkers.push(poiMarker);
				} else if (oneMarker.typeClass == 'amenity'){
					let poiPopup = L.popup({
						className: 'wikiPopup'
					});
					poiPopup.setContent(oneMarker.typeName);
					let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: amenityMarker}).bindPopup(poiPopup);
					amenityMarkers.push(poiMarker);
					if (!amenityTypes.includes(oneMarker.typeName)) {
						amenityTypes.push(oneMarker.typeName);
					}																	
				}
			} else {
				if (oneMarker.typeClass == 'amenity'){
					let poiPopup = L.popup({
						className: 'wikiPopup'
					});
					poiPopup.setContent(oneMarker.typeName);
					let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: amenityMarker}).bindPopup(poiPopup);
					amenityMarkers.push(poiMarker);
					if (!amenityTypes.includes(oneMarker.typeName)) {
						amenityTypes.push(oneMarker.typeName);
					}																	
				}
			}		
		}
	
	
	amenityClusterMarkers = L.markerClusterGroup({
		iconCreateFunction: function(cluster) {
			let childCount = cluster.getChildCount();
			let c = ' amenity-marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
		},
		showCoverageOnHover: false
	});
	
	for (let i = 0; i < amenityMarkers.length; i++) {
		amenityClusterMarkers.addLayer(amenityMarkers[i]);
	}

	touristClusterMarkers = L.markerClusterGroup({
		iconCreateFunction: function(cluster) {
			let childCount = cluster.getChildCount();
			let c = ' tourist-marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
		},
		showCoverageOnHover: false
	});
	
	for (let i = 0; i < touristMarkers.length; i++) {
		touristClusterMarkers.addLayer(touristMarkers[i]);
	}

	shopClusterMarkers = L.markerClusterGroup({
		iconCreateFunction: function(cluster) {
			let childCount = cluster.getChildCount();
			let c = ' shop-marker-cluster-';
			if (childCount < 10) {
				c += 'small';
			} else if (childCount < 100) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'cursorClass marker-cluster' + c, iconSize: new L.Point(40, 40) });
		},
		showCoverageOnHover: false
	});
	
	for (let i = 0; i < shopMarkers.length; i++) {
		shopClusterMarkers.addLayer(shopMarkers[i]);
	}
	
	//mymap.removeControl(layersControl);
	//addOverlays();
	}
}

// weather forecast with heatmap
function addWeatherLayer(listOfCities) {

	let counter = 0;
	
	let allWeatherMarkers = [];
	
	let checklat;
	let checklng;
	
	function recursiveWeather(recursiveList, counter) {
		
		if (counter < 1) {
			
			let { lat, lng } = recursiveList[0].getLatLng();
			
			checklat = lat;
			checklng = lng
			
			console.log('send to php', lat, lng);
			
			counter ++;
			
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

					let weatherMarkers = []
										
					for (let iweather = 0; iweather < result.data.features.length ; iweather ++) {

						let weather = result.data.features[iweather];

						let lat = weather.geometry.coordinates[1];
						let lng = weather.geometry.coordinates[0];
						
						let temp = weather.properties.temp;				

						let weatherMarker = L.divIcon({
							className: 'weatherMarkerStyle ' + weather.properties.icon,
							html: weather.properties.temp + weather.properties.icon,
							iconSize: [40,40],
							iconAnchor: [20,40]
						})
						
						let marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time, temp: weather.properties.temp});

						weatherMarkers.push(marker);

						}
					
					allWeatherMarkers.push(weatherMarkers);
					recursiveWeather(recursiveList.slice(1), counter);

	
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('weatherbit error');
					console.log(textStatus);
					console.log(errorThrown);
				}
				}); //end of Weatherbit ajax
			
			
		} else {
			
				console.log('allWM',allWeatherMarkers);

				let weatherMarkersLayerGroup = L.layerGroup();
		
				for (let t = 0; t < 16 ; t ++) {

					let cityWeatherTimeMarkers = L.layerGroup([], {time: allWeatherMarkers[0][t].options.time});
				
					cityWeatherTimeMarkers['options']['data'] = [];

					for (let a = 0; a < allWeatherMarkers.length; a++) {
						let {lat,lng} = allWeatherMarkers[a][t].getLatLng();
						let instance = {}
						instance['lat'] = lat;
						instance['lng'] = lng;
						instance['count'] = allWeatherMarkers[a][t].options.temp;
						setMax = heatmapData['max'];
						heatmapData['max'] = setMax <= allWeatherMarkers[a][t].options.temp ? allWeatherMarkers[a][t].options.temp : setMax;
						cityWeatherTimeMarkers['options']['maxtemp'] = setMax <= allWeatherMarkers[a][t].options.temp ? allWeatherMarkers[a][t].options.temp : setMax;
					
						cityWeatherTimeMarkers['options']['data'].push(instance);
						cityWeatherTimeMarkers.addLayer(allWeatherMarkers[a][t]);
							
						cityWeatherTimeMarkers.on('add', function (e) {

							let updatedHeat = e.target.options.data;

							if (e.target.options.maxtemp < 25) {
								console.log('max temp less than 25');	
								let color = 'orange';							
								heatmapData['data'] = updatedHeat;
								
							} else if (e.target.options.maxtemp < 35) {
								console.log('max temp less than 35');
								let color = 'red';							
								heatmapData['data'] = updatedHeat;

							}

						})
						cityWeatherTimeMarkers.on('remove', function () {
							console.log('layer removed');
						})
					
					};
					
					weatherMarkersLayerGroup.addLayer(cityWeatherTimeMarkers);
					
					};
					
					console.log('wm3',weatherMarkersLayerGroup);

					let sliderControl = L.control.sliderControl({
						position: "topright", 
						layer: weatherMarkersLayerGroup,
						range: false,
						follow: 1
					});

					//Make sure to add the slider to the map ;-)
					mymap.addControl(sliderControl);
					
					//And initialize the slider
					sliderControl.startSlider();	
					
					console.log('ll', checklat,checklng);
					
		}
	}

	recursiveWeather(listOfCities, counter);
	
}


/* stuff
const bordersOn = document.getElementById("borderToggle");

bordersOn.addEventListener("click", function(e) {
	document.getElementById('startMap').setAttribute('style', 'display: none');
	userLocationMarker.closePopup();
	firstLoad = false;
	if (mymap.hasLayer(invisibleBorders)) {
		mymap.removeLayer(invisibleBorders);
	} else {	
		mymap.addLayer(invisibleBorders);
		if (mymap.getZoom() > 4) {
			mymap.flyTo(mymap.getCenter(), 4);
		}
	}
	if (mapAdviceCount == 0) {
		mapAdviceCount++;
	} else {
		document.getElementById("borderToggle").setAttribute("data-target", "");
	};			
}, false);



$("#backToUser").click(function() {
  clearTimeout(timer);
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const {
        latitude,
        longitude
      } = position.coords;
      $.ajax({
        url: "dist/php/openCage.php",
        type: "POST",
        dataType: "json",
        data: {
          lat: latitude,
          lng: longitude,
        },
        success: function(result) {
          let isoa3Code;
          for (let i = 0; i < countryBorders.length; i++) {
            if (countryBorders[i]["properties"].iso_a3 == result.data.results[0].components["ISO_3166-1_alpha-3"]) {
              isoa3Code = countryBorders[i]["properties"]["iso_a3"];
            }
          }
          mymap.removeLayer(selectedCountryLayer);
          //mymap.removeLayer(wikiLayer);
					mymap.removeLayer(wikiClusterMarkers);
					mymap.removeLayer(citiesLayer);
          mymap.removeControl(layersControl);
          mymap.removeLayer(invisibleBorders);
          displayCountry(isoa3Code);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }, (error) => {
      console.log(error);
      if (error.code == error.PERMISSION_DENIED) console.log("where are you");
      mymap.setView([0, 0], 1);
    });
});

stuff

		// tomtom 
		$.ajax({
		url: "libs/php/tomTomPOI.php",
		type: "POST",
		dataType: "json",
		data: {
			isoa3	: isoa3Code,
			topL: bounds['_northEast'].lat + ',' + bounds['_southWest'].lng,
			btmR: bounds['_southWest'].lat + ',' + bounds['_northEast'].lng
		},
		success: function (result) {
			document.getElementById("loadingText").innerHTML = '';
			
			let listOfPOIMarkers = [];

			for (let poi = 0; poi < result.data.results.length; poi++) {
				let pointOfInterest = result.data.results[poi];
				let poiPopup = L.popup({
					className: 'wikiPopup'
				});
				
				let poiURL;
				if (pointOfInterest.poi.url) {
					poiURL = pointOfInterest.poi.url;
					if (poiURL.includes('http')) {
						poiPopup.setContent('<a href=' + `${poiURL}` + ' target="_blank">' + `${pointOfInterest.poi.name}` + '</a>');																	
					} else {
						poiPopup.setContent('<a href=http://' + `${poiURL}` + ' target="_blank">' + `${pointOfInterest.poi.name}` + '</a>');																	
					}
				} else {
					poiPopup.setContent(pointOfInterest.poi.name);		
				}
				
				let poiMarker = L.ExtraMarkers.icon({
					icon: 'fa-clinic-medical',
					markerColor: 'red',
					shape: 'square',
					prefix: 'fas',
					shadowSize: [0, 0]
				});
																	
				let marker = L.marker([pointOfInterest.position.lat, pointOfInterest.position.lon], {icon: poiMarker}).bindPopup(poiPopup);
				listOfPOIMarkers.push(marker);
				
					}
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
				// error code
				console.log('TomTom error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		}); // end of TOMTOM ajax
					
			let tomTomClusterMarkers = L.markerClusterGroup({
				iconCreateFunction: function(cluster) {
					let childCount = cluster.getChildCount();
					let c = ' tt-marker-cluster-';
					if (childCount < 10) {
						c += 'small';
					} else if (childCount < 100) {
						c += 'medium';
					} else {
						c += 'large';
					}

					return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
				},
				showCoverageOnHover: false
			});
			
			for (let ttm = 0; ttm < listOfPOIMarkers.length; ttm++) {
				tomTomClusterMarkers.addLayer(listOfPOIMarkers[ttm]);
			}
			
		
		
		//} end of else
												 

	 AMADEUS
	
	let amadeusToken;											
	
	$.ajax({
	url: "libs/php/amadeusGetToken.php",
	type: "POST",
	dataType: "json",
	data: {
		//clientID: '7SVuIW48l6YWeFS3jynfwTQeejXf8LXv' ;
		//clientSecret: '4UpXZXJcH6AVk59f'
	},
	success: function (result) {
		console.log(result);
		amadeusToken = result.data.access_token;
		console.log(amadeusToken);
		console.log(
				'box',
				bounds['_northEast'].lat,
				bounds['_southWest'].lat,
				bounds['_northEast'].lng,
				bounds['_southWest'].lng
		)
		
		$.ajax({
			url: "libs/php/amadeusRequest.php",
			type: "GET",
			dataType: "json",
			data: {
				amToken: amadeusToken,
				//north: bounds['_northEast'].lat,
				//south: bounds['_southWest'].lat,
				//east: bounds['_northEast'].lng,
				//west: bounds['_southWest'].lng
				north: 42.081917,
				south: 41.934977,
				east: 2.932138,
				west: 2.767233
			},
			success: function (result) {
				console.log(result);													
			},
			error: function (jqXHR, textStatus, errorThrown) {
					// error code
					console.log('amadeus request error');
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		
	},
	error: function (jqXHR, textStatus, errorThrown) {
			// error code
			console.log('amadeus token error');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	
	 // END OF AMADEUS



$('#startMap').click(function (){
	displayCount++;
	document.getElementById('startMap').setAttribute('style', 'display: none');
	firstLoad = false;
	mymap.flyTo([mylat, mylng], 12, {
		duration: 3
	});
	zoomLocationTimer = setTimeout(function() {
		mymap.flyToBounds(viewportBounds, {
			duration: 3.25
		});
	userLocationMarker.closePopup();
	selectedCountryLayer.addTo(mymap);
	});
	});


OVERPASS CITIES - needs a button to work
$("#showCities").click(function() {
  document.getElementById("loading").innerHTML = 'loading';
  loadingTime(0);
  let executed = false;
  console.log(currentisoA2);
  $.ajax({
    url: "dist/php/overPassCities.php",
    type: "POST",
    dataType: "json",
    data: {
      iso_A2: currentisoA2
    },
    complete: function() {
      document.getElementById("loading").innerHTML = "";
      document.getElementById("loadingTimer").innerHTML = "";
      clearTimeout(loadingTimer);
    },
    success: function(result) {
      console.log('overpass cities', result);														
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    },
  }); //end of overPassCities ajax
});

CLUSTER MARKER STUFF

clusterMarkers = L.markerClusterGroup();

clusterMarkers.addLayer(marker);



CLOCK Functions AND code

let offsetUTC = getOffset(result.data.rawOffset, result.data.dstOffset, result.data.gmtOffset);
startTime(offsetUTC);

function getOffset(rawOffset, dstOffset, gmtOffset) {
  function browserOffset() {
    let browserString = new Date();
    console.log(browserString);
    return browserString.toString().slice(browserString.toString().indexOf("GMT") + 3, browserString.toString().indexOf("GMT") + 8);
  }
  // browser offset hours need to be added or subtracted from offsetfrom Data hours / minutes
  let showBrowserOffset = browserOffset();
  //document.getElementById("browserOffset").innerHTML = showBrowserOffset;
  //document.getElementById("rawOffset").innerHTML = rawOffset;
  //document.getElementById("dstOffset").innerHTML = dstOffset;
  //document.getElementById("gmtOffset").innerHTML = gmtOffset;	
  // offset from Data calc below:
  let adjSym = "+";
  if (rawOffset < 0) {
    adjSym = "-";
    rawOffset *= -1;
  }
  let remainder = rawOffset % 1;
  let adjRaw = rawOffset;
  let offsetString = adjRaw.toString();
  let hours;
  let minutes;
  if (remainder != 0) {
    let rawHours = offsetString.slice(0, offsetString.indexOf("."));
    hours = rawHours.length == 1 ? "0" + rawHours : rawHours;
    minutes = (60 * remainder).toString();
  } else {
    hours = adjRaw.toString().length == 1 ? "0" + adjRaw.toString() : adjRaw.toString();
    minutes = "00";
  }
  offsetUTC = adjSym + hours + minutes;
  //document.getElementById("finalOffset").innerHTML = offsetUTC;	
  return offsetUTC;
}

function startTime(offsetUTC) {
	//console.log('time check');

	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		} // add zero in front of numbers < 10
		return i;
	}

  let now = new Date();
  let year = now.getFullYear();
  let month = checkTime(now.getMonth());
  let date = checkTime(now.getDate());
  let hour = checkTime(now.getHours());
  let minute = checkTime(now.getMinutes());
  let seconds = checkTime(now.getSeconds());
	
	let testOffset = '+0200'

  let today = new Date(
    //`${month} ${date} ${year} ${hour}:${minute}:${seconds} GMT` + offsetUTC
    `${month} ${date} ${year} ${hour}:${minute}:${seconds} GMT` + testOffset		
  );

  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("clock").innerHTML = h + ":" + m + ":" + s;
  timer = setTimeout(function () {
    startTime(offsetUTC);
    //if (timer == 30) {
    //  console.log("browser data string", now);
    //}
  }, 1000);
}



const hoverBorders = document.querySelectorAll('.leaflet-interactive');

hoverBorders.forEach(el => el.addEventListener('click', event => {
  //console.log(event.target.getAttribute("data-el"));
	console.log("wtf");
}));


var marker = L.marker([51.5, -0.09]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

var circle = L.circle([51.508, -0.11], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

mymap.on("click", onMapClick);

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

var geojsonFeature = [
  {
    type: "Feature",
    properties: {
      name: "Coors Field",
      amenity: "Baseball Stadium",
      popupContent: "This is where the Rockies play!",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.99404, 39.75621],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "Another Field",
      amenity: "No Stadium",
      popupContent: "This is where the Rocks play!",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.99502, 39.75725],
      // "coordinates": [39.75725,-104.99502]
    },
  },
];

L.geoJSON(geojsonFeature, {
  onEachFeature: onEachFeature,
}).addTo(selectedCountryLayer);

var markers = L.markerClusterGroup();

var myaddressPoints = [
  // [39.75725,-104.99502, "2"],
  [39.75725, -104.99402, "3"],
  [39.75725, -104.993502, "3A"],
  [39.75725, -104.99202, "1"],
];

for (var i = 0; i < myaddressPoints.length; i++) {
  var a = myaddressPoints[i];
  var title = a[2];
  var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
  marker.bindPopup(title);
  markers.addLayer(marker);
}

mymap.addLayer(markers);

var zoomTo = L.map("zoomto", { scrollWheelZoom: false }).setView(
  [37.8, -96],
  4
);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(zoomTo);

L.easyButton("fa-gbp", function () {
  mymap.setView([55, -2], 4);
}).addTo(mymap);

L.easyButton("fa-jpy", function () {
  mymap.setView([38, 139], 4);
}).addTo(mymap);

L.easyButton("fa-usd", function () {
  mymap.setView([37.8, -96], 3);
}).addTo(mymap);

var redMarker = L.ExtraMarkers.icon({
  icon: "fa-coffee",
  markerColor: "green",
  shape: "square",
  prefix: "fa",
});

L.marker([39.76725, -104.98202], { icon: redMarker }).addTo(mymap);

// Utility functions
function countLayers() {
  let il = 0;
  mymap.eachLayer(function() {
    il += 1;
  });
  return (`Map has ${il} layers.`);
}


let Stamen_TerrainLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});



mymap.on('overlayadd', function(e) {
  if (e.name == 'All Borders') {
    console.log('add', e.name);
    mymap.flyTo(mymap.getCenter(), 4);
    if (usedToggle == false) {
      console.log('add used toggle false')
      toggleBorders.checked = toggleBorders.checked == true ? false : true;
      if (mapAdviceCount == 0) {
        document.getElementById("openMapAdvice").click();
        mapAdviceCount++;
      }
    } else {
      mymap.flyTo(mymap.getCenter(), 4);
      console.log('add usedToggle true')
    }
  } else if (e.name == 'Capital') {
    capitalMarker.openPopup();
  }
});

mymap.on('overlayremove', function(e) {
  if (e.name == 'All Borders') {
    console.log('remove', e.name);
    if (usedToggle == false) {
      console.log('remove usedToggle false')
      toggleBorders.checked = toggleBorders.checked == true ? false : true;
    } else {
      console.log('remove usedToggle true')
    }
  }
});


//https://github.com/CliffCloud/Leaflet.EasyButton

		/*
		$.ajax({
			url: "libs/php/openCageCapital.php",
			type: "POST",
			dataType: "json",
			data: {
				capital: encodeURI(capital),
				isoA2: isoA2,
			},
			success: function(result) {
				console.log('cage capital', result);
				if (!result.data.results) {
					abortfunction('openCageCapital Error');
				}

				let chooseCities = [];
				let chooseCity;

				function findBestConfidence(listOfCountries) {
					let confidence = 10;
					let selected = listOfCountries[0];
					for (let i = 0; i < listOfCountries.length; i++) {
						if (listOfCountries[i].confidence < confidence) {
							selected = listOfCountries[i];
							confidence = listOfCountries.confidence;
						} else {
							continue
						}
					}
					return selected;
				}

				if (result.data.results.length == 1) {
					chooseCity = result.data.results[0];
				} else {
					for (let i = 0; i < result.data.results.length; i++) {
						if (result.data.results[i].components._type == "city" || result.data.results[i].components.city == capital) {
							chooseCities.push(result.data.results[i]);
						}
					}
					if (chooseCities.length) {
						chooseCity = findBestConfidence(chooseCities);
					} else {
						chooseCity = findBestConfidence(result.data.results);
					}
				}

				lat = chooseCity.geometry.lat;
				lng = chooseCity.geometry.lng;
				let capitalPopup = L.popup({autoPan: false, autoClose: false, closeOnClick: false});
				let node = document.createElement("button");
				node.innerHTML = capital;
				node.setAttribute("type", "button");
				node.setAttribute("class", "badge rounded-pill bg-secondary");
				node.setAttribute("data-toggle", "modal");
				node.setAttribute("style", "font-size: 1rem");
				node.setAttribute("data-target", "#viewCountry");
				capitalPopup.setContent(node);
				
				capitalMarkerIcon = L.divIcon({
					className: 'capitalMarkerIcon'
				});
				
				capitalMarker = L.marker([lat, lng], {
					icon: capitalMarkerIcon
				}).bindPopup(capitalPopup);
				
				capitalMarker.getPopup().on('remove', function () {
					mymap.removeLayer(capitalMarker);
				});
				
				capitalMarker.addTo(mymap).openPopup();
				
				getWeather(lat, lng);
				getTimezone(lat, lng);
				getWikipedia(currentCountry, bounds);
				getGeonamesCities(isoA2);
				getGeonamesAirports(isoA2);
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}
			}); //end of OpenCage  Capital ajax
			

/* // A NEWS ACCORDION ARTICLE
cardDiv.innerHTML = 
`<div class="card-header" id="headingOne">
	<h5 class="mb-0">
	
		<button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapse${target}" aria-expanded="false" aria-controls="collapseOne">
			${oneArt.title}
		</button>
	</h5>
</div>

<div id="collapse${target}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
	<div class="card-body">
	<div>Source: <a href="${oneArt.url}" target="_blank">${oneArt.source}</a></div>
	<div>${oneArt.description}</div>
	<img src="${oneArt.imgURL}" class="newsImage"/>
	</div>
</div>`;


	
QUESTIONS:

Is there a better way to find capital city location (another API?, instead of checking opencage for confidence etc)

THOUGHTS

learn about recursion and leakage making a clock
hanging questions / not perfection eg. ajax jqXHR, not sure what it is
*/