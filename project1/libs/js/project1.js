//#sourceMappingURL=bootstrap/css/bootstrap-grid.css.map
//#sourceMappingURL=bootstrap/js/bootstrap.bundle.min.js.map
//#sourceMappingURL=bootstrap/js/bootstrap.min.js.map

//global variables

// weather : 
//	chart for avg temp and rain - http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/month/GBR (tas / pr)
//https://www.chartjs.org/docs/latest/
// current temp heatmap & current weather icons

// news:
// articles in accordion

// freedom status: - need to load excel file to server

// local landmarks - show on map

//NEXT - list of layers to remove, call function with select dropdown / home button.

let firstLoad = true;
let showToast = false;
let displayCount = 0;
const countriesList = [];
const regions = [];
let mapAdviceCount = 0;
let toggleStatus = false
let usedToggle = false
let toggleBorders = document.getElementById('borderToggle');
let selectedCountryLayer = L.geoJSON();
let dropdownList = [];
let cityNamesRemovedByUser = true;
let userFound = true;
let previewCounter = 0;
let poiMarkers = [];
let layersAdded = 0;
let layerNames = [];
let overlaysObj = {};
let overlaysCounter = 0;
let overlayProbs = 0;
let problemLayers = "";

let landmarkList = [];
let landmarkIDs = [];
let landmarkTypes = [];
let landmarkMarker;

//userLocationMarker,
let baseLayerName, mylat, mylng, capitalMarker, timer, zoomLocationTimer, recursiveLoadTimer, allRestCountries, myBounds, currentCountry, selectedCountry, currentCountryPolygons, layersControl, sliderControl, fijiUpdated, russiaUpdated, invisibleBorders, wikiLayer, wikiClusterMarkers, citiesLayer, cityCirclesLayer, touristLayer, webcamLayer, shopLayer, amenityClusterMarkers, userPopup, corner1, corner2, viewportBounds, userCircle, overlays, touristMarkers, shopMarkers, amenityMarkers, countryBorders

let loadingTimer;
let loadingCount = 0
let stopLoadingCount = false

let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
let collapseList = collapseElementList.map(function (collapseEl) {
  return new bootstrap.Collapse(collapseEl)
});

const selectDropDown = document.getElementById("selectCountries");
const testE = document.getElementById("viewCountryBtn");

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
	"Watercolour": l2
}

new L.Control.Zoom({
	position: "bottomright"
}).addTo(mymap);


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

let setMax;

let heatmapData = {
	max: 10,
	data: []
};

function redrawHeatMap(heatmapData, color) {
	console.log(heatmapData);
	//mymap.removeLayer(heatmapLayer);
	//heatmapLayer = new HeatmapOverlay(cfg);
	cfg['gradient'] = {'.1' : 'white', '.95': color};
	heatmapLayer._heatmap.configure(cfg);  // call private method but do not changethe original code
	heatmapLayer._reset();
	heatmapLayer.setData(heatmapData);
}

let heatmapLayer = new HeatmapOverlay(cfg);
heatmapLayer.setData(heatmapData);
//heatmapLayer.addTo(mymap)

