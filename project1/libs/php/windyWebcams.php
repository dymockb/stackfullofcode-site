<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
 
	$url='https://api.windy.com/api/webcams/v2/list/country=' . $_REQUEST['countryCode'] . '/orderby=popularity,desc/limit=20?show=webcams:image,location,player,url,property,statistics&key=PANhpeI8Xm7rW8KmSe5W3JUDHPXfGFoF';

	//$ch = curl_init();
	//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	//curl_setopt($ch, CURLOPT_URL,$url);

	//$result=curl_exec($ch);

	//curl_close($ch);

	//$decode = json_decode($result,true);	
	
	$decode = json_decode(file_get_contents('../../vendors/json/webcamsStatic.json'),true);

	$webcams = [];

  foreach ($decode['result']['webcams'] as $webcam) {
		
		$one = null;
		$one['status'] = (empty($webcam['status'])) ? "no data" : $webcam['status'];
		$one['title'] = (empty($webcam['title'])) ? "no data" : $webcam['title']; 
		$one['thumbnail'] = (empty($webcam['image']['daylight']['thumbnail'])) ? "no data" : $webcam['image']['daylight']['thumbnail'];
		$one['lat'] = (empty($webcam['location']['latitude'])) ? "no data" : $webcam['location']['latitude'];
		$one['lng'] = (empty($webcam['location']['longitude'])) ? "no data" : $webcam['location']['longitude'];
		$one['wikipedia'] = (empty($webcam['location']['wikipedia'])) ? "no data" : $webcam['location']['wikipedia'];
		$one['embed'] = (empty($webcam['player']['lifetime']['embed'])) ? "no data" : $webcam['player']['lifetime']['embed'];

		array_push($webcams, $one);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $webcams;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output,JSON_UNESCAPED_SLASHES); 


?>
