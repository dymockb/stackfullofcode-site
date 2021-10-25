let employeeDetailsVisibility = 0;
let employeePropertiesObj = {};
let blankEmployeeObj = {};
let employeePropertiesStored;

let lastSearch = "";
let orderBy = 'lastName';

let locationsObj = {};
let departmentsObj = {};

let listOfLocations = [];
let listOfDepts = [];

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

function renderCheckboxes(checkboxItems, category){

	for (cbi = 0; cbi < checkboxItems.length; cbi ++) {
		let cbName = checkboxItems[cbi];
		let checkedStatus = createCheckbox(cbName, category, false).getAttribute('class').includes('checked');
		document.getElementById(`${category}-checkboxes`).appendChild(createCheckbox(cbName, category, false));
		document.getElementById(`${category}-checkboxes-mobile`).appendChild(createCheckbox(cbName, category, true));

		if(category == 'department') {
			activeDepartmentsObj[cbName] = checkedStatus;
		} else if (category == 'location') {
			activeLocationsObj[cbName] = checkedStatus;
		}
	}

}

function removeCheckBoxes(category){
	
	document.getElementById(`${category}-checkboxes`).innerHTML = '';
	document.getElementById(`${category}-checkboxes-mobile`).innerHTML = '';
	
};


function getAllDepartments(){
	$.ajax({
	url: "assets/php/getAllDepartments.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('getAllDepartments ',result);

			listOfDepts = [];
			
			for (let d = 0; d < result.data.length; d++) {
				departmentsObj[result.data[d].id] = result.data[d].name;
				if (!listOfDepts.includes(result.data[d].name)) {
					listOfDepts.push(result.data[d].name);
				}
			}

			listOfDepts.sort();

			countOfDepts = listOfDepts.length;
			countOfCheckedDepts = listOfDepts.length;

			renderCheckboxes(listOfDepts, 'department');

			departmentCheckboxFunctionality();

			departmentCheckboxFunctionalityMobile();

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
			
			listOfLocations = [];
			
			for (let l = 0; l < result.data.length; l++) {
				locationsObj[result.data[l].id] = result.data[l].name;
				if (!listOfLocations.includes(result.data[l].name)) {
					listOfLocations.push(result.data[l].name);
				}
			}

			listOfLocations.sort();

			countOfLocations = listOfLocations.length;
			countOfCheckedLocations = listOfLocations.length;

			renderCheckboxes(listOfLocations, 'location');

			locationCheckboxFunctionality();

			locationCheckboxFunctionalityMobile();
		
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

					otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj, true));
					
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
		
		document.getElementById('manage-depts-and-locs').setAttribute('style', 'display: block');
		document.getElementById('create-new-location-btn').setAttribute('style', 'display: inline');
	
		deptStringTemplate = 'departmentID-1';
		locStringTemplate = 'locationID-1';

		let buttonForModal = document.createElement('button')
		buttonForModal.setAttribute('class', 'ui button');
		buttonForModal.setAttribute('id', 'create-new-location-btn');
		buttonForModal.innerHTML = 'Add new location';

		$('.ui.modal.employee-details-modal').modal({

		title: `Manage Departments and Locations`,
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
		console.log('approve');
		},
		onHidden: function(){	
			console.log('close view employee modal');
			closeModal();
		}	
		}).modal('show');
		
	
});

$('#mobile-manage-cog').click(function (){

	$('#manage-depts-and-locs-btn').click();

});

$('#mobile-create-employee-btn').click(function (){

	$('#create-employee-btn').click();

});

//buttons on employee panel
$('#delete-employee-btn').click(function (){
	
	let employeeDetails = JSON.parse(document.getElementById('delete-employee-btn').getAttribute('employee-details'));

	$('#delete-employee-modal-btn').attr('style', 'display: inline');

	
 	$('#alert-modal').modal(
 		{
	 		title: '<i class="archive icon"></i>',
			content: `<div class="alert-modal-text">Delete this employee? <br> <h3> ${employeeDetails.firstName} ${employeeDetails.lastName} </h3></div>`,
 		}).modal('show');

	});