function onLocationFound(e) {
  let radius = e.accuracy;
  let {lat,lng} = e.latlng;
  mylat = lat;
  mylng = lng;
	console.log('mylat', mylat, 'mylng', mylng);

	$.ajax({
		url: "libs/php/openCage.php",
		type: "POST",
		dataType: "json",
		data: {
			lat: mylat,
			lng: mylng,
		},
		success: function(result) {
			console.log(result);
			console.log('oc', result.data.results[0].components['ISO_3166-1_alpha-3']);
			let isoa3Code = result.data.results[0].components["ISO_3166-1_alpha-3"];
			console.log(isoa3Code);
			let userCountryBounds = result.data.results[0].bounds;
			displayCountry(isoa3Code,userCountryBounds);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
}

function onLocationError(e) {
	userFound = false;
  console.log(e.message);
	console.log('cb', countryBorders);
	
	function recursiveRandom(countriesParam) {
		let randCountry = countryBorders[Math.floor(Math.random()*countryBorders.length)];		
		console.log('random country: ', randCountry.name, randCountry.code);
		if (randCountry.name == 'Kosovo' || randCountry.name == 'N. Cyprus' || randCountry.name == 'Somaliland'){
			recursiveRandom(countriesParam);
		} else {
			displayCountry(randCountry.code);
		};
	}

	recursiveRandom(countryBorders);

}

function abortfunction (string) {
	console.log(string);
	document.getElementById("viewCountryText").innerHTML = 'Data error - please refresh the page';
	document.getElementById("dataError").click();
	throw new Error('API error - reload page');
}

L.easyButton('fa-home', function() {
	clearTimeout(timer);
	if (firstLoad == true) {
		firstLoad = false;
	}
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const {
				latitude,
				longitude
			} = position.coords;
			$.ajax({
				url: "libs/php/openCage.php",
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
							let countryName = countryBorders[i]['properties']['name'];
							for (let icountry = 0; icountry < dropdownList.length; icountry++) {
								if (dropdownList[icountry].includes(countryName)) {
									selectedCountry = dropdownList[icountry];
								}
							}
						}
					}
					mymap.removeLayer(selectedCountryLayer);
					//mymap.removeLayer(invisibleBorders);
					mymap.removeLayer(wikiClusterMarkers);
					mymap.removeLayer(citiesLayer);
					mymap.removeLayer(cityCirclesLayer);
					mymap.removeLayer(touristClusterMarkers);
					mymap.removeLayer(shopClusterMarkers);
					mymap.removeLayer(amenityClusterMarkers);
					mymap.removeControl(layersControl);
					//if (mymap.hasLayer(invisibleBorders)) {
					//	document.getElementById('borderToggle').click();
					//}
					document.getElementById('selectCountries').value = selectedCountry;
					displayCountry(isoa3Code);
					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
		}, (error) => {
			/*
			function handlePermission() {
				
				navigator.permissions.query({name:'geolocation'}).then(function(result) {
					if (result.state == 'granted') {
						report(result.state);
					} else if (result.state == 'prompt') {
						report(result.state);
						navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
					} else if (result.state == 'denied') {
						report(result.state);
					}
					result.onchange = function() {
						report(result.state);
					}
				});
			}

			function report(state) {
				console.log('Permission ' + state);
			}

			handlePermission();
			
			*/
			console.log(error);
			
			if (error.code == error.PERMISSION_DENIED) console.log("where are you");
			document.getElementById('needLocation').click();
		});
}).addTo(mymap);

L.easyButton('fa-info-circle', function() {
	document.getElementById('infoSym').click();
}).addTo(mymap);

L.easyButton('fa-rss-square', function() {

	document.getElementById('newsArticles').click();
	
}).addTo(mymap);


//https://github.com/Hipo/university-domains-list-api
//https://developer.flightstats.com/products
//airports

function addWeatherLayer(listOfCities) {
	//console.log(listOfCities);
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
					let weatherMarkers = []
					
					for (let iweather = 0; iweather < result.data.features.length ; iweather ++) {

						let weather = result.data.features[iweather];

							lat = weather.geometry.coordinates[1];
							lng = weather.geometry.coordinates[0];
							
							temp = weather.properties.temp;				
							//popup = L.popup({
							//	className: 'wikiPopup'
							//});

							//popup.setContent('weather');

							weatherMarker = L.divIcon({
								className: 'weatherMarkerStyle ' + weather.properties.icon,
								html: weather.properties.temp + weather.properties.icon,
								iconSize: [40,40],
								iconAnchor: [20,40]
								//+ ' <img src="img/weatherIcons/' + weather.properties.icon + '.png"></img>'
							})
							
							marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time, temp: weather.properties.temp});
							//.bindPopup(popup);			
							//
							weatherMarkers.push(marker);

						}
			
			
//heatmapData = {
//	max: 8,
//	data: [{lat: checklat, lng: checklng, count: 8}]
//};	
			
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

/*
				let container = {};
				
							let {lat,lng} = allWeatherMarkers[a][t].getLatLng();
						
						console.log('a weather marker', allWeatherMarkers[a][t], lat, lng);

						let addItems = {};
						
						addItems['lat'] = lat;
						addItems['lng'] = lng;
						addItems['count'] = allWeatherMarkers[a][t].options.temp;
						
						instance.push(addItems);
					
					
					container['data'] = instance;
					
									heatlist.push(container);
				
				console.log('heatlist', heatlist);
				console.log('container', container);
					
					//heatmapData = {
//	max: 8,
//	data: [{lat: checklat, lng: checklng, count: 8}]
//};	
					
	*/				
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
							//console.log('hmdata',heatmapData);
							//console.log('has heatmp', mymap.hasLayer(heatmapLayer));
							//console.log('layer added', e.target.options);
							let updatedHeat = e.target.options.data;
							//console.log('updatedheat', updatedHeat);
							if (e.target.options.maxtemp < 25) {
								console.log('max temp less than 25');	
								let color = 'orange';							
								heatmapData['data'] = updatedHeat;
								redrawHeatMap(heatmapData, color);
								
							} else if (e.target.options.maxtemp < 35) {
								console.log('max temp less than 35');
								let color = 'red';							
								heatmapData['data'] = updatedHeat;
								redrawHeatMap(heatmapData, color);
							}

						})
						cityWeatherTimeMarkers.on('remove', function () {
							console.log('layer removed');
						})
					
					};
					
					weatherMarkersLayerGroup.addLayer(cityWeatherTimeMarkers);
					
					};

				
				
									/*	
				for (let a = 0; a < allWeatherMarkers.length; a++) {

					for (let l = 0; l < allWeatherMarkers[a].length; l++) {
							if (l==0) {
								console.log('time', weatherMarkers0[l].options.time);
							}
							let cityWeatherMarkers = L.layerGroup([],{time: weatherMarkers0[l].options.time});
							cityWeatherMarkers.addLayer(weatherMarkers0[l]);
							cityWeatherMarkers.addLayer(weatherMarkers1[l]);
							weatherMarkersLayerGroup.addLayer(cityWeatherMarkers);
						}
						
				}
					*/
					
					console.log('wm3',weatherMarkersLayerGroup);
					//let allWeatherMarkers = weatherMarkers0.concat(weatherMarkers1);
					//let weatherlayerGroup = weatherMarkersLayerGroup;
					
					//console.log('jsontest',jsontest);
					//let testlayer = L.geoJson(jsontest);
					//let weatherlayer = L.geoJson(result.data);
					let sliderControl = L.control.sliderControl({
						position: "topright", 
						//layer: testlayer,
						layer: weatherMarkersLayerGroup,
						range: false,
						follow: 1
					});

					//Make sure to add the slider to the map ;-)
					mymap.addControl(sliderControl);
					
					//And initialize the slider
					sliderControl.startSlider();	
					
					console.log('ll', checklat,checklng);
					//let heat = L.heatLayer([
						//[50.5, 30.5, 0.8], // lat, lng, intensity
						//[50.6, 30.4, 0.5]
					//	[checklat, checklng, 1]
					//], {
					//	radius: 20,
					//	max: 1,
					//	}).addTo(mymap);

