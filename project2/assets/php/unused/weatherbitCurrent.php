<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	$url='https://api.weatherbit.io/v2.0/current?lat=' . $_REQUEST['locationLat'] . '&lon=' . $_REQUEST['locationLng'] . '&key=db7345f9de8c4d42b3478ec1ea7cf2f9';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	
	// if ($_REQUEST['counter'] == 0) {
	//			$decode = json_decode(file_get_contents('../../vendors/json/weatherbitStatic1.json'),true);
	// } elseif ($_REQUEST['counter'] == 1) {
	//			$decode = json_decode(file_get_contents('../../vendors/json/weatherbitStatic2.json'),true);		 
	// }


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data']['lat'] = $decode['data'][0]['lat'];
	$output['data']['lng'] = $decode['data'][0]['lon'];
	$output['data']['temp'] = $decode['data'][0]['temp'];
	$output['data']['icon'] = $decode['data'][0]['weather']['icon'];
	$output['data']['description'] = $decode['data'][0]['weather']['description'];
	$output['data']['windDir'] = $decode['data'][0]['wind_dir'];
	$output['data']['windSpd']= $decode['data'][0]['wind_spd'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
