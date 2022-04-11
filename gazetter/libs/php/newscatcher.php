<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


	$curl = curl_init();

	curl_setopt_array($curl, [
	CURLOPT_URL => 'https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&country=' . $_REQUEST['countryCode'] . '&media=True',
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: newscatcher.p.rapidapi.com",
		"x-rapidapi-key: e1e25d1b8emsh6d6284ceab9616ep1546efjsnb9119f125e5a"
	],
]);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	$decode = json_decode($response,true);	

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
	
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	
	//echo $response;
}

?>