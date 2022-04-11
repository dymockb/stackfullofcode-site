<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	$url='http://api.exchangeratesapi.io/v1/symbols?access_key=e495500168faee09db7e31e05078d557';

	//$url='https://openexchangerates.org/api/latest.json?app_id=ec349985b99c4dfc88fdf780b5afd7ce';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	$symName = [];
	
	foreach($decode['symbols'] as $key => $value) {
		if($key == $_REQUEST['symbol']) {
			array_push($symName, $key);			
			array_push($symName, $value);			
		}
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $symName;
	$output['symbol'] = $_REQUEST['symbol'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
