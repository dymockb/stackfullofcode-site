<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	$url = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=d2er4LmsADYxcap4AHZQbraGbqmIdToSaD00tL1tnQ8&mode=retrieveLandmarks&prox=' . $_REQUEST['markerLat'] . ','. $_REQUEST['markerLng'] . ',1000';
	
	/*
	$url='https://api.weatherbit.io/v2.0/forecast/daily?lat=' . $_REQUEST['markerLat'] . '&lon=' . $_REQUEST['markerLng'] . '&key=db7345f9de8c4d42b3478ec1ea7cf2f9';
	
	*/

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	$landmarks = [];

  foreach ($decode['Response']['View'][0]['Result'] as $landmark) {
		
		if ($landmark['Location']['LocationType'] == 'hospital'){
			array_push($landmarks, $landmark);
		}
		
		if ($landmark['Location']['LocationType'] == 'park'){
			array_push($landmarks, $landmark);
		}
		
		if ($landmark['Location']['LocationType'] == 'river'){
			array_push($landmarks, $landmark);
		}
		
		if ($landmark['Location']['LocationType'] == 'universityCollege'){
			array_push($landmarks, $landmark);
		}
		
		//array_push($landmarks, $landmark);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	//$output['data'] = $decode['Response']['View'][0]['Result'];
	$output['data'] = $landmarks;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
