<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=PAR&maxPrice=200';
	//$url='https://test.api.amadeus.com/v1/security/oauth2/token?grant_type=client_credentials&client_id=' . '7SVuIW48l6YWeFS3jynfwTQeejXf8LXv' . '&client_secret=' . '4UpXZXJcH6AVk59f';

	$url='https://test.api.amadeus.com/v1/security/oauth2/token';

	$ch = curl_init();
	//$authorization = "Authorization: Bearer 7SVuIW48l6YWeFS3jynfwTQeejXf8LXv";
	
	//curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials&client_id=7SVuIW48l6YWeFS3jynfwTQeejXf8LXv&client_secret=4UpXZXJcH6AVk59f");
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