$('#edit-employee-fields-btn').click(function(){
	
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	
	let employeeDetails = JSON.parse(this.getAttribute('employee-details'));
	
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
	
	closeAlertModal();

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

	closeAlertModal();
	
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

$('#delete-department-modal-btn').click(function (){

	closeAlertModal();
	
	console.log(`delete deparment ${this.getAttribute('deptid')}`)
	
	let deleteDepartmentID = this.getAttribute('deptid');
	
	$.ajax({
	url: "assets/php/deleteDepartmentByID.php",
	type: "GET",
	dataType: "json",
	data: {
		departmentID: deleteDepartmentID
	},
	success: function (result) {
		
			console.log('deleteDept ',result);
			if (result['status'].description != 'dependency error') {
				console.log('refresh page');
				refreshPage();				
			}



	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
});

$('#alert-modal-no-btn').click(function(){

	closeAlertModal();

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
			title: '<i class="fas fa-user-edit"></i>',
			content: `<div class="alert-modal-text">Update this employee?</div>`,
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
	ruleThree['prompt'] = 'At least two characters are required.';

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
		console.log('new location submitted')
		
		let newLocationName;

		for (let e = 0; e < this.elements.length; e ++) {
	
			if (this.elements[e].tagName != 'BUTTON') {			

				console.log(`#new-location-form`, this.elements[e].value);
				newLocationName = this.elements[e].value;
				
			}

		}
		
		$.ajax({
		url: "assets/php/insertLocation.php",
		type: "GET",
		dataType: "json",
		data: {
			name: newLocationName
		},
		success: function (result) {
			
				console.log('new location result',result);

				refreshPage();

		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
		

	});

		let departmentRules = basicRules.slice();

		for (let r = 0 ; r < existingDepartmentNames.length; r ++) {
			let newRule = {}
			newRule['type'] = `notExactly[${existingDepartmentNames[r]}]`;
			newRule['prompt'] = 'That department already exists';
			departmentRules.push(newRule)
		}
		
	for (let f = 0; f < 1; f++) {
		
		$(`#departmentID-1-form`).form({
			fields: {
				name: {
					identifier: 'dept-rename',
					rules: departmentRules
				}
			}
		});
		
		$(`#submit-rename-departmentID-1-btn`).click(function(e){
			
			if ($(`#${depStringTemplate}-form`).form('validate form')) {
				$(`#${depStringTemplate}-form`).form('submit');
				$(`#${depStringTemplate}-form`).form('reset');
			}

		});


		$(`#departmentID-1-form`).submit(function(event){
			event.preventDefault();

			$(`#departmentID-1-form`).form('set defaults');
			
			$('#departmentID-1-accordion').click()	

			let updatedDeptName;
			let updatedDeptID;
			let updateDepartmentDataObj = {};

			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			
	
					console.log(`#${depStringTemplate}-form`, this.elements[e].value);
					updatedDeptName = this.elements[e].value;
					updatedDeptID = this.elements[e].getAttribute('deptID');

					$(`#input-departmentID-1-field`).attr('value', this.elements[e].value);
					$(`#input-departmentID-1-field`).attr('placeholder', this.elements[e].value);
					$(`#departmentID-1-title`).hide().html(this.elements[e].value).fadeIn(750); 

					}
				
			}	
			
			updateDepartmentDataObj['department'] = updatedDeptName;
			updateDepartmentDataObj['departmentID'] = updatedDeptID;
				
			console.log('update dept data obj', updateDepartmentDataObj);
				
				
				
				$.ajax({
				url: "assets/php/updateDepartment.php",
				type: "GET",
				dataType: "json",
				data: updateDepartmentDataObj,
				success: function (result) {
					
						console.log('updateDept ',result.data);

						refreshPage();

				},
				error: function (jqXHR, textStatus, errorThrown) {
						console.log('error');
						console.log(textStatus);
						console.log(errorThrown);
					},
				});

		});

		$(`#cancel-departmentID-1-btn`).click(function(e){

			console.log('cancel');
			
			$(`#departmentID-1-form`).form('reset');

			$('#departmentID-1-accordion').click();

		});

		$(`#rename-departmentID-1-btn`).click(function(e){

			$('#departmentID-1-trash-warning').attr('style', 'display: inline !important');
			$('#delete-departmentID-1-btn').attr('style', 'display: none');

			$('#departmentID-1-accordion').click()
			
			$(`#rename-departmentID-1-input-field`).attr('value','');
			
		});	

		$(`#delete-departmentID-1-btn`).click(function(e){
			
			document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: inline !important');
			document.getElementById('delete-department-modal-btn').setAttribute('deptid', `${this.getAttribute('deptid')}`);

			$('#alert-modal').modal(
				{
					title: '<i class="archive icon"></i>',
					content: `<div class="alert-modal-text">Delete this department? <h3> ${this.getAttribute('deptName')} </h3></div>`
				}).modal('show');

		});

		$(`#departmentID-1-trash-warning`).click(function(e){

			$('#alert-modal').modal(
				{
					title: '<i class="archive icon"></i>',
					content: `<div class="alert-modal-text">Cannot delete department. Remove all employees and try again.</div>`
				}).modal('show');

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
	
			if ($(`#locationID-1-new-dept-form`).form('validate form')) {
				$(`#locationID-1-new-dept-form`).form('submit');
				$(`#locationID-1-new-dept-form`).form('reset');
			}
			

		});

		$(`#locationID-1-new-dept-form`).submit(function(event){
			event.preventDefault();

			$('#locationID-1-new-dept-accordion-btn').click();

			let newDeptName;
			let locationID = document.getElementById('locationID-1-submit-new-dept-btn').getAttribute('locid');
			
			for (let e = 0; e < this.elements.length; e ++) {
		
				if (this.elements[e].tagName != 'BUTTON') {			
	
					console.log(`#locationID-1-new-dept-form`, this.elements[e].value);
					newDeptName = this.elements[e].value;
					
				}
	
			}
			
			let newDeptObj = {};
			newDeptObj['name'] = newDeptName;
			newDeptObj['locationID'] = locationID;
			
			$.ajax({
			url: "assets/php/insertDepartment.php",
			type: "GET",
			dataType: "json",
			data: newDeptObj,
			success: function (result) {
				
					console.log('new dept result',result);

					refreshPage();

			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			

		});

		$(`#locationID-1-cancel-new-dept-btn`).click(function(e){

			$(`#locationID-1-new-dept-form`).form('reset');
			$('#locationID-1-new-dept-accordion-btn').click();

		});

	}

}

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

	}
	
};

// CREATE CHECKBOXES
function createCheckbox(checkboxName, category, mobile){
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
					
				if (locationDropDownClicked == 0) {
					
					locationDropDownClicked ++;
				}
				
			});

			}
	}

	return listOfIdentifiers;
}

function createEmployeeModalContent(editOrCreate, detailsForEditForm){
	
	
	let listOfLocationsUpdated = [];	
	
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
									
			}); 	

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
};

