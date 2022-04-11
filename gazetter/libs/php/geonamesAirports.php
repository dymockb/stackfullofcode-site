<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	//http://api.geonames.org/searchJSON?country=GB&username=dymockb&maxRows=40
	
	$url='http://api.geonames.org/searchJSON?q=airport&country=' . $_REQUEST['country'] . '&username=dymockb&maxRows=50';
	//$url='http://api.geonames.org/searchJSON?q=airport&country=GB&username=dymockb&maxRows=150';
	
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
	//$output['data'] = $decode;
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
