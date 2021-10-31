<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
//this includes the login details
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	
	// check if loc exists
	
	$check = $conn->prepare('SELECT COUNT(*) FROM location WHERE name = ?');

	$check->bind_param("s", $_REQUEST['name']);
	
	$check->execute();
	
	$result = $check->get_result();

  $data;

	while ($row = mysqli_fetch_assoc($result)) {
		
		//echo 'row ' . json_encode($row);
		//array_push($data, $row['COUNT(*)']);
		$data = $row['COUNT(*)'];

	}

	$message;
	
	if ($data == 0) {
		$message =  'New location name OK';
	} else {
		$message =  'Location name already exists';		
	}
	
	// end of checking if loc exists
	
		if ($data != 0) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Location name already exists error";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
	
	$query = $conn->prepare('INSERT INTO location (name) VALUES (?)');

	$query->bind_param("s", $_REQUEST['name']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
	
	/*  this will get the new location ID back to return to ajax */
	
	//$queryForID = "SELECT id FROM location WHERE name = 'London'";
	//$resultForID = $conn->query($queryForID);
	
	$queryForID = $conn->prepare('SELECT id FROM location WHERE name =  ?');
	$queryForID->bind_param("s", $_REQUEST['name']);
	$queryForID->execute();
	
	if (false === $queryForID) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "queryForID failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}

	$resultForID = $queryForID->get_result();

  //$dataForID = [];
  $dataForID;

	while ($row = mysqli_fetch_assoc($resultForID)) {

		//array_push($dataForID, $row);
		$dataForID = $row;

	}


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	//$output['data'] = [$resultForID];
	$output['data'] = $dataForID;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>