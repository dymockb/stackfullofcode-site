<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	//https://wtools.io/convert-json-to-php-array
	$poiArray = array (
		0 => 
		array (
			'index' => 0,
			'lat' => 51.55796964156346,
			'lng' => -1.781158447265625,
		),
		1 => 
		array (
			'index' => 1,
			'lat' => 51.8796701576038,
			'lng' => -0.41748046875,
		),
		2 => 
		array (
			'index' => 2,
			'lat' => 51.2372,
			'lng' => -2.6266,
		),
		3 => 
		array (
			'index' => 3,
			'lat' => 54.9046457367726,
			'lng' => -1.38221740722656,
		),
		4 => 
		array (
			'index' => 4,
			'lat' => 50.90394649036434,
			'lng' => -1.4042820553079378,
		),
	);
	

	$test = array();

	for ($x = 0; $x <= 5; $x+=1) {
		array_push($test, $x);
	};
		
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $_REQUEST['poiData'];
	$what = $_REQUEST['poiData'];
	
	header('Content-Type: application/json; charset=UTF-8');
	
	//echo json_encode($poiArray);
	echo json_encode($poiArray);
	
?>