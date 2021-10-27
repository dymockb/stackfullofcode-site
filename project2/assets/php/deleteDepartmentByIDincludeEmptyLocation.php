<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	
	$check = $conn->prepare('SELECT locationID FROM department WHERE id = ?');

	$check->bind_param("i", $_REQUEST['departmentID']);
	
	$check->execute();
	
	$result = $check->get_result();

  $data;

	while ($row = mysqli_fetch_assoc($result)) {
		
		//echo 'row ' . json_encode($row);
		//array_push($data, $row);
		$data = $row['locationID'];

	}
	
	//echo 'data ' . json_encode($data);
	
	$countDeptsInLoc = 'SELECT * FROM department WHERE locationID = ' . $data;

	$countResult = $conn->query($countDeptsInLoc);
	
	$countData = [];

	while ($row = mysqli_fetch_assoc($countResult)) {

		array_push($countData, $row);

	}
	
	//echo 'count result' . json_encode($countData);
	
	$locationStatusMsg = 'Location will not be deleted';
	
	if (count($countData) == 1) {
		
		if ($countData[0]['id'] == $_REQUEST['departmentID']) {
		
			$locationStatusMsg =  'Location Will be Deleted';
		
		}
	
	}
	
	$checkDependency = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE departmentID = ?');

	$checkDependency->bind_param("i", $_REQUEST['departmentID']);
	
	$checkDependency->execute();
	
	$dependencyResult = $checkDependency->get_result();

	$dependencyData;
	
	while ($row = mysqli_fetch_assoc($dependencyResult)) {
		
		//echo 'row ' . json_encode($row);
		//array_push($data, $row['COUNT(*)']);
		$dependencyData = $row['COUNT(*)'];

	}	
	
	if ($dependencyData != 0) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "employee dependency error";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	// 
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	$query->bind_param("i", $_REQUEST['departmentID']);

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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $locationStatusMsg;
	
	mysqli_close($conn);

	echo json_encode($output); 
  
?>