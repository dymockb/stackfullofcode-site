<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	$url = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=d2er4LmsADYxcap4AHZQbraGbqmIdToSaD00tL1tnQ8&mode=retrieveLandmarks&prox=' . $_REQUEST['markerLat'] . ','. $_REQUEST['markerLng'] . ',1000';
	
	/*
	$url='https://api.weatherbit.io/v2.0/forecast/daily?lat=' . $_REQUEST['markerLat'] . '&lon=' . $_REQUEST['markerLng'] . '&key=db7345f9de8c4d42b3478ec1ea7cf2f9';
	
		$forecast = [];

  foreach ($decode['data'] as $day) {

		$one = null;
		$one['type'] = 'Feature';
		$one['properties']['time'] = $day["datetime"];
		$one['properties']['temp'] = $day["temp"];
		$one['properties']['icon'] = $day["weather"]["icon"];
		$one['geometry']['type'] = 'Point';
		$one['geometry']['coordinates'][0] = $_REQUEST['locationLng'];
		$one['geometry']['coordinates'][1] = $_REQUEST['locationLat'];
		$one['geometry']['coordinates'][2] = 1;



		array_push($forecast, $one);

	}
	*/

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['Response']['View'][0]['Result'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
