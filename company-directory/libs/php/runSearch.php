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

  $startOfQueryString = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.id as locationID, l.name as locationName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE ";

  $searchParamString = "(CONVERT(`firstName` USING utf8) LIKE ? OR CONVERT(`lastName` USING utf8) LIKE ? OR CONVERT(`email` USING utf8) LIKE ?)";

  $departmentsArray = [];

  if ($_REQUEST['departments'] == "") {

	 $queryStringIncDepts = $startOfQueryString;
   $deptString = "";

   $outputQueryString = $startOfQueryString . $searchParamString;

  } else {

  $departmentsArray = explode(',',$_REQUEST['departments']);
	
    $deptString = "(d.name = ";
  
    for ($i = 0; $i < count($departmentsArray); $i ++) {

      $deptString = $deptString . "?";

      if ($i != count($departmentsArray)-1) {

        $deptString = $deptString . " OR d.name = ";

      } elseif ($i == count($departmentsArray)-1) {

        $deptString = $deptString . " ) AND "; 

     }
    };

		$locationsArray = explode(',',$_REQUEST['locations']);

		$locString = "(l.id = "; 

		for ($i = 0; $i < count($locationsArray); $i ++) {
      $locString = $locString . "?";
      if ($i != count($locationsArray)-1) {
 
        $locString = $locString . " OR l.id = ";
      } elseif ($i == count($locationsArray)-1) {

        $locString = $locString . " ) AND "; 
     }
    };

		$queryStringIncDeptsAndLocs = $startOfQueryString . $deptString . $locString . $searchParamString;

    $outputQueryString = $queryStringIncDeptsAndLocs;
  
  }
  

	if ($_REQUEST['orderBy'] == 'lastName') {
	
		$orderByQueryString = " ORDER BY p.lastName, p.firstName, d.name, l.name";
	
	} elseif ($_REQUEST['orderBy'] == 'firstName') {

		$orderByQueryString = " ORDER BY p.firstName, p.lastName, d.name, l.name";
	
	}
	
	$query = $conn->prepare($outputQueryString . $orderByQueryString);

  $requestArray = array_merge($departmentsArray, $locationsArray, array($_REQUEST['searchTerm'], $_REQUEST['searchTerm'], $_REQUEST['searchEmail']));

  $types = str_repeat('s', count($requestArray));
	$query->bind_param($types, ...$requestArray);	

	
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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	$output['queryString'] = $outputQueryString . $orderByQueryString;
	$output['requestArray'] = $requestArray;
	
	
	mysqli_close($conn);

	echo json_encode($output); 

?>