<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='https://api.tomtom.com/search/2/poiSearch/pizza.json?countrySet=' . $_REQUEST['isoa3'] . '&categorySet=7315&key=P4thY7MG6mQNmGzAvpVcBPV0sygKedvk&ofs=0&limit=5000';
	
	//$url='https://api.tomtom.com/search/2/poiSearch/california.json?countrySet='. $_REQUEST['isoa3'] .'&categorySet=7376&lon=' . $_REQUEST['lon'] . '&key=P4thY7MG6mQNmGzAvpVcBPV0sygKedvk&ofs=25&limit=100';
	
	$url='https://api.tomtom.com/search/2/poiSearch/hospital.json?countrySet='. $_REQUEST['isoa3'] .'&categorySet=7321&topLeft=' . $_REQUEST['topL'] . '&btmRight=' . $_REQUEST['btmR'] . '&key=P4thY7MG6mQNmGzAvpVcBPV0sygKedvk&ofs=25&limit=100';
	
	$ch = curl_init();
	
	//$authorization = 'Authorization: Bearer ' . $_REQUEST['amToken'];
	//curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
	
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
