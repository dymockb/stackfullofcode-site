<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	//$url = 'https://api.unsplash.com/search/photos?page=1&query=united%20kingdom&client_id=CCZ8dNx0pfilTC8MRoDtF3AZUBZg1tI49vWE36strI0';
	$url='https://api.unsplash.com/search/photos?page=1&query=' . urlencode($_REQUEST['qString']) . '&client_id=CCZ8dNx0pfilTC8MRoDtF3AZUBZg1tI49vWE36strI0';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
/*
	 if ($_REQUEST['counter'] == 0) {
				$decode = json_decode(file_get_contents('../../vendors/json/weatherbitStatic1.json'),true);
	 } elseif ($_REQUEST['counter'] == 1) {
				$decode = json_decode(file_get_contents('../../vendors/json/weatherbitStatic2.json'),true);		 
	 }
	*/

	$photos = [];

	//$echostring = '';

  foreach ($decode['results'] as $item) {

		$one = null;
		$one['img'] = $item['urls']['small'];
		
		//$echostring = $echostring . '<img src=' . $item['urls']['thumb'] . '/>';

		array_push($photos, $one);

	}
	
	/*
	echo 
	'<!DOCTYPE html>
	<html>
	<head>
	<style>
	img {
		width: 200px
	}
	</style></head>
	<body>' . $echostring .
	
	'</body>
	</html>';
	 */

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $photos;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output, JSON_UNESCAPED_SLASHES); 


?>
