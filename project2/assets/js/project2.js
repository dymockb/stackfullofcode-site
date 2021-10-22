//let locationDropDownHolder = [];
//let deleteAttempts = 0;

let employeeDetailsVisibility = 0;
let employeePropertiesObj = {};
let blankEmployeeObj = {};

let lastSearch = "";
let orderBy = 'lastName';

let locationsObj = {};
let departmentsObj = {};

let activeDepartmentsObj = {};
let countOfDepts;
let countOfCheckedDepts;
let howManyDeptsSelected = 'All';

let activeLocationsObj = {};
let countOfLocations;
let countOfCheckedLocations;
let howManyLocationsSelected = 'All';

let locationsDropDownObj = {};
let departmentsDropDownObj = {};

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

// ** PAGE LOAD FUNCTIONS **

function getAllDepartments(){
	$.ajax({
	url: "assets/php/getAllDepartments.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('getAllDepartments ',result);

			let listOfDepts = [];
			
			for (let d = 0; d < result.data.length; d++) {
				departmentsObj[result.data[d].id] = result.data[d].name;
				if (!listOfDepts.includes(result.data[d].name)) {
					listOfDepts.push(result.data[d].name);
				}
			}

			countOfDepts = listOfDepts.length;
			countOfCheckedDepts = listOfDepts.length;

			for (lod = 0; lod < listOfDepts.length; lod ++) {
				let deptName = listOfDepts[lod];
				let checkedStatus = createCheckbox(deptName, 'department').getAttribute('class').includes('checked');
				document.getElementById('department-checkboxes').appendChild(createCheckbox(deptName, 'department'));
				activeDepartmentsObj[deptName] = checkedStatus;
			}

			departmentCheckboxFunctionality();

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
}

function getAllLocations(){
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('getAllLocations ', result);
			
			let listOfLocations = [];
			
			for (let l = 0; l < result.data.length; l++) {
				locationsObj[result.data[l].id] = result.data[l].name;
				if (!listOfLocations.includes(result.data[l].name)) {
					listOfLocations.push(result.data[l].name);
				}
			}

			countOfLocations = listOfLocations.length;
			countOfCheckedLocations = listOfLocations.length;

			for (lol = 0; lol < listOfLocations.length; lol ++) {
				let locName = listOfLocations[lol];
				let checkedStatus = createCheckbox(locName, 'location').getAttribute('class').includes('checked');
				document.getElementById('location-checkboxes').appendChild(createCheckbox(locName, 'location'));
				activeLocationsObj[locName] = checkedStatus;
			}

			locationCheckboxFunctionality();

		
	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});	
}