// ** SET FUNCTIONALITY **

// CHECKBOXES
function departmentCheckboxFunctionality() {
	
		function setSelectAllCheckBox(){
			if (countOfCheckedDepts < countOfDepts) {
				console.log('countofcheckeddepts',countOfCheckedDepts);
				if (countOfCheckedDepts == 0) {
				 $('#select-none-departments').checkbox('set checked');
				 $('#select-none-departments-mobile').checkbox('set checked');
				} else {
				 $('#select-none-departments').checkbox('set unchecked');
				 $('#select-none-departments-mobile').checkbox('set unchecked');					
				}

				$('#select-all-departments').checkbox('set unchecked');
				$('#select-all-departments-mobile').checkbox('set unchecked');

			} else if (countOfCheckedDepts == countOfDepts) {
				$('#select-all-departments').checkbox('set checked');
				$('#select-none-departments').checkbox('set unchecked');

				$('#select-all-departments-mobile').checkbox('set checked');
				$('#select-none-departments-mobile').checkbox('set unchecked');
			}
		}

		$('.department-checkbox').checkbox({
			onChecked: function(){
				activeDepartmentsObj[this.name] = this.checked;
				countOfCheckedDepts ++;
				
				if ((countOfCheckedDepts < countOfDepts) && (countOfCheckedDepts > 0)){
					howManyDeptssSelected = 'Some';
				}
				
				setSelectAllCheckBox();
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
				
				setSelectAllCheckBox();
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

				setSelectAllCheckBox();

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
				setSelectAllCheckBox();
				if (howManyLocationsSelected == 'None') {
					if (countOfCheckedLocations == 0) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					runSearch(orderBy,lastSearch);
				}

			},				
		});	
		
		$('#select-none-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'None';
			  $('.location-checkbox').checkbox('uncheck');
			},
		});

		$('#select-all-locations').checkbox({
			onChecked: function(){
				howManyLocationsSelected = 'All';
			  $('.location-checkbox').checkbox('check');
			},
		});
		

};

