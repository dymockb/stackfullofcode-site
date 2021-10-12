<?php

$request = new HttpRequest();
$request->setUrl('https://translo.p.rapidapi.com/translate');
$request->setMethod(HTTP_METH_POST);

$request->setQueryData([
	'text' => 'Hey, how are you today?',
	'to' => 'fr',
	'from' => 'en'
]);

$request->setHeaders([
	'content-type' => 'application/json',
	'x-rapidapi-host' => 'translo.p.rapidapi.com',
	'x-rapidapi-key' => 'e1e25d1b8emsh6d6284ceab9616ep1546efjsnb9119f125e5a'
]);

$request->setBody('{
    "key1": "value",
    "key2": "value"
}');

try {
	$response = $request->send();

	echo $response->getBody();
} catch (HttpException $ex) {
	echo $ex;
}

?>