function getAllEmployees(){

	$.ajax({
		url: "assets/php/getAll.php",
		type: "GET",
		dataType: "json",
		data: {},
		success: function (result) {
			
				console.log('getAll ',result.data);
				
				for (const [key, value] of Object.entries(result.data[0])) {
					
					console.log(key);
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
		
				let firstEmployee = document.getElementById('first-employee');

				appendEmployee(firstEmployee, createEmployee(blankEmployeeObj));

				let otherEmployees = document.getElementById('table-body');

				for (let e = 0; e < result.data.length; e ++) {
					
					for (const [key, value] of Object.entries(result.data[e])) {
					
						employeePropertiesObj[key] = value;
						maxEmployeeID = employeePropertiesObj.id > maxEmployeeID ? employeePropertiesObj.id : maxEmployeeID;
					
					}

					otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj));
					
				}
				
				viewDetailsBtnFunctionality()
				
				selectEmployeeFunctionality()
				
				if ($('#preloader').length) {
					$('#preloader').delay(1000).fadeOut('slow', function () {
						$(this).remove();
						console.log("Window loaded", event);		
					});
				}

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
    console.log('start typing');
		document.getElementById('search-box-icon').setAttribute('class', 'ui icon input loading');
		var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

//BUTTONS

//top level buttons

$('#create-employee-btn').click(function(){
	
	let noDetailsRequired = {};
	locationDropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'create', noDetailsRequired);
	
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-create-employee').setAttribute('style', 'display: inline');


	$('.ui.modal.employee-details-modal').modal({
		
		title: 'Create Employee',
		closable: false,
		onDeny: function(){
			console.log('deny');
			//return false;
		},
		onApprove: function (){
		console.log('approve');
		},
		onHidden: function(){	
			console.log('close view employee modal');
			document.getElementById('employee-modal-create-fields').innerHTML = "";
			closeModal();
		}	
		}).modal('show');

	
});

$('#manage-depts-and-locs-btn').click(function(){
		
		document.getElementById('manage-depts-and-locs').setAttribute('style', 'display: block')
	
		deptStringTemplate = 'departmentID-1';
		locStringTemplate = 'locationID-1';

		let buttonForModal = document.createElement('button')
		buttonForModal.setAttribute('class', 'ui button');
		buttonForModal.setAttribute('id', 'create-new-location-btn');
		buttonForModal.innerHTML = 'Add new location';

		$('.ui.modal.employee-details-modal').modal({

		title: `Manage Departments and Locations` + buttonForModal.outerHTML,
		closable: false,
		onShow: function(){
			$('.ui.accordion').accordion();
			eventListenersInsideDeptsandLocsModal(deptStringTemplate, locStringTemplate);
		},
		onDeny: function(){
			console.log('deny');
			//return false;
		},
		onApprove: function (){
		//document.getElementById('submit-create-employee').click();
		console.log('approve');
		},
		onHidden: function(){	
			console.log('close view employee modal');
			closeModal();
		}	
		}).modal('show');
		
	
});

//buttons on employee panel
$('#delete-employee-btn').click(function (){
	
	let employeeDetails = JSON.parse(document.getElementById('delete-employee-btn').getAttribute('employee-details'));

	$('#delete-employee-modal-btn').attr('style', 'display: inline');

	
 	$('#alert-modal').modal(
 		{
	 		title: '<i class="archive icon"></i>',
	 		content: `Delete this employee?  ${employeeDetails.firstName} ${employeeDetails.lastName}`
 		}).modal('show');

	});

$('#edit-employee-fields-btn').click(function(){
	
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	
	let employeeDetails = JSON.parse(this.getAttribute('employee-details'));

	//employeeDetails['jobTitle'] = 'TBC';
	
	dropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'edit', employeeDetails);	

	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-edit-employee').setAttribute('style','display: inline');
	document.getElementById('submit-edit-employee').setAttribute('employee-details', this.getAttribute('employee-details'));

	$('.ui.modal.employee-details-modal').modal({
		title: 'Edit Employee',
		closable: false,
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

	// to set the fields to not read-only I think
	//$('#edit-employee-modal-btn').click();

});

//buttons on employee modal

$('#submit-create-employee').click(function(event){
			
	console.log('create employee submit clicked');
	console.log($(`#employee-modal-create-fields`).form('validate form'));

	if ($('#employee-modal-create-fields').form('validate form')) {
		$('#employee-modal-create-fields').form('submit');
		$('#employee-modal-create-fields').form('reset');
	}

});

$('#submit-edit-employee').click(function (){

	console.log('submit edit employee btn clicked');
	console.log($(`#employee-modal-edit-fields`).form('validate form'));

	if ($('#employee-modal-edit-fields').form('validate form')) {

		$('#employee-modal-edit-fields').form('submit');
	
	}
	
});

//buttons on alert modal
$('#delete-employee-modal-btn').click(function (){
	
	let employeeID = JSON.parse(this.getAttribute('employee-details')).id;

	document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: none');

	$.ajax({
	url: "assets/php/deleteEmployeeByID.php",
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

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
});

$('#update-employee-modal-btn').click(function (){
	
	let updateEmployeeDataObj = JSON.parse(this.getAttribute('employee-details'));

	document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: none');

	$.ajax({
	url: "assets/php/updateEmployee.php",
	type: "GET",
	dataType: "json",
	data: updateEmployeeDataObj,
	success: function (result) {
		
			console.log('updateEmployee ',result.data);
			console.log('orderby', orderBy, 'lastSearch', lastSearch);
			employeeJustEdited = true;
			editedElement = updateEmployeeDataObj;
			runSearch(orderBy,'');

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
	

});

// linked mobile buttons

$('#create-employee-btn-mobile').click(function(){

	$('#create-employee-btn').click();

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
					editEmployeeDataObj['department'] = departmentsObj[this.elements[e].value];
				} else if (this.elements[e].getAttribute('fieldname') == 'locationID'){
					editEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
					editEmployeeDataObj['locationName'] = locationsObj[this.elements[e].value];
				} else {
					editEmployeeDataObj[this.elements[e].getAttribute('fieldname')] = this.elements[e].value;
				}
			}

		}
		
		document.getElementById('update-employee-modal-btn').setAttribute('employee-details', JSON.stringify(editEmployeeDataObj));
		
		let employeeDetails = editEmployeeDataObj;
		
		document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: inline');	
		
		$('#alert-modal').modal(
		{
			title: '<i class="archive icon"></i>',
			content: `Update this employee?`,
			//content: `${employeeDetails.firstName} ${employeeDetails.lastName}:  Update this employee?`,
			onHidden: function(){	
				console.log('close edit employee');
				closeModal();
			}	
		}
		).modal('show');

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
	
	console.log(createEmployeeDataObj);
	
	$.ajax({
	url: "assets/php/insertEmployee.php",
	type: "GET",
	dataType: "json",
	data: createEmployeeDataObj,
	success: function (result) {
		
			console.log('insertEmployee ',result.data);
			console.log('orderby', orderBy, 'lastSearch', lastSearch);
			employeeJustCreated = true;
			runSearch(orderBy,'');

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
		
});

//forms within Manage Depts and Locs Modal

function eventListenersInsideDeptsandLocsModal(depStringTemplate, locStringTemplate){

	let existingDepartmentNames = ['Dept1', 'Dept2'];

	let existingDepartmentName = 'Dept1'
	let existingLocationName = 'Loc1'

	let existingLocationNames = ['Loc1', 'Loc2'];
	let basicRules = []

	let ruleOne = {}
	ruleOne['type'] = 'empty';
	ruleOne['prompt'] = 'Please enter a name';

	let ruleTwo = {}
	ruleTwo['type'] = 'regExp[/^[A-Z]/]';
	ruleTwo['prompt'] = 'First letter must be a capital';

	let ruleThree = {};
	ruleThree['type'] = 'minLength[2]';
	ruleTwo['prompt'] = 'At least two characters are required.';

	basicRules.push(ruleOne);
	basicRules.push(ruleTwo);
	basicRules.push(ruleThree);

	let locationRules = basicRules.slice();

	for (let e = 0 ; e < existingLocationNames.length; e ++) {
		let newRule = {}
		newRule['type'] = `notExactly[${existingLocationNames[e]}]`;
		newRule['prompt'] = 'That location already exists';
		locationRules.push(newRule)
	}

	$('#create-new-location-btn').click(function(){

		console.log('click');

		$('#location-accordion-segment').attr('style', 'display: block')

		$('#new-location-accordion-btn').click();

	});

	$(`#cancel-new-location-btn`).click(function(e){

		console.log('clicked cancel');

		$(`#new-location-form`).form('reset');
		$('#new-location-accordion-btn').click();

		let closeNewLocationTimer = setTimeout(function(){
			$('#location-accordion-segment').attr('style', 'display: none');
			clearTimeout(closeNewLocationTimer);
		},250);		

	});

	$(`#new-location-form`).form({
		fields: {
			name: {
				identifier: 'new-location',
				rules: locationRules
			}
		}
	});

	$(`#submit-new-location-btn`).click(function(e){
			
		console.log('submit new location clicked');
		console.log($(`#new-location-form`));
		console.log($(`#new-location-form`).form('validate form'));

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

	$(`#new-location-form`).submit(function(event){
		event.preventDefault();
		console.log('new location submitted');

		for (let e = 0; e < this.elements.length; e ++) {
	
			if (this.elements[e].tagName != 'BUTTON') {			

				console.log(`#new-location-form`, this.elements[e].value);
				
			}

		}

	});



	for (let f = 0; f < 1; f++){

		let departmentRules = basicRules.slice();

		for (let r = 0 ; r < existingDepartmentNames.length; r ++) {
			let newRule = {}
			newRule['type'] = `notExactly[${existingDepartmentNames[r]}]`;
			newRule['prompt'] = 'That department already exists';
			departmentRules.push(newRule)
		}
		
		$(`#locationID-1-cancel-new-dept-btn`).click(function(e){

			console.log('clicked cancel');
			$(`#locationID-new-dept-form`).form('reset');
			$('#locationID-1-new-dept-btn').click();

		});

		$(`#locationID-new-dept-form`).submit(function(event){
			event.preventDefault();
			console.log($('#locationID-1-new-dept-form'));
			console.log('new department submitted');

			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			
	
					console.log(`#${depStringTemplate}-form`, this.elements[e].value);
					
					//$(`#${depStringTemplate}-title`).hide().html(this.elements[e].value).fadeIn(750);
		}
	
			}

		});

		$(`#departmentID-1-form`).form({
			fields: {
				name: {
					identifier: 'dept-rename',
					rules: departmentRules
				}
			}
		});
		
		

		$(`#submit-departmentID-1-btn`).click(function(e){
			
			
			console.log('submit clicked');
			console.log($('#departmentID-1-form').form('validate form'));
			
			if ($(`#${depStringTemplate}-form`).form('validate form')) {
				$(`#${depStringTemplate}-form`).form('submit');
				$(`#${depStringTemplate}-form`).form('reset');
			}

		});


		$(`#departmentID-1-form`).submit(function(event){
			event.preventDefault();
			console.log('submitted');
			$(`#departmentID-1-form`).form('set defaults');
			//$(`#${depStringTemplate}-form`).form('set as clean');

			$(`#departmentID-1-field`).attr('class', 'eight wide field dept-name-field');
			$(`#input-departmentID-1-field`).attr('readonly','');
			$(`#rename-${depStringTemplate}-btn`).attr('class', 'ui tiny button');
			$(`#submit-departmentID-1-btn`).attr('class', 'ui tiny disabled button');
			$(`#cancel-departmentID-1-btn`).attr('class', 'ui tiny disabled button');
			
			$('#departmentID-1-accordion').click()
			//$('#departmentID-1-field-container').attr('style', 'display: none');
			

			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			
	
					console.log(`#${depStringTemplate}-form`, this.elements[e].value);
					//$(`#${depStringTemplate}-title`).html(this.elements[e].value);
					//$(`#${depStringTemplate}-title`).hide().html(this.elements[e].value).fadeIn(750);
					//$(`#${depStringTemplate}-form`).form('reset')
					$(`#input-departmentID-1-field`).attr('value', this.elements[e].value);
					$(`#input-departmentID-1-field`).attr('placeholder', this.elements[e].value);
					$(`#departmentID-1-title`).hide().html(this.elements[e].value).fadeIn(750); 

				}
	
			}

		});

		$(`#cancel-${depStringTemplate}-btn`).click(function(e){

			console.log('cancel');
			
			$(`#departmentID-1-form`).form('reset');

			//$(`#input-departmentID-1-field`).attr('value',`${existingDepartmentName}`);
			//$(`#input-departmentID-1-field`).attr('placeholder',`${existingDepartmentName}`);

			//$('#departmentID-1-field-container').attr('style', 'display: none');
			$('#departmentID-1-accordion').click()
			
			//$(`#departmentID-1-field`).attr('class', 'field');

			$(`#submit-departmentID-1-btn`).attr('class', 'ui tiny disabled button');
			$(`#cancel-departmentID-1-btn`).attr('class', 'ui tiny disabled button');
			$(`#rename-${depStringTemplate}-btn`).attr('class', 'ui tiny button');
			$(`#departmentID-1-field`).attr('class', 'eight wide field dept-name-field');			
			$(`#input-departmentID-1-field`).attr('readonly','');

		});

		$(`#rename-${depStringTemplate}-btn`).click(function(e){

			//$('#departmentID-1-field-container').attr('style', 'display: flex');

			$('#departmentID-1-accordion').click()
			
			$(`#input-departmentID-1-field`).removeAttr('readonly');
			$(`#submit-departmentID-1-btn`).attr('class', 'ui tiny button');
			
			$(`#input-departmentID-1-field`).attr('value','');
			$(`#input-departmentID-1-field`).attr('placeholder','New Department Name');
			$(`#departmentID-1-field`).attr('class', 'eight wide info field dept-name-field');
			$(`#cancel-departmentID-1-btn`).attr('class', 'ui tiny button');
		
			$(`#rename-${depStringTemplate}-btn`).attr('class', 'ui tiny disabled button');

		});	

		$(`#delete-${depStringTemplate}-btn`).click(function(e){
			
			console.log('delete', this.getAttribute('deptID'));

		});


		$(`#locationID-1-new-dept-form`).form({
			fields: {
				name: {
					identifier: 'new-department',
					rules: departmentRules
				}
			}
		});
	

		$(`#locationID-1-submit-new-dept-btn`).click(function(e){
			
			
			console.log('submit clicked');
			
			
			if ($(`#locationID-1-new-dept-form`).form('validate form')) {
				$(`#locationID-1-new-dept-form`).form('submit');
				$(`#locationID-1-new-dept-form`).form('reset');
			}
			

		});

		$(`#locationID-1-new-dept-form`).submit(function(event){
			event.preventDefault();
			console.log('submitted');

			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			
	
					console.log(`#locationID-1-new-dept-form`, this.elements[e].value);

				}
	
			}

		});

	}

}

// ** FUNCTIONS TO CREATE ELEMENTS **

// CREATE EMPLOYEES
function createEmployee(employeePropertiesObj){
	
	let employeeH4 = document.createElement('h4');
	employeeH4.setAttribute('class', 'ui image header');
	
	let employeeImg = document.createElement('img');
	employeeImg.setAttribute('src', 'assets/images/wireframe/square-image.png');
	employeeImg.setAttribute('class', 'ui mini rounded image');
		
	let employeeDiv = document.createElement('div');
	employeeDiv.setAttribute('class', 'content');

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
	
	employeeDiv.appendChild(employeeSubHeader);
	
	employeeH4.appendChild(employeeImg);
	employeeH4.appendChild(employeeDiv);	
		
	let employeeModalBtn = document.createElement('div');
	employeeModalBtn.setAttribute('class', 'employee-modal-btn ui button');
	//employeeModalBtn.setAttribute('id', 'modalBtn');
	employeeModalBtn.innerHTML = 'View Details';
	
	return [employeeH4, employeeModalBtn];
};

function appendEmployee(elementToAppend, employeeElements){
	elementToAppend.innerHTML = '';
	elementToAppend.appendChild(employeeElements[0]);
	elementToAppend.appendChild(employeeElements[1]);
};

function createEmployeeRow(employeePropertiesObj) {

	
	let setMax = false;
	if (employeePropertiesObj.id == finalMaxID) {

		setMax = true;
		console.log('THIS IS THE NEWEST EMPLOYEE',employeePropertiesObj);
		newestElement = employeePropertiesObj;
	}

	let tableRow = document.createElement('tr');
	tableRow.setAttribute('class', 'result-row');
	if (employeePropertiesObj.firstName == 'First name') {
	  tableRow.setAttribute('style', 'visibility: hidden');
	} 
	
	if (setMax) {
		if (!document.getElementById('newest-employee')) {
			tableRow.setAttribute('id', 'newest-employee');
		}
	}
	
	maxNewEmployeeID = employeePropertiesObj.id > maxNewEmployeeID ? employeePropertiesObj.id : maxNewEmployeeID; 

	let tableData = document.createElement('td');

	let employeeElements = createEmployee(employeePropertiesObj);
					
	tableData.appendChild(employeeElements[0]);
	tableData.appendChild(employeeElements[1]);
	
	tableRow.appendChild(tableData);

	return tableRow;
};

function renderEmployee(employeeProperties){

	employeeProperties['jobTitle'] = employeeProperties['jobTitle'] == '' ? 'Job Title TBC' : employeeProperties['jobTitle'];
	
	for (const [key, value] of Object.entries(employeeProperties)) {
					
		document.getElementById(`employee-${key}-field`).innerHTML = value;

	}
	
};

// CREATE CHECKBOXES
function createCheckbox (checkboxName, department){
	let checkboxDiv = document.createElement('div');
	checkboxDiv.setAttribute('class', `ui checkbox ${department}-checkbox checked`);

	let checkboxInput = document.createElement('input');
	checkboxInput.setAttribute('type', 'checkbox');
	checkboxInput.setAttribute('name', `${checkboxName}`);
	checkboxInput.setAttribute('checked', "");

	let checkboxLabel =document.createElement('label');
	checkboxLabel.innerHTML = `${checkboxName}`;

	checkboxDiv.appendChild(checkboxInput);
	checkboxDiv.appendChild(checkboxLabel);

	return checkboxDiv;

};

// CREATE MODAL CONTENT

function buildForm(listOfNames, listOfIDs, editOrCreate, detailsForEditForm){	

  console.log('editorcreate', editOrCreate);
  
	let listOfIdentifiers = [];
		
	let uiForm = document.createElement('div');
	uiForm.setAttribute('class', 'ui form');
	
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
		//input.setAttribute('required', '');
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
		
		return outerNode
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
		
		for (let loc = 0; loc < listOfNames.length; loc ++){
			
			let oneOption = dataValue.cloneNode(true);
			let outputValue = listOfIDs[loc];
			oneOption.innerHTML = listOfNames[loc];
			oneOption.setAttribute('data-value', outputValue);
			menu.appendChild(oneOption);
			
		}
		
		if(editOrCreate == 'create'){
			input.setAttribute('value', '');
		} else if (editOrCreate == 'view') {
      input.setAttribute('value', '');
    }

		input.setAttribute('fieldname', fieldID);
		input.setAttribute('fieldID', fieldID);
		input.setAttribute('type', 'hidden');
		//input.setAttribute('name', 'category');
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
		let jobTitleValue = detailsForEditForm.jobTitle == 0 ? '' : detailsForEditForm.jobTitle;
		//jobTitleInput.setAttribute('value', jobTitleValue);
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
	//emailInput.setAttribute('required', '');
	if (editOrCreate == 'create') {
		emailInput.setAttribute('placeholder', 'employee@company.com');
	} else {
		emailInput.setAttribute('placeholder', detailsForEditForm.email);
		emailInput.setAttribute('value', detailsForEditForm.email);		
	}

	let emailError = document.createElement('div');
	emailError.setAttribute('class', 'ui error message')

	emailField.appendChild(emailHeading);
	emailField.appendChild(emailInput);
	emailField.appendChild(emailError);
		
	uiForm.appendChild(twoCategories);
	uiForm.appendChild(nameCategories);
	uiForm.appendChild(jobTitleField);
	uiForm.appendChild(emailField);


	if (editOrCreate == 'edit'){
		let idField = field.cloneNode(true);
		
		let idInput = inputField.cloneNode(true);
		idInput.setAttribute('fieldname', 'id');
		idInput.setAttribute('value', detailsForEditForm.id);
		idInput.setAttribute('class', 'display-none-field');
	
		idField.appendChild(idInput);
		uiForm.appendChild(idField);
	}
	
	console.log(uiForm);
	document.getElementById(`employee-modal-${editOrCreate}-fields`).appendChild(uiForm);
	
	if (editOrCreate == 'edit') {
		
		$.ajax({
		url: "assets/php/departmentsChange.php",
		type: "GET",
		dataType: "json",
		data: {
			locationID: detailsForEditForm.locationID
		},
		success: function (result) {
			
				console.log('departments for edit ',result.data);

				
				for (let dc = 0; dc < result.data.length; dc ++ ) {

					let oneOption = document.createElement('div');
					oneOption.setAttribute('class', 'item');

					let outputValue = result.data[dc].id;
					oneOption.innerHTML = result.data[dc].name;
					oneOption.setAttribute('data-value', outputValue);
				
					document.getElementById('department-dropdown-menu').appendChild(oneOption);
								
				}		
				
				if (dropDownClicked == 0) {

					$('#location-dropdown').click(function(){
						$('.selection.dropdown').dropdown();
						if (dropDownClicked == 0) {
							document.getElementById('location-dropdown').click();
							dropDownClicked ++;
						}

					});

					$('#department-dropdown').click(function(){
						$('.selection.dropdown').dropdown();
						if (dropDownClicked == 0) {
							document.getElementById('department-dropdown').click();
							dropDownClicked ++;
						}
					});

				}
				
		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
	}
	
	if (editOrCreate == 'create') {
		console.log('locationDropDownClicked', locationDropDownClicked);
		if (locationDropDownClicked == 0) {

			$('#location-dropdown').click(function(){
				//$('.selection.dropdown').dropdown();	
				if (locationDropDownClicked == 0) {
					//document.getElementById('location-dropdown').click();
					locationDropDownClicked ++;
				}
				
			});

			}
	}

	return listOfIdentifiers;
}

function createEmployeeModalContent(editOrCreate, detailsForEditForm){
	
	//let newEmployeeFieldsObj = {};
	let listOfLocationsUpdated = [];	
	//let listOfDepartmentsUpdated = [];
	let listOfLocationIDs = [];
	
	
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
			
			for (let loc = 0; loc < result.data.length; loc ++){
				listOfLocationsUpdated.push(result.data[loc].name);
				listOfLocationIDs.push(result.data[loc].id);
			}
			
			let listOfIdentifiers = buildForm(listOfLocationsUpdated, listOfLocationIDs, editOrCreate, detailsForEditForm);
			console.log('listofIdentifiers', listOfIdentifiers);

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

			//WASHERE

			let locationDropDown = document.getElementById('location-dropdown');
			
			locationDropDown.addEventListener('change', function(e){
				
						$.ajax({
						url: "assets/php/departmentsChange.php",
						type: "GET",
						dataType: "json",
						data: {
							locationID: e.target.value
						},
						success: function (result) {

								document.getElementById('department-dropdown-menu').innerHTML = "";

								for (let dc = 0; dc < result.data.length; dc ++ ) {

									let oneOption = document.createElement('div');
									oneOption.setAttribute('class', 'item');

									let outputValue = result.data[dc].id;
									oneOption.innerHTML = result.data[dc].name;
									oneOption.setAttribute('data-value', outputValue);
									
									document.getElementById('department-dropdown-menu').appendChild(oneOption);
									
								}							
								
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
									
			}); // end of event listener	

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
};

/*
function editEmployeeModalContent(){
	
	let newEmployeeFieldsObj = {};
	let listOfLocationsUpdated = [];	
	//let listOfDepartmentsUpdated = [];
	
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
				
			for (let l = 0; l < result.data.length; l ++) {
				listOfLocationsUpdated.push(result.data[l].name)
				locationsDropDownObj[result.data[l].name] = result.data[l].id;
			}

			for (const [key, value] of Object.entries(blankEmployeeObj)) {
				
				if (key == 'firstName') {
					newEmployeeFieldsObj[key] = document.createElement('h2');
				} else if (key == 'lastName') {
					newEmployeeFieldsObj[key] = document.createElement('h2');
				} else if (key == 'email') {
					newEmployeeFieldsObj[key] = document.createElement('h3');
				} else if (key == 'jobTitle') {
					newEmployeeFieldsObj[key] = document.createElement('h2');
				} else if (key == 'department') {
					newEmployeeFieldsObj[key] = document.createElement('h2');
				} else if (key == 'locationName') {
					newEmployeeFieldsObj[key] = document.createElement('h3');
				} else {
					newEmployeeFieldsObj[key] = document.createElement('p');
					newEmployeeFieldsObj[key].setAttribute('class', 'display-none-field');
				}
			
			}
	
			console.log('listoflocationsupdated',listOfLocationsUpdated);
			
			for (const [key, value] of Object.entries(newEmployeeFieldsObj)) {
				
				let inputField;

				if (key == 'locationName'){
					
					if (key == 'locationName') {
						inputField = document.createElement('select');
						inputField.setAttribute('required', '');
						inputField.setAttribute('class', 'ui fluid dropdown');
						inputField.setAttribute('id', 'location-dropdown');
						
						let locationSelectOption = document.createElement('option');
						locationSelectOption.setAttribute('disabled', '');
						locationSelectOption.setAttribute('value', '');
						locationSelectOption.setAttribute('selected', '');
						locationSelectOption.innerHTML = 'choose a location';
						
						
						inputField.appendChild(locationSelectOption);
						
						for (let lc = 0; lc < listOfLocationsUpdated.length; lc ++) {
													
							let locationChoice = document.createElement('option');
							locationChoice.setAttribute('value', listOfLocationsUpdated[lc]);
							locationChoice.innerHTML = listOfLocationsUpdated[lc];
							locationChoice.setAttribute('placeholder-id', locationsDropDownObj[listOfLocationsUpdated[lc]]);
							inputField.appendChild(locationChoice);
							
						}

					} 

				} else if ( key != 'department') {
					
					inputField = document.createElement('input');
					inputField.setAttribute('autocomplete', 'off');

					if (key == 'email') {
						inputField.setAttribute('type', 'email');			
					} else {
						inputField.setAttribute('type', 'text');			
					}
					
					if (key == 'firstName' || key == 'lastName') {
						inputField.setAttribute('required', '');
					}			

					inputField.setAttribute('id', `create-employee-${key}-field`);
					inputField.setAttribute('placeholder', key);
					inputField.setAttribute('field-name', key);
					
				}

				if (key != 'department'){
					newEmployeeFieldsObj[key].appendChild(inputField);
				}
				
				if (key == 'firstName') {
					document.getElementById('employee-modal-view-fields').appendChild(newEmployeeFieldsObj[key]);
				}
			
			}	

			for (const [key, value] of Object.entries(newEmployeeFieldsObj)) {
				
				if (key != 'firstName') {
						document.getElementById('employee-modal-view-fields').appendChild(newEmployeeFieldsObj[key]);
				}
			}
			
			let locationDropDown = document.getElementById('location-dropdown');
			
			locationDropDown.addEventListener('change', function(e){
				
				console.log('change');
				console.log(e.target.value);
				
						$.ajax({
						url: "assets/php/departmentsChange.php",
						type: "GET",
						dataType: "json",
						data: {
							locationID: locationsDropDownObj[e.target.value]	
						},
						success: function (result) {
							
								console.log('departments change ',result.data);
								
								let inputField;
								
							
								inputField = document.createElement('select');
								inputField.setAttribute('required', '');
								inputField.setAttribute('class', 'ui fluid dropdown');
								inputField.setAttribute('id', 'department-dropdown');
								
								let departmentSelectOption = document.createElement('option');
								departmentSelectOption.setAttribute('disabled', '');
								departmentSelectOption.setAttribute('value', '');
								departmentSelectOption.setAttribute('selected', '');
								departmentSelectOption.innerHTML = 'choose a department';
								inputField.appendChild(departmentSelectOption);
								
								for (dc = 0; dc < result.data.length; dc ++) {
									let departmentChoice = document.createElement('option');
									departmentChoice.innerHTML = result.data[dc].name;
									departmentChoice.setAttribute('value', result.data[dc].name);
									inputField.appendChild(departmentChoice);
									
									departmentsDropDownObj[result.data[dc].name] = result.data[dc].id;
								}
								
								if (document.getElementById('department-dropdown')) {
									document.getElementById('department-dropdown').remove();
								}
								document.getElementById('employee-modal-view-fields').appendChild(inputField);
						
						

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
*/


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
				
				if ((countOfCheckedDepts < countOfDepts) && (countOfCheckedDepts > 0)){
					howManyDeptssSelected = 'Some';
				}
				
				setSelectAllCheckBox(countOfDepts);
				if (howManyDeptsSelected == 'All') {
					if (countOfCheckedDepts == countOfDepts) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					runSearch(orderBy,lastSearch);
				}
				
			},
			onUnchecked: function(){
				activeDepartmentsObj[this.name] = this.checked;
				countOfCheckedDepts --;
				setSelectAllCheckBox(countOfDepts);
				if (howManyDeptsSelected == 'None') {
					if (countOfCheckedDepts == 0) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					runSearch(orderBy,lastSearch);
				}

			},				
		});
		
		$('#select-none-departments').checkbox({
			onChecked: function(){
				howManyDeptsSelected = 'None';
			  $('.department-checkbox').checkbox('uncheck');
			},
		});

		$('#select-all-departments').checkbox({
			onChecked: function(){
				howManyDeptsSelected = 'All';
			  $('.department-checkbox').checkbox('check');
			},
		});

};

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

				activeLocationsObj[this.name] = this.checked;
				countOfCheckedLocations ++;
				
				if ((countOfCheckedLocations < countOfLocations) && (countOfCheckedLocations > 0)){
					howManyLocationsSelected = 'Some';
				}

				setSelectAllCheckBox(countOfLocations);

				if (howManyLocationsSelected == 'All') {
					if (countOfCheckedLocations == countOfLocations) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					console.log('run search');
					runSearch(orderBy,lastSearch);
				}
				
			},
			onUnchecked: function(){
				activeLocationsObj[this.name] = this.checked;
				countOfCheckedLocations --;
				setSelectAllCheckBox(countOfLocations);
				if (howManyLocationsSelected == 'None') {
					if (countOfCheckedLocations == 0) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					runSearch(orderBy,lastSearch);
				}

			},				
		});
		
		//$('.department-checkbox').checkbox('attach events', '#select-all-departments', 'check');

		//$('.department-checkbox').checkbox('attach events', '#select-none-departments', 'uncheck');
		
		
		$('#select-none-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'None';
			  //$('.department-checkbox').checkbox('set checked');
			  $('.location-checkbox').checkbox('uncheck');
			},
		});

		$('#select-all-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'All';
			  //$('.department-checkbox').checkbox('set checked');
			  $('.location-checkbox').checkbox('check');
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
			let employeeDetails = this.firstChild.children[1].getAttribute('employee-properties');
			employeePropertiesObj = JSON.parse(employeeDetails);

			employeePropertiesObj['jobTitle'] = employeePropertiesObj['jobTitle'] == 0 ? 'Job Title TBC' : employeePropertiesObj['jobTitle'];

			renderEmployee(employeePropertiesObj);

			if (employeeDetailsVisibility == 0) {
				$('.employee-detail-fields').attr('style', 'visibility: visible');
				$('.message').attr('class', 'ui floating message');
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
				document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
				employeeDetailsVisibility ++;
			} else {
				$('.message').attr('class', 'ui floating message');
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

		let employeeProperties = JSON.parse($($(this).context.previousSibling.children[1]).attr('employee-properties'));
		//let employeeDetails = $($(this).context.previousSibling.children[1]).attr('employee-properties');
				
		for (const [key, value] of Object.entries(employeeProperties)) {

			employeePropertiesObj[key] = value;
			
		}

		employeePropertiesObj['jobTitle'] = employeePropertiesObj['jobTitle'] == 0 ? 'Job Title TBC' : employeePropertiesObj['jobTitle'];

		console.log('employee properties',employeePropertiesObj);

		//document.getElementById('employee-modal-view-fields').innerHTML = "";
	
		let employeeDetails = employeePropertiesObj;
		
		dropDownClicked = 0;
		createEmployeeModalContent(editOrCreate = 'view', employeeDetails);	

		document.getElementById('employee-modal-view-fields').setAttribute('style','display: inherit');
		//document.getElementById('submit-edit-employee').setAttribute('style','display: inline');
		document.getElementById('submit-edit-employee').setAttribute('employee-details', this.getAttribute('employee-details'));

		$('.ui.modal.employee-details-modal').modal({
			title: 'Employee details',
			closable: false,
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

		/*

		document.getElementById('employee-modal-view-fields').setAttribute('style','display: inherit');
		document.getElementById('close-employee-modal').setAttribute('style','display: inline');
		
		$('.ui.modal.employee-details-modal').modal(
			{
				title: 'Employee Details',
				closable: false,
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
		
		if (employeeDetailsVisibility == 0) {
			renderEmployee(employeePropertiesObj);
			$('.employee-detail-fields').attr('style', 'visibility: visible');
			document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
			document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
			document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
			employeeDetailsVisibility ++;
		}

		renderEmployee(employeePropertiesObj);
	
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

			otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj));

		}
		
	} else {

	$.ajax({
		//url: "assets/php/searchAll.php",
		//url: "assets/php/searchAllBuildInDepts.php",
		url: "assets/php/searchAllBuildInLocations.php",
		type: "GET",
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
				console.log('no of results', result.data.length);
				
				$('.result-row').remove();

				let otherEmployees = document.getElementById('table-body');
				
				let rowsToCreate = result.data.length < 20 ? 20 : result.data.length;
				
				if (result.data.length < 8) {
					document.getElementById('body-tag').setAttribute('style', 'overflow: hidden');
				} else {
					document.getElementById('body-tag').setAttribute('style', 'overflow: auto');
				}
	
				//let nextNewestElement;
				let newestEmployeeObj = {};

				for (let e = 0; e < rowsToCreate; e ++) {

					if (e < result.data.length) {
												
						for (const [key, value] of Object.entries(result.data[e])) {
						
							employeePropertiesObj[key] = value;
						
						}
						
						newestEmployeeObj[JSON.parse(createEmployeeRow(employeePropertiesObj).getElementsByTagName('div')[0].attributes[1].textContent).id] = createEmployeeRow(employeePropertiesObj);
						
						otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj));
					
					
					} else {
						
						otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj));
						
					}
				}
				
				function newElem (){
					finalMaxID = maxNewEmployeeID;
					return newestEmployeeObj[maxNewEmployeeID] 
				}

				if (newElem()) {
				
					console.log('creates newest employee on first search');
					otherEmployees.appendChild(createEmployeeRow(JSON.parse(newElem().getElementsByTagName('td')[0].children[0].children[1].attributes[1].textContent)));

				}

				viewDetailsBtnFunctionality()
				
				selectEmployeeFunctionality()

				if (employeeJustCreated) {
					
					renderEmployee(newestElement);

					let employeeDetails = JSON.stringify(newestElement);
					console.log('test', employeeDetails);

					if (employeeDetailsVisibility == 0) {
						$('.employee-detail-fields').attr('style', 'visibility: visible');
						$('.message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
						employeeDetailsVisibility ++;
					} else {
						$('.message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
					}
					
				}
				
				if (employeeJustEdited) {
					
					renderEmployee(editedElement);
					console.log('edited element', editedElement);

					let employeeDetails = JSON.stringify(editedElement);

					if (employeeDetailsVisibility == 0) {
						$('.employee-detail-fields').attr('style', 'visibility: visible');
						$('.message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
						employeeDetailsVisibility ++;
					} else {
						$('.message').attr('class', 'ui floating message');
						document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);
						document.getElementById('delete-employee-modal-btn').setAttribute('employee-details', employeeDetails)
					}
					
				}

				employeeJustCreated = false;
				employeeJustEdited = false;
				document.getElementById('search-box-icon').setAttribute('class', 'ui icon input');				
				

		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
		}
		
};

// ** OTHER FUNCTIONS **

// CLOSE MODAL

function closeModal(){	

	console.log('closeModal func run');

	document.getElementById('employee-modal-create-fields').reset();
	document.getElementById('employee-modal-edit-fields').reset();

	document.getElementById('employee-modal-view-fields').setAttribute('style','display: none');
	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: none');
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: none');
	document.getElementById('submit-create-employee').setAttribute('style','display: none');
	document.getElementById('submit-edit-employee').setAttribute('style', 'display: none');

	document.getElementById('employee-modal-view-fields').innerHTML = "";
	document.getElementById('employee-modal-create-fields').innerHTML = "";
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	document.getElementById('manage-depts-and-locs').innerHTML = "";

	//$(".employee-editable-modal-field").attr('readonly', 'readonly');
	//$('.employee-editable-modal-field').attr('style', 'border-color: black');

};

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

window.onload = (event) => {	
		
		$(document).ready(function () {
			
			document.getElementById('search-input').value = ""; 
			
			$('.ui.accordion').accordion();

			$('.ui.modal').modal({
				onHidden: function(){	
					console.log('close view employee modal');
					closeModal();
				}
			});

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

			$('#order-by-first-name-mobile').checkbox('attach events', '#order-by-first-name', 'check');
			$('#order-by-last-name-mobile').checkbox('attach events', '#order-by-last-name', 'check');

			$('#order-by-first-name').checkbox('attach events', '#order-by-first-name-mobile', 'check');
			$('#order-by-last-name').checkbox('attach events', '#order-by-last-name-mobile', 'check');		
			
			getAllEmployees();

			getAllDepartments();

			getAllLocations();

		});

}; //END OF WINDOW ON LOAD

// STUFF

//delete this when create-employee-btn working
$('#create-employee-orig').click(function(){
	
	createEmployeeModalContentORIGINAL();
	
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-create-employee').setAttribute('style', 'display: inline');
	
	$('.ui.modal.employee-details-modal').modal({
		
		title: 'Create Employee',
		closable: false,
		onDeny: function(){
			console.log('deny');
			//return false;
		},
		onApprove: function (){
		//document.getElementById('submit-create-employee').click();
		console.log('approve');
		},
		onHidden: function(){	
			console.log('close view employee modal');
			document.getElementById('employee-modal-create-fields').innerHTML = "";
			closeModal();
		}	
		}).modal('show');

	
});

$('#edit-employee-modal-btn').click(function(){
	
	$(".employee-editable-modal-field").removeAttr('readonly');
	$('.employee-editable-modal-field').attr('style', 'border-color: blue');
	
});

