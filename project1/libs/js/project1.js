//#sourceMappingURL=bootstrap/css/bootstrap-grid.css.map
//#sourceMappingURL=bootstrap/js/bootstrap.bundle.min.js.map
//#sourceMappingURL=bootstrap/js/bootstrap.min.js.map

window.onload = (event) => {	
	if ($('#preloader').length) {
		$('#preloader').delay(1000).fadeOut('slow', function () {
		$(this).remove();
		console.log("Window loaded");
		});
	};
}
	
let loadingTimer;
let loadingCount = 0
let stopLoadingCount = false
		
$(document).ready(function () {

function loadingpage(loadingCount) {
	loadingTimer = setTimeout(function () {
		loadingCount++;
		if (loadingCount < 8) {
			if (stopLoadingCount == false) { 
				loadingpage(loadingCount);
			}
		} else {
		document.getElementById('viewCountryText').innerHTML = 'Connection error. Please reload the page';
		//$('#viewCountryText').fadeIn(250);
		clearTimeout(loadingTimer);
		}
	}, 1000);
}

loadingpage(loadingCount);

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

let mylat, mylng, capitalMarker, timer, zoomLocationTimer, allRestCountrieslet, myBounds, newBounds,currentCountry, currentCountryPolygons, layersControl, currentisoA2, fijiUpdated, russiaUpdated, invisibleBorders, userLocationMarker,userPopup, wikiLayer, corner1, corner2, viewportBounds, userCircle

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

/*
let Stamen_TerrainLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});
*/

let mymap = L.map("mapid", {
  worldCopyJump: true,
  zoomControl: false,
  layers: [l1]
});

let baseMaps = {
	"Atlas": l1,
	"Watercolour": l2
}

new L.Control.Zoom({
  position: "bottomright"
}).addTo(mymap);


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
L.easyButton('fa-home', function() {
  clearTimeout(timer);
	if (firstLoad == true) {
		document.getElementById('startMap').setAttribute('style', 'display: none');
		firstLoad = false;
	}
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
          mymap.removeLayer(wikiLayer);
          mymap.removeControl(layersControl);
          if (mymap.hasLayer(invisibleBorders)) {
            document.getElementById('borderToggle').click();
          }
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
}).addTo(mymap);

L.easyButton('fa-info-circle', function() {
	document.getElementById('infoSym').click();
}).addTo(mymap);

// https://leafletjs.com/examples/mobile/  https://stackoverflow.com/questions/10563789/how-to-locate-user-with-leaflet-locate

mymap.locate({
  setView: true,
  maxZoom: 16
}).on("locationfound", onLocationFound).on("locationerror", onLocationError);

//Functions 

// Utility functions
function countLayers() {
  let il = 0;
  mymap.eachLayer(function() {
    il += 1;
  });
  return (`Map has ${il} layers.`);
}

function onLocationFound(e) {
  let radius = e.accuracy;
  let {
    lat,
    lng
  } = e.latlng;
  mylat = lat;
  mylng = lng;

  userCircle = L.circle(e.latlng, radius);

  let userIcon = new L.Icon({ 
    iconUrl: 'img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    //shadowSize: [41, 41]
  });

  userPopup = L.popup({
    autoClose: false,
		className: 'userPopup'
  }).setContent("You are within " + Math.floor(radius) + " meters from this point");

  userLocationMarker = L.marker(e.latlng, {
      icon: userIcon
    })
		
	//userLocationMarker.addTo(mymap).bindPopup(userPopup)
  //  .openPopup();
		
		
}

function onLocationError(e) {
  console.log(e.message);
  mymap.setView([51, 0], 16);
}

function loadingTime(count) {
  //document.getElementById("loadingTimer").innerHTML = count;
  count++
  loadingTimer = setTimeout(function() {
    loadingTime(count);
  }, 1000);
}

function displayCountry(isoa3Code) {
	displayCount++
	document.getElementById('startMap').setAttribute('style', 'display: none');
	//document.getElementById('viewCountryText').innerHTML = '';
	
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

  let {
    lat,
    lng
  } = myNorthEast;

  fitBoundsArr.push([lat, lng]);

  corner1 = L.latLng(lat, lng);
  ({
    lat,
    lng
  } = mySouthWest);

  fitBoundsArr.push([lat, lng]);

  corner2 = L.latLng(lat, lng);
  viewportBounds = L.latLngBounds(corner1, corner2);

	//userLocationMarker.openPopup();

  if (firstLoad == false) {
    mymap.flyToBounds(viewportBounds, {
      duration: 1.5
    });
  } 
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

  loadingTime(0);

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
      let capitalPopup = L.popup({autoPan: false, autoClose: false});
      let node = document.createElement("button");
      node.innerHTML = capital;
      node.setAttribute("type", "button");
      node.setAttribute("class", "badge rounded-pill bg-secondary");
      node.setAttribute("data-toggle", "modal");
      node.setAttribute("style", "font-size: 1rem");
      node.setAttribute("data-target", "#viewCountry");
      capitalPopup.setContent(node);
      capitalMarker = L.circleMarker([lat, lng], {
        color: 'red'
      }).bindPopup(capitalPopup);
      
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
                  if (!result.data.geonames) {
                    document.getElementById("wikierror").innerHTML = result.data.status.message;
                  } else {
                    for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
                      let placeArticle = result.data.geonames[oneArt];
                      let wikiurl = 'http://' + `${placeArticle.wikipediaUrl}`;
                      let placePopup = L.popup({
												className: 'wikiPopup'
											});
                      if (!placeArticle.thumbnailImg) {
                        placePopup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
                      } else {
                        let imgurl = '"' + placeArticle.thumbnailImg.toString() + '"'
                        placePopup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${placeArticle.title}` + '</a>');
                      }
                      													
                      let marker = L.marker([placeArticle.lat, placeArticle.lng]).bindPopup(placePopup);
                      for (let n = 0; n < newPolygons.length; n++) {
                        let onePolygon = L.polygon(newPolygons[n]);
                        if (onePolygon.contains(marker.getLatLng())) {
                          listOfMarkers.push(marker);
                          listOfTitlesPlace.push(placeArticle.title);
                        }
                      }
                    }
                  }
                  //document.getElementById("viewCountryText").innerHTML = 'fetching more wikipedia data';
									document.getElementById("loadingText").innerHTML = 'fetching more wikipedia data';
                  document.getElementById("progressBar").setAttribute('style', "width: 90%;");
									console.log('north', bounds['_northEast'].lat, 'south', bounds['_southWest'].lat, 'east', bounds['_northEast'].lng, 'west', bounds['_southWest'].lng);
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
                      let listOfTitlesbbox = []
                      if (!result.data.geonames) {
                        document.getElementById("loadingText").innerHTML = "Sorry data didn't load please refresh the page";
                        document.getElementById("viewCountryText").innerHTML = "Sorry data didn't load please refresh the page";
                      } else {
                        document.getElementById("progressBar").setAttribute('style', "width: 100%;");
	                      document.getElementById("viewCountryText").innerHTML = currentCountry;
												document.getElementById('loadingText').innerHTML = "";
                        let progressTimer = setTimeout(function() {
                          //document.getElementById("progressBar").setAttribute('style', 'visibility: hidden');		
													document.getElementById("progressBar").setAttribute('style', "width: 0%; visibility: hidden");
													if (firstLoad == true ){
															userCircle.addTo(mymap);
															userLocationMarker.addTo(mymap).bindPopup(userPopup).openPopup();
															capitalMarker.addTo(mymap).openPopup();
															$("#startMap").fadeIn(250);
															firstLoad = false;
													}
                          clearTimeout(progressTimer);
                        }, 1500);
                        for (let oneArt = 0; oneArt < result.data.geonames.length; oneArt++) {
                          let article = result.data.geonames[oneArt];
                          let wikiurl = `http://${article.wikipediaUrl}`;
                          let popup = L.popup({
														className: 'wikiPopup'
													});
                          popup.setContent('<a href=' + `${wikiurl}` + ' target="_blank">' + `${article.title}` + '</a>');
                          let marker = L.marker([article.lat, article.lng]).bindPopup(popup);
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
                      
												
											
                      //keep at center ajax (move inside exchange when active);

                      newPolygons = [];
                      wikiLayer = L.layerGroup(listOfMarkers);
                      wikiLayer.addTo(mymap);
                      
											if (firstLoad == false) {
												selectedCountryLayer.addTo(mymap);
												capitalMarker.addTo(mymap).openPopup();
											}
											
											let overlays = {
                        "Capital": capitalMarker,
                        "Highlight": selectedCountryLayer,
                        "Wikipedia": wikiLayer
                      }
                      layersControl = L.control.layers(baseMaps, overlays);
                      layersControl.addTo(mymap);
											// TOAST DISPLAY
											/*if (displayCount == 2) {
												document.getElementById('toastie').setAttribute('class', 'toast show');
												let toastieTimeout = setTimeout(function () {
													document.getElementById('toastie').setAttribute('class', 'toast');
													clearTimeout(toastieTimeout);
												}, 3500);											
											}
											*/
												
                      //remove when exchange rate active
                      document.getElementById("exchangeRate").innerHTML = '1 USD = ' + "0.745335";

                      } // close else
											
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
												
												$.ajax({
													url: "libs/php/amadeusRequest.php",
													type: "GET",
													dataType: "json",
													data: {
														amToken: amadeusToken
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
											clearTimeout(loadingTimer);
											stopLoadingCount = true;
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
} 

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
					mymap.removeLayer(wikiLayer);
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
          document.getElementById("selectCountries").appendChild(node);
          // use this to manually choose user country on load
          //if (countryBorders[i]['properties'].name == "United Kingdom") {
          //myBounds = countryBorders[i]['properties'].bounds;
          //}
        }
      }
    }
		
    //displayCountry(myBounds) to be  used with code above
    
		// this will set the map to user location's full country on load

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
		document.getElementById('startMap').setAttribute('style', 'display: none');
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
    mymap.removeLayer(wikiLayer);
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

const selectDropDown = document.getElementById("selectCountries");

selectDropDown.addEventListener("change", function (event) {
	console.log(event.target.value);
  let completeFunction = true
  let selectedCountry = event.target.value;
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
    mymap.removeLayer(wikiLayer);
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
          mymap.removeLayer(wikiLayer);
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

$('#closeToastie').click(function (){
	console.log('check');
	document.getElementById('toastie').setAttribute('class', 'toast');
});

/* stuff

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
	
QUESTIONS:

Is there a better way to find capital city location (another API?, instead of checking opencage for confidence etc)

THOUGHTS

learn about recursion and leakage making a clock
hanging questions / not perfection eg. ajax jqXHR, not sure what it is
*/