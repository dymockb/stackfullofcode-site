<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

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
	
	//prepared version:
	
	/*
	
	//working prepared query string
	#$queryString = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?) ORDER BY p.lastName, p.firstName, d.name, l.name";
	
	//experiment prepared query string
	$queryString = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN ( SELECT * WHERE name = ?) department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?) ORDER BY p.lastName, p.firstName, d.name, l.name";
	
	if ($_REQUEST['orderBy'] == 'lastName') {
	
		$query = $conn->prepare($queryString);
		
		#$query = $conn->prepare("SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?) ORDER BY p.lastName, p.firstName, d.name, l.name");
	
	} elseif ($_REQUEST['orderBy'] == 'firstName') {
	
		$query = $conn->prepare("SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?) ORDER BY p.firstName, p.lastName, d.name, l.name");
	
	}


	
	$query->bind_param("ssss", $_REQUEST['department'], $_REQUEST['searchTerm'], $_REQUEST['searchTerm'], $_REQUEST['searchEmail']);
	#http://localhost/part4/project2/assets/php/searchAll.php?searchTerm=%tam%&searchEmail=%tam%&orderBy=lastName&department=Legal
	
	#$query->bind_param("sss", $_REQUEST['searchTerm'], $_REQUEST['searchTerm'], $_REQUEST['searchEmail']);	
	#http://localhost/part4/project2/assets/php/searchAll.php?searchTerm=%tam%&orderBy=lastName&searchEmail=%tam%
	
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

  $data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}
	
	*/
	
	//unprepared version
	
	/**/
	
	#$query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`id` USING utf8) LIKE '%tam%' OR CONVERT(`firstName` USING utf8) LIKE '%tam%' OR CONVERT(`lastName` USING utf8) LIKE '%tam%' OR CONVERT(`jobTitle` USING utf8) LIKE '%tam%' OR CONVERT(`email` USING utf8) LIKE '%tam%' OR CONVERT(`departmentID` USING utf8) LIKE '%tam%')";
	
	#$query = "SELECT * FROM `companydirectory`.`personnel` WHERE (CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?) ORDER BY p.lastName, p.firstName, d.name, l.name";
	
	//experimental unprepared
	$query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (d.name = 'Support' OR d.name = 'Legal') AND (CONVERT(`firstName` USING utf8) LIKE '%ta%' OR CONVERT(`lastName` USING utf8) LIKE '%ta%' OR CONVERT(`jobTitle` USING utf8) LIKE '%ta%' OR CONVERT(`email` USING utf8) LIKE '%ta%' OR CONVERT(`departmentID` USING utf8) LIKE '%ta%')";
	
	//working unprepared:
	#$query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE (CONVERT(`firstName` USING utf8) LIKE '%ta%' OR CONVERT(`lastName` USING utf8) LIKE '%ta%' OR CONVERT(`jobTitle` USING utf8) LIKE '%ta%' OR CONVERT(`email` USING utf8) LIKE '%ta%' OR CONVERT(`departmentID` USING utf8) LIKE '%ta%')";
	
	
	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
  $data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>