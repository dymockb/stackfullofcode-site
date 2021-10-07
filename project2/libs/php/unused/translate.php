<?php

	// remove for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


$curl = curl_init();
//$URL = "https://translo.p.rapidapi.com/translate?text=Hey%2C%20how%20are%20you%20today%3F&to=en";
$URL = "https://translo.p.rapidapi.com/translate?text=" . urlencode($_REQUEST['text']) . "&to=en";

curl_setopt_array($curl, [
	//CURLOPT_URL => "https://translo.p.rapidapi.com/translate?text=Hey%2C%20how%20are%20you%20today%3F&to=en",
	//CURLOPT_URL => "https://translo.p.rapidapi.com/translate?text=Hey%2C%20how%20are%20you%20today%3F&to=fr&from=en",
	CURLOPT_URL => $URL,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "POST",
	CURLOPT_POSTFIELDS => "{\r\n    \"key1\": \"value\",\r\n    \"key2\": \"value\"\r\n}",
	CURLOPT_HTTPHEADER => [
		"content-type: application/json",
		"x-rapidapi-host: translo.p.rapidapi.com",
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