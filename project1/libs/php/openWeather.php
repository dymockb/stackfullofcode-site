<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['locationLat'] . '&lon=' . $_REQUEST['locationLng'] . '&appid=518c20b352a872e1f58d0bbebe080957&exclude=hourly,daily,minutely&units=metric';

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
	
	$output['data']['lat'] = $decode['lat'];
	$output['data']['lng'] = $decode['lon'];
	$output['data']['temp'] = $decode['current']['temp'];
	$output['data']['icon'] = $decode['current']['weather'][0]['icon'];
	$output['data']['description'] = $decode['current']['weather'][0]['description'];
	$output['data']['windDir'] = $decode['current']['wind_deg'];
	$output['data']['windSpd']= $decode['current']['wind_speed'];
	
	
	//$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