function departmentCheckboxFunctionalityMobile() {
	
	function setSelectAllCheckBox(){
		if (countOfCheckedDepts < countOfDepts) {
			console.log('countofcheckeddepts',countOfCheckedDepts);
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
			
			if ((countOfCheckedDepts < countOfDepts) && (countOfCheckedDepts > 0)){
				howManyDeptssSelected = 'Some';
			}
			
			setSelectAllCheckBox();
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
		
			setSelectAllCheckBox();
			if (howManyDeptsSelected == 'None') {
				if (countOfCheckedDepts == 0) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				runSearch(orderBy,lastSearch);
			}

		},				
	});
	
	$('#select-none-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'None';
			$('.department-mobile-checkbox').checkbox('uncheck');
		},
	});

	$('#select-all-departments-mobile').checkbox({
		onChecked: function(){
			howManyDeptsSelected = 'All';
			$('.department-mobile-checkbox').checkbox('check');
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

			activeLocationsObj[this.name] = this.checked;
			countOfCheckedLocations ++;
			
			if ((countOfCheckedLocations < countOfLocations) && (countOfCheckedLocations > 0)){
				howManyLocationsSelected = 'Some';
			}

			setSelectAllCheckBox();

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
			
			setSelectAllCheckBox();
			if (howManyLocationsSelected == 'None') {
				if (countOfCheckedLocations == 0) {
					runSearch(orderBy, lastSearch);						
				}
			} else {
				runSearch(orderBy,lastSearch);
			}

		},				
	});
	

	$('#select-none-locations-mobile').checkbox({
		onChecked: function(){
			howManyLocationsSelected = 'None';
			
			$('.location-mobile-checkbox').checkbox('uncheck');
		},
	});

	$('#select-all-locations-mobile').checkbox({
		onChecked: function(){
			howManyLocationsSelected = 'All';
			
			$('.location-mobile-checkbox').checkbox('check');
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
		},150);

		$('#edit-employee-mobile-modal-button').click(function(e){
			e.preventDefault()

			document.getElementById('submit-edit-employee').setAttribute('style', 'display: inline');

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

			otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj, true));

		}
		
	} else {

	$.ajax({
		
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
	document.getElementById('create-new-location-btn').setAttribute('style', 'display: none');


	document.getElementById('employee-modal-view-fields').innerHTML = "";
	document.getElementById('employee-modal-create-fields').innerHTML = "";
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	//document.getElementById('manage-depts-and-locs').innerHTML = "";


};

function closeAlertModal(){

	document.getElementById('delete-employee-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('update-employee-modal-btn').setAttribute('style', 'display: none');
	document.getElementById('delete-department-modal-btn').setAttribute('style', 'display: none');

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
	
	removeCheckBoxes('department');
	removeCheckBoxes('location');
	
	getAllEmployees();

	getAllDepartments();

	getAllLocations();
	
	runSearch(orderBy, lastSearch);
	
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

			attachRadioEvents();	
			
			getAllEmployees();

			getAllDepartments();

			getAllLocations();


		});

}; //END OF WINDOW ON LOAD