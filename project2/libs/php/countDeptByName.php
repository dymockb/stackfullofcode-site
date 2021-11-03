<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

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

	// first query - SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('SELECT count(id) as dc from department WHERE name = ?');

	$query->bind_param("s", $_REQUEST['departmentName']);

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
    
	$result = $query->get_result();

  $deptCount;

	while ($row = mysqli_fetch_assoc($result)) {

		$deptCount = $row['dc'];

	}
	
	$confirmLocationID = 0;

	if ($deptCount == 1) {

		$queryForLocID = $conn->prepare('SELECT locationID from department WHERE name = ?');

		$queryForLocID->bind_param("s", $_REQUEST['departmentName']);

		$queryForLocID->execute();
		
		if (false === $queryForLocID) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query for LOCID failed";	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;

		}
			
		$resultForLocID = $queryForLocID->get_result();

		while ($row = mysqli_fetch_assoc($resultForLocID)) {

			$confirmLocationID = $row;

		}
	
	}
	
	


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	//$output['data'][$_REQUEST['departmentName']] = $deptCount;
	$output['data']['existing-names'] = $deptCount;
	$output['data']['locationID'] = $confirmLocationID['locationID'];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>