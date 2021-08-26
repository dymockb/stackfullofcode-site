<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=PAR&maxPrice=200';
	//$url='https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=41.397158&longitude=2.160873';
	$url='https://test.api.amadeus.com/v1/reference-data/locations/pois/by-square?north=' . $_REQUEST['north'] . '&west=' . $_REQUEST['west'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&page%5Blimit%5D=10&page%5Boffset%5D=0';
	//'https://test.api.amadeus.com/v1/reference-data/locations/pois/by-square?north=41.397158&west=2.160873&south=41.394582&east=2.177181&page%5Blimit%5D=10&page%5Boffset%5D=0';
	
	$ch = curl_init();
	$authorization = 'Authorization: Bearer ' . $_REQUEST['amToken'];
	
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
	//curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
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

	echo json_encode($output); 


?>
