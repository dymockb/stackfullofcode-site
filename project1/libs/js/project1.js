//#sourceMappingURL=bootstrap/css/bootstrap-grid.css.map
//#sourceMappingURL=bootstrap/js/bootstrap.bundle.min.js.map
//#sourceMappingURL=bootstrap/js/bootstrap.min.js.map

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

let firstLoad = true;
let totalLayers = 2;
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
let layersOnAndOff = [];
let controlsOnAndOff = [];

let landmarkList = [];
let landmarkIDs = [];
let landmarkTypes = [];
let landmarkMarker;

let weatherOn = false;

//userLocationMarker,
let baseLayerName, mylat, mylng, capitalMarker, timer, zoomLocationTimer, recursiveLoadTimer, allRestCountries, myBounds, currentCountry, selectedCountry, currentCountryPolygons, layersControl, sliderControl, fijiUpdated, russiaUpdated, invisibleBorders, wikiLayer, wikiClusterMarkers, citiesLayer, weatherLayer, cityCirclesLayer, touristLayer, webcamLayer, shopLayer, amenityClusterMarkers, userPopup, corner1, corner2, viewportBounds, userCircle, overlays, touristMarkers, shopMarkers, amenityMarkers, countryBorders

let loadingTimer;
let loadingCount = 0
let stopLoadingCount = false

let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
let collapseList = collapseElementList.map(function (collapseEl) {
  return new bootstrap.Collapse(collapseEl)
});

const selectDropDown = document.getElementById("selectCountries");
//const testE = document.getElementById("viewCountryBtn");

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

let heatmapColor; 

let heatmapLayer = new HeatmapOverlay(cfg);
heatmapLayer.setData(heatmapData);

function redrawHeatMap(heatmapData, color) {
	
	heatmapLayer.addTo(mymap)
	//mymap.removeLayer(heatmapLayer);
	cfg['gradient'] = {'.1' : 'white', '.95': color};
	heatmapLayer._heatmap.configure(cfg);  // call private method but do not changethe original code
	heatmapLayer._reset();
	heatmapLayer.setData(heatmapData);

}

