let firstload = 1;

let employeeDetailsVisibility = 0;
let employeePropertiesObj = {};
let blankEmployeeObj = {};
let employeePropertiesStored;
let employeeBeforeEdit;

let lastSearch = "";
let orderBy = 'firstName';

let locationsObj = {};
let departmentsObj = {};

let listOfLocations = [];
let listOfDepts = [];
let listOfLocationIDs = [];
let listOfDeptIDs = [];

let manageDeptsAndLocsOpened = 0;
let locationRules = [];
let departmentRules = [];
let deptCacheObj = {};
let locCacheObj = {};

let activeDepartmentsObj = {};
let countOfDepts = 0;
let countOfCheckedDepts;
let howManyDeptsSelected = 'All';
let selectAllDeptsUsed = false;
let selectNoneDeptsUsed = false;

let activeLocationsObj = {};
let countOfLocations;
let countOfCheckedLocations;
let howManyLocationsSelected = 'All';
let selectAllLocationsUsed = false;
let selectNoneLocationsUsed = false; 

//let locationsDropDownObj = {};
//let departmentsDropDownObj = {};

let	dropDownClicked = 0;
let locationDropDownClicked = 0;

let maxNewEmployeeID = 0;
let maxEmployeeID = 0;
let finalMaxID = 0;

let employeeJustCreated = false;
let	employeeJustEdited = false;

let newestElement;
let editedElement;

let locAndDeptStringTemplate;

// rules for adding / changing locations and departments
let basicRules = []

let ruleOne = {}
ruleOne['type'] = 'empty';
ruleOne['prompt'] = 'Please enter a name';

let ruleTwo = {}
ruleTwo['type'] = 'regExp[/^[A-Z]/]';
ruleTwo['prompt'] = 'First letter must be a capital';

let ruleThree = {};
ruleThree['type'] = 'minLength[3]';
ruleThree['prompt'] = 'At least three characters are required.';

basicRules.push(ruleOne);
basicRules.push(ruleTwo);
basicRules.push(ruleThree);

let renameDeptNeedsToBeValidated = false;
let createNewDeptNeedsToBeValidated = false;
let locationNameNeedsToBeValidated = false;

let renameLocNeedsToBeValidated = false;
let createNewLocNeedsToBeValidated = false;


let locsAndDeptsObj = {};

let updateLoadedDepts = [];
let updateLoadedLocs = [];

// ** PAGE LOAD FUNCTIONS **

function renderCheckboxes(checkboxItems, checkboxIDs, category){

	let checkboxesObj = {};

	for (cbo = 0; cbo < checkboxItems.length; cbo ++) {
		
		checkboxesObj[checkboxItems[cbo]] = checkboxIDs[cbo]
	
	}

	checkboxItems.sort()

	for (cbi = 0; cbi < checkboxItems.length; cbi ++) {
		let cbName, cbInputID;
		if (category == 'department') {
			cbName = checkboxItems[cbi];
			
			cbInputID = checkboxesObj[checkboxItems[cbi]];
		} else if (category == 'location'){
			cbName = checkboxItems[cbi];			
			cbInputID = checkboxesObj[checkboxItems[cbi]];
			
		}
			
		document.getElementById(`${category}-checkboxes`).appendChild(createCheckbox(cbName, cbInputID, category, false));
		document.getElementById(`${category}-checkboxes-mobile`).appendChild(createCheckbox(cbName, cbInputID, category, true));

	}

	for (cbid = 0; cbid < checkboxIDs.length; cbid ++) {
		
		let cbID = checkboxIDs[cbid];

		if(category == 'department') {
			activeDepartmentsObj[departmentsObj[cbID]['id']] = true;
		} else if (category == 'location') {
			activeLocationsObj[cbID] = true;
		}
	}

}

function removeCheckBoxes(category){
	
	document.getElementById(`${category}-checkboxes`).innerHTML = '';
	document.getElementById(`${category}-checkboxes-mobile`).innerHTML = '';
	
};

function refreshDeptsAndLocsModal(category, show){
	
	for (let prop in locsAndDeptsObj){
		delete locsAndDeptsObj[prop];
	}
	
	for (let prop in locationsObj){
		delete locationsObj[prop];
	}
	
	for (let prop in departmentsObj){
		delete departmentsObj[prop];
	}

	getAllLocationsAndDepartments(category, show);
	
}

