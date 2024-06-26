<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$countryData = json_decode(file_get_contents('../../vendors/json/countryBorders.geojson'),true);

	$country = [];

    foreach ($countryData['features'] as $feature) {

        $temp = null;
        $temp['A2code'] = $feature["properties"]['iso_a2'];
        $temp['A3code'] = $feature["properties"]['iso_a3'];
        $temp['name'] = $feature["properties"]['name'];

        array_push($country, $temp);
	
    }

    usort($country, function ($item1, $item2) {

        return $item1['name'] <=> $item2['name'];

    });	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $country;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
