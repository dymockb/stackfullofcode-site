//#sourceMappingURL=bootstrap/css/bootstrap-grid.css.map
//#sourceMappingURL=bootstrap/js/bootstrap.bundle.min.js.map
//#sourceMappingURL=bootstrap/js/bootstrap.min.js.map

//global variables

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

let baseLayerName, mylat, mylng, capitalMarker, timer, zoomLocationTimer, allRestCountrieslet, myBounds, newBounds, currentCountry, selectedCountry, currentCountryPolygons, layersControl, currentisoA2, fijiUpdated, russiaUpdated, invisibleBorders, userLocationMarker, wikiLayer, wikiClusterMarkers, citiesLayer, cityCirclesLayer, touristLayer, shopLayer, amenityClusterMarkers, userPopup, corner1, corner2, viewportBounds, userCircle, overlays, touristMarkers, shopMarkers, amenityMarkers 

let loadingTimer;
let loadingCount = 0
let stopLoadingCount = false

const selectDropDown = document.getElementById("selectCountries");

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
	layers: [l1]
});

let baseMaps = {
	"Atlas": l1,
	"Watercolour": l2
}

new L.Control.Zoom({
	position: "bottomright"
}).addTo(mymap);


function onLocationFound(e) {
  let radius = e.accuracy;
  let {
    lat,
    lng
  } = e.latlng;
  mylat = lat;
  mylng = lng;

  userCircle = L.circle(e.latlng, radius, {color: '#b30a08'});

  let userIcon = new L.Icon({ 
    iconUrl: 'img/map-pin-solid.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
		className: 'userIconStyle'
    //shadowSize: [41, 41]
  });
	
	//let userIcon = L.ExtraMarkers.icon({
	//	icon: 'fa-map-pin',
	//	markerColor: 'white',
	//	iconColor: 'blue',
	//	shape: 'square',
	//	prefix: 'fas'
	//});

  userPopup = L.popup({
    autoClose: false,
		autoPan: false,
		className: 'userPopup'
  }).setContent("You are within " + Math.floor(radius) + " meters from this point");

  userLocationMarker = L.marker(e.latlng, {
      icon: userIcon
    }).bindPopup(userPopup);
	//userLocationMarker.addTo(mymap).bindPopup(userPopup)
  //  .openPopup();	
	


	$.ajax({
		url: "libs/php/openCage.php",
		type: "POST",
		dataType: "json",
		data: {
			lat: mylat,
			lng: mylng,
		},
		success: function(result) {
			let isoa3Code;
			for (let i = 0; i < countryBorders.length; i++) {
				if (countryBorders[i]["properties"].iso_a3 == result.data.results[0].components["ISO_3166-1_alpha-3"]) {
					myBounds = countryBorders[i]["properties"].bounds;
					isoa3Code = countryBorders[i]["properties"]["iso_a3"];
				}
			}
								
			displayCountry(isoa3Code);
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
	let randCountry = countryBorders[Math.floor(Math.random()*countryBorders.length)];
	console.log('random country: ', randCountry.properties.name, randCountry.properties.iso_a3);
	displayCountry(randCountry.properties.iso_a3);
  //mymap.setView([51, 0], 16);
}

function abortfunction (string) {
	console.log(string);
	document.getElementById("viewCountryText").innerHTML = 'Data error - please refresh the page';
	throw new Error('API error - reload page');
}

L.easyButton('fa-home', function() {
	clearTimeout(timer);
	if (firstLoad == true) {
		//document.getElementById('startMap').setAttribute('style', 'display: none');
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
							//selectedCountry = 'Europe: United Kingdom';
						}
					}
					mymap.removeLayer(selectedCountryLayer);
					mymap.removeLayer(invisibleBorders);
					//mymap.removeLayer(wikiLayer);
					mymap.removeLayer(wikiClusterMarkers);
					mymap.removeLayer(citiesLayer);
					mymap.removeLayer(cityCirclesLayer);
					mymap.removeLayer(touristClusterMarkers);
					mymap.removeLayer(shopClusterMarkers);
					mymap.removeLayer(amenityClusterMarkers);
					mymap.removeControl(layersControl);
					if (mymap.hasLayer(invisibleBorders)) {
						document.getElementById('borderToggle').click();
					}
					document.getElementById('selectCountries').value = selectedCountry;
					displayCountry(isoa3Code);
					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
		}, (error) => {
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
			
			console.log(error);
			if (error.code == error.PERMISSION_DENIED) console.log("where are you");
				document.getElementById('needLocation').click();
		});
}).addTo(mymap);

L.easyButton('fa-info-circle', function() {
	document.getElementById('infoSym').click();
}).addTo(mymap);

// https://leafletjs.com/examples/mobile/  https://stackoverflow.com/questions/10563789/how-to-locate-user-with-leaflet-locate

//mymap.locate({
//  setView: true,
//  maxZoom: 1
//}).on("locationfound", onLocationFound).on("locationerror", onLocationError);

//Functions 

