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
	
	$check = $conn->prepare('SELECT COUNT(*) FROM department WHERE id = ?');

	$check->bind_param("i", $_REQUEST['departmentID']);
	
	$check->execute();
	
	$result = $check->get_result();

  $data;

	while ($row = mysqli_fetch_assoc($result)) {
		
		$data = $row['COUNT(*)'];

	}

	$message;
	
	if ($data != 0) {
		$message =  'Department Deleted';
	} else {
		$message =  'Department Does Not Exist';		
	}
		
	$checkDependency = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE departmentID = ?');

	$checkDependency->bind_param("i", $_REQUEST['departmentID']);
	
	$checkDependency->execute();
	
	$dependencyResult = $checkDependency->get_result();

	$dependencyData;
	
	while ($row = mysqli_fetch_assoc($dependencyResult)) {
		
		$dependencyData = $row['COUNT(*)'];

	}	
	
	if ($dependencyData != 0) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "dependency error";	
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
	$output['data'] = $message;
	
	mysqli_close($conn);

	echo json_encode($output); 
  
?>