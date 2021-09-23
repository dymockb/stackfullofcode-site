<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$freedomData = json_decode(file_get_contents('../../vendors/json/freedomHouse.json'),true);

	$freedomStatus;

    foreach ($freedomData as $feature) {

        if ($feature["Code"] == $_REQUEST['countryCode']) {

            $freedomStatus = $feature;

            break;

        }

    }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $freedomStatus;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
