<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='https://api.weatherbit.io/v2.0/forecast/daily?lat=' . $_REQUEST['locationLat'] . '&lon=' . $_REQUEST['locationLng'] . '&key=db7345f9de8c4d42b3478ec1ea7cf2f9';

	//$ch = curl_init();
	//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	//curl_setopt($ch, CURLOPT_URL,$url);

	//$result=curl_exec($ch);

	//curl_close($ch);

	//$decode = json_decode($result,true);	
	$decode = json_decode(file_get_contents('../../vendors/json/weatherbitStatic.json'),true);

	$forecast = [];

  foreach ($decode['data'] as $day) {

		$one = null;
		$one['temp'] = $day["temp"];
		$one['date'] = $day["datetime"];

		array_push($forecast, $one);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $forecast;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
