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

	//$queryForID = $conn->prepare('SELECT name FROM department WHERE id = ?');
	$queryForID = $conn->prepare('SELECT firstName, lastName, departmentID, jobTitle, email FROM personnel WHERE id = ?');
	$queryForID->bind_param("i", $_REQUEST['id']);
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

  $dataForID;
	
	

	while ($row = mysqli_fetch_assoc($resultForID)) {

		$dataForID = $row;

	}
	
	
	$verified = false;
	
	if ($dataForID['firstName'] == $_REQUEST['firstName'] && $dataForID['lastName'] == $_REQUEST['lastName'] && $dataForID['email'] == $_REQUEST['email'] && $dataForID['jobTitle'] == $_REQUEST['jobTitle'] && $dataForID['departmentID'] == $_REQUEST['departmentID']) {
		
		$verified = true;
		
	}
	
	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	#$output['data'] = $dataForID;
	$output['data'] = $verified;
	$output['details'] = $dataForID;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>