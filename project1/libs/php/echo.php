<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	//https://wtools.io/convert-json-to-php-array

	$resultsArray = array();


	$citiesCoords = $_REQUEST['poiData'];
	

	for ($x = 0; $x < count($citiesCoords); $x+=1) {
		
		$lat = $citiesCoords[$x]['lat'];
		$lng = $citiesCoords[$x]['lng'];
		$url='http://api.geonames.org/findNearbyPOIsOSMJSON?lat=' . $lat . '&lng=' . $lng . '&username=dymockb';
	
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
		$output['data'] = $decode;
		
		header('Content-Type: application/json; charset=UTF-8');
		
		array_push($resultsArray, $output);
	};
		
	//$output['status']['code'] = "200";
	//$output['status']['name'] = "ok";
	//$output['status']['description'] = "success";
	//$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	//$output['data'] = $_REQUEST['poiData'];
	
	//echo json_encode($poiArray);
	echo json_encode($resultsArray);
	

?>