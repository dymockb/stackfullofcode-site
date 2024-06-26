<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://openexchangerates.org/api/latest.json?app_id=ec349985b99c4dfc88fdf780b5afd7ce';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	$Xrates = [];
	
	foreach($decode['rates'] as $key => $value) {
		if($key == $_REQUEST['symbol']) {
			array_push($Xrates, $key);			
			array_push($Xrates, $value);			
		}
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $Xrates;
	$output['symbol'] = $_REQUEST['symbol'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