function onLocationFound(e) {
  let radius = e.accuracy;
  let {lat,lng} = e.latlng;
  mylat = lat;
  mylng = lng;
	
	$.ajax({
		url: "libs/php/openCage.php",
		type: "POST",
		dataType: "json",
		data: {
			lat: mylat,
			lng: mylng,
		},
		success: function(result) {
			
			let isoa3Code = result.data.results[0].components["ISO_3166-1_alpha-3"];
			
			let userCountryBounds = result.data.results[0].bounds;
			displayCountry(isoa3Code);
			//addOverlays(overlaysObj);
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

	function recursiveRandom(countriesParam) {
		let randCountry = countryBorders[Math.floor(Math.random()*countryBorders.length)];
		console.log(randCountry);
		console.log('random country: ', randCountry.name, randCountry.A3code);
		if (randCountry.name == 'Kosovo' || randCountry.name == 'N. Cyprus' || randCountry.name == 'Somaliland'){
			recursiveRandom(countriesParam);
		} else {

			displayCountry(randCountry.A3code);

		};
	}

	recursiveRandom(countryBorders);

}

function abortfunction (string) {
	console.log(string);
	//document.getElementById("viewCountryText").innerHTML = 'Abort Func';
	document.getElementById("dataError").click();
	//throw new Error('API error - reload page');
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
					
					switchCountry(layersOnAndOff, controlsOnAndOff);
					
					/*
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
					*/
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

L.easyButton('fa-temperature-low', function() {
	document.getElementById('weatherBtn').click();
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
								//redrawHeatMap(heatmapData, color);
								
							} else if (e.target.options.maxtemp < 35) {
								console.log('max temp less than 35');
								let color = 'red';							
								heatmapData['data'] = updatedHeat;
								//redrawHeatMap(heatmapData, color);
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
/*
function translateNews() {
	
	let testText = 'Hey how are you today?'
	console.log(encodeURIComponent(testText));
	
	$.ajax({
		url: "libs/php/translate.php",
		type: "POST",
		dataType: "json",
		data: {
			//text: newsText
		},
	success: function (result) {
		console.log('translate result',result);
		


	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('translate error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
	
}
*/

function getNews(isoA2code) {
	
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
		
		function recursiveTranslate(articlesToTranslate) {
			
			if (articlesToTranslate.length > 0) {
							
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
							
						} else {
							console.log('what???')
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
						recursiveTranslate(articlesToTranslate.slice(1));
	
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
					
				console.log('content',content);
				
				let translatedObj = {};
				translatedObj['url'] = articlesToTranslate[0].url;
				translatedObj['imgURL'] = articlesToTranslate[0].urlToImage;
				recursiveContent(content);

				} else {
					
						console.log('translatedObjs', translatedObjs)
						
					function createAccordianArticle(oneArt, target) {
			
						let cardDiv = document.createElement('div');
						
//<button class="btn btn-link" data-toggle="collapse" data-target="#collapse${target}" aria-expanded="true" aria-controls="collapseOne">

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
							<div>${oneArt.url}</div>
							<div>${oneArt.description}</div>
							<img src="${oneArt.imgURL}" class="newsImage"/>
							</div>
						</div>`;
						
						document.getElementById('accordion').appendChild(cardDiv);
							
					}

					for (let oneArt = 0; oneArt < translatedObjs.length; oneArt++) {
						
						let fields = ['title', 'description'];
						
						for (let f = 0; f < fields.length; f++) {

							if (!translatedObjs[oneArt][fields[f]]) {
									translatedObjs[oneArt][fields[f]] = 'NO DATA';
								}
							}
						
						createAccordianArticle(translatedObjs[oneArt], oneArt);

					}					
		
				}
		
		}
		
		//console.log('slice',result.data.slice(0,3));
		recursiveTranslate(result.data.slice(0,3));
				



		//if (result.data.status == 'ok') {
			
		
		
		//}
		
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

				} else {
					//previewCounter = 0;
					//this.openPopup();
					//document.getElementById('viewCountryText').innerHTML = result.data[r].title;

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
					//document.getElementById('viewCountryText').innerHTML = 'popup clicked';
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
			layersOnAndOff.push(webcamLayer);
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
				layersOnAndOff.push(wikiClusterMarkers);
				layerNames.push('wikiClusterMarkers');
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//document.getElementById("viewCountryText").innerHTML = "Sorry data didn't load please refresh the page";
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
		layersAdded++;
		overlayprobs++;
		problemLayers += 'Wikipedia';
		console.log('geonamesWikierror');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); //end of geonamesWiki ajax
	
}

function getGeonamesAirports (isoA2) {
										
	$.ajax({
		url: "libs/php/geonamesAirports.php",
		type: "POST",
		dataType: "json",
		data: {
			country: isoA2
		},
	success: function (result) {
		
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
		layersOnAndOff.push(airportClusterMarkers);
		layerNames.push('airportClusterMarkers');
		
		

	},
	error: function (jqXHR, textStatus, errorThrown) {
		layersAdded++;
		overlayProbs++;
		problemLayers += 'Airports'
		console.log('airports error');
		console.log(textStatus);
		console.log(errorThrown);
	}
	}); 	
}

function hereLandmarks(markerlist, landmarkIDs, landmarkTypes) {
 
	if (markerlist.length > 10) {
		
		let { lat, lng } = markerlist[0].getLatLng();
		
		//document.getElementById("viewCountryText").innerHTML = markerlist[0].options.icon.options.html;
		
		//console.log('landmark params', markerlist, landmarkIDs, landmarkTypes);
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
				console.log('landmarks result', result);
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
				//abortfunction('landmarks error');
				console.log('landmarks error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		}); // end of hereLandmarks ajax

	} else {
				
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

	}
}


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

function getGeonamesCities(isoA2) {

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
					
		citiesLayer = L.layerGroup(citiesMarkers);
		cityCirclesLayer = L.layerGroup(citiesCircles);
		
		//citiesLayer is added / removed by cityCirclesLayer
		citiesLayer.addTo(mymap);
		//layersAdded++;
		//layerNames.push('citiesLayer');
		
		cityCirclesLayer.addTo(mymap);
		overlaysObj['Cities'] = cityCirclesLayer;
		layersAdded++;
		layersOnAndOff.push(cityCirclesLayer);
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
				
		landmarkList = [];
		landmarkIDs = [];
		landmarkTypes = [];

		//hereLandmarks(randomMarkers, landmarkIDs, landmarkTypes);
		
		let currentWeatherData = [];
		
		function getCurrentWeather(locations) {
			
			if (locations.length > 0) {
				
				let {lat, lng} = locations[0].getLatLng();
				
				$.ajax({
					url: "libs/php/weatherbitCurrent.php",
					type: "POST",
					dataType: "json",
					data: {
						locationLat: lat,
						locationLng: lng,
					},
					success: function(result) {

						currentWeatherData.push(result);
						getCurrentWeather(locations.slice(1));
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('weatherbit error');
						console.log(textStatus);
						console.log(errorThrown);
					}
					}); //end of Weatherbit ajax
			
			} else {

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
					let temp = currentWeatherData[hm]['data']['temp'];
										
					let	weatherMarker = L.divIcon({
						//className: 'weatherMarkerStyle ' + currentWeatherData[hm]['data'].icon,
						className: 'weatherMarkerStyle',
						html: `<div>${temp}<sup>o</sup>C<img src="img/weatherIcons/${currentWeatherData[hm]['data']['icon']}.png" style="width: 50px; height: 50px"/></div>` ,
						iconSize: [20,20],
						iconAnchor: [10,55]
						//+ ' <img src="img/weatherIcons/' + weather.properties.icon + '.png"></img>'
					})

					//let marker = L.marker([lat, lng], {icon: weatherMarker, time: weather.properties.time, temp: weather.properties.temp});
					let marker = L.marker([lat, lng], {icon: weatherMarker});
					//.bindPopup(popup);			
					//
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

				//weatherLayer.addTo(mymap);
				
				if (maxTemp < 15) {
					heatmapColor = 'blue';
					
					console.log('hdata',heatmapData);
					
				} else if (maxTemp < 30) {
					heatmapColor = 'orange';							
					
				} else if (maxTemp < 40) {
					heatmapColor = 'red';							
	
				}
			
				}
			
		}
		
		getCurrentWeather(randomMarkers.slice(0,2));
		

		//mymap.removeControl(layersControl);
				
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


function addOverlays(overlaysObj) {
	console.log('adding overlays');
	
	
	if (layersAdded == totalLayers && overlayProbs == 0) {
		layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
		controlsOnAndOff.push(layersControl);
		
		console.log('controls on and off', controlsOnAndOff);
		console.log('layers on and off', layersOnAndOff);
		
	} else if (layersAdded == totalLayers && overlayProbs > 0) {
		layersControl = L.control.layers(baseMaps, overlaysObj);
		layersControl.addTo(mymap);
		controlsOnAndOff.push(layersControl);
		
		console.log('controls on and off', controlsOnAndOff);
		console.log('layers on and off', layersOnAndOff);
		
		//document.getElementById("viewCountryText").innerHTML = 'overlayprobs ' + overlayProbs;
		document.getElementById("layerErrorText").innerHTML = problemLayers;
		document.getElementById("dataError").click();
		
	} else if (overlaysCounter < 6 ){
		
		overlaysCounter++;
		
		let overlayAgain = setTimeout(function () {
			
			addOverlays(overlaysObj);
			clearTimeout(overlayAgain);
		},1500);
		
	} else {
		
		console.log('ERROR layers on and off', layersOnAndOff);
		abortfunction('overlay error');
		
	}

}

function placeBorder(isoa3Code){
	
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
			layersOnAndOff.push(selectedCountryLayer);
			layerNames.push('selectedCountryLayer');
									
		},
		error: function (jqXHR, textStatus, errorThrown) {
				layersAdded++;
				problemLayers += 'polygon';
				overlayProbs++;
				console.log('get polygon error');
				console.log(textStatus);
				console.log(errorThrown);
			},
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
						
			console.log('Rain chart (mm)',result)
				
			let chartData = [];
			let min = result.data[0].data;
			
			for (let c = 0; c < result.data.length; c++) {
				chartData.push(result.data[c].data);
				min = min < result.data[c].data ? min : result.data[c].data;
			}
			
			let ctx = document.getElementById('rainChart').getContext('2d');
			let myChart = new Chart(ctx, {
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
			let myChart = new Chart(ctx, {
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

function countryBasics(isoa3Code){
	
		$.ajax({
		url: "libs/php/oneRestCountry.php",
		type: "GET",
		dataType: "json",
		data: {
			countryCode: isoa3Code
		},
		success: function (result) {

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
								
				lat = result.data[1][0].latitude; // W. Sahara ESH problem
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
				
				//capitalMarker.addTo(mymap).openPopup();
				//layersAdded++;
				//layersOnAndOff.push(capitalMarker);
				//overlaysObj['Capital'] = capitalMarker;
				//layerNames.push('capitalMarker');
				
				//console.log('get timezone');
				//getTimezone(lat, lng);
				//console.log('get wiki');
				//getWikipedia(currentCountry, bounds);
				//console.log('get cities');
				//getGeonamesCities(isoA2);
				//console.log('get airports');
				//getGeonamesAirports(isoA2);
				
				//console.log('get news');
				//getNews(isoA2);
				
				//console.log('translate');
				//translateNews();
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

}

function displayCountry(isoa3Code) {
	addOverlays(overlaysObj);
	overlaysCounter = 0;
		
	selectDropDown['value'] = isoa3Code;
	//document.getElementById('viewCountryText').innerHTML = 'Loading...';
	
	if (typeof capitalMarker == "object") {
    capitalMarker.remove();
  }
	
	let bounds;
	let isoA2;
	
	for (let io = 0; io < countryBorders.length; io++){
	 if (countryBorders[io].A3code == isoa3Code) {
		 isoA2 = countryBorders[io].A2code;
	 }
	}
	
	placeBorder(isoa3Code);

	getGeonamesCities(isoA2);
	
	weatherChartCelcius(isoa3Code);
	
	weatherChartRain(isoa3Code);
	
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
	//document.getElementById("viewCountryText").innerHTML = 'delete';
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
	
	for (let i = 0; i < countryBorders.length; i++) {
		let textValue = countryBorders[i].name;
		let node = document.createElement("option");
		node.innerHTML = textValue;
		//node.setAttribute("value", textValue);
		node.setAttribute("value", countryBorders[i].A3code);		
		//dropdownList.push(textValue);
		document.getElementById("selectCountries").appendChild(node);
	}	
	
	mymap.locate().on("locationfound", onLocationFound).on("locationerror", onLocationError);			

} // end of countryBordersFunc

//EVENT HANDLERS

function switchCountry(layersToChange, controlsToChange){
	
	document.getElementById('accordion').innerHTML = "";
	clearTimeout(timer);
	
	console.log('loao', layersToChange);
	console.log('coao', controlsToChange);
	
	for (let s = 0; s < layersToChange.length; s++) {
		mymap.removeLayer(layersOnAndOff[s]);
	}
	for (let c = 0; c < controlsToChange.length; c ++) {
		mymap.removeControl(controlsToChange[c]);
	}
	
	layersOnAndOff = [];
	controlsOnAndOff = [];
	heatmapData.data = [];
	
}

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
		
		if (weatherOn == true) {
			document.getElementById('weatherToggle').click();
		}
		
		switchCountry(layersOnAndOff, controlsOnAndOff);
		//addOverlays(overlaysObj);
		
		/*
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
		*/
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


$('#weatherToggle').click(function (){
	
	if (weatherOn == false) {
		weatherOn = true;
		redrawHeatMap(heatmapData, heatmapColor);
		weatherLayer.addTo(mymap);
	} else {
		weatherOn = false;
		let undrawObj = {max: 20, data: []};
		redrawHeatMap(undrawObj, heatmapColor);
		mymap.removeLayer(weatherLayer);
	}
	
	/*
	if (weatherOn == false) {
		weatherOn = true;
		for (let s = 0; s < layersOnAndOff.length; s++) {
			if (layersOnAndOff[s] != selectedCountryLayer) {
				mymap.removeLayer(layersOnAndOff[s]);
				redrawHeatMap(heatmapData, heatmapColor)
			}
		}
		for (let c = 0; c < controlsOnAndOff.length; c ++) {
			mymap.removeControl(controlsOnAndOff[c]);
		}
	} else {
		for (let s = 0; s < layersOnAndOff.length; s++) {
			if (layersOnAndOff[s] != selectedCountryLayer) {
				layersOnAndOff[s].addTo(mymap);
				
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
				
				let undrawObj = {max: 20, data: []};
				redrawHeatMap(undrawObj, heatmapColor);
			}
		}
		for (let c = 0; c < controlsOnAndOff.length; c ++) {
			controlsOnAndOff[c].addTo(mymap);
		}

		weatherOn = false;
	}
	*/
	
});

	
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

/*
$('#newsArticlesModal').on('shown.bs.modal', function () {
	console.log('shown');
	$('.btn-link').each(function(){
				console.log(this);
				//$(this).collapse();
				//$(this).setAttribute('class', 'accordion-body collapse');
});
})
*/

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