//let heatmapData = {
//	max: 20
//	data: [{lat: checklat, lng: checklng, count: 8}]
//};					

//heatmapData['data'] = [{lat: checklat, lng: checklng, count: 18}];
				
//heatmapLayer.setData(heatmapData);

//heatmapLayer.addTo(mymap)
					
		}
	}
	
	recursiveWeather(listOfCities, counter);
		
	//for (let c = 0; c < 2; c++) {
	//	let { lat, lng } = listOfCities[c].getLatLng();	
	//	console.log(lat, lng);	
	//	if (c<2) {		
	//	getRecursiveWeather(lat,lng);	
	//	}
	//}
	
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
			console.log('timezone', result);
			if (!result.data.timezoneId) {
				abortfunction('timeZone Error');
			}
			document.getElementById('timezone').innerHTML = result.data.timezoneId;
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

function getNews (isoA2code) {
	
	$.ajax({
		url: "libs/php/newsAPI.php",
		type: "GET",
		dataType: "json",
		data: {
			country: isoA2code
		},
	success: function (result) {
		console.log('news result',result);
		


	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('news error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
	
}

function getWebcams (isoA2code) {
	
		$.ajax({
		url: "libs/php/windyWebcams.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoA2code
		},
		success: function (result) {
		console.log('webcam result',result);
		
		let webcamMarkers = [];
		for (let r = 0; r < result.data.length; r ++) {
				
			let lat = result.data[r].lat;
			let lng = result.data[r].lng;
			let webcamPopup = L.popup({autoPan: false, autoClose: false, closeOnClick: false});
			//let node = document.createElement('a');
			//node.setAttribute()
			//let wcpreview = document.createElement('img');
			//wcpreview.setAttribute("class", "webcamPreview");
			//wcpreview.setAttribute('src', result.data[r].thumbnail);
			//node.appendChild(wcpreview);
			let node = document.createElement("button");
			node.setAttribute("type", "button");
			//node.setAttribute("class", "badge rounded-pill bg-secondary");
			node.setAttribute("data-toggle", "modal");
			node.setAttribute("style", "font-size: 1rem");
			node.setAttribute("data-target", "#webcamModal");
			let previewNode = document.createElement('img');
			previewNode.setAttribute("class", "webcamPreview");
			previewNode.setAttribute('src', result.data[r].thumbnail);
			node.appendChild(previewNode);
			
			//let node = document.createElement("img");
			//node.setAttribute("class", "webcamPreview");
			//node.setAttribute('src', result.data[r].thumbnail);

			webcamPopup.setContent(node);
			
			webcamMarkerIcon = L.divIcon({
				//html: '<div><i class="fas fa-video"></i></div>',
				className: 'cursorClass fas fa-video'
				//className: 'capitalMarkerIcon'
			});
			
			webcamMarker = L.marker([lat, lng], {
				icon: webcamMarkerIcon,
				className: 'cursorClass'
			}).bindPopup(webcamPopup);
			
			webcamMarker.on('mouseover', function (e) {
				previewCounter++;
        this.openPopup();
        });
				
      webcamMarker.on('mouseout', function (e) {
        previewCounter = 0;
				this.closePopup();
				 //let webcamPreviewTimer = setTimeout(function(e){
					// webcamMarker.closePopup();
					// clearTimeout(webcamPreviewTimer);
				 //}, 1000);
       });
			 
			webcamMarker.on('click', function (e) {
				document.getElementById('webcamTitle').innerHTML = 'Webcam: ' + result.data[r].title;
				document.getElementById('embedWebcam').setAttribute('src', result.data[r].embed);
				document.getElementById('webcamBtn').click();
				if (previewCounter != 0) {
					//document.getElementById('viewCountryText').innerHTML = 'nothing yet';
					//this.openPopup();
					console.log(previewCounter);
				} else {
					//previewCounter = 0;
					//this.openPopup();
					//document.getElementById('viewCountryText').innerHTML = result.data[r].title;
					console.log(result.data[r].title);
					console.log(previewCounter);
				}

       });
			 
			 webcamMarker.getPopup().on('remove', function () {
					//console.log(previewCounter);
					//previewCounter = 0;
				});

			 webcamMarker.getPopup().on('add', function () {
					//console.log(previewCounter);
					//previewCounter++;
				});
				
			 webcamMarker.getPopup().on('click', function () {
					document.getElementById('viewCountryText').innerHTML = 'popup clicked';
					//previewCounter++;
				});
			
			//capitalMarker.getPopup().on('remove', function () {
			//	mymap.removeLayer(capitalMarker);
			//});
			
			webcamMarkers.push(webcamMarker);

		}
		
			webcamLayer = L.layerGroup(webcamMarkers);
		
			webcamLayer.addTo(mymap);
			overlaysObj['Webcams'] = webcamLayer;
			layersAdded++;
			layerNames.push('webcamLayer');
		
	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('webcam error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 
}

function getWikipedia (currentCountry, bounds) {
	
		$.ajax({
		url: "libs/php/geonamesWiki.php",
		type: "POST",
		dataType: "json",
		data: {
			country: encodeURI(currentCountry),
			maxRows: '25'
		},
		success: function(result) {
			console.log('wiki result', result);
			if (!result.data.geonames) {
				abortfunction('geonamesWiki Error');
			}
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
				//if (!placeArticle.thumbnailImg) {
				//	placeTooltip.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
				//} else {
				//	let imgurl = '"' + placeArticle.thumbnailImg.toString() + '"';
				//placeTooltip.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
				//placeTooltip.setContent(`<span>${placeArticle.title} + ' </br>(Double click to view article)'</span>`);
				placeTooltip.setContent(`<span>${placeArticle.title}</br>(Double click to view article)</span>`);
				//}
																	
				let wikiMarker = L.ExtraMarkers.icon({
					extraClasses: 'cursorClass',
					icon: 'fa-wikipedia-w',
					markerColor: 'blue',
					iconColor: 'white',
					shape: 'square',
					prefix: 'fab',
					shadowSize: [0, 0]
				});
																	
				let marker = L.marker([placeArticle.lat, placeArticle.lng], {icon: wikiMarker}).bindTooltip(placeTooltip);
				
				marker.on('dblclick', function(e) {
					console.log('clicked' ,e);
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
				console.log('bbox result', result);
				if (!result.data.geonames) {
						abortfunction('geonamesWikibbox Error');
					}
			
				let listOfTitlesbbox = []

				for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
					let article = result.data.geonames[oneArt];
					let wikiurl = `http://${article.wikipediaUrl}`;
					let tooltip = L.tooltip({
						className: 'wikiPopup',
						sticky: true,
						url: article.wikipediaUrl
					});
					//tooltip.setContent(article.title + ' (Double click to view article)');
					tooltip.setContent(`<span>${article.title}</br>(Double click to view article)</span>`);
					//tooltip.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${article.title}` + '</a>');
					
					let wikiMarker = L.ExtraMarkers.icon({
						extraClasses: 'cursorClass',
						icon: 'fa-wikipedia-w',
						markerColor: 'blue',
						iconColor: 'white',
						shape: 'square',
						prefix: 'fab',
						shadowSize: [0, 0]
					});
					
					let marker = L.marker([article.lat, article.lng], {icon: wikiMarker}).bindTooltip(tooltip);
					
					marker.on('dblclick', function(e) {
						console.log('clicked' ,e);
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
				
				newPolygons = [];
				wikiClusterMarkers.addTo(mymap);
				overlaysObj['Wikipedia Articles'] = wikiClusterMarkers;
				layersAdded++;
				layerNames.push('wikiClusterMarkers');
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				document.getElementById("viewCountryText").innerHTML = "Sorry data didn't load please refresh the page";
				layersAdded++;
				overlayprobs++;
				problemLayers += 'Wikipedia';
				console.log('geonamesWikibbox error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		}); //end of geonamesWikibbox
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('geonamesWikierror');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of geonamesWiki ajax
	
}

function getGeonamesAirports (isoA2) {
	console.log('isoa2',isoA2);									
	$.ajax({
		url: "libs/php/geonamesAirports.php",
		type: "POST",
		dataType: "json",
		data: {
			country: isoA2
		},
	success: function (result) {
		console.log('airports result',result);
		if (!result.data.geonames) {
			abortfunction('airports error');
		}
		
		let airportMarkers = [];

		let airportMarker = L.ExtraMarkers.icon({
			extraClasses: 'cursorClass',
			icon: 'fa-plane-departure',
			markerColor: 'cyan',
			iconColor: 'white',
			shape: 'square',
			prefix: 'fas',
			//shadowSize: [40, 0]
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
		

		//let airportTooltip = L.tooltip({
		//	className: 'wikiPopup',
		//	sticky: true
		//});
		
		//airportTooltip.setContent('test');
		
		//airportClusterMarkers.bindTooltip(airportTooltip);
		
		//airportClusterMarkers.on('clustermouseover', function(e){
		//	console.log(e);
		//	e.target.openPopup();
		//})
		
		airportClusterMarkers.addTo(mymap);
		overlaysObj['Airports'] = airportClusterMarkers;
		layersAdded++;
		layerNames.push('airportClusterMarkers');
		
		

	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('airports error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
}

function hereLandmarks(markerlist, landmarkIDs, landmarkTypes) {
 
	if (markerlist.length > 10) {
		
		let { lat, lng } = markerlist[0].getLatLng();
		
		document.getElementById("viewCountryText").innerHTML = markerlist[0].options.icon.options.html;
		
		$.ajax({
		url: "libs/php/hereLandmarks.php",
		type: "POST",
		dataType: "json",
		data: {
			markerLat: lat,
			markerLng: lng,
			lmIDs: landmarkIDs
		},
			success: function (result) {
				console.log('landmarks',result)
		
				for (let lm = 0; lm < result.data.length; lm++) {
					landmarkIDs.push(result.data[lm].Location.Name);
					landmarkTypes.push(result.data[lm].Location.LocationType);
					
					if (result.data[lm].Location.LocationType == 'park') {
						landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-tree',
							prefix: 'fas',
							markerColor: 'green',
							iconColor: 'white',
							shape: 'square',
							shadowSize: [40, 0],
							test: 'idiot'
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

						landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-clinic-medical',
							prefix: 'fas',
							markerColor: 'red',
							iconColor: 'white',
							shape: 'square',
							shadowSize: [40, 0],
							test: 'idiot'
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
						
						landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-water',
							prefix: 'fas',
							markerColor: 'blue',
							iconColor: 'white',
							shape: 'square',
							shadowSize: [40, 0],
							test: 'idiot'
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
						
						landmarkMarker = L.ExtraMarkers.icon({
							extraClasses: 'cursorClass',
							icon: 'fa-university',
							prefix: 'fas',
							markerColor: 'purple',
							iconColor: 'white',
							shape: 'square',
							shadowSize: [40, 0],
							test: 'idiot'
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
					
					/*				
					let popup = L.popup({
						className: 'wikiPopup'
					});
					
					console.log('location name', result.data[lm].Location.Name);
					popup.setContent(result.data[lm].Location.Name);
					
					console.log(landmarkMarker.options.markerColor, result.data[lm].Location.Name);
					console.log('landmarkMarker', landmarkMarker);
					let marker = L.marker([result.data[lm].Location.DisplayPosition.Latitude, result.data[lm].Location.DisplayPosition.Longitude], 
					{icon: landmarkMarker}).bindPopup(popup);
					
					console.log('next marker', marker);
					landmarkList.push(marker);	
					*/
				}	
			
					
				hereLandmarks(markerlist.slice(1), landmarkIDs, landmarkTypes);
				
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//document.getElementById('closeFetchingData').click();
				layersAdded++;
				overlayProbs++;
				problemLayers += 'Landmarks';
				abortfunction('landmarks error');
				console.log('landmarks error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		}); // end of hereLandmarks ajax

	} else {
		
		console.log('landmarkIDs',landmarkIDs);
		console.log('landmarkList',landmarkList);
		console.log('landmarkTypes', landmarkTypes);
		
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
	layerNames.push('landmarkClusterMarkers');

	}
}

function geonamesPoiFunc(markerlist) {
		
	if (markerlist.length > 0) {
		
		let { lat, lng } = markerlist[0].getLatLng();
		
		document.getElementById("viewCountryText").innerHTML = markerlist[0].options.icon.options.html;
		
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
		
		console.log('poimarkers', poiMarkers);
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

	console.log('tourist points found',touristMarkers.length);
	console.log('shops found', shopMarkers.length);
	console.log('amenities found',amenityMarkers.length);
	
	//mymap.removeControl(layersControl);
	//addOverlays();
	}
}

function getGeonamesCities (isoA2) {
	console.log('isoa2',isoA2);									
	$.ajax({
		url: "libs/php/geonamesSearchCities.php",
		type: "POST",
		dataType: "json",
		data: {
			country: isoA2
		},
	success: function (result) {
		if (result.data.length == 0) {
			abortfunction('geonamesSearchCities error');
		}
		console.log('geonamesSearchCities result',result);
		
		let citiesMarkers = [];
		let citiesCircles = [];
			
		for (let icity = 0; icity < result.data.length; icity++) {
			let city = result.data[icity];
			
			//let cityPopup = L.popup({
			//	className: 'wikiPopup'
			//});

			let cityTooltip = L.tooltip({
				className: 'wikiPopup',
				sticky: true
			});
			
			let cityMarker = L.ExtraMarkers.icon({
				icon: 'fa-number',
				markerColor: 'green',
				shape: 'square',
				//prefix: 'fas',
				number: 'A',
				//innerHTML: '<span>what is this</span>',
				shadowSize: [0, 0]
			});
			
		//let cityMarker;	
			cityMarker = L.divIcon({
				className: 'cityMarkerStyle cursorClass badge rounded-pill bg-secondary-cm',
				html: city.name
			});
		
			let radius;
			let cityCircle;
			if (city.population) {
				//cityPopup.setContent(city.name + ' - Population: ' + city.population	);
				cityTooltip.setContent(city.name + ' - Population: ' + parseInt(city.population).toLocaleString('en-US'));
				radius = city.population/100 > 20000 ? 20000 : city.population/100;	
				//cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindPopup(cityPopup);
				cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindTooltip(cityTooltip);
			} else {
				//cityPopup.setContent(city.name + ' - Population unknown'	);
				cityTooltip.setContent(city.name + ' - Population unknown'	);
				radius = 200;							
				//cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindPopup(cityPopup);
				cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08', className: 'cursorClass'}).bindTooltip(cityTooltip);
			}

			//let marker = L.marker([city.lat, city.lng], {icon: cityMarker}).bindPopup(cityPopup);
			
			let marker = L.marker([city.lat, city.lng], {icon: cityMarker}).bindTooltip(cityTooltip);
			citiesMarkers.push(marker);
			citiesCircles.push(cityCircle);
		
		} // end of result.data loop
			
		console.log('Cities found: ',citiesMarkers);
		
		citiesLayer = L.layerGroup(citiesMarkers);
		cityCirclesLayer = L.layerGroup(citiesCircles);
		
		citiesLayer.addTo(mymap);
		layersAdded++;
		layerNames.push('citiesLayer');
		cityCirclesLayer.addTo(mymap);
		overlaysObj['Cities'] = cityCirclesLayer;
		layersAdded++;
		layerNames.push('cityCirclesLayer');
		
		mymap.on('zoomend', function() {
			//zoomCount++;
			if (mymap.hasLayer(cityCirclesLayer)) {
				if (mymap.hasLayer(citiesLayer)) {
					if (mymap.getZoom() >= 7 ) {
							//layerCheck = 1;
						if (baseLayerName != 'Watercolour') {
							mymap.removeLayer(citiesLayer);
						}
					}
				} else {
					if (mymap.getZoom() <=6) {
								citiesLayer.addTo(mymap);
								//layerCheck = 1;
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
		console.log('cities sent to PHP',randomMarkers);
		
		landmarkList = [];
		landmarkIDs = [];
		landmarkTypes = [];
		hereLandmarks(randomMarkers, landmarkIDs, landmarkTypes);
		//mymap.removeControl(layersControl);
		addOverlays(overlaysObj);
		
		//addWeatherLayer(randomMarkers);
			
		//show loading modal
		//document.getElementById('fetchingData').click();
		
		// call recursive function - POIs
		//poiMarkers = [];
		//geonamesPoiFunc(randomMarkers);

	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('geonames search error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
}


function addOverlays (overlaysObj) {
	
	console.log('overlaysobj', overlaysObj);
	console.log('layersAdded', layersAdded);
	console.log('layernames', layerNames);
	if (layersAdded == 8 && overlayProbs == 0) {
		layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
	} else if (layersAdded == 8 && overlayProbs > 0) {
		layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
		console.log(problemLayers);
		document.getElementById("viewCountryText").innerHTML = 'overlayprobs ' + overlayProbs;
		document.getElementById("layerErrorText").innerHTML = problemLayers;
		document.getElementById("dataError").click();
	} else if (overlaysCounter < 6 ){
		console.log('try again');
		overlaysCounter++;
		let overlayAgain = setTimeout(function () {
			console.log('now');
			addOverlays(overlaysObj);
			clearTimeout(overlayAgain);
		},1500);
	} else {
		abortfunction('overlay error');
	}

}

function displayCountry(isoa3Code) {
	overlaysCounter = 0;
	//heatmapLayer.addTo(mymap)
	console.log('sc',selectDropDown);
	selectDropDown['value'] = isoa3Code;
	document.getElementById('viewCountryText').innerHTML = 'Loading...';
	
	if (typeof capitalMarker == "object") {
    capitalMarker.remove();
  }
	
	let bounds;
	let isoA2;
	
	$.ajax({
		url: "libs/php/getPolygon.php",
		type: "POST",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {
			console.log(result.data);
			
			let country = result.data;
			let geojsonLayer = L.geoJson(country);
			bounds = geojsonLayer.getBounds();
			
			if (!fijiUpdated) {
				if (isoa3Code == 'FJI') {
					bounds._southWest.lng += 360;
					fijiUpdated = true;
					console.log(bounds);
				}
			}
			if (!russiaUpdated) {
				if (isoa3Code == 'RUS') {
					bounds._southWest.lng += 360;
					russiaUpdated = true;
					console.log(bounds);
				}
			}
				
			console.log(bounds);
			let northEast = bounds._northEast;
			let southWest = bounds._southWest;
			
			fitBoundsArr = [];

			let { lat, lng } = northEast;

			fitBoundsArr.push([lat, lng]);

			corner1 = L.latLng(lat, lng);
			({ lat, lng } = southWest);

			fitBoundsArr.push([lat, lng]);

			corner2 = L.latLng(lat, lng);
			viewportBounds = L.latLngBounds(corner1, corner2);
			
	    currentCountry = result.data["properties"].name;
			console.log('currentC', currentCountry);
      if (result.data["geometry"]["type"] == 'MultiPolygon') {
        currentCountryPolygons = result.data["geometry"]["coordinates"];
      } else {
        currentCountryPolygons = [result.data["geometry"]["coordinates"]];
      }
			
			selectedCountryLayer = L.geoJSON();

			let isoA3;
			let capital;
			let currency;
			
      document.getElementById("countryModalTitle").innerHTML = currentCountry;
			
			mymap.flyToBounds(viewportBounds, {
					duration: 1.5
			});
			
			borderLines = L.geoJSON(country, {
				style: function(feature) {
						return {
							color: "#ff0000",
							fillOpacity: 0
					}
				}
			});

			borderLines.addTo(selectedCountryLayer);
			selectedCountryLayer.addTo(mymap);
			overlaysObj['Highlight'] = selectedCountryLayer;
			layersAdded++;
			layerNames.push('selectedCountryLayer');
									
		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('get polygon error');
				console.log(textStatus);
				console.log(errorThrown);
			},
	});
	
	$.ajax({
		url: "libs/php/oneRestCountry.php",
		type: "GET",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {
			console.log('orc', result.data);

			let textValue = result.data.nativeName;
			document.getElementById("nativeName").innerHTML = 'Native name: ' + textValue;
			document.getElementById("population").innerHTML = parseInt(result.data.population).toLocaleString('en-US');
			document.getElementById("currency").innerHTML = result.data.currencies[0].code;
			currency = result.data.currencies[0].code;
			document.getElementById("currencyName").innerHTML = result.data.currencies[0].name;
			document.getElementById("flagIMG").setAttribute("src", result.data.flag);
			document.getElementById("capital").innerHTML = result.data.capital;
			capital = result.data.capital;

			isoA2 = result.data.alpha2Code;
			
		$.ajax({
			url: "libs/php/worldBankCapital.php",
			type: "POST",
			dataType: "json",
			data: {
				isoA3: isoa3Code
			},
			success: function(result) {
				console.log('WB capital', result);
				console.log(result.data[1][0].latitude);
				//if (!result.data.results) {
				//	abortfunction('openCageCapital Error');
				//}

				
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
				overlaysObj['Capital'] = capitalMarker;
				layerNames.push('capitalMarker');
				
				console.log('gettimezone');
				getTimezone(lat, lng);
				console.log('get wiki');
				getWikipedia(currentCountry, bounds);
				console.log('get cities');
				getGeonamesCities(isoA2);
				console.log('get airports');
				getGeonamesAirports(isoA2);
				//console.log('gettimezone');
				//getNews(isoA2);
				console.log('get webcams');
				getWebcams(isoA2);
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}
			}); //end of World Bank Capital ajax
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('one rest country error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	}); //end of One Rest Country ajax

	//let overlays = {
	//		"Please wait data loading...": L.geoJSON(),
	//	}	
	//layersControl = L.control.layers(baseMaps, overlays);
	//layersControl.addTo(mymap)
	
  document.getElementById("progressBar").setAttribute('style', 'visibility: initial');
	document.getElementById("loadingText").innerHTML = 'fetching exchange rate';
  document.getElementById("progressBar").setAttribute('style', "width: 10%;");
	document.getElementById("loadingText").innerHTML = 'fetching capital city';
	document.getElementById("progressBar").setAttribute('style', "width: 15%;");
	document.getElementById("loadingText").innerHTML = 'fetching weather data';
	document.getElementById("progressBar").setAttribute('style', "width: 30%;");
	document.getElementById("loadingText").innerHTML = 'fetching time data';					          
	document.getElementById("progressBar").setAttribute('style', "width: 50%;");	
	document.getElementById("loadingText").innerHTML = 'fetching wikipedia data';
	document.getElementById("progressBar").setAttribute('style', "width: 60%;");
	document.getElementById("loadingText").innerHTML = 'fetching cities data';
	document.getElementById("progressBar").setAttribute('style', "width: 75%;");
	document.getElementById("loadingText").innerHTML = 'fetching points of interest';
	document.getElementById("progressBar").setAttribute('style', "width: 90%;");
	document.getElementById("loadingText").innerHTML = '';
	document.getElementById("progressBar").setAttribute('style', "width: 100%;");
	document.getElementById("viewCountryText").innerHTML = 'delete';
	let progressTimer = setTimeout(function() {
		document.getElementById("progressBar").setAttribute('style', "width: 0%; visibility: hidden");
		clearTimeout(progressTimer);
		}, 1500);
	
	/*  ONLY RETURN CORRECT CURRENCY
	$.ajax({
		url: "libs/php/openExchange.php",
		type: "POST",
		dataType: "json",
		data: {},
		success: function (result) {
			console.log('exchange rate result', result);
			if (!result.data.rates) {
				abortfunction('exchange rate Error');
			}
			for (let [key, value] of Object.entries(result.data.rates)){
				if (key == currency) {
					document.getElementById("exchangeRate").innerHTML = value.toFixed(2) + ' ' + currency + ' = 1 USD';
				};
			};	
		},
		error: function (jqXHR, textStatus, errorThrown) {
			// error code
			console.log('OpenExchange error');
			console.log(textStatus);
			console.log(errorThrown);
		}
	}); // end of OpenExchange ajax			
  */

} // end of DISPLAY COUNTRY 

function countryBordersFunc(response) {
	
	countryBorders = response;
	console.log('CB', countryBorders);
	
	for (let i = 0; i < countryBorders.length; i++) {
		let textValue = countryBorders[i].name;
		let node = document.createElement("option");
		node.innerHTML = textValue;
		//node.setAttribute("value", textValue);
		node.setAttribute("value", countryBorders[i].code);		
		//dropdownList.push(textValue);
		document.getElementById("selectCountries").appendChild(node);
	}	
	
	mymap.locate().on("locationfound", onLocationFound).on("locationerror", onLocationError);			

} // end of countryBordersFunc

//EVENT HANDLERS

selectDropDown.addEventListener("change", function (event) {
  let completeFunction = true
  let selectedCountry = event.target.value;
	//console.log(selectedCountry);
	if (selectedCountry == "") {
    //document.getElementById('goToCountry').setAttribute('data-dismiss', "stop");
    document.getElementById('selectCountryError').setAttribute('style', 'visibility: visible')
    completeFunction = false
  } else {
    //if (document.getElementById('goToCountry').getAttribute('data-dismiss') == 'stop') {
      //document.getElementById('goToCountry').setAttribute('data-dismiss', "modal");
    //}
  }
  if (completeFunction == true) {
		layersAdded = 0;
		layerNames = [];
		overlaysObj = {};
    mymap.removeLayer(selectedCountryLayer);
    //mymap.removeLayer(invisibleBorders);
    mymap.removeLayer(wikiClusterMarkers);
    mymap.removeLayer(citiesLayer);
    mymap.removeLayer(cityCirclesLayer);
		mymap.removeLayer(capitalMarker);
		mymap.removeLayer(landmarkClusterMarkers);
		mymap.removeLayer(airportClusterMarkers);
    //mymap.removeLayer(heatmapLayer);
    //mymap.removeLayer(touristClusterMarkers);
    //mymap.removeLayer(shopClusterMarkers);
		//mymap.removeLayer(amenityClusterMarkers);
		mymap.removeLayer(webcamLayer);
    mymap.removeControl(layersControl);
		//mymap.removeControl(sliderControl);
    clearTimeout(timer);
    //let isoa3Code;
    //countryBorders.forEach(function(arrayItem) {
    //  if (event.target.value.includes(arrayItem.properties.name)) {
    //    isoa3Code = arrayItem.properties.iso_a3;
    //  }
    //});
		//isoa3Code = selectedCountry;
    //displayCountry(isoa3Code);
    displayCountry(selectedCountry);
  }
}, false)

	
mymap.on('overlayadd', function(e) {
  if (e.name == 'Capital') {
		capitalMarker.openPopup();
  };
	//if (e.name == 'Your location') {
	//	userLocationMarker.openPopup();	
	//};
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
				//layerCheck = 1;
			}
		}
	};
	if (e.name == 'Watercolour') {
		if (mymap.hasLayer(cityCirclesLayer)) {
			if (!mymap.hasLayer(citiesLayer)) {
				if (mymap.getZoom() >= 7) {
					citiesLayer.addTo(mymap);
					//layerCheck = 1;
				}
			}
		}
	}
});

$('#newsArticlesModal').on('shown.bs.modal', function () {
	console.log('shown');
	$('.btn-link').each(function(){
				console.log(this);
				//$(this).collapse();
				//$(this).setAttribute('class', 'accordion-body collapse');
});
})

window.onload = (event) => {	
	if ($('#preloader').length) {
		$('#preloader').delay(1000).fadeOut('slow', function () {
			$(this).remove();
			console.log("Window loaded", event);
		
			$(document).ready(function () {
								
				function recursiveLoad () {
					console.log('load attempt'); 
					 
					$.ajax({
					url: "libs/php/getCountryBorders.php",
					type: "GET",
					dataType: "json",
					data: {},
					success: function (result) {
						console.log('new', result.data);
						countryBordersFunc(result.data);
						
					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('country borders error');
							console.log(textStatus);
							console.log(errorThrown);
							recursiveLoadTimer = setTimeout(function () {
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

/* 
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
			

	
QUESTIONS:

Is there a better way to find capital city location (another API?, instead of checking opencage for confidence etc)

THOUGHTS

learn about recursion and leakage making a clock
hanging questions / not perfection eg. ajax jqXHR, not sure what it is
*/