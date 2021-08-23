<?php

	// remove for production
	// https://www.geonames.org/export/place-hierarchy.html#neighbours
	//http://api.geonames.org/timezoneJSON?lat=47.01&lng=10.2&username=dymockb
	// drop-down with lat and longs

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/neighboursJSON?country=' . $_REQUEST['country'] . '&username=dymockb';

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
	$output['data'] = $decode['geonames'];
	$output['totNeighbours'] = $decode['totalResultsCount'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