function getAllLocationsAndDepartments(category, show){

  removeCheckBoxes('location');
  removeCheckBoxes('department');

	$.ajax({
		//url: "libs/post-php/getAllLocations.php",
		//type: "POST",
		url: "libs/php/getAllLocations.php",
		type: "GET",
		dataType: "json",
		data: {},
		success: function (result) {
			
				console.log('getAllLocations ', result);
				
				listOfLocations = [];
				listOfLocationIDs = [];
				
				for (let l = 0; l < result.data.length; l++) {
					
					locationsObj[result.data[l].id] = result.data[l].name;
					
					if (!listOfLocations.includes(result.data[l].name)) {
						listOfLocations.push(result.data[l].name);
					}

					if (!listOfLocationIDs.includes(result.data[l].id)) {
						listOfLocationIDs.push(result.data[l].id);
					}
					
				}

				countOfLocations = listOfLocationIDs.length;
				countOfCheckedLocations = listOfLocationIDs.length;
				
				renderCheckboxes(listOfLocations, listOfLocationIDs, 'location');
	
				locationCheckboxFunctionality();
	
				locationCheckboxFunctionalityMobile();

				$.ajax({
					//url: "libs/post-php/getAllDepartments.php",
					//type: "POST",
					url: "libs/php/getAllDepartments.php",
					type: "GET",
					dataType: "json",
					data: {},
					success: function (result) {
						
							console.log('getAllDepartments ',result);
										
							listOfDepts = [];
							listOfDeptIDs = [];
							
							let locationsForObj = [];
				
							for (let d = 0; d < result.data.length; d++) {
								
								departmentsObj[result.data[d].id] = {};
								departmentsObj[result.data[d].id]['name'] = result.data[d].name;
								departmentsObj[result.data[d].id]['id'] = result.data[d].id;
								
								if (!listOfDepts.includes(result.data[d].name)) {
									listOfDepts.push(result.data[d].name);
								}

								if (!listOfDeptIDs.includes(result.data[d].id)) {
									listOfDeptIDs.push(result.data[d].id);
								}
				
								if(!locationsForObj.includes(result.data[d].locationID)) {
									locationsForObj.push(result.data[d].locationID);
								}
							
							}	
							
							
							for (let lob = 0; lob < locationsForObj.length; lob ++) {
								
								let locationObj = {};
								locationObj['loaded'] = false;
								locationObj['departments'] = {};

                if (!locsAndDeptsObj[locationsForObj[lob]]) {
								  locsAndDeptsObj[locationsForObj[lob]] = locationObj;
                }

							}
							
							
							for (let d2 = 0; d2 < result.data.length; d2++) {
									
								let deptObj = {};
								deptObj['loaded'] = false;
								deptObj['depname'] = result.data[d2].name;

                if (!locsAndDeptsObj[result.data[d2]['locationID']]['departments'][result.data[d2]['id']]) {
								  locsAndDeptsObj[result.data[d2]['locationID']]['departments'][result.data[d2]['id']] = deptObj;
                }
							
              }	
							
							listOfDepts.sort();
				
							countOfDepts = listOfDepts.length;
							countOfCheckedDepts = listOfDepts.length;
				
							renderCheckboxes(listOfDepts, listOfDeptIDs, 'department');
				
							departmentCheckboxFunctionality();

							departmentCheckboxFunctionalityMobileIncludesRunSearch();

							if ($('#preloader').length) {
								$('#preloader').delay(1000).fadeOut('slow', function () {
									$(this).remove();
									//console.log("Window loaded");		
								});
							}
		
							manageDepartmentsAndLocationsModalNEW(category, show);

							/*
							
							let finaled = result.data.length;
							
							for (let ed = 0; ed < result.data.length; ed ++){
				
								let did = result.data[ed].id;
								let dlid = result.data[ed].locationID;
								
									$.ajax({
									//url: "libs/post-php/countPersonnelByDept.php",
									//type: "POST",
									url: "libs/php/countPersonnelByDept.php",
									type: "GET",
									dataType: "json",
									data: {
										deptID: did
									},
									success: function (result) {
											
											departmentsObj[did]['employees'] = result.data.personnel; 
											departmentsObj[did]['locationID'] = dlid;
											
											if (ed == finaled-1) {
												


												
											
											}
										
									},
									error: function (jqXHR, textStatus, errorThrown) {
											console.log('error');
											console.log(textStatus);
											console.log(errorThrown);
										},
									});	
									

							
							}
							*/

              //eventListenersInsideDeptsandLocsModal();
		
					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('error');
							console.log(textStatus);
							console.log(errorThrown);
						},
					});
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error', jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
		});

}


function getAllEmployees(){

	$.ajax({
		url: "libs/php/getAll.php",
		type: "GET",
		//url: "libs/post-php/getAll.php",
		//type: "POST",
		dataType: "json",
		data: {},
		success: function (result) {
				
				for (const [key, value] of Object.entries(result.data[0])) {
					
					if (key == "firstName") {
						blankEmployeeObj[key] = "First name";						
					} else if (key == "lastName") {
						blankEmployeeObj[key] = "Last name";					
					} else if (key == "email") {
						blankEmployeeObj[key] = "Email address";
					} else if (key == "department") {
						blankEmployeeObj[key] = "Department";					
					} else if (key == "jobTitle") {
						blankEmployeeObj[key] = "Job title";					
					} else if (key == "locationName") {
						blankEmployeeObj[key] = "Location";					
					} else {
						blankEmployeeObj[key] = 0;					
					} 

				
				}
				
				/*
				let firstEmployee = document.getElementById('first-employee');

				appendEmployee(firstEmployee, createEmployee(blankEmployeeObj));

				let otherEmployees = document.getElementById('table-body');

				for (let e = 0; e < result.data.length; e ++) {
					
					for (const [key, value] of Object.entries(result.data[e])) {
					
						employeePropertiesObj[key] = value;
						maxEmployeeID = employeePropertiesObj.id > maxEmployeeID ? employeePropertiesObj.id : maxEmployeeID;
					
					}

					otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj, true));
					
				}
				
				viewDetailsBtnFunctionality()
				
				selectEmployeeFunctionality()
				*/

		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});

};

// ** EVENT LISTENERS **

//SEARCH BOX
$('#search-input').on('input', delay(function () {
  
	console.log('search term:', this.value.toLowerCase());
	
	console.log('order by: ', orderBy);

	let searchTerm = this.value.toLowerCase();
	lastSearch = searchTerm;
	
	runSearch(orderBy, searchTerm);
	
}, 500));

// delay timer function for seach box
function delay(callback, ms) {
	var timer = 0;
  return function() {
    //console.log('start typing');
		document.getElementById('search-box-icon').setAttribute('class', 'ui icon input loading');
		var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

//BUTTONS

//mobile buttons

$('#create-employee-btn-mobile').click(function(){

	$('#create-employee-btn').click();

});

$('#mobile-manage-cog').click(function (){

	//ALERT TO CHOOSE

});

$('#mobile-create-employee-btn').click(function (){

	$('#create-employee-btn').click();

});

$('#close-mobile-accordion-options').click(function(){

	$('#search-accordion').click();

})

//top level buttons

$('#create-employee-btn').click(function(){
	
	let noDetailsRequired = {};
	locationDropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'create', noDetailsRequired);
	
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-create-employee').setAttribute('style', 'display: inline');
	document.getElementById('close-only-btn').setAttribute('style', 'display: inline');

	showModal('create employee');
	
});

function showModal(category){

	$('.first.modal')
	.modal('show');
	
}

function showAlertModal(title, content){

	$('#alert-modal').modal(
		{ title: title,
		 	content: content }).modal('show');

}


$('#manage-locs-btn').click(function(){
	
	let show = true;
	refreshDeptsAndLocsModal('locations', show);

	document.getElementById('manage-depts-and-locs').setAttribute('style', 'display: block');
	document.getElementById('modal-deny-btn').setAttribute('style', 'display: inline');
	//document.getElementById('create-new-location-btn').setAttribute('style', 'display: inline');

});

$('#manage-depts-btn').click(function(){

	let show = true;
	refreshDeptsAndLocsModal('departments', show);

	document.getElementById('manage-depts-and-locs').setAttribute('style', 'display: block');
	document.getElementById('modal-deny-btn').setAttribute('style', 'display: inline');

});


//buttons on employee panel
$('#delete-employee-btn').click(function (){
	
	let employeeDetails = JSON.parse(document.getElementById('delete-employee-btn').getAttribute('employee-details'));

	$('#delete-employee-modal-btn').attr('style', 'display: inline');

	document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: none');
	
	showAlertModal('<i class="archive icon"></i>', `<div class="alert-modal-text">Delete this employee? <br> <h3> ${employeeDetails.firstName} ${employeeDetails.lastName} </h3></div>`);

	});

$('#edit-employee-fields-btn').click(function(){
	
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	
	let employeeDetails = JSON.parse(this.getAttribute('employee-details'));

	employeeBeforeEdit = employeeDetails;
	
	dropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'edit', employeeDetails);	

	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-edit-employee').setAttribute('style','display: inline');
	document.getElementById('close-only-btn').setAttribute('style', 'display: inline');

	document.getElementById('submit-edit-employee').setAttribute('employee-details', this.getAttribute('employee-details'));
	
	showModal('edit employee');

});

//buttons on employee modal

$('#submit-create-employee').click(function(event){

	if ($('#employee-modal-create-fields').form('validate form')) {
		$('#employee-modal-create-fields').form('submit');
		$('#employee-modal-create-fields').form('reset');
	}

});

$('#submit-edit-employee').click(function (){

	if ($('#employee-modal-edit-fields').form('validate form')) {

		$('#employee-modal-edit-fields').form('submit');
		$('#employee-modal-create-fields').form('reset');	
	}
	
});

//buttons on alert modal
$('#delete-employee-modal-btn').click(function (){
	
	closeAlertModal();

	let employeeID = JSON.parse(this.getAttribute('employee-details')).id;

	document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: none');

	$.ajax({
	//url: "libs/post-php/deleteEmployeeByID.php",
	//type: "POST",
	url: "libs/php/deleteEmployeeByID.php",
	type: "GET",
	dataType: "json",
	data: {
		id: employeeID
	},
	success: function (result) {
				
		runSearch(orderBy, lastSearch);
		
		let deletedEmployeeTimer = setTimeout(function () {
			document.getElementById('close-panel-icon').click();	
			clearTimeout(deletedEmployeeTimer);
		
		}, 750);
		
		refreshPage();

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
});

$('#update-employee-modal-btn').click(function (){

	closeAlertModal();
	
	let updateEmployeeDataObj = JSON.parse(this.getAttribute('employee-details'));

	$.ajax({
	url: "libs/php/updateEmployee.php",
	type: "GET",
	//url: "libs/post-php/updateEmployee.php",
	//type: "POST",
	dataType: "json",
	data: updateEmployeeDataObj,
	success: function (result) {
		
			console.log('updateEmployee ',result.data);
			console.log('orderby', orderBy, 'lastSearch', lastSearch);
			employeeJustEdited = true;
			editedElement = updateEmployeeDataObj;
			document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', JSON.stringify(updateEmployeeDataObj));
			refreshPage();

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
	

});


//FORMS

$('#employee-modal-edit-fields').submit(function(event) {
	event.preventDefault();
	
	if (this.elements.length > 0) {
		
		editEmployeeDataObj = {
		firstName: '', //
		lastName: '',		//
		jobTitle: '', //
		email: '', //
		departmentID: '', //
		locationName: '',
		locationID: '',
		department: '',
		id: ''
		}
	
		for (let e = 0; e < this.elements.length; e ++) {
		
			if (this.elements[e].tagName != 'BUTTON') {			

				if (this.elements[e].getAttribute('fieldname') == 'departmentID') {
					editEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
					editEmployeeDataObj['department'] = departmentsObj[this.elements[e].value]['name'];
				} else if (this.elements[e].getAttribute('fieldname') == 'locationID'){
					editEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
					editEmployeeDataObj['locationName'] = locationsObj[this.elements[e].value];
				} else {
					editEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
				}
			}

		}
		
		document.getElementById('update-employee-modal-btn').setAttribute('employee-details', JSON.stringify(editEmployeeDataObj));
		
		document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: inline');	

		document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: none');
		document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: none');
		
		
		showAlertModal('<i class="fas fa-user-edit"></i>', `<div class="alert-modal-text">Update this employee?</div>`);

		$('#employee-modal-edit-fields').form('reset');
		
	}	
		
});

$('#employee-modal-create-fields').submit(function(event) {
	event.preventDefault();
	
	if (this.elements) {

		document.getElementById('close-employee-modal').click();

	}
	
	createEmployeeDataObj = {
		firstName: '', //
		lastName: '',		//
		jobTitle: '', //
		email: '', //
		departmentID: '', //
		locationName: '',
		locationID: '',
		department: '',
		id: ''
	}
	
	for (let e = 0; e < this.elements.length; e ++) {
	
		if (this.elements[e].tagName != 'BUTTON') {			
		
			createEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
			
		}

	}

	createEmployeeDataObj['jobTitle'] = 	createEmployeeDataObj['jobTitle'] == 0 ? 'Job Title TBC' : 	createEmployeeDataObj['jobTitle'];
	
	$.ajax({
	//url: "libs/post-php/insertEmployee.php",
	//type: "POST",
	url: "libs/php/insertEmployee.php",
	type: "GET",
	dataType: "json",
	data: createEmployeeDataObj,
	success: function (result) {
		
			employeeJustCreated = true;
			
			refreshPage();
			

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
		
});

//forms within Manage Depts and Locs Modal

$('#create-new-department-btn').click(function(){


	$.ajax({
		//url: "libs/post-php/getAllDepartments.php",
		//type: "POST",
		url: "libs/php/getAllLocations.php",
		type: "GET",
		dataType: "json",
		data: {},
		success: function (result) {

			let latestLocNames = [];
			let latestLocIDs = [];

			let latestLocations = {};
			
			for (let [llkey, llvalue] of Object.entries(result.data)){

				latestLocations[llvalue['id']] = llvalue['name'];

				latestLocNames.push(llvalue['name']);
				latestLocIDs.push(llvalue['id']);
			
			}

			$('#department-accordion-segment').attr('style', 'display: block');
		
			$('#new-department-accordion-btn').click();
			//document.getElementById('department-accordion-segment').scrollIntoView({behavior: "smooth"});
			$("#scrolling-modal-pane").animate({ scrollTop: 0 }, "fast");

			$(`#new-department-form`).one('submit', function(event){
		
				event.preventDefault();
				//let newDepartmentName = 'New Loc'
				//let newDepartmentNode = createDepartmentSegment(1, newDepartmentName, 'test location', 0, latestLocations);
				//$(`#department-entries`).prepend( $(newDepartmentNode).hide().fadeIn(1000) );
				
				
	
			});	

			$(`#submit-new-department-btn`).click(function(e){

				if ($(`#new-department-form`).form('validate form')) {
		
					$(`#new-department-form`).form('submit');
					$(`#new-department-form`).form('reset');
		
				}
		
			});


		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});

});

$(`#cancel-new-department-btn`).click(function(e){

	$(`#new-department-form`).form('reset');
	$('#new-department-accordion-btn').click();

	let closeNewDepartmentTimer = setTimeout(function(){
		$('#department-accordion-segment').attr('style', 'display: none');
		clearTimeout(closeNewDepartmentTimer);
	},350);		

});


$('#create-new-location-btn').click(function(){

	$('#location-accordion-segment').attr('style', 'display: block');

	locationRules = basicRules.slice();

	for (let [key, value] of Object.entries(locationsObj)) {
		
		let nameRequired = value;
		
		let newRule = {}
		newRule['type'] = `notExactly[${nameRequired}]`;
		newRule['prompt'] = 'That location already exists';
		locationRules.push(newRule)
	
	}
	
		$(`#new-location-form`).form({
		fields: {
			name: {
				identifier: 'new-location',
				rules: locationRules
			}
		}
		});

	$('#new-location-accordion-btn').click();
	document.getElementById('location-accordion-segment').scrollIntoView({behavior: "smooth"});

});

$(`#cancel-new-location-btn`).click(function(e){

	$(`#new-location-form`).form('reset');
	$('#new-location-accordion-btn').click();

	let closeNewLocationTimer = setTimeout(function(){
		$('#location-accordion-segment').attr('style', 'display: none');
		clearTimeout(closeNewLocationTimer);
	},250);		

});

$(`#submit-new-location-btn`).click(function(e){

	if (!locationNameNeedsToBeValidated) { //needs to be validated
		
	$(`#new-location-form`).one('submit', function(event){
	  event.preventDefault();


    let newLocationName;

    for (let e = 0; e < this.elements.length; e ++) {

      if (this.elements[e].tagName != 'BUTTON') {			

        console.log(`#new-location-form`, this.elements[e].value);
        newLocationName = this.elements[e].value;
        
      }

    }

		let newLocationNode = createLocationSegment(6, newLocationName);

		//$(`#append-location-panels`).children()[0].after( $(newLocationNode).hide().fadeIn(1000) );
		//$(`#append-location-panels`).children()[0].append( $(newLocationNode) );
		$(`#location-entries`).prepend( $(newLocationNode).hide().fadeIn(1000) );

		

		document.getElementById('create-new-location-btn').innerHTML = 'Save';
		
		/*
    $.ajax({
		url: "libs/php/insertLocation.php",
		type: "GET",
		//url: "libs/post-php/insertLocation.php",
    //type: "POST",
    dataType: "json",
    data: {
      name: newLocationName
    },
    success: function (result) {
      
          let newDeptObj = {};
          newDeptObj['name'] = 'New Department';
          newDeptObj['locationID'] = result.data.id;
          
          $.ajax({
          url: "libs/php/insertDepartmentRtnID.php",  
          //url: "libs/php/insertDepartment.php", //not used
          type: "GET",
          //url: "libs/post-php/insertDepartmentRtnID.php",
          //type: "POST",
          dataType: "json",
          data: newDeptObj,
          success: function (result) {
						
							console.log('new loction result', result);
							
							document.getElementById('modal-deny-btn').click();
							
							document.getElementById('floating-info-message').setAttribute('class', 'ui info floating-error message');
							document.getElementById('floating-info-header').innerHTML = 'New Location created';
							document.getElementById('floating-info-text').innerHTML = newLocationName;

							refreshPage();

          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.log('error');
              console.log(textStatus);
              console.log(errorThrown);
            },
          });
          

    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log('error');
        console.log(textStatus);
        console.log(errorThrown);
      },
    });

		*/

  });	
	
	} // end of IF locationNameNeedsToBeValidated == false
				

				
				if (!$(`#new-location-form`).form('validate form')) {
					
					locationNameNeedsToBeValidated = true;

				} else if ($(`#new-location-form`).form('validate form')){
				
					locationNameNeedsToBeValidated = false;

				}


	if ($(`#new-location-form`).form('validate form')) {
		$(`#new-location-form`).form('submit');
		$(`#new-location-form`).form('reset');
		$('#new-location-accordion-btn').click();

		let closeNewLocationTimer = setTimeout(function(){
			$('#location-accordion-segment').attr('style', 'display: none');
			clearTimeout(closeNewLocationTimer);
		},250);		

	}

});


function oneLocationEventListeners(deptsParam, locKey){

	for (let [k, val] of Object.entries(deptsParam)){	
		
			

	if(!val.loaded) {
		
			$(`#departmentID-${k}-form`).form({
				fields: {
					name: {
						identifier: 'dept-rename',
						rules: departmentRules
					}
				}
			});	
		
			
			
			updateLoadedDepts.push(k);

		$(`#submit-rename-departmentID-${k}-btn`).click(function(e){
			e.preventDefault();			
			
			if (!renameDeptNeedsToBeValidated) {
							
			$(`#departmentID-${k}-form`).one('submit', function(event){
				event.preventDefault();

				$(`#departmentID-${k}-form`).form('set defaults');
				
				$(`#departmentID-${k}-accordion`).click()	

				let updatedDeptName;
				let updatedDeptID;
				let updateDepartmentDataObj = {};

				for (let e = 0; e < this.elements.length; e ++) {
			
					if (this.elements[e].tagName != 'BUTTON') {			

						updatedDeptName = this.elements[e].value;
						updatedDeptID = this.elements[e].getAttribute('deptID');

						$(`#input-departmentID-${k}-field`).attr('value', this.elements[e].value);
						$(`#input-departmentID-${k}-field`).attr('placeholder', this.elements[e].value);
						$(`#departmentID-${k}-title`).hide().html(this.elements[e].value).fadeIn(750); 

						}
					
				}	
				
				updateDepartmentDataObj['department'] = updatedDeptName;
				updateDepartmentDataObj['departmentID'] = updatedDeptID;	
				
				$.ajax({
				url: "libs/php/updateDepartment.php",
				type: "GET",
				//url: "libs/post-php/updateDepartment.php",
				//type: "POST",
				dataType: "json",
				data: updateDepartmentDataObj,
				success: function (result) {
					
						refreshPage();

				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error');
						console.log(textStatus);
						console.log(errorThrown);
					},
				});

			});
			
			} // end of IF renameDeptNeedsToBeValidated == false
			

			
			if (!$(`#departmentID-${k}-form`).form('validate form')) {
				console.log('not validated')
				renameDeptNeedsToBeValidated = true;
			} else if ($(`#departmentID-${k}-form`).form('validate form')){
				console.log('validated')
				renameDeptNeedsToBeValidated = false;
			}

				if ($(`#departmentID-${k}-form`).form('validate form')) {
					$(`#departmentID-${k}-form`).form('submit');
					$(`#departmentID-${k}-form`).form('reset');
				}

			

		});

		$(`#cancel-departmentID-${k}-btn`).click(function(e){

			
			$(`#departmentID-${k}-form`).form('reset');

			$(`#departmentID-${k}-accordion`).click();

		});
	
		$(`#rename-departmentID-${k}-btn`).click(function(e){

			departmentRules = basicRules.slice();

			for (let [o,p] of Object.entries(deptsParam)) {
			
				let newRule = {}
				newRule['type'] = `notExactly[${p.depname}]`;	
				newRule['prompt'] = 'That department already exists in this location.';
				departmentRules.push(newRule)
			
			}

			$(`#departmentID-${k}-form`).form({
				fields: {
					name: {
						identifier: 'dept-rename',
						rules: departmentRules
					}
				}
			});	

			$(`#departmentID-${k}-accordion`).click()
			
			$(`#rename-departmentID-${k}-input-field`).attr('value','');
			
		});	

		$(`#delete-departmentID-${k}-btn`).click(function(e){
			
			document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: inline !important');
			document.getElementById('delete-department-modal-btn').setAttribute('deptid', `${this.getAttribute('deptid')}`);
			
			let deptID = this.getAttribute('deptid');
			let deptName = departmentsObj[deptID]['name'];

			$.ajax({
			url: "libs/php/checkIfLastDepartment.php",
			type: "GET",
			//url: "libs/post-php/checkIfLastDepartment.php",
			//type: "POST",
			dataType: "json",
			data: {
				departmentID: deptID
			},
			success: function (result) {
				
					console.log('delete Location: ',result.data);
					
					let locName = locationsObj[result.data.locID];
										
					if (result.data.msg == "Delete location") {
						
						document.getElementById('delete-department-modal-btn').setAttribute('emptyLocID', result.data.locID);
						
						$('#alert-modal').modal(
						{
							title: '<i class="archive icon"></i>',
							content: `<div class="alert-modal-text">
											<h3>Delete location and department?</h3> 
											<h4> The location ${locName} and the department ${deptName} will both be deleted. </h4>
											</div>`
						}).modal('show');
						
						
					}	else {
						
						document.getElementById('delete-department-modal-btn').setAttribute('emptyLocID', 0);

						$('#alert-modal').modal(
						{
							title: '<i class="archive icon"></i>',
							content: `<div class="alert-modal-text">Delete this department? <h3> ${deptName} </h3></div>`
							
						}).modal('show');
											
						
						
					}
					
			
					
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			
			
		});

		
		//$(`#departmentID-${k}-trash-warning`).click(function(e){
		//	$('#alert-modal').modal(
		//		{
		//			title: '<i class="archive icon"></i>',
		//			content: `<div class="alert-modal-text">Cannot delete department. Remove all employees and try again.</div>`
		//		}).modal('show');
		//});
		
		
		locsAndDeptsObj[locKey]['departments'][k]['loaded'] = true;

	}  // end of IF dept loaded == false, apply listeners
					
	$(`#rename-dept-${k}-accordion`).accordion();
} // end of loop through departments	
}

function eventListenersInsideLocsModal() {

	let existingLocationNames = [];
	
	for (let [k, value] of Object.entries(locsAndDeptsObj)){

		existingLocationNames.push(locationsObj[k]);

		$(`#submit-rename-locationID-${k}-btn`).click(function(e){
		e.preventDefault();
		
		if (!renameLocNeedsToBeValidated) {
		
		$(`#locationID-${k}-form`).one('submit', function(event){
			event.preventDefault();

			$(`#locationID-${k}-form`).form('set defaults');
			
			$(`#locationID-${k}-accordion`).click()	

			let updatedLocName;
			let updatedLocID;
			let updateLocationDataObj = {};

			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			

					updatedLocName = this.elements[e].value;
					updatedLocID = this.elements[e].getAttribute('locID');

					$(`#input-locationID-${k}-field`).attr('value', this.elements[e].value);
					$(`#input-locationID-${k}-field`).attr('placeholder', this.elements[e].value);
					$(`#locationID-${k}-title`).hide().html(this.elements[e].value).fadeIn(750); 

					}
				
			}	
			
			updateLocationDataObj['location'] = updatedLocName;
			updateLocationDataObj['locationID'] = updatedLocID;	
		
			console.log('need ajax to update location, JS line 1783');

			});
		
		} // end of IF renameLocNeedsToBeValidated == false
		
		if (!$(`#locationID-${k}-form`).form('validate form')) {
			console.log('not validated')
			renameLocNeedsToBeValidated = true;
		} else if ($(`#locationID-${k}-form`).form('validate form')){
			
			renameLocNeedsToBeValidated = false;
		}

			if ($(`#locationID-${k}-form`).form('validate form')) {
				$(`#locationID-${k}-form`).form('submit');
				$(`#locationID-${k}-form`).form('reset');
			}


		});

		$(`#cancel-locationID-${k}-btn`).click(function(e){
			
			$(`#locationID-${k}-form`).form('reset');

			$(`#locationID-${k}-accordion`).click();

		});
	
		
		$(`#rename-locationID-${k}-btn`).click(function(e){

		$(`#locationID-${k}-accordion`).click();

			let clickFieldTimer = setTimeout(function(){
				console.log('click');
				document.getElementById(`rename-locationID-${k}-form-field`).click();
				clearTimeout(clickFieldTimer);
			}, 500);

		});	
		

		$(`#delete-locationID-${k}-btn`).click(function(e){

			console.log('get current dept count from DB');

		});

	}	 
				
	locationRules = basicRules.slice();


	for (let r = 0 ; r < existingLocationNames.length; r ++) {
	
		let newRule = {}
			newRule['type'] = `notExactly[${existingLocationNames[r]}]`;
			newRule['prompt'] = 'That location already exists.';
			locationRules.push(newRule)
	
	}
				
	for (let [c, val] of Object.entries(locationsObj)){	
			
		$(`#locationID-${c}-form`).form({
			fields: {
				name: {
					identifier: 'loc-rename',
					rules: locationRules
				}
			}
		});	
				
	}
		
	// the new location field also gets the same rules

	$('#locationID-x-new-loc-accordion-btn').click(function(){

		let invisibleDivTimer = setTimeout(function(){
			document.getElementById('invisible-div').scrollIntoView({behavior: "smooth", block: "end"});
			clearTimeout(invisibleDivTimer);
		},200);

		//document.getElementById('invisible-div').scrollIntoView({behavior: "smooth", block: "end"});

	});
					
			$(`#locationID-x-new-loc-form`).form({
			
				fields: {
						name: {
							identifier: 'new-location',
							rules: locationRules
						}
					}

			});
			
			
	$(`#locationID-x-submit-new-loc-btn`).click(function(e){
		e.preventDefault();
		
		if(!createNewLocNeedsToBeValidated){
		
			$(`#locationID-x-new-loc-form`).one('submit', function(event){
				event.preventDefault();

				$(`#locationID-x-new-loc-accordion-btn`).click();

				let newLocName;
				//let locationID = document.getElementById(`locationID-x-submit-new-loc-btn`).getAttribute('locid');
				
				for (let e = 0; e < this.elements.length; e ++) {
			
					if (this.elements[e].tagName != 'BUTTON') {			
		
						newLocName = this.elements[e].value;
						
					}
		
				}

				let newLocNode = createLocationSegment(6, newLocName);

				$(`#location-x-new-loc-before`).before($(newLocNode).hide().fadeIn(1000));

			});
		
		} // end of createNewDeptNeedsToBeValidated == false
		
		if (!$(`#locationID-x-new-loc-form`).form('validate form')) {
			console.log('not validated')
			createNewLocNeedsToBeValidated = true;
		} else if ($(`#locationID-x-new-loc-form`).form('validate form')){
			createNewLocNeedsToBeValidated = false;
		}
		
		if ($(`#locationID-x-new-loc-form`).form('validate form')) {
			$(`#locationID-x-new-loc-form`).form('submit');
			$(`#locationID-x-new-loc-form`).form('reset');
		}
		

	});

	$(`#locationID-x-cancel-new-loc-btn`).click(function(e){

		$(`#locationID-x-new-loc-form`).form('reset');
		$(`#locationID-x-new-loc-accordion-btn`).click();

	});
				
	$('.ui.accordion').accordion();
	

} //END OF ADDING LOCATION EVENT LISTENERS FUNCTION;



function eventListenersInsideDeptsModal() {

		let existingDepartmentNames = [];

		for (let [k, val] of Object.entries(departmentsObj)){	
		
			existingDepartmentNames.push(val.name);	
			
			$(`#rename-departmentID-${k}-input-field`).on('input', function(){
				
				$(`#submit-rename-departmentID-${k}-btn`).attr('class','ui tiny button dept-action-button');
				
			});
			
			$(`#departmentID-${k}-loc-dropdown`).on('change', function(){
				
				$(`#submit-rename-departmentID-${k}-btn`).attr('class','ui tiny button dept-action-button');
				
			});

							
			$(`#departmentID-${k}-form`).one('submit', function(event){
				event.preventDefault();

				$(`#departmentID-${k}-form`).addClass('loading');
			
				let updatedDeptName;
				let updatedDeptID;
				let updateDepartmentDataObj = {};
				let updatedLocationID;
				let newNameSuccess = false;

				let formFields = $(`#departmentID-${k}-form`).form('get values');
				formFields['departmentID'] = k;
				
				function updateDepartment(formData) {
					
					console.log('data submitted', formData);
					
					$.ajax({
					//url: "libs/post-php/updateDepartment.php",
					//type: "POST",
					url: "libs/php/updateDepartment.php",
					type: "GET",
					dataType: "json",
					data: formData,
					success: function (result) {
						
						$(`#departmentID-${k}-accordion`).click();
		

						
						let renameTimer = setTimeout(function(){
							$(`#departmentID-${k}-form`).removeClass('loading');
							$(`#departmentID-${k}-title`).hide().html(`${formFields['dept-rename']} | ${locationsObj[formFields['locID']]}`).fadeIn(750);	
							clearTimeout(renameTimer);
						},250);
							
						$(`#departmentID-${k}-form`).form('set defaults');
						$(`#rename-departmentID-${k}-input-field`).attr('value', `${formFields['dept-rename']}`);
						$(`#rename-departmentID-${k}-input-field`).attr('placeholder', `${formFields['dept-rename']}`);
						
						deptCacheObj[k]['departmentName'] = formFields['dept-rename'];
						deptCacheObj[k]['locationID'] = formFields['locID'];

					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('error', jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
						},
					});
								
				} //end of Update function
				
				$.ajax({
				//url: "libs/post-php/checkDepartmentCachce.php",
				//type: "POST",
				url: "libs/php/checkDepartmentCache.php",
				type: "GET",
				dataType: "json",
				data: deptCacheObj[k],
				success: function (result) {
					
					if (result.data == true) {
						
						if (deptCacheObj[k]['departmentName'] == formFields['dept-rename'] && deptCacheObj[k]['locationID'] == formFields['locID']) {
							
							$(`#departmentID-${k}-form`).removeClass('loading');
						
						} else {
						
							$.ajax({
							//url: "libs/post-php/countDeptByName.php",
							//type: "POST",
							url: "libs/php/countDeptByName.php",
							type: "GET",
							dataType: "json",
							data: {
								departmentName: formFields['dept-rename']
							},
							success: function (result) {
											
								if (result.data['existing-names'] == 0) { 
									
									updateDepartment(formFields);

								} else if (result.data['existing-names'] >= 1) {
									
									if (result.data['locationID'] == deptCacheObj[k]['locationID']) {
										
										$.ajax({
										//url: "libs/post-php/checkOwnLocNames.php",
										//type: "POST",
										url: "libs/php/checkOwnLocNames.php",
										type: "GET",
										dataType: "json",
										data: {
											departmentName: formFields['dept-rename'],
											locationID: result.data['locationID']
										},
										success: function (result) {
											
											if (result.data != deptCacheObj[k]['departmentID']){
												
												$(`#departmentID-${k}-form`).form('add errors', ['That department already exists in this location.']);
												$(`#departmentID-${k}-form`).removeClass('loading');	
												
											} else {
												
												updateDepartment(formFields);

											}
											
										},
										error: function (jqXHR, textStatus, errorThrown) {
												console.log('error', jqXHR);
												console.log(textStatus);
												console.log(errorThrown);
											},
										});
										
										
									} else {
										
										$(`#departmentID-${k}-form`).form('add errors', ['That department already exists in another location.']);
										$(`#departmentID-${k}-form`).removeClass('loading');
										
									}
								
								} // end of IF a matching name found in dept table

							},
							error: function (jqXHR, textStatus, errorThrown) {
									console.log('error', jqXHR);
									console.log(textStatus);
									console.log(errorThrown);
								},
							});
						
						}
						
						
					} else {
						
						$(`#departmentID-${k}-form`).form('add errors', ['A data error occurred please refresh this window and try again.'])
						
					}
					
				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error', jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					},
				});


			}); // end of Submit listener


			$(`#submit-rename-departmentID-${k}-btn`).click(function(e){
				e.preventDefault();
												
				if ($(`#departmentID-${k}-form`).form('validate form')) {
					$(`#departmentID-${k}-form`).form('submit');
				}

			});

			$(`#cancel-departmentID-${k}-btn`).click(function(e){
				
				$(`#departmentID-${k}-form`).form('reset');

				$(`#departmentID-${k}-accordion`).click();

			});
		
			$(`#rename-departmentID-${k}-btn`).click(function(e){

				departmentRules = basicRules.slice();

				//$(`#departmentID-${k}-form`).form('reset');

				$(`#departmentID-${k}-form`).form({	
					fields: {
						name: {
							identifier: 'dept-rename',
							rules: departmentRules
						}
					},
					transition: 'fade'
				})	

				$(`#departmentID-${k}-accordion`).click();
				
			});	

			$(`#delete-departmentID-${k}-btn`).click(function(e){

				$.ajax({
				//url: "libs/post-php/countPersonnelByDept.php",
				//type: "POST",
				url: "libs/php/countPersonnelByDept.php",
				type: "GET",
				dataType: "json",
				data: {
					deptID: k
				},
				success: function (result) {
					
					if (result.data.personnel > 9) {

						$(`#departmentID-${k}-warning`).attr('class', 'ui floating warning message');
						$(`#departmentID-${k}-warning-text`).html(`This department has ${result.data.personnel} employees. <br/>Only empty departments can be deleted.`);
						
						$(`#departmentID-${k}-close-icon`)
						.one('click', function() {
							$(this)
								.closest('.message')
								.transition('fade')
							;
						});
				
					} else {


												
						$.ajax({
						//url: "libs/post-php/checkDepartmentCachce.php",
						//type: "POST",
						url: "libs/php/checkDepartmentCache.php",
						type: "GET",
						dataType: "json",
						data: deptCacheObj[k],
						success: function (result) {
							
							console.log('delete cache check', result);
							
							if (result.data == true) {

							$('#modal-header-text').html(`<i class="archive icon"></i> Delete Department`);
							$('#alert-modal-text').html('Are you sure you want to delete this department?');

							$('#open-second-modal-btn').click();

							$('#confirm-delete-dept-btn').one('click', function(){

								console.log(`now delete Department ${k}, ${deptCacheObj[k]['departmentName']}`);

								/*
								$(`#close-departmentID-${k}-icon`)
								.one('click', function() {
									$(this)
										.closest('.message')
										.transition('fade')
									;
								});
								*/

							});
							

							} else {
								
								$(`#departmentID-${k}-form`).form('add errors', ['A data error occurred please refresh this window and try again.']);
								
							}

						},
						error: function (jqXHR, textStatus, errorThrown) {
								console.log('error', jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
							},
						});
					
						

						
					}
					
					
				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error', jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					},
				});




					
					
			});

							
	} // end of loop through departments
			
		departmentRules = basicRules.slice();

		//get all current dept names for rules
		for (let r = 0 ; r < existingDepartmentNames.length; r ++) {
		
			let newRule = {}
				newRule['type'] = `notExactly[${existingDepartmentNames[r]}]`;
				newRule['prompt'] = 'That department already exists.';
				departmentRules.push(newRule)
		
		}
			
		// each department for the current location gets the same rules - for renaming
		for (let [k, val] of Object.entries(departmentsObj)){	
				
			$(`#departmentID-${k}-form`).form({
				fields: {
					name: {
						identifier: 'dept-rename',
						rules: departmentRules
					}
				}
			});	
			
		}
	
		// the new dept field also gets the same rules 
		/*
		$(`#locationID-${key}-new-dept-form`).form({
		
			fields: {
					name: {
						identifier: 'new-department',
						rules: departmentRules
					}
				}

		});

		$(`#locationID-${key}-submit-new-dept-btn`).click(function(e){
			e.preventDefault();
			
			if(!createNewDeptNeedsToBeValidated){
			
			$(`#locationID-${key}-new-dept-form`).one('submit', function(event){
				event.preventDefault();

				$(`#locationID-${key}-new-dept-accordion-btn`).click();

				let newDeptName;
				let locationID = document.getElementById(`locationID-${key}-submit-new-dept-btn`).getAttribute('locid');
				
				for (let e = 0; e < this.elements.length; e ++) {
			
					if (this.elements[e].tagName != 'BUTTON') {			
		
						newDeptName = this.elements[e].value;
						
					}
		
				}
				
				let newDeptObj = {};
				newDeptObj['name'] = newDeptName;
				newDeptObj['locationID'] = locationID;
				
				$.ajax({
				//url: "libs/post-php/insertDepartmentRtnID.php",
				//type: "POST",
				url: "libs/php/insertDepartmentRtnID.php",
				type: "GET",
				dataType: "json",
				data: newDeptObj,
				success: function (result) {

						let newDeptNode = createDepartmentSegment(result.data.id, newDeptName, 0);
						
						
						$(`#location-${locationID}-new-dept-before`).before($(newDeptNode).hide().fadeIn(1000));

						departmentsObj[result.data.id] = {};
						departmentsObj[result.data.id]['name'] = newDeptName;

						locsAndDeptsObj[locationID]['departments'][result.data.id] = {};
						locsAndDeptsObj[locationID]['departments'][result.data.id]['loaded'] = false;
						locsAndDeptsObj[locationID]['departments'][result.data.id]['depname'] = newDeptName;

						oneLocationEventListeners(locsAndDeptsObj[locationID]['departments'], locationID);

						refreshPage();  

				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error');
						console.log(textStatus);
						console.log(errorThrown);
					},
				});
				

			});
			
			} // end of createNewDeptNeedsToBeValidated == false
			
			if (!$(`#locationID-${key}-new-dept-form`).form('validate form')) {
				console.log('not validated')
				createNewDeptNeedsToBeValidated = true;
			} else if ($(`#locationID-${key}-new-dept-form`).form('validate form')){
			
				createNewDeptNeedsToBeValidated = false;
			}
			
			if ($(`#locationID-${key}-new-dept-form`).form('validate form')) {
				$(`#locationID-${key}-new-dept-form`).form('submit');
				$(`#locationID-${key}-new-dept-form`).form('reset');
			}
			

		});

		$(`#locationID-${key}-cancel-new-dept-btn`).click(function(e){

			$(`#locationID-${key}-new-dept-form`).form('reset');
			$(`#locationID-${key}-new-dept-accordion-btn`).click();

		});

    $(`#delete-locationID-${key}-icon`).click(function(e){
			
			let onlyDeptID;
			let checkDeptObj = locsAndDeptsObj[key]['departments'];
			let checkDeptCount = 0;
			
			for (let [check_key, check_val] of Object.entries(checkDeptObj)){
				
				checkDeptCount++;
				onlyDeptID = check_key;
			
			}		
			
			if (checkDeptCount == 1) {

				document.getElementById(`delete-departmentID-${onlyDeptID}-btn`).click();				
			} else {

				console.log('error finding last department ID');
			
			}

			
    });
		*/
				
	$('.ui.accordion').accordion();
	

} //END OF ADDING DEPARTMENTS EVENT LISTENERS FUNCTION;




function eventListenersInsideDeptsandLocsModal() {

	
	
	for (let [key, value] of Object.entries(locsAndDeptsObj)){
	
		if (!value.loaded) {

		updateLoadedLocs.push(key);

		let existingDepartmentNames = [];

		for (let [k, val] of Object.entries(value.departments)){	
		
			existingDepartmentNames.push(val.depname);	

		if(!val.loaded) {
			
				$(`#departmentID-${k}-form`).form({
					fields: {
						name: {
							identifier: 'dept-rename',
							rules: departmentRules
						}
					}
				});	
				
				updateLoadedDepts.push(k);

			$(`#submit-rename-departmentID-${k}-btn`).click(function(e){
				e.preventDefault();
				
				if (!renameDeptNeedsToBeValidated) {
				
				$(`#departmentID-${k}-form`).one('submit', function(event){
					event.preventDefault();

					$(`#departmentID-${k}-form`).form('set defaults');
					
					$(`#departmentID-${k}-accordion`).click()	

					let updatedDeptName;
					let updatedDeptID;
					let updateDepartmentDataObj = {};

					for (let e = 0; e < this.elements.length; e ++) {
				
						if (this.elements[e].tagName != 'BUTTON') {			

							updatedDeptName = this.elements[e].value;
							updatedDeptID = this.elements[e].getAttribute('deptID');

							$(`#input-departmentID-${k}-field`).attr('value', this.elements[e].value);
							$(`#input-departmentID-${k}-field`).attr('placeholder', this.elements[e].value);
							$(`#departmentID-${k}-title`).hide().html(this.elements[e].value).fadeIn(750); 

							}
						
					}	
					
					updateDepartmentDataObj['department'] = updatedDeptName;
					updateDepartmentDataObj['departmentID'] = updatedDeptID;	
					
					$.ajax({
					url: "libs/php/updateDepartment.php",
					type: "GET",
					//url: "libs/post-php/updateDepartment.php",
					//type: "POST",
					dataType: "json",
					data: updateDepartmentDataObj,
					success: function (result) {

              refreshPage();

					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('error');
							console.log(textStatus);
							console.log(errorThrown);
						},
					});

				});
				
				} // end of IF renameDeptNeedsToBeValidated == false
				

				
				if (!$(`#departmentID-${k}-form`).form('validate form')) {
					console.log('not validated')
					renameDeptNeedsToBeValidated = true;
				} else if ($(`#departmentID-${k}-form`).form('validate form')){
					
					renameDeptNeedsToBeValidated = false;
				}

					if ($(`#departmentID-${k}-form`).form('validate form')) {
						$(`#departmentID-${k}-form`).form('submit');
						$(`#departmentID-${k}-form`).form('reset');
					}

				

			});

			$(`#cancel-departmentID-${k}-btn`).click(function(e){
				
				$(`#departmentID-${k}-form`).form('reset');

				$(`#departmentID-${k}-accordion`).click();

			});
		
			$(`#rename-departmentID-${k}-btn`).click(function(e){

				departmentRules = basicRules.slice();

				for (let [o,p] of Object.entries(value['departments'])) {
				
					let newRule = {}
					newRule['type'] = `notExactly[${p.depname}]`;	
					newRule['prompt'] = 'That department already exists in this location.';
					departmentRules.push(newRule)
				
				}

				$(`#departmentID-${k}-form`).form({
					fields: {
						name: {
							identifier: 'dept-rename',
							rules: departmentRules
						}
					}
				});	

				$(`#departmentID-${k}-accordion`).click()
				
				$(`#rename-departmentID-${k}-input-field`).attr('value','');
				
			});	

			$(`#delete-departmentID-${k}-btn`).click(function(e){

				document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: inline !important');
				document.getElementById('delete-department-modal-btn').setAttribute('deptid', `${this.getAttribute('deptid')}`);
				
				let deptID = this.getAttribute('deptid');
				let deptName = departmentsObj[deptID]['name'];

				if (this.getAttribute('employees') != 0) {
					
					document.getElementById(`departmentID-${k}-warning`).setAttribute('class','ui floating warning message');
					document.getElementById(`departmentID-${k}-warning-text`).innerHTML = `<i class="fas fa-exclamation-circle">&nbsp;</i>  Only empty departments can be deleted.`;
					
					$(`#departmentID-${k}-close-icon`)
					.one('click', function() {
						$(this)
							.closest('.message')
							.transition('fade')
						;
					});
					
				} else {
				
				$.ajax({
				//url: "libs/post-php/checkIfLastDepartment.php",
				//type: "POST",
				url: "libs/php/checkIfLastDepartment.php",
				type: "GET",
				dataType: "json",
				data: {
					departmentID: deptID
				},
				success: function (result) {

						console.log('delete loc result', result);
						
						let locName = locationsObj[result.data.locID];
											
						if (result.data.msg == "Delete location") {
							
							document.getElementById('delete-department-modal-btn').setAttribute('emptyLocID', result.data.locID);
							
							$('#alert-modal').modal(
							{
								title: '<i class="archive icon"></i>',
								content: `<div class="alert-modal-text">Delete this location and department? 
								
												<h4> The location ${locName} and department ${deptName} will both be deleted. </h4>
												</div>`
							}).modal('show');
							
							
						}	else {
							
							document.getElementById('delete-department-modal-btn').setAttribute('emptyLocID', 0);

							document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: inline');

							$('#alert-modal').modal(
							{
								title: '<i class="archive icon"></i>',
								content: `<div class="alert-modal-text">Delete this department? <h3> ${deptName} </h3></div>`
							}).modal('show');
												
							
							
						}
					
				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error');
						console.log(textStatus);
						console.log(errorThrown);
					},
				});
				
			
				}

			});

			
			/*
			$(`#departmentID-${k}-trash-warning`).click(function(e){
				
				$('#alert-modal').modal(
					{
						title: '<i class="archive icon"></i>',
						content: `<div class="alert-modal-text">Cannot delete department. Remove all employees and try again.</div>`
					}).modal('show');

			});
			*/

			locsAndDeptsObj[key]['departments'][k]['loaded'] = true;

		}  // end of IF dept loaded == false, apply listeners
							
	} // end of loop through departments
			
		departmentRules = basicRules.slice();

		//get all current dept names for rules
		for (let r = 0 ; r < existingDepartmentNames.length; r ++) {
		
			let newRule = {}
				newRule['type'] = `notExactly[${existingDepartmentNames[r]}]`;
				newRule['prompt'] = 'That department already exists in this location.';
				departmentRules.push(newRule)
		
		}
			
		// each department for the current location gets the same rules - for renaming
		for (let [k, val] of Object.entries(value.departments)){	
				
			$(`#departmentID-${k}-form`).form({
				fields: {
					name: {
						identifier: 'dept-rename',
						rules: departmentRules
					}
				}
			});	
			
		}
	
		// the new dept field also gets the same rules
		$(`#locationID-${key}-new-dept-form`).form({
		
			fields: {
					name: {
						identifier: 'new-department',
						rules: departmentRules
					}
				}

		});

		$(`#locationID-${key}-submit-new-dept-btn`).click(function(e){
			e.preventDefault();
			
			if(!createNewDeptNeedsToBeValidated){
			
			$(`#locationID-${key}-new-dept-form`).one('submit', function(event){
				event.preventDefault();

				$(`#locationID-${key}-new-dept-accordion-btn`).click();

				let newDeptName;
				let locationID = document.getElementById(`locationID-${key}-submit-new-dept-btn`).getAttribute('locid');
				
				for (let e = 0; e < this.elements.length; e ++) {
			
					if (this.elements[e].tagName != 'BUTTON') {			
		
						newDeptName = this.elements[e].value;
						
					}
		
				}
				
				let newDeptObj = {};
				newDeptObj['name'] = newDeptName;
				newDeptObj['locationID'] = locationID;
				
				$.ajax({
				//url: "libs/post-php/insertDepartmentRtnID.php",
				//type: "POST",
				url: "libs/php/insertDepartmentRtnID.php",
				type: "GET",
				dataType: "json",
				data: newDeptObj,
				success: function (result) {

						let newDeptNode = createDepartmentSegment(result.data.id, newDeptName, 0);
						
						
						$(`#location-${locationID}-new-dept-before`).before($(newDeptNode).hide().fadeIn(1000));

						departmentsObj[result.data.id] = {};
						departmentsObj[result.data.id]['name'] = newDeptName;

						locsAndDeptsObj[locationID]['departments'][result.data.id] = {};
						locsAndDeptsObj[locationID]['departments'][result.data.id]['loaded'] = false;
						locsAndDeptsObj[locationID]['departments'][result.data.id]['depname'] = newDeptName;

						oneLocationEventListeners(locsAndDeptsObj[locationID]['departments'], locationID);

						refreshPage();  

				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error');
						console.log(textStatus);
						console.log(errorThrown);
					},
				});
				

			});
			
			} // end of createNewDeptNeedsToBeValidated == false
			
			if (!$(`#locationID-${key}-new-dept-form`).form('validate form')) {
				console.log('not validated')
				createNewDeptNeedsToBeValidated = true;
			} else if ($(`#locationID-${key}-new-dept-form`).form('validate form')){
			
				createNewDeptNeedsToBeValidated = false;
			}
			
			if ($(`#locationID-${key}-new-dept-form`).form('validate form')) {
				$(`#locationID-${key}-new-dept-form`).form('submit');
				$(`#locationID-${key}-new-dept-form`).form('reset');
			}
			

		});

		$(`#locationID-${key}-cancel-new-dept-btn`).click(function(e){

			$(`#locationID-${key}-new-dept-form`).form('reset');
			$(`#locationID-${key}-new-dept-accordion-btn`).click();

		});

    $(`#delete-locationID-${key}-icon`).click(function(e){
			
			let onlyDeptID;
			let checkDeptObj = locsAndDeptsObj[key]['departments'];
			let checkDeptCount = 0;
			
			for (let [check_key, check_val] of Object.entries(checkDeptObj)){
				
				checkDeptCount++;
				onlyDeptID = check_key;
			
			}		
			
			if (checkDeptCount == 1) {

				document.getElementById(`delete-departmentID-${onlyDeptID}-btn`).click();				
			} else {

				console.log('error finding last department ID');
			
			}

			
    });

    //locsAndDeptsObj[key]['loaded'] = true;

	} // end of location loop if loaded == false
	
	} //end of loop through the Obj	
				
	$('.ui.accordion').accordion();
	

} //END OF ADDING EVENT LISTENERS FUNCTION;



// ** FUNCTIONS TO CREATE ELEMENTS **

// CREATE EMPLOYEES
function createEmployee(employeePropertiesObj){
	
	let employeeH4 = document.createElement('h4');
	employeeH4.setAttribute('class', 'ui image header');
		
	let employeeDiv = document.createElement('div');
	employeeDiv.setAttribute('class', 'content employee-row-content');

	for (const [key, value] of Object.entries(employeePropertiesObj)) {

		let checkNull = value == 0 ? 0 : value;

		let textValue = checkNull == "" ? 0 : checkNull;

		if (textValue == 'TBC') {
			console.log(key, value);
		}

		employeePropertiesObj[key] = textValue;
		
	}

	employeeDiv.setAttribute('employee-properties', JSON.stringify(employeePropertiesObj));
	
	if (orderBy == 'firstName') {
		employeeDiv.innerHTML = `${employeePropertiesObj.firstName} ${employeePropertiesObj.lastName}`;		
	} else if (orderBy == 'lastName'){
		employeeDiv.innerHTML = `${employeePropertiesObj.lastName}, ${employeePropertiesObj.firstName}`;
	}
	
	let employeeSubHeader = document.createElement('div');
	employeeSubHeader.setAttribute('class', 'sub header');
	employeeSubHeader.innerHTML = `${employeePropertiesObj.department} | ${employeePropertiesObj.locationName}`;
	
	let empInfo = document.createElement('i');
	empInfo.setAttribute('class', 'fas fa-info-circle employee-modal-btn pointer');
	empInfo.setAttribute('employee-details', JSON.stringify(employeePropertiesObj));

	employeeDiv.appendChild(empInfo);

	employeeDiv.appendChild(employeeSubHeader);
	
	employeeH4.appendChild(employeeDiv);	
		
	let employeeModalBtn = document.createElement('div');
	employeeModalBtn.setAttribute('class', 'employee-modal-btn ui button');
	employeeModalBtn.innerHTML = 'View Details';
	
	return [employeeH4, employeeModalBtn];

};

function appendEmployee(elementToAppend, employeeElements){

	elementToAppend.innerHTML = '';
	elementToAppend.appendChild(employeeElements[0]);
	
};

function createEmployeeRow(employeePropertiesObj, visibility) {

	
	let setMax = false;
	if (employeePropertiesObj.id == finalMaxID) {

		setMax = true;
		newestElement = employeePropertiesObj;
	}

	let tableRow = document.createElement('tr');
	tableRow.setAttribute('class', 'result-row');

	if (!visibility) {

		tableRow.setAttribute('style', 'display: none !important');
		
	}

	if (employeePropertiesObj.firstName == 'First name') {
	  tableRow.setAttribute('style', 'visibility: hidden');
	} 
	
	maxNewEmployeeID = employeePropertiesObj.id > maxNewEmployeeID ? employeePropertiesObj.id : maxNewEmployeeID; 

	let tableData = document.createElement('td');

	let employeeElements = createEmployee(employeePropertiesObj, visibility);
					
	tableData.appendChild(employeeElements[0]);
	
	tableRow.appendChild(tableData);

	return tableRow;

};

function renderEmployee(employeeProperties){

	employeeProperties['jobTitle'] = employeeProperties['jobTitle'] == '' ? 'Job Title TBC' : employeeProperties['jobTitle'];
	
	for (const [key, value] of Object.entries(employeeProperties)) {
					
		document.getElementById(`employee-${key}-field`).innerHTML = value;
		if (value == 'Job Title TBC') {
			document.getElementById(`employee-${key}-field`).setAttribute('style', 'color: gray; font-size: 1rem; font-style: italic');
		} else {
			document.getElementById(`employee-${key}-field`).setAttribute('style', '');
		}
		
		if (key == 'email'){
			
			document.getElementById('email-mail-to').setAttribute('href', `mailto:${value}`);
			
		}
		

	}
	
};

// CREATE CHECKBOXES
function createCheckbox(checkboxName, checkboxInputID, category, mobile){
	let checkboxDiv = document.createElement('div');

	if(mobile) {
		checkboxDiv.setAttribute('class', `ui checkbox ${category}-mobile-checkbox checked`);		
	} else {
		checkboxDiv.setAttribute('class', `ui checkbox ${category}-checkbox checked`);
	}

	let checkboxNameStr = checkboxName.replace(/\s+/g, '-').toLowerCase();
	let categoryStr = category.replace(/\s+/g, '-').toLowerCase();

	if (mobile) {
		checkboxDiv.setAttribute('id', `${checkboxNameStr}-${categoryStr}-mobile-checkbox`);
	} else {
		checkboxDiv.setAttribute('id', `${checkboxNameStr}-${categoryStr}-checkbox`);
	} 

	let checkboxInput = document.createElement('input');
	checkboxInput.setAttribute('type', 'checkbox');
	checkboxInput.setAttribute('name', `${checkboxName}`);
	checkboxInput.setAttribute('category-id', `${checkboxInputID}`);
	checkboxInput.setAttribute('checked', "");

	let checkboxLabel =document.createElement('label');
	checkboxLabel.innerHTML = `${checkboxName}`;

	checkboxDiv.appendChild(checkboxInput);
	checkboxDiv.appendChild(checkboxLabel);

	return checkboxDiv;

};

// CREATE MODAL CONTENT

function createOneManageDeptsDropDown(listOfNames, listOfIDs, currentLocName, currentLocID, deptID) { //fieldName, fieldID
		
	let outerNode = document.createElement('div');
	outerNode.setAttribute('class', 'field');
	
	let dropdown = document.createElement('div');
	dropdown.setAttribute('class', 'ui fluid selection dropdown');
	dropdown.setAttribute('id', `departmentID-${deptID}-loc-dropdown`);

	let selected = document.createElement('div');
	selected.setAttribute('class', 'default text');
	selected.innerHTML = currentLocName;
	
	let icon = document.createElement('i');
	icon.setAttribute('class', 'dropdown icon');

	let input = document.createElement('input');
	input.setAttribute('type', 'hidden');
	input.setAttribute('name', 'locID');
	input.setAttribute('value', currentLocID);

	
	let menu = document.createElement('div');
	menu.setAttribute('class', 'menu');

	let dropDownObj = {};
	let dropDownList = [];

	for (let ddo = 0; ddo < listOfNames.length; ddo ++){

		dropDownObj[listOfNames[ddo]] = listOfIDs[ddo];
		dropDownList.push(listOfNames[ddo]);

	}

	dropDownList.sort();

	for (let ddn = 0; ddn < dropDownList.length; ddn ++){
	
		let oneOption = document.createElement('div');
		oneOption.setAttribute('class', 'item');

		let outputValue = dropDownObj[dropDownList[ddn]];
		oneOption.innerHTML = dropDownList[ddn];
		oneOption.setAttribute('data-value', outputValue);
		menu.appendChild(oneOption);			

	}

	dropdown.appendChild(input);
	dropdown.appendChild(icon);
	dropdown.appendChild(selected);
	dropdown.appendChild(menu);		

	outerNode.appendChild(dropdown)
	
	return outerNode;

}

function buildForm(listOfNames, listOfIDs, editOrCreate, detailsForEditForm){	
  
	let listOfIdentifiers = [];
		
	let uiForm = document.createElement('div');
	uiForm.setAttribute('class', 'ui form');
	uiForm.setAttribute('id', 'employee-modal-form-fields')
	
	let twoFields = document.createElement('div');
	twoFields.setAttribute('class', 'two fields');
	
	let field = document.createElement('div');
	field.setAttribute('class', 'field');
	
	let requiredField = document.createElement('div');
	requiredField.setAttribute('class', 'required field');
	
	let label = document.createElement('label');
	label.innerHTML = 'MENU';

	let  selectionDropdown = document.createElement('div')
	selectionDropdown.setAttribute('class', 'ui fluid selection dropdown');
	
	let defaultText = document.createElement('div');
	defaultText.setAttribute('class', 'default text');
	defaultText.innerHTML = 'Default Text';
	
	let dropdownIcon = document.createElement('i');
	dropdownIcon.setAttribute('class', 'dropdown icon');
	
	let inputField = document.createElement('input');
	
	let menuDiv = document.createElement('div');
	menuDiv.setAttribute('class', 'menu');
	
	let dataValue = document.createElement('div');
	dataValue.setAttribute('class', 'item');
	
	function createInputField (mainTitle, data, fieldName) {
		
		let outerNode = requiredField.cloneNode(true);
		let heading = label.cloneNode(true);
		heading.innerHTML = mainTitle;
		
		let input = inputField.cloneNode(true);
		input.setAttribute('name', fieldName);
		listOfIdentifiers.push(fieldName);
		
		if (editOrCreate == 'edit') {
			input.setAttribute('value', data);
		} else if (editOrCreate == 'view') {
      console.log('view readonly');
      input.setAttribute('value', data);
      input.setAttribute('readonly', '');
    }
		
		input.setAttribute('fieldname', fieldName);
		input.setAttribute('type', 'text');
		input.setAttribute('placeholder', data);
		
		outerNode.appendChild(heading);
		outerNode.appendChild(input);
		
		return outerNode;

	}
	
	function createDropDown(mainTitle, placeholder, listOfNames, listOfIDs, fieldName, fieldID, dropdownType){
		
		let outerNode = requiredField.cloneNode(true);

		if (editOrCreate == 'create') {

			if (mainTitle.includes('epartment')) {

				outerNode.setAttribute('class', 'disabled field');
				outerNode.setAttribute('id', 'departments-field')

			}
		} else if (editOrCreate == 'view') {
      if (mainTitle.includes('epartment')) {
				outerNode.setAttribute('class', 'disabled field');
				outerNode.setAttribute('id', 'departments-field')
			} else if (mainTitle.includes('ocation')) {
				outerNode.setAttribute('class', 'disabled field');
			}     
    }

		let heading = label.cloneNode(true);
		heading.innerHTML = mainTitle;
		
		let dropdown = selectionDropdown.cloneNode(true);
		dropdown.setAttribute('id', dropdownType);

		let selected = defaultText.cloneNode(true);
		if (mainTitle.includes('epartment')) {
			selected.setAttribute('id', 'department-dropdown-placeholder-text');
		}
		
		let icon = dropdownIcon.cloneNode(true);
		let input = inputField.cloneNode(true);

		if (editOrCreate == 'edit') {
				if (mainTitle.includes('epartment')) {	
					input.setAttribute('value', detailsForEditForm.departmentID);
				} else if (mainTitle.includes('ocation')) {	
					input.setAttribute('value', detailsForEditForm.locationID);
				}
			}
		
		let menu = menuDiv.cloneNode(true);
		menu.setAttribute('id', dropdownType + '-menu');

		let dropDownObj = {};
		let dropDownList = [];

		for (let ddo = 0; ddo < listOfNames.length; ddo ++){

			dropDownObj[listOfNames[ddo]] = listOfIDs[ddo];
			dropDownList.push(listOfNames[ddo]);

		}

		dropDownList.sort();

		for (let ddn = 0; ddn < dropDownList.length; ddn ++){
		
			let oneOption = dataValue.cloneNode(true);
			let outputValue = dropDownObj[dropDownList[ddn]];
			oneOption.innerHTML = dropDownList[ddn];
			oneOption.setAttribute('data-value', outputValue);
			menu.appendChild(oneOption);			

		}
		/*
		for (let loc = 0; loc < listOfNames.length; loc ++){
			
			let oneOption = dataValue.cloneNode(true);
			let outputValue = listOfIDs[loc];
			oneOption.innerHTML = listOfNames[loc];
			oneOption.setAttribute('data-value', outputValue);
			menu.appendChild(oneOption);
			
		}
		*/
		
		if(editOrCreate == 'create'){
			input.setAttribute('value', '');
		} else if (editOrCreate == 'view') {
      input.setAttribute('value', '');
    }

		input.setAttribute('fieldname', fieldID);
		input.setAttribute('fieldID', fieldID);
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', fieldName);
		listOfIdentifiers.push(fieldName);

		if (editOrCreate == 'create'){
			selected.innerHTML = placeholder;
		} else {
				if (mainTitle.includes('epartment')) {
					selected.innerHTML = detailsForEditForm.department;
				} else if (mainTitle.includes('ocation')) {
					selected.innerHTML = detailsForEditForm.locationName;
				}
		}
		
		dropdown.appendChild(selected);
		dropdown.appendChild(icon);
		dropdown.appendChild(input);
		dropdown.appendChild(menu);		

		outerNode.appendChild(heading);
		outerNode.appendChild(dropdown)
		
		return outerNode;
	}
	
	let twoCategories = twoFields.cloneNode(true);
		
	twoCategories.appendChild(createDropDown('Location', 'Select a location', listOfNames, listOfIDs, 'locationName', 'locationID', 'location-dropdown'));
	
	let depNames = [];
	let depIDs = [];
	twoCategories.appendChild(createDropDown('Department', 'Select a department', depNames, depIDs, 'department', 'departmentID', 'department-dropdown'));
		
	let nameCategories = twoFields.cloneNode(true);
	
	if (editOrCreate == 'create') {
		nameCategories.appendChild(createInputField('First Name', 'First Name', 'firstName'));
		nameCategories.appendChild(createInputField('Last Name', 'Last Name', 'lastName'));
	} else {
		nameCategories.appendChild(createInputField('First Name', detailsForEditForm.firstName, 'firstName'));
		nameCategories.appendChild(createInputField('Last Name', detailsForEditForm.lastName, 'lastName'));
	}
	
	let jobTitleField = field.cloneNode(true);
	let jobTitleHeading = label.cloneNode(true);
	jobTitleHeading.innerHTML = 'Job Title'
	
	let jobTitleInput = inputField.cloneNode(true);
	jobTitleInput.setAttribute('fieldname', 'jobTitle');
	jobTitleInput.setAttribute('type', 'text');
	
	if (editOrCreate == 'create') {
		jobTitleInput.setAttribute('placeholder', 'Job Title');
	} else {
		let jobTitlePlaceholder = detailsForEditForm.jobTitle == 0 ? 'Job Title' : detailsForEditForm.jobTitle;
		jobTitleInput.setAttribute('placeholder', jobTitlePlaceholder);
	}
	
	jobTitleField.appendChild(jobTitleHeading);
	jobTitleField.appendChild(jobTitleInput);
	
	let emailField = requiredField.cloneNode(true);
	let emailHeading = label.cloneNode(true);
	emailHeading.innerHTML = 'Email'
	
	let emailInput = inputField.cloneNode(true);
	emailInput.setAttribute('fieldname', 'email');
	emailInput.setAttribute('type', 'email');
	emailInput.setAttribute('name', 'email')
	listOfIdentifiers.push('email')

	if (editOrCreate == 'create') {
		emailInput.setAttribute('placeholder', 'employee@company.com');
	} else {
		emailInput.setAttribute('placeholder', detailsForEditForm.email);
		emailInput.setAttribute('value', detailsForEditForm.email);		
	}

	let emailError = document.createElement('div');
	emailError.setAttribute('class', 'ui error message')
	
	//let blankInputDiv = document.createElement('div');
	//blankInputDiv.setAttribute('class', 'ui input focus display-none-field');
	//let blankInput = selectionDropdown.cloneNode(true);
	//blankInputDiv.appendChild(blankInput);

	emailField.appendChild(emailHeading);
	emailField.appendChild(emailInput);
	emailField.appendChild(emailError);
		
	uiForm.appendChild(twoCategories);
	uiForm.appendChild(nameCategories);
	uiForm.appendChild(jobTitleField);
	uiForm.appendChild(emailField);	
	//uiForm.appendChild(blankInputDiv);

	if (editOrCreate == 'edit'){
		let idField = field.cloneNode(true);
		
		let idInput = inputField.cloneNode(true);
		idInput.setAttribute('fieldname', 'id');
		idInput.setAttribute('value', detailsForEditForm.id);
		idInput.setAttribute('class', 'display-none-field');
	
		idField.appendChild(idInput);
		uiForm.appendChild(idField);
	}
	
	document.getElementById(`employee-modal-${editOrCreate}-fields`).appendChild(uiForm);

	if (editOrCreate == 'edit') {
		
		$.ajax({
		url: "libs/php/departmentsChange.php",
		type: "GET",
		//url: "libs/post-php/departmentsChange.php",
		//type: "POST",
		dataType: "json",
		data: {
			locationID: detailsForEditForm.locationID
		},
		success: function (result) {
			
				console.log('departments for edit ',result.data);

				let deptsDropDownObj = {};
				let deptsDropDownList = [];

				for (let dc = 0; dc < result.data.length; dc ++ ) {

					deptsDropDownList.push(result.data[dc].name);
					deptsDropDownObj[result.data[dc].name] = result.data[dc].id;

				}

				deptsDropDownList.sort();

				for (let ddl = 0; ddl < deptsDropDownList.length; ddl ++ ) {

					let oneOption = document.createElement('div');
					oneOption.setAttribute('class', 'item');

					let outputValue = deptsDropDownObj[deptsDropDownList[ddl]];
					oneOption.innerHTML = deptsDropDownList[ddl];
					oneOption.setAttribute('data-value', outputValue);
					
					document.getElementById('department-dropdown-menu').appendChild(oneOption);
					
				}

				/*
				for (let dc = 0; dc < result.data.length; dc ++ ) {

					let oneOption = document.createElement('div');
					oneOption.setAttribute('class', 'item');

					let outputValue = result.data[dc].id;
					oneOption.innerHTML = result.data[dc].name;
					oneOption.setAttribute('data-value', outputValue);
				
					document.getElementById('department-dropdown-menu').appendChild(oneOption);
								
				}
				*/		
				
		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
	}

	return listOfIdentifiers;

}

function createEmployeeModalContent(editOrCreate, detailsForEditForm){
	
	let listOfLocationsUpdated = [];	
	
	let listOfLocationIDs = [];
	
	
	$.ajax({
	//url: "libs/post-php/getAllLocations.php",
	//type: "POST",
	url: "libs/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
			
			for (let loc = 0; loc < result.data.length; loc ++){
				listOfLocationsUpdated.push(result.data[loc].name);
				listOfLocationIDs.push(result.data[loc].id);
			}
			
			let listOfIdentifiers = buildForm(listOfLocationsUpdated, listOfLocationIDs, editOrCreate, detailsForEditForm);
			
			let formValidateFields = {}
			
			for (let id = 0; id < listOfIdentifiers.length; id ++) {
				let obj = {};
				let rule = {};
				if (listOfIdentifiers[id] == 'email') {
					rule['type'] = 'email';
					rule['prompt'] = 'Please enter a valid email address';
				} else {
					rule['type'] = 'empty';
					rule['prompt'] = '';
				}

				obj['identifier'] = listOfIdentifiers[id];
				obj['rules'] = [rule]
				formValidateFields[listOfIdentifiers[id]] = obj

			}

			$(`#employee-modal-${editOrCreate}-fields`).form({
				fields: formValidateFields
			});

			let locationDropDown = document.getElementById('location-dropdown');
			
			locationDropDown.addEventListener('change', function(e){
				
						$.ajax({
						url: "libs/php/departmentsChange.php",
						type: "GET",
						//url: "libs/post-php/departmentsChange.php",
						//type: "POST",
						dataType: "json",
						data: {
							locationID: e.target.value
						},
						success: function (result) {

								document.getElementById('department-dropdown-menu').innerHTML = "";

								let deptsDropDownObj = {};
								let deptsDropDownList = [];

								for (let dc = 0; dc < result.data.length; dc ++ ) {

									deptsDropDownList.push(result.data[dc].name);
									deptsDropDownObj[result.data[dc].name] = result.data[dc].id;

								}

								deptsDropDownList.sort();

								for (let ddl = 0; ddl < deptsDropDownList.length; ddl ++ ) {

									let oneOption = document.createElement('div');
									oneOption.setAttribute('class', 'item');

									let outputValue = deptsDropDownObj[deptsDropDownList[ddl]];
									oneOption.innerHTML = deptsDropDownList[ddl];
									oneOption.setAttribute('data-value', outputValue);
									
									document.getElementById('department-dropdown-menu').appendChild(oneOption);
									
								}
	
								/*
								for (let dc = 0; dc < result.data.length; dc ++ ) {

									let oneOption = document.createElement('div');
									oneOption.setAttribute('class', 'item');

									let outputValue = result.data[dc].id;
									oneOption.innerHTML = result.data[dc].name;
									oneOption.setAttribute('data-value', outputValue);
									
									document.getElementById('department-dropdown-menu').appendChild(oneOption);
									
								}
								*/							
								
								document.getElementById('department-dropdown-placeholder-text').innerHTML = 'Select a department';

								if (editOrCreate == 'create') {
									document.getElementById('departments-field').setAttribute('class', 'required field');
								}
						},
						error: function (jqXHR, textStatus, errorThrown) {
								console.log('error');
								console.log(textStatus);
								console.log(errorThrown);
							},
						});
									
			}); 	

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
};

function createLocationPanelNEW(name){
	
	let locationPanel = document.createElement('div'); //LOCATION PANEL
		let panelCloser = document.createElement('i');
		panelCloser.setAttribute('class', 'close icon display-none-field');
		//panelCloser.setAttribute('id', `close-locationID-${id}-panel`);
		
		let locationHeader = document.createElement('div');
		locationHeader.setAttribute('class', 'ui one top attached segment location-header');
		
		let locationHeaderText = document.createElement('div');
		locationHeaderText.innerHTML = `${name}`; 
		locationHeaderText.setAttribute('class', 'location-header-text')
		
		locationHeader.appendChild(locationHeaderText);
		
		locationPanel.appendChild(panelCloser);
		locationPanel.appendChild(locationHeader);
	
	return locationPanel;

}

function createLocationPanel(name, id, deptsCount, totalEmployees){
	
	let locationPanel = document.createElement('div'); //LOCATION PANEL
		let panelCloser = document.createElement('i');
		panelCloser.setAttribute('class', 'close icon display-none-field');
		panelCloser.setAttribute('id', `close-locationID-${id}-panel`);
		
		let locationHeader = document.createElement('div');
		locationHeader.setAttribute('class', 'ui one top attached segment location-header');
		let deleteLocationIcon = document.createElement('span');
		deleteLocationIcon.setAttribute('locid', id);
		deleteLocationIcon.setAttribute('locname', locationsObj[id]);
		deleteLocationIcon.setAttribute('id', `delete-locationID-${id}-icon`);
		deleteLocationIcon.setAttribute('class', 'location-trash-icon pointer');
		
		let trashIcon = document.createElement('i');
		trashIcon.setAttribute('class', 'fas fa-trash-alt');
		
		deleteLocationIcon.appendChild(trashIcon);
		
		let locationHeaderText = document.createElement('div');
		locationHeaderText.innerHTML = `${name}`; 
		locationHeaderText.setAttribute('class', 'location-header-text')
		
		locationHeader.appendChild(locationHeaderText);
		
		if (deptsCount == 1 && totalEmployees == 0){
		
			locationHeader.appendChild(deleteLocationIcon);	
		
		}
		
		locationPanel.appendChild(panelCloser);
		locationPanel.appendChild(locationHeader);
	
	return locationPanel;

}


function createDepartmentSegment(id, name, location, locationID, latestLocations){

	let latestLocNames = [];
	let latestLocIDs = [];

	for (let [key, value] of Object.entries(latestLocations)){

		latestLocNames.push(value);
		latestLocIDs.push(key);

	}
	
	let dropDown = createOneManageDeptsDropDown(latestLocNames, latestLocIDs, latestLocations[locationID], locationID, id);
	
	let departmentSegment = document.createElement('div'); // Department Segment
	let departmentCloser = document.createElement('i');															departmentSegment.appendChild(departmentCloser);
	let departmentRow = document.createElement('div');															departmentSegment.appendChild(departmentRow);
		let departmentWarning = document.createElement('div');												departmentRow.appendChild(departmentWarning);
			let closeWarningIcon = document.createElement('i');													departmentWarning.appendChild(closeWarningIcon);
			let departmentWarningText = document.createElement('span');									departmentWarning.appendChild(departmentWarningText);
		let departmentDetails = document.createElement('div');												departmentRow.appendChild(departmentDetails);
			let departmentForm = document.createElement('form');												departmentDetails.appendChild(departmentForm);
				let departmentTitleRow = document.createElement('div');										departmentForm.appendChild(departmentTitleRow);
					let departmentTitle = document.createElement('span');										departmentTitleRow.appendChild(departmentTitle);
						let departmentTitleText = document.createElement('h4');								departmentTitle.appendChild(departmentTitleText);
					let departmentEmployees = document.createElement('div');								departmentTitleRow.appendChild(departmentEmployees);
						//let departmentEmployeeInfo = document.createElement('div');						departmentEmployees.appendChild(departmentEmployeeInfo);
							//let departmentEmployeeCount = document.createElement('span');				departmentEmployeeInfo.appendChild(departmentEmployeeCount);
							//let employeesIcon = document.createElement('i');										departmentEmployeeInfo.appendChild(employeesIcon);
						let departmentButtons = document.createElement('div');								departmentEmployees.appendChild(departmentButtons);
							let renameDepartmentBtn = document.createElement('span');						departmentButtons.appendChild(renameDepartmentBtn);
								let editIcon = document.createElement('i');												renameDepartmentBtn.appendChild(editIcon);
							let deleteDepartmentBtn = document.createElement('span');						departmentButtons.appendChild(deleteDepartmentBtn);
								let binIcon = document.createElement('i');												deleteDepartmentBtn.appendChild(binIcon);
				let renameDeptAccordion = document.createElement('div');									departmentForm.appendChild(renameDeptAccordion);
					let renameDeptAccordionTitle = document.createElement('div');						renameDeptAccordion.appendChild(renameDeptAccordionTitle);
						let renameDeptAccordionDropdown = document.createElement('i');				renameDeptAccordionTitle.appendChild(renameDeptAccordionDropdown);
						let renameDeptAccordionBtn = document.createElement('div');						renameDeptAccordionTitle.appendChild(renameDeptAccordionBtn);	
					let	renameDeptAccordionContent = document.createElement('div');					renameDeptAccordion.appendChild(renameDeptAccordionContent);
						let	renameDeptAccordionTransition = document.createElement('div'); 		renameDeptAccordionContent.appendChild(renameDeptAccordionTransition);
							let	renameDeptAccordionContainer = document.createElement('div');		renameDeptAccordionTransition.appendChild(renameDeptAccordionContainer);
								let renameDeptText = document.createElement('div');								renameDeptAccordionContainer.appendChild(renameDeptText);
								let	renameDeptAccordionField = document.createElement('div');			renameDeptAccordionContainer.appendChild(renameDeptAccordionField);
									let	renameDeptAccordionInput = document.createElement('input'); renameDeptAccordionField.appendChild(renameDeptAccordionInput);
							let moveDeptContainer = document.createElement('div');							renameDeptAccordionTransition.appendChild(moveDeptContainer);																												
								let moveDeptText = document.createElement('div');									moveDeptContainer.appendChild(moveDeptText);																																	
																																									moveDeptContainer.appendChild(dropDown);
							let renameDeptAccordionButtons = document.createElement('div');  		renameDeptAccordionTransition.appendChild(renameDeptAccordionButtons);
								let submitRenameDeptBtn = document.createElement('div');					renameDeptAccordionButtons.appendChild(submitRenameDeptBtn);
								let cancelRenameDeptBtn = document.createElement('button');				renameDeptAccordionButtons.appendChild(cancelRenameDeptBtn);
				let renameDeptErrorMsg = document.createElement('div');										departmentForm.appendChild(renameDeptErrorMsg);

	departmentSegment.setAttribute('class', 'ui floating message department-segment');
	departmentCloser.setAttribute('class', 'close icon display-none-field'); departmentCloser.setAttribute('id', `close-departmentID-${id}-icon`);
	departmentRow.setAttribute('class', 'ui row');
		departmentDetails.setAttribute('class', 'ui column manage-dept-info');
		departmentWarning.setAttribute('class', 'ui hidden warning message'); departmentWarning.setAttribute('id', `departmentID-${id}-warning`);
			closeWarningIcon.setAttribute('class', 'close icon'); closeWarningIcon.setAttribute('id', `departmentID-${id}-close-icon`);
			departmentWarningText.setAttribute('id', `departmentID-${id}-warning-text`);
			departmentForm.setAttribute('class', 'ui form rename-form'); departmentForm.setAttribute('id',`departmentID-${id}-form`); departmentForm.setAttribute('name',`departmentID-${id}-form`); departmentForm.setAttribute('autocomplete','off');
				departmentTitleRow.setAttribute('class', 'department-title-row');
					//departmentTitle.setAttribute();
						departmentTitleText.setAttribute('id', `departmentID-${id}-title`); departmentTitleText.innerHTML = `${name} | ${location}`;
					departmentEmployees.setAttribute('class', 'dept-employee-info-icons');						
						//departmentEmployeeInfo.setAttribute('class', 'employee-count-icon'); //hide with display-none-field display-none-field
							//departmentEmployeeCount.setAttribute('id', `departmentID-${id}-employee-count`); departmentEmployeeCount.innerHTML = `${emps}`; departmentEmployeeCount.setAttribute('class', 'employee-count-number default-cursor');
							//employeesIcon.setAttribute('class', 'fas fa-users');
						departmentButtons.setAttribute('class', 'dept-delete-edit-btns');
							renameDepartmentBtn.setAttribute('class', 'ui icon button');  renameDepartmentBtn.setAttribute('id', `rename-departmentID-${id}-btn`);
							editIcon.setAttribute('class', 'fas fa-edit pointer');
							deleteDepartmentBtn.setAttribute('class', 'ui icon button'); deleteDepartmentBtn.setAttribute('deptid', id); deleteDepartmentBtn.setAttribute('deptname', name); deleteDepartmentBtn.setAttribute('id', `delete-departmentID-${id}-btn`);
							binIcon.setAttribute('class', 'fas fa-trash-alt');
				renameDeptAccordion.setAttribute('class', 'ui accordion field new-dept-accordion');	renameDeptAccordion.setAttribute('id', `rename-dept-${id}-accordion`);
					renameDeptAccordionTitle.setAttribute('class', 'title display-none-field');
						renameDeptAccordionDropdown.setAttribute('class', 'icon dropdown');
						renameDeptAccordionBtn.setAttribute('class', 'ui tiny button'); renameDeptAccordionBtn.setAttribute('id', `departmentID-${id}-accordion`); renameDeptAccordionBtn.innerHTML = 'Rename department'; 
					renameDeptAccordionContent.setAttribute('class', 'content field');
						renameDeptAccordionTransition.setAttribute('class', 'content field transition hidden');
							renameDeptAccordionContainer.setAttribute('class', 'department-field-container');
								renameDeptText.innerHTML = 'Edit name:';
								renameDeptAccordionField.setAttribute('class', 'field dept-name-field'); 
									renameDeptAccordionInput.setAttribute('id', `rename-departmentID-${id}-input-field`); renameDeptAccordionInput.setAttribute('placeholder', departmentsObj[id].name); renameDeptAccordionInput.setAttribute('deptid', id); renameDeptAccordionInput.setAttribute('type', 'text'); renameDeptAccordionInput.setAttribute('value',departmentsObj[id].name); renameDeptAccordionInput.setAttribute('name','dept-rename');
								//renameDeptAccordionButtons.setAttribute('class', 'rename-accordion-buttons');
									//submitRenameDeptBtn.setAttribute('class', 'ui tiny button dept-action-button'); submitRenameDeptBtn.setAttribute('id', `submit-rename-departmentID-${id}-btn`); submitRenameDeptBtn.innerHTML = 'Submit';
									//cancelRenameDeptBtn.setAttribute('class', 'ui tiny button dept-action-button'); cancelRenameDeptBtn.setAttribute('form', `departmentID-${id}-form`); cancelRenameDeptBtn.setAttribute('id', `cancel-departmentID-${id}-btn`); cancelRenameDeptBtn.setAttribute('type', 'reset'); cancelRenameDeptBtn.innerHTML = 'Cancel';				
							moveDeptContainer.setAttribute('class', 'department-field-container');
								moveDeptText.innerHTML = 'Change location';	
							renameDeptAccordionButtons.setAttribute('class', 'rename-accordion-buttons');
								submitRenameDeptBtn.setAttribute('class', 'ui tiny disabled button dept-action-button'); submitRenameDeptBtn.setAttribute('id', `submit-rename-departmentID-${id}-btn`); submitRenameDeptBtn.innerHTML = 'Submit';
								cancelRenameDeptBtn.setAttribute('class', 'ui tiny button dept-action-button'); cancelRenameDeptBtn.setAttribute('form', `departmentID-${id}-form`); cancelRenameDeptBtn.setAttribute('id', `cancel-departmentID-${id}-btn`); cancelRenameDeptBtn.setAttribute('type', 'reset'); cancelRenameDeptBtn.innerHTML = 'Cancel';				
				renameDeptErrorMsg.setAttribute('class','ui error message');
		
	return departmentSegment
	
}

function createLocationSegment(id, name){

	//let dropDown = createOneManageLocsDropDown(['London','New York'], [1, 2]);
	
	let locationSegment = document.createElement('div'); // Location Segment
	let locationCloser = document.createElement('i');															  locationSegment.appendChild(locationCloser);
	let locationRow = document.createElement('div');															  locationSegment.appendChild(locationRow);
		let locationWarning = document.createElement('div');												  locationRow.appendChild(locationWarning);
			let closeWarningIcon = document.createElement('i');													locationWarning.appendChild(closeWarningIcon);
			let locationWarningText = document.createElement('span');									  locationWarning.appendChild(locationWarningText);
		let locationDetails = document.createElement('div');												  locationRow.appendChild(locationDetails);
			let locationForm = document.createElement('form');												  locationDetails.appendChild(locationForm);
				let locationTitleRow = document.createElement('div');										  locationForm.appendChild(locationTitleRow);
					let locationTitle = document.createElement('span');										  locationTitleRow.appendChild(locationTitle);
						let locationTitleText = document.createElement('h4');								  locationTitle.appendChild(locationTitleText);
					let locationEmployees = document.createElement('div');								  locationTitleRow.appendChild(locationEmployees);
						let locationEmployeeInfo = document.createElement('div');						  locationEmployees.appendChild(locationEmployeeInfo);
							let locationEmployeeCount = document.createElement('span');				  locationEmployeeInfo.appendChild(locationEmployeeCount);
							//let employeesIcon = document.createElement('i');									locationEmployeeInfo.appendChild(employeesIcon);
						let locationButtons = document.createElement('div');								  locationEmployees.appendChild(locationButtons);
							let renameLocationBtn = document.createElement('span');						  locationButtons.appendChild(renameLocationBtn);
								let editIcon = document.createElement('i');												renameLocationBtn.appendChild(editIcon);
							let deleteLocationBtn = document.createElement('span');					  	locationButtons.appendChild(deleteLocationBtn);
								let binIcon = document.createElement('i');												deleteLocationBtn.appendChild(binIcon);
				let renameLocAccordion = document.createElement('div');									  locationForm.appendChild(renameLocAccordion);
					let renameLocAccordionTitle = document.createElement('div');						renameLocAccordion.appendChild(renameLocAccordionTitle);
						let renameLocAccordionDropdown = document.createElement('i');				  renameLocAccordionTitle.appendChild(renameLocAccordionDropdown);
						let renameLocAccordionBtn = document.createElement('div');						renameLocAccordionTitle.appendChild(renameLocAccordionBtn);	
					let	renameLocAccordionContent = document.createElement('div');					renameLocAccordion.appendChild(renameLocAccordionContent);
						let	renameLocAccordionTransition = document.createElement('div'); 		renameLocAccordionContent.appendChild(renameLocAccordionTransition);
							let	renameLocAccordionContainer = document.createElement('div');		renameLocAccordionTransition.appendChild(renameLocAccordionContainer);
								let renameLocText = document.createElement('div');								renameLocAccordionContainer.appendChild(renameLocText);
								let	renameLocAccordionField = document.createElement('div');			renameLocAccordionContainer.appendChild(renameLocAccordionField);
									let	renameLocAccordionInput = document.createElement('input');  renameLocAccordionField.appendChild(renameLocAccordionInput);
								let renameLocAccordionButtons = document.createElement('div');  	renameLocAccordionContainer.appendChild(renameLocAccordionButtons);
									let submitRenameLocBtn = document.createElement('div');				  renameLocAccordionButtons.appendChild(submitRenameLocBtn);
									let cancelRenameLocBtn = document.createElement('button');			renameLocAccordionButtons.appendChild(cancelRenameLocBtn);
																																									//locationForm.appendChild(dropDown);
				let renameLocErrorMsg = document.createElement('div');										locationForm.appendChild(renameLocErrorMsg);

	locationSegment.setAttribute('class', 'ui floating message location-segment');
	locationCloser.setAttribute('class', 'close icon display-none-field'); locationCloser.setAttribute('id', `close-locationID-${id}-icon`);
	locationRow.setAttribute('class', 'ui row');
		locationDetails.setAttribute('class', 'ui column manage-loc-info');
		locationWarning.setAttribute('class', 'ui hidden warning message'); locationWarning.setAttribute('id', `locationID-${id}-warning`);
			closeWarningIcon.setAttribute('class', 'close icon'); closeWarningIcon.setAttribute('id', `locationID-${id}-close-icon`);
			locationWarningText.setAttribute('id', `locationID-${id}-warning-text`);
			locationForm.setAttribute('class', 'ui form rename-form'); locationForm.setAttribute('id',`locationID-${id}-form`); locationForm.setAttribute('name',`locationID-${id}-form`);
				locationTitleRow.setAttribute('class', 'location-title-row');
					locationTitle.setAttribute('id', `locationID-${id}-title`);
						locationTitleText.innerHTML = name;
					locationEmployees.setAttribute('class', 'loc-employee-info-icons');						
						locationEmployeeInfo.setAttribute('class', 'employee-count-icon'); //hide with display-none-field display-none-field
							locationEmployeeCount.setAttribute('id', `locationID-${id}-employee-count`); locationEmployeeCount.innerHTML = `X Departments`; locationEmployeeCount.setAttribute('class', 'employee-count-number default-cursor');
							//employeesIcon.setAttribute('class', 'fas fa-users');
						locationButtons.setAttribute('class', 'loc-delete-edit-btns');
							renameLocationBtn.setAttribute('class', 'ui icon button');  renameLocationBtn.setAttribute('id', `rename-locationID-${id}-btn`);
							editIcon.setAttribute('class', 'fas fa-edit pointer');
							//deleteLocationBtn.setAttribute('class', 'ui icon button'); deleteLocationBtn.setAttribute('locid', id); deleteLocationBtn.setAttribute('locname', name); deleteLocationBtn.setAttribute('id', `delete-locationID-${id}-btn`); deleteLocationBtn.setAttribute('employees', `${emps}`);// also add emps as property to button
							binIcon.setAttribute('class', 'fas fa-trash-alt');
				renameLocAccordion.setAttribute('class', 'ui accordion field new-loc-accordion');	renameLocAccordion.setAttribute('id', `rename-loc-${id}-accordion`);
					renameLocAccordionTitle.setAttribute('class', 'title display-none-field');
						renameLocAccordionDropdown.setAttribute('class', 'icon dropdown');
						renameLocAccordionBtn.setAttribute('class', 'ui tiny button'); renameLocAccordionBtn.setAttribute('id', `locationID-${id}-accordion`); renameLocAccordionBtn.innerHTML = 'Rename location'; 
					renameLocAccordionContent.setAttribute('class', 'content field');
						renameLocAccordionTransition.setAttribute('class', 'content field transition hidden');
							renameLocAccordionContainer.setAttribute('class', 'location-field-container'); 
								renameLocText.innerHTML = 'Edit name: '; 
								renameLocAccordionField.setAttribute('class', 'field loc-name-field'); renameLocAccordionField.setAttribute('autofocus', ''); renameLocAccordionField.setAttribute('id', `rename-locationID-${id}-form-field`); 
									renameLocAccordionInput.setAttribute('id', `rename-locationID-${id}-input-field`); renameLocAccordionInput.setAttribute('placeholder', 'Rename Location'); renameLocAccordionInput.setAttribute('locid', id); renameLocAccordionInput.setAttribute('type', 'text'); renameLocAccordionInput.setAttribute('value',locationsObj[id]); renameLocAccordionInput.setAttribute('name','loc-rename'); renameLocAccordionInput.setAttribute('autofocus','');
								renameLocAccordionButtons.setAttribute('class', 'rename-accordion-buttons');
									submitRenameLocBtn.setAttribute('class', 'ui tiny button loc-action-button'); submitRenameLocBtn.setAttribute('id', `submit-rename-locationID-${id}-btn`); submitRenameLocBtn.innerHTML = 'Submit';
									cancelRenameLocBtn.setAttribute('class', 'ui tiny button loc-action-button'); cancelRenameLocBtn.setAttribute('form', `locationID-${id}-form`); cancelRenameLocBtn.setAttribute('id', `cancel-locationID-${id}-btn`); cancelRenameLocBtn.setAttribute('type', 'reset'); cancelRenameLocBtn.innerHTML = 'Cancel';
				renameLocErrorMsg.setAttribute('class','ui error message');
		
	return locationSegment
	
}

function createNewLocationAccordion(id){
	
	let newLocAccordion = document.createElement('div');  // New Loc Accordion
	let newLocAccordionTitle = document.createElement('div');											newLocAccordion.appendChild(newLocAccordionTitle);
		let newLocAccordionDropDown = document.createElement('i');										newLocAccordionTitle.appendChild(newLocAccordionDropDown);
		let newLocAccordionBtn = document.createElement('div'); 											newLocAccordionTitle.appendChild(newLocAccordionBtn);
	let newLocAccordionContent = document.createElement('div');										newLocAccordion.appendChild(newLocAccordionContent);
		let newLocAccordionTransition = document.createElement('div');								newLocAccordionContent.appendChild(newLocAccordionTransition);
			let newLocForm = document.createElement('form');														newLocAccordionTransition.appendChild(newLocForm);
				let newLocAccordionContainer = document.createElement('div');						newLocForm.appendChild(newLocAccordionContainer);
					let newLocAccordionField = document.createElement('div');							newLocAccordionContainer.appendChild(newLocAccordionField);
						let newLocAccordionInput = document.createElement('input');					newLocAccordionField.appendChild(newLocAccordionInput);
					let createLocDiv = document.createElement('div');											newLocAccordionContainer.appendChild(createLocDiv);
						let createNewLocBtn = document.createElement('div');									createLocDiv.appendChild(createNewLocBtn);
					let cancelCreateLocDiv = document.createElement('div');								newLocAccordionContainer.appendChild(cancelCreateLocDiv);
						let cancelNewLocBtn = document.createElement('button');							cancelCreateLocDiv.appendChild(cancelNewLocBtn);
				let createLocErrorMsg = document.createElement('div');										newLocForm.appendChild(createLocErrorMsg);

	newLocAccordion.setAttribute('class', 'ui accordion field'); newLocAccordion.setAttribute('id', `location-${id}-new-loc-before`);
	newLocAccordionTitle.setAttribute('class', 'title');
		newLocAccordionDropDown.setAttribute('class', 'icon dropdown');	
		newLocAccordionBtn.setAttribute('class', 'ui tiny button'); newLocAccordionBtn.setAttribute('id', `locationID-${id}-new-loc-accordion-btn`); newLocAccordionBtn.innerHTML = 'Create new location';
	newLocAccordionContent.setAttribute('class', 'content field');
		newLocAccordionTransition.setAttribute('class', 'content field transition hidden');
			newLocForm.setAttribute('class', 'ui form');	newLocForm.setAttribute('id', `locationID-${id}-new-loc-form`);	newLocForm.setAttribute('name', `locationID-${id}-new-loc-form`);	
				newLocAccordionContainer.setAttribute('class', 'location-field-container');
					newLocAccordionField.setAttribute('class', 'eight wide field loc-name-field');
						// input maybe needs value = ""
						newLocAccordionInput.setAttribute('name', 'new-location');	newLocAccordionInput.setAttribute('placeholder', 'New location name'); newLocAccordionInput.setAttribute('type', 'text'); 			 
					createLocDiv.setAttribute('class', 'create-loc-btn');
						createNewLocBtn.setAttribute('class', 'ui mini button'); createNewLocBtn.setAttribute('locid', id); createNewLocBtn.setAttribute('id', `locationID-${id}-submit-new-loc-btn`); createNewLocBtn.innerHTML = 'Submit';
					cancelCreateLocDiv.setAttribute('class', 'create-loc-btn');
						cancelNewLocBtn.setAttribute('class', 'ui mini button'); cancelNewLocBtn.setAttribute('form', `locationID-${id}-new-loc-form`); cancelNewLocBtn.setAttribute('id', `locationID-${id}-cancel-new-loc-btn`); cancelNewLocBtn.setAttribute('type', 'reset'); cancelNewLocBtn.innerHTML = 'Cancel';
				createLocErrorMsg.setAttribute('class', 'ui error message');
	
	return newLocAccordion;
	
}



function createNewDeptAccordion(id){
	
	let newDeptAccordion = document.createElement('div');  // New Dept Accordion
	let newDeptAccordionTitle = document.createElement('div');											newDeptAccordion.appendChild(newDeptAccordionTitle);
		let newDeptAccordionDropDown = document.createElement('i');										newDeptAccordionTitle.appendChild(newDeptAccordionDropDown);
		let newDeptAccordionBtn = document.createElement('div'); 											newDeptAccordionTitle.appendChild(newDeptAccordionBtn);
	let newDeptAccordionContent = document.createElement('div');										newDeptAccordion.appendChild(newDeptAccordionContent);
		let newDeptAccordionTransition = document.createElement('div');								newDeptAccordionContent.appendChild(newDeptAccordionTransition);
			let newDeptForm = document.createElement('form');														newDeptAccordionTransition.appendChild(newDeptForm);
				let newDeptAccordionContainer = document.createElement('div');						newDeptForm.appendChild(newDeptAccordionContainer);
					let newDeptAccordionField = document.createElement('div');							newDeptAccordionContainer.appendChild(newDeptAccordionField);
						let newDeptAccordionInput = document.createElement('input');					newDeptAccordionField.appendChild(newDeptAccordionInput);
					let createDeptDiv = document.createElement('div');											newDeptAccordionContainer.appendChild(createDeptDiv);
						let createNewDeptBtn = document.createElement('div');									createDeptDiv.appendChild(createNewDeptBtn);
					let cancelCreateDeptDiv = document.createElement('div');								newDeptAccordionContainer.appendChild(cancelCreateDeptDiv);
						let cancelNewDeptBtn = document.createElement('button');							cancelCreateDeptDiv.appendChild(cancelNewDeptBtn);
				let createDeptErrorMsg = document.createElement('div');										newDeptForm.appendChild(createDeptErrorMsg);

	newDeptAccordion.setAttribute('class', 'ui accordion field'); newDeptAccordion.setAttribute('id', `location-${id}-new-dept-before`);
	newDeptAccordionTitle.setAttribute('class', 'title');
		newDeptAccordionDropDown.setAttribute('class', 'icon dropdown');	
		newDeptAccordionBtn.setAttribute('class', 'ui tiny button'); newDeptAccordionBtn.setAttribute('id', `locationID-${id}-new-dept-accordion-btn`); newDeptAccordionBtn.innerHTML = 'Create new department';
	newDeptAccordionContent.setAttribute('class', 'content field');
		newDeptAccordionTransition.setAttribute('class', 'content field transition hidden');
			newDeptForm.setAttribute('class', 'ui form');	newDeptForm.setAttribute('id', `locationID-${id}-new-dept-form`);	newDeptForm.setAttribute('name', `locationID-${id}-new-dept-form`);	
				newDeptAccordionContainer.setAttribute('class', 'department-field-container');
					newDeptAccordionField.setAttribute('class', 'eight wide field dept-name-field');
						// input maybe needs value = ""
						newDeptAccordionInput.setAttribute('name', 'new-department');	newDeptAccordionInput.setAttribute('placeholder', 'New department name'); newDeptAccordionInput.setAttribute('type', 'text'); 			 
					createDeptDiv.setAttribute('class', 'create-dept-btn');
						createNewDeptBtn.setAttribute('class', 'ui mini button'); createNewDeptBtn.setAttribute('locid', id); createNewDeptBtn.setAttribute('id', `locationID-${id}-submit-new-dept-btn`); createNewDeptBtn.innerHTML = 'Submit';
					cancelCreateDeptDiv.setAttribute('class', 'create-dept-btn');
						cancelNewDeptBtn.setAttribute('class', 'ui mini button'); cancelNewDeptBtn.setAttribute('form', `locationID-${id}-new-dept-form`); cancelNewDeptBtn.setAttribute('id', `locationID-${id}-cancel-new-dept-btn`); cancelNewDeptBtn.setAttribute('type', 'reset'); cancelNewDeptBtn.innerHTML = 'Cancel';
				createDeptErrorMsg.setAttribute('class', 'ui error message');
	
	return newDeptAccordion;
	
}


function manageDepartmentsAndLocationsModalNEW(category, show){

	document.getElementById('append-location-panels').innerHTML = '';
	document.getElementById('append-department-panels').innerHTML = '';

	if (category == 'locations'){

		let locationContent = document.createElement('div');

		locationContent.setAttribute('class', 'ui segment');
		locationContent.setAttribute('id', 'location-entries');
		
		for (let [key, value] of Object.entries(locationsObj)) {	
				
			locationContent.appendChild(createLocationSegment(key, value));

		}
		
		document.getElementById('append-location-panels').appendChild(locationContent);

		if (show == true) {

			document.getElementById('create-new-location-btn').setAttribute('style', 'display: inline');
			showModal('Locations');
			eventListenersInsideLocsModal();
		
		}

	} else if (category == 'departments') {

		$.ajax({
			//url: "libs/post-php/getAllDepartments.php",
			//type: "POST",
			url: "libs/php/getAllLocations.php",
			type: "GET",
			dataType: "json",
			data: {},
			success: function (result) {

				let latestLocations = {};
				latestLocNames = [];
				latestLocIDs = [];
				
				for (let [llkey, llvalue] of Object.entries(result.data)){

					latestLocations[llvalue['id']] = llvalue['name'];
					latestLocIDs.push(llvalue['id']);
					latestLocNames.push(llvalue['name']);
					
				}
				
				let newDeptDropdown = createOneManageDeptsDropDown(latestLocNames, latestLocIDs, 'Select a Location', "", 0);

				$('#append-new-dept-dropdown').append(newDeptDropdown);
			
				departmentRules = basicRules.slice();
				
				$(`#new-department-form`).form({
				fields: {
					name: {
						identifier: 'new-department',
						rules: departmentRules
					},
					location: {
						identifier: 'locID',
						rules: [{
							type: 'empty',
							prompt: 'Please choose a location.'			
						}]
					}
				}

				});

				$.ajax({
					//url: "libs/post-php/getAllDepartments.php",
					//type: "POST",
					url: "libs/php/getAllDepartments.php",
					type: "GET",
					dataType: "json",
					data: {},
					success: function (result) {

						let departmentsContent = document.createElement('div');

						departmentsContent.setAttribute('class', 'ui segment');
						departmentsContent.setAttribute('id', 'department-entries');
						
						for (let [key, value] of Object.entries(result.data)) {
							
							let cacheDept = {};
							cacheDept['departmentName'] = value['name'];
							cacheDept['departmentID'] = value['id'];
							cacheDept['locationID'] = value['locationID'];
							deptCacheObj[value['id']] = cacheDept;
							departmentsContent.appendChild(createDepartmentSegment(value['id'], value['name'], latestLocations[value['locationID']], value['locationID'], latestLocations));
										
						} 
						
						document.getElementById('append-department-panels').appendChild(departmentsContent);
			
			
						if (show == true){
						
							document.getElementById('create-new-department-btn').setAttribute('style', 'display: inline');
							showModal('Departments');
							eventListenersInsideDeptsModal();
					
						}

					},
					error: function (jqXHR, textStatus, errorThrown) {
							console.log('error', jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
						},
					});

			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error', jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
		
	}
	
	/*
	for (let loc = 0; loc < listOfLocations.length; loc ++) {
		
		let locationName = listOfLocations[loc];
		
		let locationID;;
		
		for (let [key, value] of Object.entries(locationsObj)) {
			
			if (value == locationName) {
				locationID = key;
			}

		}
		
		if (!locsAndDeptsObj[locationID]['loaded']) {
		
		let numberOfDepts = 0; 
		let totalNumberOfEmployees = 0;

		//for (let [count_k, count_val] of Object.entries(locsAndDeptsObj[locationID]['departments'])){	
		for (let [count_k, count_val] of Object.entries(departmentsObj)){	
			
			if(count_val['locationID'] == locationID) {
				numberOfDepts ++;
				totalNumberOfEmployees += count_val['employees'];
			}
	
		}

		let locationPanel = createLocationPanel(locationName, locationID, numberOfDepts, totalNumberOfEmployees );
		let locationContent = document.createElement('div');
		locationContent.setAttribute('class', 'ui attached segment');
		locationContent.setAttribute('id', `location-${locationID}-append-dept`);
		
		let deptAppendObj = {};
		let deptSegmentNameList = []
		
		for (let [k, val] of Object.entries(locsAndDeptsObj[locationID]['departments'])){	
				
				let employeeCount = departmentsObj[k]['employees'];

				if (!val.loaded) {
	
					let deptName = val.depname;	
					
					deptSegmentNameList.push(deptName);
					deptAppendObj[deptName] = createDepartmentSegment(k, deptName, employeeCount);
					
					//locationContent.appendChild(createDepartmentSegment(k, deptName, employeeCount));
					
					} // !val.loaded
					
		} // end of DeptsLoops

		deptSegmentNameList.sort();

		for (let ds = 0; ds < deptSegmentNameList.length; ds ++) {

			locationContent.appendChild(deptAppendObj[deptSegmentNameList[ds]]);	

		}
	
		locationContent.appendChild(createNewDeptAccordion(locationID));
		
		locationPanel.appendChild(locationContent);
		
		document.getElementById('append-location-panels').appendChild(locationPanel);
			
		} // ! location ID .loaded
		
	} // end of locations loop

	*/

		
	
}


function manageDepartmentsAndLocationsModal(locsAndDeptsObj){
	
	listOfLocations.sort();		

	if (manageDeptsAndLocsOpened != 0) {
	
		let el = document.getElementById('append-location-panels');
		let elClone = el.cloneNode(true);
		
		el.parentNode.replaceChild(elClone, el);
		
		document.getElementById('append-location-panels').innerHTML = '';
	
	}
	
	
	for (let loc = 0; loc < listOfLocations.length; loc ++) {
		
		let locationName = listOfLocations[loc];
		
		let locationID;;
		
		for (let [key, value] of Object.entries(locationsObj)) {
			
			if (value == locationName) {
				locationID = key;
			}

		}
		
		if (!locsAndDeptsObj[locationID]['loaded']) {
		
		let numberOfDepts = 0; 
		let totalNumberOfEmployees = 0;

		//for (let [count_k, count_val] of Object.entries(locsAndDeptsObj[locationID]['departments'])){	
		for (let [count_k, count_val] of Object.entries(departmentsObj)){	
			
			if(count_val['locationID'] == locationID) {
				numberOfDepts ++;
				totalNumberOfEmployees += count_val['employees'];
			}
	
		}

		let locationPanel = createLocationPanel(locationName, locationID, numberOfDepts, totalNumberOfEmployees );
		let locationContent = document.createElement('div');
		locationContent.setAttribute('class', 'ui attached segment');
		locationContent.setAttribute('id', `location-${locationID}-append-dept`);
		
		let deptAppendObj = {};
		let deptSegmentNameList = []
		
		for (let [k, val] of Object.entries(locsAndDeptsObj[locationID]['departments'])){	
				
				let employeeCount = departmentsObj[k]['employees'];

				if (!val.loaded) {
	
					let deptName = val.depname;	
					
					deptSegmentNameList.push(deptName);
					deptAppendObj[deptName] = createDepartmentSegment(k, deptName, employeeCount);
					
					//locationContent.appendChild(createDepartmentSegment(k, deptName, employeeCount));
					
					} // !val.loaded
					
		} // end of DeptsLoops

		deptSegmentNameList.sort();

		for (let ds = 0; ds < deptSegmentNameList.length; ds ++) {

			locationContent.appendChild(deptAppendObj[deptSegmentNameList[ds]]);	

		}
	
		locationContent.appendChild(createNewDeptAccordion(locationID));
		
		locationPanel.appendChild(locationContent);
		
		document.getElementById('append-location-panels').appendChild(locationPanel);
			
		} // ! location ID .loaded
		
	} // end of locations loop

	eventListenersInsideDeptsandLocsModal();	
	
}

// ** SET FUNCTIONALITY **

// CHECKBOXES
function departmentCheckboxFunctionality() {
	
		function setSelectAllCheckBox(){
			if (countOfCheckedDepts < countOfDepts) {

				if (countOfCheckedDepts == 0) {
				 $('#select-none-departments').checkbox('set checked');
				 
				} else {
				 $('#select-none-departments').checkbox('set unchecked');				 					
				}

				$('#select-all-departments').checkbox('set unchecked');
				
			} else if (countOfCheckedDepts == countOfDepts) {
				$('#select-all-departments').checkbox('set checked');
				$('#select-none-departments').checkbox('set unchecked');

			}
		}

		$('.department-checkbox').checkbox({
			onChecked: function(){
				activeDepartmentsObj[this.name] = this.checked;
				countOfCheckedDepts ++;

				if (!selectAllDeptsUsed) {

					if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0) {
						howManyDeptsSelected = 'Some';
					}

				}

				setSelectAllCheckBox();
				if (howManyDeptsSelected == 'All') {
					if (countOfCheckedDepts == countOfDepts) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					selectAllDeptsUsed = false;
					selectNoneDeptsUsed = false;
					runSearch(orderBy,lastSearch);
				}
				
			},
			onUnchecked: function(){
				activeDepartmentsObj[this.name] = this.checked;
				countOfCheckedDepts --;

				if(!selectNoneDeptsUsed) {

					if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0) {

						howManyDeptsSelected = 'Some';

					}

				}
				
				setSelectAllCheckBox();
				if (howManyDeptsSelected == 'None') {
					if (countOfCheckedDepts == 0) {
						runSearch(orderBy, lastSearch);					
					}
				} else {
					selectNoneDeptsUsed = false;
					selectAllDeptsUsed = false;
					runSearch(orderBy,lastSearch);
				}

			},				
		});


		$('#select-all-departments').checkbox({
			onChecked: function(){
			    howManyDeptsSelected = 'All';
			    selectAllDeptsUsed = true; 
			    $('.department-checkbox').checkbox('check');
			},
		});

		$('#select-none-departments').checkbox({
			onChecked: function(){
			    howManyDeptsSelected = 'None';
			    selectNoneDeptsUsed = true;
			    $('.department-checkbox').checkbox('uncheck');
			},
		});

};

function disableDeptCheckboxes() {

	let deptCheckboxes = document.getElementById('department-checkboxes').children;
	
	for (let ckbx = 0; ckbx < deptCheckboxes.length; ckbx++) {
		deptCheckboxes[ckbx].children[0].setAttribute('disabled', '');
		deptCheckboxes[ckbx].removeAttribute('checked');
		deptCheckboxes[ckbx].children[0].removeAttribute('checked');
	}

	let activeDeptNames = [];
	
	for (let [key, value] of Object.entries(activeLocationsObj)){
		if (value == true) {
					
			for (let [keya, valuea] of Object.entries(locsAndDeptsObj[key]['departments'])){
				activeDeptNames.push(valuea['depname'])
			}
	
		}
	
	}

	for (let ckbx = 0; ckbx < deptCheckboxes.length; ckbx++) {
		if (activeDeptNames.includes(deptCheckboxes[ckbx].children[0].getAttribute('name'))) {
			deptCheckboxes[ckbx].children[0].removeAttribute('disabled');
			deptCheckboxes[ckbx].setAttribute('checked', '');
			deptCheckboxes[ckbx].children[0].setAttribute('checked', '');

			activeDepartmentsObj[deptCheckboxes[ckbx].children[0].getAttribute('name')] = true;
		} else {

			activeDepartmentsObj[deptCheckboxes[ckbx].children[0].getAttribute('name')] = false;

		}



	}
	
	}

function locationCheckboxFunctionality() {
	
		function setSelectAllCheckBox(){
			if (countOfCheckedLocations < countOfLocations) {
				if (countOfCheckedLocations == 0) {
				 $('#select-none-locations').checkbox('set checked');
				} else {
				 $('#select-none-locations').checkbox('set unchecked');					
				}

				$('#select-all-locations').checkbox('set unchecked');

			} else if (countOfCheckedLocations == countOfLocations) {
				$('#select-all-locations').checkbox('set checked');
				$('#select-none-locations').checkbox('set unchecked');
			}
		}

		$('.location-checkbox').checkbox({
			onChecked: function(){

				activeLocationsObj[this.getAttribute('category-id')] = this.checked;
				countOfCheckedLocations ++;

				if (!selectAllLocationsUsed) {

					if (countOfCheckedLocations < countOfLocations && countOfCheckedLocations > 0) {
						howManyLocationsSelected = 'Some';
					}

				}

				setSelectAllCheckBox();

				if (howManyLocationsSelected == 'All') {
					if (countOfCheckedLocations == countOfLocations) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					selectAllLocationsUsed = false;
					selectNoneLocationsUsed = false;   
					runSearch(orderBy,lastSearch);
					disableDeptCheckboxes();
				}
				
			},
			onUnchecked: function(){
				
				activeLocationsObj[this.getAttribute('category-id')] = this.checked;
				countOfCheckedLocations --;

				if (!selectNoneLocationsUsed) {

					if (countOfCheckedLocations < countOfLocations && countOfCheckedLocations > 0) {
						howManyLocationsSelected = 'Some';
					}

				}

				setSelectAllCheckBox();
				if (howManyLocationsSelected == 'None') {
					if (countOfCheckedLocations == 0) {
						runSearch(orderBy, lastSearch);
						disableDeptCheckboxes();						
					}
				} else {
					selectAllLocationsUsed = false;
					selectNoneLocationsUsed = false; 
					runSearch(orderBy,lastSearch);
					disableDeptCheckboxes();
				}

			},				
		});	
		
		$('#select-all-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'All';
				selectAllLocationsUsed = true;
			  $('.location-checkbox').checkbox('check');
			},
		});

		$('#select-none-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'None';
				selectNoneLocationsUsed = true;
				//$('#select-none-departments').checkbox('check');
			  $('.location-checkbox').checkbox('uncheck');
			},
		});
		

};

function departmentCheckboxFunctionalityMobileIncludesRunSearch() {
	
	function setSelectAllCheckBox(){
		if (countOfCheckedDepts < countOfDepts) {

			if (countOfCheckedDepts == 0) {
			 $('#select-none-departments-mobile').checkbox('set checked');
			
			} else {
			 $('#select-none-departments-mobile').checkbox('set unchecked');
								
			}

			$('#select-all-departments-mobile').checkbox('set unchecked');
			

		} else if (countOfCheckedDepts == countOfDepts) {
			$('#select-all-departments-mobile').checkbox('set checked');
			$('#select-none-departments-mobile').checkbox('set unchecked');

		}
	}

	$('.department-mobile-checkbox').checkbox({
		onChecked: function(){
			activeDepartmentsObj[this.name] = this.checked;
			countOfCheckedDepts ++;

			if (!selectAllDeptsUsed) {
			
				if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0){
					howManyDeptsSelected = 'Some';
				}

			}
			
			setSelectAllCheckBox();
			if (howManyDeptsSelected == 'All') {
				if (countOfCheckedDepts == countOfDepts) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectAllDeptsUsed = false;
				selectNoneDeptsUsed = false;
				runSearch(orderBy,lastSearch);
			}
			
		},
		onUnchecked: function(){
			activeDepartmentsObj[this.name] = this.checked;
			countOfCheckedDepts --;

			if(!selectNoneDeptsUsed) {

				if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0) {

					howManyDeptsSelected = 'Some';

				}

			}
		
			setSelectAllCheckBox();
			if (howManyDeptsSelected == 'None') {
				if (countOfCheckedDepts == 0) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectNoneDeptsUsed = false;
				selectAllDeptsUsed = false;
				runSearch(orderBy,lastSearch);
			}

		},				
	});

	$('#select-all-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'All';
			selectAllDeptsUsed = true; 
			$('.department-mobile-checkbox').checkbox('check');
		},
	});
	
	$('#select-none-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'None';
			selectNoneDeptsUsed = true;
			$('.department-mobile-checkbox').checkbox('uncheck');
		},
	});

	if (firstload > 0) {
	
		runSearch(orderBy, lastSearch);
		
	}

};

function departmentCheckboxFunctionalityMobile() {
	
	function setSelectAllCheckBox(){
		if (countOfCheckedDepts < countOfDepts) {

			if (countOfCheckedDepts == 0) {
			 $('#select-none-departments-mobile').checkbox('set checked');
			
			} else {
			 $('#select-none-departments-mobile').checkbox('set unchecked');
								
			}

			$('#select-all-departments-mobile').checkbox('set unchecked');
			

		} else if (countOfCheckedDepts == countOfDepts) {
			$('#select-all-departments-mobile').checkbox('set checked');
			$('#select-none-departments-mobile').checkbox('set unchecked');

		}
	}

	$('.department-mobile-checkbox').checkbox({
		onChecked: function(){
			activeDepartmentsObj[this.name] = this.checked;
			countOfCheckedDepts ++;

			if (!selectAllDeptsUsed) {
			
				if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0){
					howManyDeptsSelected = 'Some';
				}

			}
			
			setSelectAllCheckBox();
			if (howManyDeptsSelected == 'All') {
				if (countOfCheckedDepts == countOfDepts) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectAllDeptsUsed = false;
				selectNoneDeptsUsed = false;
				runSearch(orderBy,lastSearch);
			}
			
		},
		onUnchecked: function(){
			activeDepartmentsObj[this.name] = this.checked;
			countOfCheckedDepts --;

			if(!selectNoneDeptsUsed) {

				if (countOfCheckedDepts < countOfDepts && countOfCheckedDepts > 0) {

					howManyDeptsSelected = 'Some';

				}

			}
		
			setSelectAllCheckBox();
			if (howManyDeptsSelected == 'None') {
				if (countOfCheckedDepts == 0) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectNoneDeptsUsed = false;
				selectAllDeptsUsed = false;
				runSearch(orderBy,lastSearch);
			}

		},				
	});

	$('#select-all-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'All';
			selectAllDeptsUsed = true; 
			$('.department-mobile-checkbox').checkbox('check');
		},
	});
	
	$('#select-none-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'None';
			selectNoneDeptsUsed = true;
			$('.department-mobile-checkbox').checkbox('uncheck');
		},
	});

};

function locationCheckboxFunctionalityMobile() {

	function setSelectAllCheckBox(){
		if (countOfCheckedLocations < countOfLocations) {
			if (countOfCheckedLocations == 0) {
			 $('#select-none-locations-mobile').checkbox('set checked');
			} else {
			 $('#select-none-locations-mobile').checkbox('set unchecked');					
			}

			$('#select-all-locations-mobile').checkbox('set unchecked');

		} else if (countOfCheckedLocations == countOfLocations) {
			$('#select-all-locations-mobile').checkbox('set checked');
			$('#select-none-locations-mobile').checkbox('set unchecked');
		}
	}

	$('.location-mobile-checkbox').checkbox({
		onChecked: function(){
			
			activeLocationsObj[this.getAttribute('category-id')] = this.checked;
			
			countOfCheckedLocations ++;
			
			if (!selectAllLocationsUsed) {

				if ((countOfCheckedLocations < countOfLocations) && (countOfCheckedLocations > 0)){
					howManyLocationsSelected = 'Some';
				}
			 
			}

			setSelectAllCheckBox();

			if (howManyLocationsSelected == 'All') {
				if (countOfCheckedLocations == countOfLocations) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectAllLocationsUsed = false;
				selectNoneLocationsUsed = false;
				runSearch(orderBy,lastSearch);
			}
			
		},
		onUnchecked: function(){

			activeLocationsObj[this.getAttribute('category-id')] = this.checked;
			
			//activeLocationsObj[this.name] = this.checked;
			countOfCheckedLocations --;

			if (!selectNoneLocationsUsed) {

				if (countOfCheckedLocations < countOfLocations && countOfCheckedLocations > 0) {
					howManyLocationsSelected = 'Some';
				}

			}
			
			setSelectAllCheckBox();
			if (howManyLocationsSelected == 'None') {
				if (countOfCheckedLocations == 0) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				selectAllLocationsUsed = false;
				selectNoneLocationsUsed = false;
				runSearch(orderBy,lastSearch);
			}

		},				
	});
	
	$('#select-all-locations-mobile').checkbox({
		onChecked: function(){
			howManyLocationsSelected = 'All';
			selectAllLocationsUsed = true;
			$('.location-mobile-checkbox').checkbox('check');
		},
	});

	$('#select-none-locations-mobile').checkbox({
		onChecked: function(){
			howManyLocationsSelected = 'None';
			selectNoneLocationsUsed = true;
			$('.location-mobile-checkbox').checkbox('uncheck');
		},
	});


	

};


// EMPLOYEE ROW
function selectEmployeeFunctionality(){
	if ($('#mobile-search-options').css('display') == 'none') {
		$('tr:not(#first-employee-row)').mouseover(function(){
			$(this).attr('style','background: gray; cursor: pointer');
		});

		$('tr:not(#first-employee-row)').mouseout(function(){
			$(this).attr('style','background: white; cursor: auto');
		});

		$('td:not(#employee-details-field)').click(function(event){

			let employeeDetails = this.firstChild.children[0].getAttribute('employee-properties');
			employeePropertiesObj = JSON.parse(employeeDetails);

			employeePropertiesObj['jobTitle'] = employeePropertiesObj['jobTitle'] == 0 ? 'Job Title TBC' : employeePropertiesObj['jobTitle'];

			renderEmployee(employeePropertiesObj);

			if (employeeDetailsVisibility == 0) {

				$('.employee-detail-fields').attr('style', 'visibility: visible');
				$('#employee-panel-message').attr('class', 'ui floating message');
				
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
				employeeDetailsVisibility ++;
			} else {

				$('#employee-panel-message').attr('class', 'ui floating message');
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
			}
			 
		});
	}
	
}

// MOBILE VIEW DETAILS BUTTON
function viewDetailsBtnFunctionality(){
	
	$('.employee-modal-btn').click(function(event){	

		let employeeProperties = JSON.parse(this.getAttribute('employee-details'));
		
		employeePropertiesStored = employeeProperties;
				
		for (const [key, value] of Object.entries(employeeProperties)) {

			employeePropertiesObj[key] = value;
			
		}

		employeePropertiesObj['jobTitle'] = employeePropertiesObj['jobTitle'] == 0 ? 'Job Title TBC' : employeePropertiesObj['jobTitle'];

		let employeeDetails = employeePropertiesObj;
		
		dropDownClicked = 0;
			
		createEmployeeModalContent(editOrCreate = 'edit', employeeDetails);	

		document.getElementById('submit-edit-employee').setAttribute('employee-details', this.getAttribute('employee-details'));

		renderEmployee(employeePropertiesObj);
		$('.employee-detail-fields').attr('style', 'visibility: visible');
		document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
		document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
		document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)

		let employeeModalPanel = document.getElementById('employee-segment').cloneNode(true)

		console.log(employeeModalPanel.children[0].children[0]);
		
		employeeModalPanel.children[0].children[0].setAttribute('id', 'close-mobile-employee-panel');
		employeeModalPanel.children[0].children[0].setAttribute('style', 'display: none !important');

		employeeModalPanel.children[0].children[1].children[1].setAttribute('id', "delete-employee-mobile-modal-button");
		employeeModalPanel.children[0].children[1].children[1].setAttribute('style', "display: inline !important");
		employeeModalPanel.children[0].children[1].children[2].setAttribute('id', "edit-employee-mobile-modal-button");
		employeeModalPanel.children[0].children[1].children[2].setAttribute('style', "display: inline !important; float: right");
		employeeModalPanel.children[0].setAttribute('class', 'ui message');
		
		console.log(employeeModalPanel.children[0].children[1].children[2]);

		let headingNode = document.createElement('h3');
		headingNode.innerHTML = 'Update details'

		document.getElementById('employee-modal-edit-fields').appendChild(employeeModalPanel);

		let topDiv = document.createElement('div')
		topDiv.appendChild(employeeModalPanel);
		
		document.getElementById('employee-modal-edit-fields').appendChild(topDiv);

		document.getElementById('employee-modal-edit-fields').setAttribute('style','display: inherit');
		
		let waitForModal = setTimeout(function(){
			document.getElementById('employee-modal-form-fields').setAttribute('style', 'display: none');		
			clearTimeout(waitForModal);			
		},450);

		$('#edit-employee-mobile-modal-button').click(function(e){
			e.preventDefault()

			document.getElementById('submit-edit-employee').setAttribute('style', 'display: inline');
			document.getElementById('close-only-btn').setAttribute('style', 'display: inline');

			document.getElementById('close-mobile-employee-panel').click();
			
			let closeModalMsgTimer = setTimeout(function(){
				document.getElementById('employee-modal-form-fields').setAttribute('style', 'display: inherit');
				clearTimeout(closeModalMsgTimer);
			}, 200);

		});

		$('#delete-employee-mobile-modal-button').click(function(e){
			e.preventDefault()
			console.log('click');
			console.log('employee Properties Stored',employeePropertiesStored);
					
			document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: inline !important');
			document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', JSON.stringify(employeePropertiesStored));

			$('#alert-modal').modal(
				{
					title: '<i class="archive icon"></i>',
					content: `<div class="alert-modal-text">Delete this employee? <br> <h3> ${employeePropertiesStored.firstName} ${employeePropertiesStored.lastName} </h3></div>`
				}).modal('show');

		});

		$('#mobile-modal-update-employee-btn').click(function(e){
			
			console.log('update');
			document.getElementById('submit-edit-employee').setAttribute('style', 'display: inline');
			document.getElementById('employee-modal-form-fields').setAttribute('style', 'display: inherit');

		});

		
		$('.message .close')
		.on('click', function() {
			$(this)
				.closest('.message')
				.transition('fade')
			;
		});
		
		document.getElementById('close-only-btn').setAttribute('style', 'display: inline');
		
		showModal('employee details');
		
		/*
		$('.ui.modal.employee-details-modal').modal({
			title: 'Employee details',
			closable: false,
			autofocus: false,
			onDeny: function(){
				console.log('deny');
				//return false;
			},
			onApprove: function (){
			console.log('approve');
			},
			onHidden: function(){	
				console.log('close view employee modal');
				closeModal();
			}	
		}).modal('show');
		*/
	
	});
	
}

// RADIO BUTTONS
function sendRadioSelection(value){
	
	orderBy = value;
	runSearch(orderBy, lastSearch);
	
};

// ** SEARCH FUNCTION **

function runSearch(orderBy, searchTerm){

	let departments = "";

	for (const [key, value] of Object.entries(activeDepartmentsObj)) { 
						
		if (value == true) {
			//departments += `${key},`;
			departments += `${key},`;
		}
	}

	let departmentsStr = departments.slice(0,-1);

	let locations = "";

	for (const [key, value] of Object.entries(activeLocationsObj)) {
						
		if (value == true) {
			locations += `${key},`;
		}
	}

	let locationsStr = locations.slice(0,-1);

	console.log('depts', countOfCheckedDepts, 'locs', countOfCheckedLocations);
	
	if (countOfCheckedDepts == 0 || countOfCheckedLocations == 0) {

		$('.result-row').remove();

		let otherEmployees = document.getElementById('table-body');
		
		for (let e = 0; e < 20; e ++) {

			otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj, true));

		}
		
	} else {

	$.ajax({
		
		//url: "libs/php/searchAllBuildInLocations.php",
		//url: "libs/php/runSearch.php",
		url: "libs/php/runSearchNEW.php",
		type: "GET",
		//url: "libs/post-php/runSearch.php",
		//type: "POST",
		dataType: "json",
		data: {
			searchTerm: `${searchTerm}%`,
			//searchEmail: `%${searchTerm}%`, // this one searches anywhere in email
			searchEmail: `${searchTerm}%`, // email starts with term
			orderBy: orderBy,
			departments: departmentsStr,
			locations: locationsStr
		},
		success: function (result) {
			
				maxNewEmployeeID = 0;

				console.log('search result',result);
				
				$('.result-row').remove();

				let otherEmployees = document.getElementById('table-body');
				
				let rowsToCreate = result.data.length < 20 ? 20 : result.data.length;
				
				if (result.data.length < 8) {
					document.getElementById('body-tag').setAttribute('style', 'overflow: hidden');
				} else {
					document.getElementById('body-tag').setAttribute('style', 'overflow: auto');
				}
	
				let newestEmployeeObj = {};

				for (let e = 0; e < rowsToCreate; e ++) {

					if (e < result.data.length) {
												
						for (const [key, value] of Object.entries(result.data[e])) {
						
							employeePropertiesObj[key] = value;
						
						}
						
						newestEmployeeObj[JSON.parse(createEmployeeRow(employeePropertiesObj, true).getElementsByTagName('div')[0].attributes[1].textContent).id] = createEmployeeRow(employeePropertiesObj, true);
						
						otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj, true));
					
					
					} else {
						
						otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj, true));
						
					}
				}
				
				function newElem (){
					finalMaxID = maxNewEmployeeID;
					return newestEmployeeObj[maxNewEmployeeID] 
				}

				if (newElem()) {
				
					otherEmployees.appendChild(createEmployeeRow(JSON.parse(newElem().getElementsByTagName('td')[0].children[0].children[0].attributes[1].textContent), false));

				}

				viewDetailsBtnFunctionality()
				
				selectEmployeeFunctionality()

				if (employeeJustCreated) {
					
					renderEmployee(newestElement);

					let employeeDetails = JSON.stringify(newestElement);

					if (employeeDetailsVisibility == 0) {

						$('.employee-detail-fields').attr('style', 'visibility: visible');
						$('#employee-panel-message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
						employeeDetailsVisibility ++;

					} else {

						$('#employee-panel-message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
					}
					
				}
				
				if (employeeJustEdited) {
					
					renderEmployee(editedElement);

					let employeeDetails = JSON.stringify(editedElement);

					if (employeeDetailsVisibility == 0) {
						$('.employee-detail-fields').attr('style', 'visibility: visible');
						$('#employee-panel-message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
						employeeDetailsVisibility ++;
					} else {
						$('#employee-panel-message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
					}
					
				}

				employeeJustCreated = false;
				employeeJustEdited = false;
				document.getElementById('search-box-icon').setAttribute('class', 'ui icon input');	
				
				console.log('refresh count', firstload);	

		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('run search error', jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
		}
		
};

// ** OTHER FUNCTIONS **

// CLOSE MODAL

function closeModal(){	

	document.getElementById('employee-modal-create-fields').reset();
	document.getElementById('employee-modal-edit-fields').reset();

	document.getElementById('employee-modal-view-fields').setAttribute('style','display: none');
	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: none');
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: none');
	document.getElementById('submit-create-employee').setAttribute('style','display: none');
	document.getElementById('submit-edit-employee').setAttribute('style', 'display: none');
	document.getElementById('modal-deny-btn').setAttribute('style', 'display: none');
	document.getElementById('close-only-btn').setAttribute('style', 'display: none');

	document.getElementById('employee-modal-view-fields').innerHTML = "";
	document.getElementById('employee-modal-create-fields').innerHTML = "";
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	document.getElementById('manage-depts-and-locs').setAttribute('style', 'display: none');
	
	document.getElementById('create-new-location-btn').setAttribute('style', 'display: none');
	document.getElementById('create-new-location-btn').innerHTML = 'Add new location';
	
	document.getElementById('create-new-department-btn').setAttribute('style', 'display: none');
	document.getElementById('create-new-department-btn').innerHTML = 'Add new department';

	document.getElementById('save-new-location-btn').setAttribute('style', 'display: none');

};

function closeAlertModal(){

	document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('create-new-location-btn').setAttribute('style', 'display: none');

	document.getElementById('create-new-location-btn').innerHTML = 'Add new location';

}


// WINDOW RESIZE FUNCTIONALITY
let tForWindow;
window.onresize = () => {
	resizing(this, this.innerWidth, this.innerHeight) //1
	if (typeof tForWindow == 'undefined') resStarted() //2
	clearTimeout(tForWindow); tForWindow = setTimeout(() => { tForWindow = undefined; resEnded() }, 200) //3
}

function resizing(target, w, h) {
	//console.log(`Youre resizing: width ${w} height ${h}`)
}    
function resStarted() { 
	//console.log('Resize Started') 
}
function resEnded() { 

$('tr:not(#first-employee-row)').off('mouseover');

$('tr:not(#first-employee-row)').off('mouseout');

$('td:not(#employee-details-field)').off('click');

selectEmployeeFunctionality()

}

function attachRadioEvents(){

	$('#order-by-first-name-mobile').checkbox('attach events', '#order-by-first-name', 'check');
	$('#order-by-last-name-mobile').checkbox('attach events', '#order-by-last-name', 'check');

	$('#order-by-first-name').checkbox('attach events', '#order-by-first-name-mobile', 'check');
	$('#order-by-last-name').checkbox('attach events', '#order-by-last-name-mobile', 'check');	

}

function refreshPage(){
	firstload++;
	
	for (let prop in locsAndDeptsObj){
		delete locsAndDeptsObj[prop];
	}
	
	for (let prop in locationsObj){
		delete locationsObj[prop];
	}
	
	for (let prop in departmentsObj){
		delete departmentsObj[prop];
	}

	listOfLocations = [];
	listOfDepts = [];
	
	getAllEmployees();

	getAllLocationsAndDepartments('locations');	
  // includes runSearch at the end inside mobiledeptcheckboxes or somthing

}

window.onload = (event) => {	
		
		$(document).ready(function () {
			
			document.getElementById('search-input').value = ""; 
			
			$('.ui.accordion').accordion();
/*
			$('.coupled.modal')
				.modal({
					allowMultiple: true
				});

			$('.second.modal')
				.modal('attach events', '#refresh-depts-btn');
			
			// open second modal on first modal buttons

			
				
			$('.ui.modal').modal({
				onHidden: function(){	
					console.log('close view employee modal');
					closeModal();
				}
			});
			*/

			$('.message .close')
				.on('click', function() {
					$(this)
						.closest('.message')
						.transition('fade')
					;
				});
			
			$('.active-radio-checkbox').checkbox({
				onChecked: function(){
					sendRadioSelection(this.value);
					console.log(this.name);
				},	
			});

			$('.coupled.modal')
					.modal({
						allowMultiple: true
					});

			$('.first.modal')
			.modal({
				autofocus: false,
				onHidden: function (){
					closeModal();
				}
			});

				
			$('.second.modal')
				.modal('attach events', '#open-second-modal-btn');
				


			attachRadioEvents();	
			
			getAllEmployees();

      getAllLocationsAndDepartments('locations');


		});

}; //END OF WINDOW ON LOAD