function displayCountry(isoa3Code) {
	displayCount++
	//document.getElementById('startMap').setAttribute('style', 'display: none');
	document.getElementById('viewCountryText').innerHTML = 'Loading...';
	
	$('#viewCountryBtn').button('toggle')
  let bounds;
	for (let c = 0; c < countryBorders.length; c++) {
		if (countryBorders[c].properties.iso_a3 == isoa3Code) {
			bounds = countryBorders[c].properties.bounds;
		}
	}
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
	
  selectedCountryLayer = L.geoJSON();

  let borderlines;
  let isoA3;
  let isoA2;
  let capital;
  let currency;

  myNorthEast = bounds._northEast;
  mySouthWest = bounds._southWest;
  fitBoundsArr = [];

  let { lat, lng } = myNorthEast;

  fitBoundsArr.push([lat, lng]);

  corner1 = L.latLng(lat, lng);
  ({ lat, lng } = mySouthWest);

  fitBoundsArr.push([lat, lng]);

  corner2 = L.latLng(lat, lng);
  viewportBounds = L.latLngBounds(corner1, corner2);

	//userLocationMarker.openPopup();

  mymap.flyToBounds(viewportBounds, {
      duration: 1.5
  });

  //if (firstLoad == false) {
  //  mymap.flyToBounds(viewportBounds, {
  //    duration: 1.5
  //  });
  //}
	
	//else {
    //firstLoad = false;
    //mymap.flyTo([mylat, mylng], 12, {
    //  duration: 3
    //});
    //zoomLocationTimer = setTimeout(function() {
    //  mymap.flyToBounds(viewportBounds, {
    //    duration: 3.25
    //  });
    //  clearTimeout(zoomLocationTimer);
    //}, 3000);
	//}
  for (let i = 0; i < countryBorders.length; i++) {
    if (countryBorders[i]["properties"].bounds == bounds) {
      currentCountry = countryBorders[i]["properties"].name;
      if (countryBorders[i]["geometry"]["type"] == 'MultiPolygon') {
        currentCountryPolygons = countryBorders[i]["geometry"]["coordinates"];
      } else {
        currentCountryPolygons = [countryBorders[i]["geometry"]["coordinates"]];
      }
			//'<span id="infoSym">&nbsp&#9432</span>'
      //document.getElementById("viewCountryText").innerHTML = currentCountry;
      document.getElementById("countryModalTitle").innerHTML = currentCountry;
      isoA3 = countryBorders[i]["properties"].iso_a3;
      isoA2 = countryBorders[i]["properties"].iso_a2;
    }
  }

  for (let i = 0; i < allRestCountries.length; i++) {
    if (allRestCountries[i].alpha3Code == isoA3) {
      let textValue = allRestCountries[i].nativeName;
      document.getElementById("nativeName").innerHTML = 'Native name: ' + textValue;
      document.getElementById("population").innerHTML = parseInt(allRestCountries[i].population).toLocaleString('en-US');
      document.getElementById("currency").innerHTML = allRestCountries[i].currencies[0].code;
      currency = allRestCountries[i].currencies[0].code;
      document.getElementById("currencyName").innerHTML = allRestCountries[i].currencies[0].name;
      document.getElementById("flagIMG").setAttribute("src", allRestCountries[i].flag);
      document.getElementById("capital").innerHTML = allRestCountries[i].capital;
      capital = allRestCountries[i].capital;
    }
  }
	
	function onEachFeature(feature, layer) {
    layer.on({
      click: function() {
				document.getElementById('infoSym').click();
         // close else
      } // end of click function
    }); // close layer.on
  } // end of onEachFeature function
	
	
  borderLines = L.geoJSON(countryBorders, {
    style: function(feature) {
      if (feature.properties.bounds == bounds) {
        return {
          color: "#ff0000"
        };
      }
    },
    filter: function(feature) {
      if (feature.properties.bounds != bounds) {
        return false;
      } else {
        return true;
      }
    },
		onEachFeature: onEachFeature
  });

  borderLines.addTo(selectedCountryLayer);
  //selectedCountryLayer.addTo(mymap);
  
	if (typeof capitalMarker == "object") {
    capitalMarker.remove();
  }

  //loadingTime(0);

  document.getElementById("progressBar").setAttribute('style', 'visibility: initial');
	//document.getElementById("viewCountryText").innerHTML = 'fetching capital city';
	document.getElementById("loadingText").innerHTML = 'fetching capital city';
  document.getElementById("progressBar").setAttribute('style', "width: 10%;");
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
      let lat;
      let lng;
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
			
			//document.getElementById("viewCountryText").innerHTML = 'fetching weather data';
			document.getElementById("loadingText").innerHTML = 'fetching weather data';
      document.getElementById("progressBar").setAttribute('style', "width: 30%;");
      
			$.ajax({
        url: "libs/php/openWeather.php",
        type: "POST",
        dataType: "json",
        data: {
          lat: lat,
          lng: lng,
        },
        success: function(result) {
					console.log('weather', result);
					if (!result.data.current) {
						abortfunction('openWeather Error');
					}
          document.getElementById("currentWeather").innerHTML = result.data.current.weather[0].description;
          /* Weather Icon
						document
            .getElementById("weatherIcon")
            .setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" +
             result.data.current.weather[0].icon +
             "@2x.png"
             ); 
					*/
          
					//document.getElementById("viewCountryText").innerHTML = 'fetching time data';
					document.getElementById("loadingText").innerHTML = 'fetching time data';					          
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
              document.getElementById("progressBar").setAttribute('style', "width: 60%;");
							
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
								//let m = checkTime(now.getMinutes(3));
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
									//if (timer == 30) {
									//  console.log("browser data string", now);
									//}
								}, 1000);
							}
							
							startTime(timeString);
							
							//document.getElementById("viewCountryText").innerHTML = 'fetching wikipedia data';
							document.getElementById("loadingText").innerHTML = 'fetching wikipedia data';
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
                  //if (!result.data.geonames) {
                  //  document.getElementById("wikierror").innerHTML = result.data.status.message;
                  //} else {
                    for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
                      let placeArticle = result.data.geonames[oneArt];
                      let wikiurl = 'http://' + `${placeArticle.wikipediaUrl}`;
                      let placePopup = L.popup({
												className: 'wikiPopup'
											});
                      if (!placeArticle.thumbnailImg) {
                        placePopup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
                      } else {
                        let imgurl = '"' + placeArticle.thumbnailImg.toString() + '"';
                        placePopup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
                      }
                      													
											let wikiMarker = L.ExtraMarkers.icon({
												icon: 'fa-wikipedia-w',
												markerColor: 'white',
												iconColor: 'blue',
												shape: 'square',
												prefix: 'fab',
												shadowSize: [0, 0]
											});
																								
                      let marker = L.marker([placeArticle.lat, placeArticle.lng], {icon: wikiMarker}).bindPopup(placePopup);
                      for (let n = 0; n < newPolygons.length; n++) {
                        let onePolygon = L.polygon(newPolygons[n]);
                        if (onePolygon.contains(marker.getLatLng())) {
                          listOfMarkers.push(marker);
                          listOfTitlesPlace.push(placeArticle.title);
                        }
                      }
                    }
                  //}
                  //document.getElementById("viewCountryText").innerHTML = 'fetching more wikipedia data';
									document.getElementById("loadingText").innerHTML = 'fetching more wikipedia data';
                  document.getElementById("progressBar").setAttribute('style', "width: 90%;");
						
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
										//if (result.length == 0) {
										//	abortfunction();
										//}
											console.log('bbox result', result);
											if (!result.data.geonames) {
												abortfunction('geonamesWikibbox Error');
											}
										
                      let listOfTitlesbbox = []
                      //if (!result.data.geonames) {
                      //  document.getElementById("loadingText").innerHTML = "Sorry data didn't load please refresh the page";
                      //  document.getElementById("viewCountryText").innerHTML = "Sorry data didn't load please refresh the page";
                      //} else {

                        for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
                          let article = result.data.geonames[oneArt];
                          let wikiurl = `http://${article.wikipediaUrl}`;
                          let popup = L.popup({
														className: 'wikiPopup'
													});
                          popup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${article.title}` + '</a>');
													
													let wikiMarker = L.ExtraMarkers.icon({
														icon: 'fa-wikipedia-w',
														markerColor: 'white',
														iconColor: 'blue',
														shape: 'square',
														prefix: 'fab',
														shadowSize: [0, 0]
													});
													
                          let marker = L.marker([article.lat, article.lng], {icon: wikiMarker}).bindPopup(popup);
                          for (let n = 0; n < newPolygons.length; n++) {
                            let onePolygon = L.polygon(newPolygons[n]);
                            if (onePolygon.contains(marker.getLatLng())) {
                              if (!listOfTitlesPlace.includes(article.title)) {
                                if (!listOfTitlesbbox.includes(article.title)) {
                                  //clusterMarkers.addLayer(marker);
                                  listOfMarkers.push(marker);
                                  listOfTitlesbbox.push(article.title);
                                } // end of if
                              } // end of if
                            } // end of if
                          } // end of polygons for loop
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

													return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
												},
												showCoverageOnHover: false
											});

											for (let i = 0; i < listOfMarkers.length; i++) {
												wikiClusterMarkers.addLayer(listOfMarkers[i]);
											}

												document.getElementById("loadingText").innerHTML = 'fetching cities';
												document.getElementById("progressBar").setAttribute('style', "width: 95%;");
												
												/* geonames cities & POI */
												$.ajax({
												url: "libs/php/geonamesCities.php",
												type: "POST",
												dataType: "json",
												data: {
													north: bounds['_northEast'].lat,
													south: bounds['_southWest'].lat,
													east: bounds['_northEast'].lng,
													west: bounds['_southWest'].lng
												},
												success: function (result) {
														if (!result.data.geonames) {
															abortfunction('geonamesCities Error');
														}
														console.log('geonamesCities result', result);
														
														let citiesMarkers = [];
														let citiesCircles = [];
														
														for (let icity = 0; icity < result.data.geonames.length; icity++) {
															let city = result.data.geonames[icity];
															let cityPopup = L.popup({
																className: 'wikiPopup'
															});
															
															//let cityURL;
															//if (pointOfInterest.poi.url) {
															//	poiURL = pointOfInterest.poi.url;
															//	if (poiURL.includes('http')) {
															//		poiPopup.setContent('<a href=' + `${poiURL}` + ' target="_blank">' + `${pointOfInterest.poi.name}` + '</a>');																	
															//	} else {
															//		poiPopup.setContent('<a href=http://' + `${poiURL}` + ' target="_blank">' + `${pointOfInterest.poi.name}` + '</a>');																	
															//	}
															//} else {
															//	poiPopup.setContent(pointOfInterest.poi.name);															
															//}
																														
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

			
															let cityMarker;
															/*
															if (city.population < 10000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle1 badge rounded-pill bg-secondary1',
																html: city.name
																})
															}	else if (city.population < 100000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle2 badge rounded-pill bg-secondary2',
																html: city.name
																});
															} else if (city.population < 200000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle3 badge rounded-pill bg-secondary3',
																html: city.name
																});
															} else if (city.population < 500000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle4 badge rounded-pill bg-secondary4',
																html: city.name
																});
															} else if (city.population < 1000000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle5 badge rounded-pill bg-secondary5',
																html: city.name
																});
															} else if (city.population < 1000000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle6 badge rounded-pill bg-secondary6',
																html: city.name
																});
															} else if (city.population < 5000000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle7 badge rounded-pill bg-secondary7',
																html: city.name
																});
															} else if (city.population < 10000000) {
																cityMarker = L.divIcon({
																className: 'cityMarkerStyle8 badge rounded-pill bg-secondary8',
																html: city.name
																});
															} else {
															}
															*/
															cityMarker = L.divIcon({
																className: 'cityMarkerStyle badge rounded-pill bg-secondary-cm',
																html: city.name
															});
															
															let radius;
															let cityCircle;
															if (city.population) {
																cityPopup.setContent(city.name + ' - Population: ' + city.population	);
																radius = city.population/100 > 20000 ? 20000 : city.population/100;	
															  cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08'}).bindPopup(cityPopup);
															} else {
																cityPopup.setContent(city.name + ' - Population unknown'	);
																radius = 200;							
															  cityCircle = L.circle([city.lat, city.lng], radius, {color: '#b30a08'}).bindPopup(cityPopup);
															}

															let marker = L.marker([city.lat, city.lng], {icon: cityMarker}).bindPopup(cityPopup);
															for (let n = 0; n < newPolygons.length; n++) {
																let onePolygon = L.polygon(newPolygons[n]);
																if (onePolygon.contains(marker.getLatLng())) {
																	citiesMarkers.push(marker);
																	citiesCircles.push(cityCircle);
																}
															}

														}
													
												let poiMarkers = [];
												
												console.log('Cities found: ',citiesMarkers);
												
												let slicedCitiesMarkers = [...citiesMarkers];
												
												function getRandom(arr, size) {
													console.log('size', size);
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
												
												let poiObjs = []
												
												for ( let irandM = 0; irandM < randomMarkers.length; irandM ++) {
														let {lat, lng} = randomMarkers[irandM].getLatLng();
														let poiObj = {}
														poiObj.index = irandM
														poiObj['lat'] = lat;
														poiObj['lng'] = lng;
														poiObjs.push(poiObj);
												}
												
												document.getElementById("loadingText").innerHTML = 'fetching points of interest';
												document.getElementById("progressBar").setAttribute('style', "width: 97%;");
												
												$.ajax({
													url: "libs/php/echo.php",
													type: "POST",
													dataType: "json",
													data: {
														poiData: poiObjs
													},
													success: function (result) {
														if (result.length == 0) {
															abortfunction('echo error');
														}
														console.log(result);
														
														let allPois = []
														
														for (let iresult = 0; iresult < result.length; iresult ++) {
															if (result[iresult].data.poi) {
															for (let p = 0; p < result[iresult].data.poi.length; p ++) {
																allPois.push(result[iresult].data.poi[p]);
															}
															} else {
																continue;
															}
														}
														
														console.log('allPois ', allPois)
														
														touristMarkers = [];
														shopMarkers = [];
														amenityMarkers = [];
														let amenityTypes = [];
														let poiTypes = []
														
														let touristMarker = L.ExtraMarkers.icon({
															icon: 'fa-map',
															markerColor: 'pink',
															shape: 'square',
															prefix: 'far',
															shadowSize: [0, 0]
														});
																																										
														let shopMarker = L.ExtraMarkers.icon({
															icon: 'fa-shopping-bag',
															markerColor: 'white',
															iconColor: 'green',
															shape: 'square',
															prefix: 'fas',
															shadowSize: [0, 0]
														});
														
														let amenityMarker = L.ExtraMarkers.icon({
															icon: 'fa-star',
															markerColor: 'orange',
															iconColor: 'black',
															shape: 'star',
															prefix: 'fas',
															shadowSize: [0, 0]
														});
														
														for (let imarker = 0; imarker < allPois.length; imarker ++) {
															let oneMarker = allPois[imarker];
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
																	//, {icon: poiMarker}).bindPopup(poiPopup);
																	touristMarkers.push(poiMarker);																		
																} else if (oneMarker.typeClass == 'shop') {
																	let poiPopup = L.popup({
																		className: 'wikiPopup'
																	});
																	poiPopup.setContent(oneMarker.name);
																	let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: shopMarker}).bindPopup(poiPopup);
																	//, {icon: poiMarker}).bindPopup(poiPopup);
																	shopMarkers.push(poiMarker);
																} else if (oneMarker.typeClass == 'amenity'){
																		let poiPopup = L.popup({
																			className: 'wikiPopup'
																		});
																		poiPopup.setContent(oneMarker.typeName);
																		let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: amenityMarker}).bindPopup(poiPopup);
																		//, {icon: poiMarker}).bindPopup(poiPopup);
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
																		//, {icon: poiMarker}).bindPopup(poiPopup);
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

															return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
														},
														showCoverageOnHover: false
														});
														
														for (let i = 0; i < amenityMarkers.length; i++) {
															amenityClusterMarkers.addLayer(amenityMarkers[i]);
														}
														
														console.log('amenityTypes', amenityTypes);
														console.log('poiTypes ', poiTypes);

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

															return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
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

															return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
														},
														showCoverageOnHover: false
														});
														
														for (let i = 0; i < shopMarkers.length; i++) {
															shopClusterMarkers.addLayer(shopMarkers[i]);
														}
														//keep at center ajax

														console.log('tourist ',touristMarkers.length);
														console.log('shops ', shopMarkers.length);
														console.log('amenities ',amenityMarkers.length);

														document.getElementById("loadingText").innerHTML = '';
														document.getElementById("progressBar").setAttribute('style', "width: 100%;");
														document.getElementById("viewCountryText").innerHTML = currentCountry;
														let progressTimer = setTimeout(function() {
														//document.getElementById("progressBar").setAttribute('style', 'visibility: hidden');		
														document.getElementById("progressBar").setAttribute('style', "width: 0%; visibility: hidden");
														if (firstLoad == true ){
																//userCircle.addTo(mymap);
																//userLocationMarker.addTo(mymap).bindPopup(userPopup).openPopup();
																//capitalMarker.addTo(mymap).openPopup();
																//selectedCountryLayer.addTo(mymap);
																//$("#startMap").fadeIn(250);
																//firstLoad = false;
														}
														clearTimeout(progressTimer);
														}, 1500);
														
															//userLocationMarker.addTo(mymap).bindPopup(userPopup).openPopup();
															
															touristLayer = L.layerGroup(touristMarkers);
															shopLayer = L.layerGroup(shopMarkers);
															amenityLayer = L.layerGroup(amenityMarkers);
															citiesLayer = L.layerGroup(citiesMarkers);
															cityCirclesLayer = L.layerGroup(citiesCircles);
															if (userFound == true) {
																userLayer = L.layerGroup([userCircle, userLocationMarker]);
																userLayer.addTo(mymap);
																userLocationMarker.openPopup();
															}


															
															newPolygons = [];
																									
															//mymap.addLayer(wikiClusterMarkers);
															
															//if (firstLoad == false) {
															selectedCountryLayer.addTo(mymap);
															capitalMarker.addTo(mymap).openPopup();
															///}

															console.log('userFound', userFound);
															if (userFound == true) {
																overlays = {
																	"Your location": userLayer,
																	"Capital": capitalMarker,
																	"Highlight": selectedCountryLayer,
																	//"Wikipedia": wikiLayer,
																	"Wikipedia Articles": wikiClusterMarkers,
																	//'geoCities': citiesLayer,
																	'Cities': cityCirclesLayer,
																	'Tourist Spots': touristClusterMarkers,
																	'Shops': shopClusterMarkers,
																	'Amenities': amenityClusterMarkers
																	//"Hospitals": tomTomClusterMarkers
																}
															} else if (userFound == false){
																console.log('create overlays');
																overlays = {
																	"Capital": capitalMarker,
																	"Highlight": selectedCountryLayer,
																	//"Wikipedia": wikiLayer,
																	"Wikipedia Articles": wikiClusterMarkers,
																	//'geoCities': citiesLayer,
																	'Cities': cityCirclesLayer,
																	'Tourist Spots': touristClusterMarkers,
																	'Shops': shopClusterMarkers,
																	'Amenities': amenityClusterMarkers
																	//"Hospitals": tomTomClusterMarkers
																}	
															}
															layersControl = L.control.layers(baseMaps, overlays);
															layersControl.addTo(mymap);
															
															let layerCheck = 0;
															let zoomCount = 0;
															
															mymap.on('zoomend', function() {
																zoomCount++;
																
																if (mymap.hasLayer(cityCirclesLayer)) {
																	if (mymap.hasLayer(citiesLayer)) {
																		if (mymap.getZoom() >= 7 ) {
																				layerCheck = 1;
																				console.log('zoomCount', zoomCount);
																				console.log('zoom in layerCheck', layerCheck);
																			if (baseLayerName != 'Watercolour') {
																				mymap.removeLayer(citiesLayer);
																			}
																		}
																	} else {
																		if (mymap.getZoom() <=6) {
																				console.log('zoomCount', zoomCount);
																				console.log('zoom out layerCheck', layerCheck);
																			//if ( cityNamesRemovedByUser == false ) {
																			//	if (layerCheck != 0) {
																					citiesLayer.addTo(mymap);
																					layerCheck = 1;
																			//	}
																			//}
																		}
																	}
																}																
															});

											
															// END OF KEEP AT CENTRE AJAX	


													},
													error: function (jqXHR, textStatus, errorThrown) {
															// error code
															console.log('POI error');
															console.log(textStatus);
															console.log(errorThrown);
														},
													}); // end of geonamesPOI ajax
												/*
												
												geonamesPoiFunc(randomMarkers);
												
												function geonamesPoiFunc(markerlist) {
													
													if (markerlist.length > 0) {
														
														let { lat, lng } = markerlist[0].getLatLng();
														
														$.ajax({
														url: "libs/php/geonamesPOI.php",
														type: "POST",
														dataType: "json",
														data: {
															poilat: lat,
															poilng: lng
														},
														success: function (result) {
															console.log(markerlist[0]._popup._content);
															console.log(result.data);
															
															if (result.data.length != 0) {
																for (let ipoi = 0; ipoi < result.data.poi.length; ipoi ++) {
																	let onePoi = result.data.poi[ipoi];
																	poiMarkers.push(onePoi);
																}
															}
															geonamesPoiFunc(markerlist.slice(1))															
														},
														error: function (jqXHR, textStatus, errorThrown) {
																// error code
																console.log('POI error');
																console.log(textStatus);
																console.log(errorThrown);
															},
														}); // end of geonamesPOI ajax
																	
													
													} else {
														console.log('ALL Points of Interest:');
														console.log(poiMarkers);
															
															let touristMarkers = [];
															let shopMarkers = [];
															
														  let touristMarker = L.ExtraMarkers.icon({
																icon: 'fa-map',
																markerColor: 'pink',
																shape: 'square',
																prefix: 'far',
																shadowSize: [0, 0]
															});
																																											
														  let shopMarker = L.ExtraMarkers.icon({
																icon: 'fa-shopping-bag',
																markerColor: 'white',
																iconColor: 'blue',
																shape: 'square',
																prefix: 'fas',
																shadowSize: [0, 0]
															});
															
															for (let imarker = 0; imarker < poiMarkers.length; imarker ++) {
																let oneMarker = poiMarkers[imarker];
																if (oneMarker.name != "") {
																	if (oneMarker.typeClass == 'tourism') {
																		let poiPopup = L.popup({
																			className: 'wikiPopup'
																		});
																		poiPopup.setContent(oneMarker.name);
																		let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: touristMarker}).bindPopup(poiPopup);
																		//, {icon: poiMarker}).bindPopup(poiPopup);
																		touristMarkers.push(poiMarker);	
																	} else if (oneMarker.typeClass == 'shop') {
																		let poiPopup = L.popup({
																			className: 'wikiPopup'
																		});
																		poiPopup.setContent(oneMarker.name);
																		let poiMarker = L.marker([oneMarker.lat, oneMarker.lng], {icon: shopMarker}).bindPopup(poiPopup);
																		//, {icon: poiMarker}).bindPopup(poiPopup);
																		shopMarkers.push(poiMarker);
																	}
																} 
															}
														} //  close else of geonamesPoiFunc
												} // close geonamesPoiFunc
												
												*/
															
												},
												error: function (jqXHR, textStatus, errorThrown) {
														// error code
														console.log('geonames cities error');
														console.log(textStatus);
														console.log(errorThrown);
													},
												}); // end of geonames cities ajax
												
												
												/* tomtom 
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
													
												*/
												
												//} end of else
											
											// TOAST DISPLAY
											/*if (displayCount == 2) {
												document.getElementById('toastie').setAttribute('class', 'toast show');
												let toastieTimeout = setTimeout(function () {
													document.getElementById('toastie').setAttribute('class', 'toast');
													clearTimeout(toastieTimeout);
												}, 3500);											
											}
											*/
												
                      // }  close wiki bbox else
											                     
								
											/* AMADEUS
											
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
											
											*/ // END OF AMADEUS

                      //remove when exchange rate active
                      document.getElementById("exchangeRate").innerHTML = '1 USD = ' + "0.745335";
											/* EXCHANGE RATE API 1000 CALLS / MONTH
                      $.ajax({
                      url: "dist/php/openExchange.php",
                      type: "POST",
                      dataType: "json",
                      data: {},
                      success: function (result) {
                      	for (let [key, value] of Object.entries(
                      		result.data.rates
                      	)) {
                      		if (key == currency) {
                      			document.getElementById("exchangeRate").innerHTML =
                      				value;
                      		}
                      	}
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                      		// error code
                      		console.log('OpenExchange error');
                      		console.log(textStatus);
                      		console.log(errorThrown);
                      	},
                      }); // end of OpenExchange ajax
                      */
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                      document.getElementById("viewCountryText").innerHTML = "Sorry data didn't load please refresh the page";
                      console.log('geonamesWikibbox error');
                      console.log(textStatus);
                      console.log(errorThrown);
                    },
                    complete: function() {
                      //document.getElementById("loadingTimer").innerHTML = "";
                      //clearTimeout(loadingTimer);
											//clearTimeout(loadingTimer);
											//stopLoadingCount = true;
                    }
                  }); //end of geonamesWikibbox
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log('geonamesWikierror');
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              }); //end of geonamesWiki ajax														
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log('timezone error');
              console.log(textStatus);
              console.log(errorThrown);
            },
          }); //end of timeZone ajax
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('OpenWeather error');
          console.log(textStatus);
          console.log(errorThrown);
        },
      }); //end of OpenWeather ajax 
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    }
  }); //end of OpenCage ajax		

} // end of DISPLAY COUNTRY 

function countryBordersFunc(response) {

  countryBorders = response.features;
  for (let i = 0; i < countryBorders.length; i++) {
    let country = countryBorders[i];
    let title = country["properties"]["name"];
    let geojsonLayer = L.geoJson(country);
    countryBorders[i]["properties"]["bounds"] = geojsonLayer.getBounds();
  }

  function onEachFeature(feature, layer) {
    layer.on({
      click: function() {
        function kosovoFunc() {
          document.getElementById('errorModalTitle').innerHTML = 'Kosovo';
          document.getElementById('errorName').innerHTML = 'No data to display for Kosovo';
          document.getElementById('viewErrorCountryBtn').click();
        }

        function nCyprusFunc() {
          document.getElementById('errorModalTitle').innerHTML = 'North Cyprus';
          document.getElementById('errorName').innerHTML = 'No data to display for North Cyprus';
          document.getElementById('viewErrorCountryBtn').click();
        }

        function somalilandFunc() {
          document.getElementById('errorModalTitle').innerHTML = 'Somaliland';
          document.getElementById('errorName').innerHTML = 'No data to display for Somaliland';
          document.getElementById('viewErrorCountryBtn').click();
        }
        let isoa3Code;
        if (feature.properties.name == 'Kosovo') {
          return (kosovoFunc());
        } else if (feature.properties.name == 'N. Cyprus') {
          return (nCyprusFunc());
        } else if (feature.properties.name == 'Somaliland') {
          return (somalilandFunc());
        } else {
          isoa3Code = feature.properties.iso_a3;
					
					mymap.removeLayer(selectedCountryLayer);
					mymap.removeLayer(invisibleBorders);
					//mymap.removeLayer(wikiLayer);
					mymap.removeControl(layersControl);
		          
					toggleBorders.checked = toggleBorders.checked == true ? false : true;
          
					clearTimeout(timer);

					firstLoad = false;
          displayCountry(isoa3Code);
        } // close else
      } // end of click function
    }); // close layer.on
  } // end of onEachFeature function
	
  invisibleBorders = L.geoJSON(countryBorders, {
    style: function(feature) {
      return {
        color: "#000000",
        fillColor: "rgba(0,0,0,0)"
      };
    },
    onEachFeature: onEachFeature
  });
	
	
//$.getJSON("libs/json/allRestCountries.json", (response) =>
	
	$.ajax({
		url: "libs/php/getAllRestCountries.php",
		type: "POST",
		dataType: "json",
		data: {},
		success: function (result) {
    allRestCountries = result.data;
    for (let i = 0; i < allRestCountries.length; i++) {
      if (!regions.includes(allRestCountries[i].region)) {
        regions.push(allRestCountries[i].region);
      }
      for (let x = 0; x < countryBorders.length; x++) {
        if (allRestCountries[i].alpha3Code == countryBorders[x]["properties"].iso_a3) {
          countryBorders[x]["properties"]["region"] = allRestCountries[i].region;
        }
      }
    }
    regions.sort();
    countryBorders.sort((a, b) => a.properties.name > b.properties.name ? 1 : -1);
    for (let r = 0; r < regions.length; r++) {
      let regionText = regions[r];
      for (let i = 0; i < countryBorders.length; i++) {
        if (countryBorders[i]["properties"].region == regionText) {
          let textValue = regionText + ": " + countryBorders[i]["properties"].name;
          let node = document.createElement("option");
          node.innerHTML = textValue;
          node.setAttribute("value", textValue);
					dropdownList.push(textValue);
          document.getElementById("selectCountries").appendChild(node);
          // use this to manually choose user country on load
          //if (countryBorders[i]['properties'].name == "United Kingdom") {
          //myBounds = countryBorders[i]['properties'].bounds;
          //}
        }
      }
    }
		
    //displayCountry(myBounds) to be  used with code above
				
		mymap.locate({
			//setView: false,
			//maxZoom: 4
		}).on("locationfound", onLocationFound).on("locationerror", onLocationError);
    
		
  },
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('country borders error');
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
} // end of countryBordersFunc

//EVENT HANDLERS

$('#goToCountry').click(function(event) {
	if (firstLoad == true) {
		//document.getElementById('startMap').setAttribute('style', 'display: none');
		firstLoad = false;
	}
	firstLoad = false;
  event.preventDefault();
  let completeFunction = true
  let selectedCountry = document.getElementById('selectCountries');
  if (selectedCountry.value == "") {
    document.getElementById('goToCountry').setAttribute('data-dismiss', "stop");
    document.getElementById('selectCountryError').setAttribute('style', 'visibility: visible')
    completeFunction = false
  } else {
    if (document.getElementById('goToCountry').getAttribute('data-dismiss') == 'stop') {
      document.getElementById('goToCountry').setAttribute('data-dismiss', "modal");
    }
  }
  if (completeFunction == true) {
    mymap.removeLayer(selectedCountryLayer);
    mymap.removeLayer(invisibleBorders);
    //mymap.removeLayer(wikiLayer);
    mymap.removeControl(layersControl);
    clearTimeout(timer);
    let isoa3Code;
    countryBorders.forEach(function(arrayItem) {
      if (selectedCountry.value.includes(arrayItem.properties.name)) {
        //newBounds = arrayItem.properties.bounds;
        isoa3Code = arrayItem.properties.iso_a3;
      }
    });
    displayCountry(isoa3Code);
  }
}); // end of goToCountryBtn

selectDropDown.addEventListener("change", function (event) {
  let completeFunction = true
  selectedCountry = event.target.value;
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
    mymap.removeLayer(selectedCountryLayer);
    mymap.removeLayer(invisibleBorders);
    //mymap.removeLayer(wikiLayer);
    mymap.removeLayer(wikiClusterMarkers);
    mymap.removeLayer(citiesLayer);
    mymap.removeLayer(cityCirclesLayer);
    mymap.removeLayer(touristClusterMarkers);
    mymap.removeLayer(shopClusterMarkers);
		mymap.removeLayer(amenityClusterMarkers);
    mymap.removeControl(layersControl);
    clearTimeout(timer);
    let isoa3Code;
    countryBorders.forEach(function(arrayItem) {
      if (event.target.value.includes(arrayItem.properties.name)) {
        //newBounds = arrayItem.properties.bounds;
        isoa3Code = arrayItem.properties.iso_a3;
      }
    });
    displayCountry(isoa3Code);
  }
}, false)
	
/* const bordersOn = document.getElementById("borderToggle");

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

*/

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



$('#closeToastie').click(function (){
	console.log('check');
	document.getElementById('toastie').setAttribute('class', 'toast');
});

mymap.on('overlayadd', function(e) {
  if (e.name == 'Capital') {
		capitalMarker.openPopup();
  };
	if (e.name == 'Your location') {
		userLocationMarker.openPopup();	
	};
	if (e.name == 'Cities') {
		if (baseLayerName == 'Watercolour') {
			citiesLayer.addTo(mymap);			
		} else if (mymap.getZoom() <= 6){
			citiesLayer.addTo(mymap);
			layerCheck = 1;
		}
	};
	if (e.name == 'Tourist Spots') {
		if (touristMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No tourist spots were found for this country';
			document.getElementById('emptyLayer').click();
			console.log('No tourist info')
		};
	};
	if (e.name == 'Shops') {
		if (shopMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No shops were found for this country';
			document.getElementById('emptyLayer').click();
			console.log('No shop info')
		};
	};
	if (e.name == 'Amenities') {
		if (amenityMarkers.length == 0) {
			document.getElementById('noMarkersFound').innerHTML = 'No amenities were found for this country';
			document.getElementById('emptyLayer').click();
			console.log('No amenity info')
		};
	};
});

mymap.on('overlayremove', function(e) {
	//if (e.name == 'citycircles') {
	//	mymap.removeLayer(citiesLayer);	
	//};
	if (e.name == 'Cities') {
		mymap.removeLayer(citiesLayer);	
	}
});

mymap.on('baselayerchange', function(e) {
  console.log('base layer changed to ' + e.name);
	baseLayerName = e.name;
	if (e.name == 'Atlas') {
		if (mymap.hasLayer(citiesLayer)) {
			if (mymap.getZoom() >= 7) {
				mymap.removeLayer(citiesLayer);
				layerCheck = 1;
			}
		}
	};
	if (e.name == 'Watercolour') {
		if (mymap.hasLayer(cityCirclesLayer)) {
			if (!mymap.hasLayer(citiesLayer)) {
				if (mymap.getZoom() >= 7) {
					citiesLayer.addTo(mymap);
					layerCheck = 1;
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
				
//		});
//	};
//}	
		
$(document).ready(function () {

console.log('document.ready');
$.ajax({
	url: "libs/php/getCountryBorders.php",
	type: "POST",
	dataType: "json",
	data: {},
	success: function (result) {
		
		countryBordersFunc(result.data);
	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('country borders error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
});

		});
	};
}


/* stuff

/*
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

/*
let Stamen_TerrainLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});
*/

/*
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

	
QUESTIONS:

Is there a better way to find capital city location (another API?, instead of checking opencage for confidence etc)

THOUGHTS

learn about recursion and leakage making a clock
hanging questions / not perfection eg. ajax jqXHR, not sure what it is
*/