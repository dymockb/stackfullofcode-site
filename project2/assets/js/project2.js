let employeeDetailsVisibility = 0;
let employeeModalCount = 0;
let employeePropertiesObj = {};
let blankEmployeeObj = {};
let searchField = document.getElementById('search-input');
let lastSearch = "";
let orderBy = 'lastName';

let departmentsObj = {};
let countOfDepts;
let countOfCheckedDepts;
let howManyDeptsSelected = 'All';

let locationsObj = {};
let countOfLocations;
let countOfCheckedLocations;
let howManyLocationsSelected = 'All';

let locationsDropDownObj = {};
let departmentsDropDownObj = {};

let locationDropDownHolder = [];

let	dropDownClicked = 0;

let maxNewEmployeeID = 0;
let maxEmployeeID = 0;
let finalMaxID;

let employeeJustCreated = false;

let newestElement;

let deleteAttempts = 0;





function logSubmit(event) {
  console.log(`Form Submitted! Time stamp: ${event.timeStamp}`);
  console.log('event log ', event);
	event.preventDefault();
}

//const form = document.getElementById('deleteDeptForm');
//form.addEventListener('submit', logSubmit);

$('#insertDeptForm').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    let form = $(this);		
		let viewArr = form.serializeArray();
    let view = {};

		for (let i in viewArr) {
			view[viewArr[i].name] = viewArr[i].value;
		}
		
		console.log('view ', view);
				
		$.ajax({
      type: form.attr('method'),
      url: 'libs/php/insertDepartment.php',
			dataType: 'json',
      data: view,
			success: function (result) {
				
					console.log('insertDept form ',result);
			
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			
			
});

$('#getDeptByIdForm').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    let form = $(this);		
		let viewArr = form.serializeArray();
    let view = {};

		for (let i in viewArr) {
			view[viewArr[i].name] = viewArr[i].value;
		}
		
		console.log('view ', view);
		
		// manually trigger form somewhere else
		//	$(function() {
		//	$('form.my_form').trigger('submit');
		//  });
		
		
		$.ajax({
      type: form.attr('method'),
      url: 'libs/php/getDepartmentByID.php',
			dataType: 'json',
      data: view,
			success: function (result) {
					
					if (result.data == []) {
						console.log('dept does not exist');
					}
				
					console.log('get Dept by ID ',result);
					$('#getDepartmentByID').html(JSON.stringify(result, null, 2));
			
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			
			
});

$('#getPersonnelByIdForm').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
		console.log('event ',event);
    let form = $(this);		
		let viewArr = form.serializeArray();
    let view = {};

		for (let i in viewArr) {
			view[viewArr[i].name] = viewArr[i].value;
		}
		
		console.log('view ', view);
				
		$.ajax({
      type: form.attr('method'),
      url: 'libs/php/getPersonnelByID.php',
			dataType: 'json',
      data: view,
			success: function (result) {
				
					console.log('get personnel by ID ',result);
					$('#getPersonnelByID').html(JSON.stringify(result, null, 2));
			
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			
			
});

$('#deleteDeptForm').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
		console.log('event ',event);
    let form = $(this);		
		let viewArr = form.serializeArray();
    let view = {};

		for (let i in viewArr) {
			view[viewArr[i].name] = viewArr[i].value;
		}
		
		console.log('view ', view);
		
		// manually trigger form somewhere else
		//	$(function() {
		//	$('form.my_form').trigger('submit');
		//  });
		
		
		$.ajax({
      type: form.attr('method'),
      url: 'libs/php/deleteDepartmentByID.php',
			dataType: 'json',
      data: view,
			success: function (result) {
				
					console.log('form ',result);
			
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log('error');
					console.log(textStatus);
					console.log(errorThrown);
				},
			});
			
			
});

$('#getAllDeptsBtn').click(function(){
	getAllDepartments();
});

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

searchField.addEventListener('input', delay(function () {
  
	console.log('search term:', this.value.toLowerCase());
	
	console.log('order by: ', orderBy);

	let searchTerm = this.value.toLowerCase();
	lastSearch = searchTerm;
	
	runSearch(orderBy, searchTerm);
	
}, 500));

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
	employeeModalBtn.setAttribute('id', 'modalBtn');
	employeeModalBtn.innerHTML = 'View Details';
	
	/*
	let employeeBtn = document.createElement('div');
	employeeBtn.setAttribute('class', 'employee-btn ui button');
	employeeBtn.setAttribute('id', 'modalBtn');
	employeeBtn.innerHTML = 'View';
	*/
	
	//return [employeeH4, employeeModalBtn, employeeBtn];
	return [employeeH4, employeeModalBtn];
	
};

function appendEmployee(elementToAppend, employeeElements){
	elementToAppend.innerHTML = '';
	elementToAppend.appendChild(employeeElements[0]);
	elementToAppend.appendChild(employeeElements[1]);
	//elementToAppend.appendChild(employeeElements[2]);	
}

function createEmployeeRow(employeePropertiesObj) {

	
	let setMax = false;
	if (employeePropertiesObj.id == finalMaxID) {

		//invisibleElement.parentNode.setAttribute('id', 'newest-employee');
		//invisibleElement.children[1].setAttribute('id', 'newest-employee-btn');
		setMax = true;
		console.log('THIS IS THE NEWEST EMPLOYEE',employeePropertiesObj);
		newestElement = employeePropertiesObj;
	}

	let tableRow = document.createElement('tr');
	tableRow.setAttribute('class', 'result-row');
	if (employeePropertiesObj.firstName == 'First name') {
	  tableRow.setAttribute('style', 'visibility: hidden');
		//tableRow.setAttribute('class', 'result-row hidden-field');
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
	//tableData.appendChild(employeeElements[2]);
	
	tableRow.appendChild(tableData);
	return tableRow;
}


function renderEmployee(employeeProperties){
	
	//document.getElementById(`employee-segment`).reset();##
	
	for (const [key, value] of Object.entries(employeeProperties)) {
					
		document.getElementById(`employee-${key}-field`).innerHTML = value;

	}
	
}


function createCheckbox (checkboxName, department){
	let checkboxDiv = document.createElement('div');
	checkboxDiv.setAttribute('class', `ui checkbox ${department}-checkbox checked`);
	//checkboxDiv.setAttribute('class', 'ui checkbox');

	let checkboxInput = document.createElement('input');
	checkboxInput.setAttribute('type', 'checkbox');
	checkboxInput.setAttribute('name', `${checkboxName}`);
	checkboxInput.setAttribute('checked', "");

	let checkboxLabel =document.createElement('label');
	checkboxLabel.innerHTML = `${checkboxName}`;

	checkboxDiv.appendChild(checkboxInput);
	checkboxDiv.appendChild(checkboxLabel);

	return checkboxDiv;

}

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

		// this was overlapping with radio buttons create distinct classes?
		//$('.ui.checkbox:not(.active-radio-checkbox)').checkbox({
		$('.department-checkbox').checkbox({
			onChecked: function(){
				departmentsObj[this.name] = this.checked;
				countOfCheckedDepts ++;
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
				departmentsObj[this.name] = this.checked;
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
		
		//$('.department-checkbox').checkbox('attach events', '#select-all-departments', 'check');

		//$('.department-checkbox').checkbox('attach events', '#select-none-departments', 'uncheck');
		
		
		$('#select-none-departments').checkbox({
			onChecked: function(){
				howManyDeptsSelected = 'None';
			  //$('.department-checkbox').checkbox('set checked');
			  $('.department-checkbox').checkbox('uncheck');
			},
		});

		$('#select-all-departments').checkbox({
			onChecked: function(){
				howManyDeptsSelected = 'All';
			  //$('.department-checkbox').checkbox('set checked');
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

		// this was overlapping with radio buttons create distinct classes?
		//$('.ui.checkbox:not(.active-radio-checkbox)').checkbox({
		$('.location-checkbox').checkbox({
			onChecked: function(){
				locationsObj[this.name] = this.checked;
				countOfCheckedLocations ++;
				setSelectAllCheckBox(countOfLocations);
				if (howManyLocationsSelected == 'All') {
					if (countOfCheckedLocations == countOfLocations) {
						runSearch(orderBy, lastSearch);						
					}
				} else {
					console.log('runserach');
					runSearch(orderBy,lastSearch);
				}
				
			},
			onUnchecked: function(){
				locationsObj[this.name] = this.checked;
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


function createEmployeeModalContentORIGINAL(){
	
	let newEmployeeFieldsObj = {};
	let listOfLocationsUpdated = [];	
	let listOfDepartmentsUpdated = [];
	
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('all locations create employee ',result.data);
			
			//let locationsChangeObj = {};
			
			
			for (let l = 0; l < result.data.length; l ++) {
				listOfLocationsUpdated.push(result.data[l].name)
				//locationsChangeObj[result.data[l].name] = result.data[l].id;
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
			//console.log('locationchangeobj', locationsChangeObj);
			
			for (const [key, value] of Object.entries(newEmployeeFieldsObj)) {
				
				let inputField;
				//if (key == 'locationName' || key == 'department'){
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
							//locationChoice.setAttribute('placeholder-id', locationsChangeObj[listOfLocationsUpdated[lc]]);
							locationChoice.setAttribute('placeholder-id', locationsDropDownObj[listOfLocationsUpdated[lc]]);
							inputField.appendChild(locationChoice);
							
						}

					} 
					
					
					/*
					
					else if (key == 'department') {
						
						inputField = document.createElement('select');
						inputField.setAttribute('required', '');
						inputField.setAttribute('class', 'ui fluid dropdown');
						inputField.setAttribute('id', 'department-dropdown');
						
						let departmentSelectOption = document.createElement('option');
						departmentSelectOption.setAttribute('disabled', '');
						departmentSelectOption.setAttribute('value', '');
						departmentSelectOption.setAttribute('selected', '');
						departmentSelectOption.innerHTML = 'choose a department';

						let departmentChoice = document.createElement('option');
						departmentChoice.innerHTML = 'choice';

						inputField.appendChild(departmentSelectOption);
						inputField.appendChild(departmentChoice);

					}
					
					*/
					
					
				//} else {
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
					document.getElementById('employee-modal-create-fields').appendChild(newEmployeeFieldsObj[key]);
				}
			
			}	

			for (const [key, value] of Object.entries(newEmployeeFieldsObj)) {
				
				if (key != 'firstName') {
						document.getElementById('employee-modal-create-fields').appendChild(newEmployeeFieldsObj[key]);
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
								document.getElementById('employee-modal-create-fields').appendChild(inputField);
						
						

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


function buildForm(listOfNames, listOfIDs, editOrCreate, detailsForEditForm){	
//function buildForm(listOfObjs, locationOnly){	
	
	console.log('build form edit or create', editOrCreate);
	
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
	selectionDropdown.setAttribute('class', 'ui selection dropdown');
	
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

	let dropdownOptions = ['option1', 'option2', 'option3'];
	
	function createInputField (mainTitle, data, fieldName) {
		
		let outerNode = requiredField.cloneNode(true);
		let heading = label.cloneNode(true);
		heading.innerHTML = mainTitle;
		
		let input = inputField.cloneNode(true);
		input.setAttribute('required', '');
		
		if (editOrCreate == 'edit'){
			input.setAttribute('value', data);
		}
		
		input.setAttribute('fieldname', fieldName);
		input.setAttribute('type', 'text');
		input.setAttribute('placeholder', data);
		
		outerNode.appendChild(heading);
		outerNode.appendChild(input);
		
		return outerNode
	}
	
	function createDropDown(mainTitle, placeholder, listOfNames, listOfIDs, fieldName, fieldID, dropdownType){
		
		console.log('ddt', dropdownType);
		let outerNode = requiredField.cloneNode(true);
		if (editOrCreate == 'create') {
			if (mainTitle.includes('epartment')) {
				outerNode.setAttribute('class', 'required disabled field');
				outerNode.setAttribute('id', 'disabled-departments-dropdown')
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
			console.log('make edit dropdown');
				if (mainTitle.includes('epartment')) {
					console.log('dept edit value', detailsForEditForm.departmentID);
					input.setAttribute('value', detailsForEditForm.departmentID);
				} else if (mainTitle.includes('ocation')) {
					console.log('loc edit value', detailsForEditForm.locationID);
					input.setAttribute('value', detailsForEditForm.locationID);
				}
			}
		
		let menu = menuDiv.cloneNode(true);
		menu.setAttribute('id', dropdownType + '-menu');
		
		console.log('listofnames', listOfNames);
		
		for (let loc = 0; loc < listOfNames.length; loc ++){
			
			let oneOption = dataValue.cloneNode(true);
			let outputValue = listOfIDs[loc];
			//let outputValue = `{${fieldID}: ${value}, ${fieldName}: ${key}}`;
			oneOption.innerHTML = listOfNames[loc];
			oneOption.setAttribute('data-value', outputValue);
			menu.appendChild(oneOption);
			
		}
		
		/*
		for (const [key, value] of Object.entries(optionsObj)) {
		
			let oneOption = dataValue.cloneNode(true);
			let outputValue = value;
			//let outputValue = `{${fieldID}: ${value}, ${fieldName}: ${key}}`;
			oneOption.innerHTML = key;
			oneOption.setAttribute('data-value', outputValue);
			menu.appendChild(oneOption);

		}
		*/
		if(editOrCreate == 'create'){
			input.setAttribute('value', '');
		}
		input.setAttribute('fieldname', fieldID);
		input.setAttribute('fieldID', fieldID);
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'category');

		if (editOrCreate == 'create'){
			selected.innerHTML = placeholder;
		} else {
				if (mainTitle.includes('epartment')) {
					selected.innerHTML = `${detailsForEditForm.department}`;
				} else if (mainTitle.includes('ocation')) {
					selected.innerHTML = `${detailsForEditForm.locationName}`;
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

	//$('.ui.selection.dropdown').attr('id', 'location-dropdown');
	
	let depNames = [];
	let depIDs = [];
	twoCategories.appendChild(createDropDown('Department', 'Select a department', depNames, depIDs, 'department', 'departmentID', 'department-dropdown'));
		
	let nameCategories = twoFields.cloneNode(true);
	
	if (editOrCreate == 'create') {
		nameCategories.appendChild(createInputField('First Name', 'First Name', 'firstName'));
		nameCategories.appendChild(createInputField('Last Name', 'Last Name', 'lastName'));
	} else {
		nameCategories.appendChild(createInputField('First Name', `${detailsForEditForm.firstName}`, 'firstName'));
		nameCategories.appendChild(createInputField('Last Name', `${detailsForEditForm.lastName}`, 'lastName'));
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
		jobTitleInput.setAttribute('placeholder', `${detailsForEditForm.jobTitle}`);
		jobTitleInput.setAttribute('value', `${detailsForEditForm.jobTitle}`);
	}
	
	jobTitleField.appendChild(jobTitleHeading);
	jobTitleField.appendChild(jobTitleInput);
	
	let emailField = requiredField.cloneNode(true);
	let emailHeading = label.cloneNode(true);
	emailHeading.innerHTML = 'Email'
	
	let emailInput = inputField.cloneNode(true);
	emailInput.setAttribute('fieldname', 'email');
	emailInput.setAttribute('type', 'email');
	emailInput.setAttribute('required', '');
	if (editOrCreate == 'create') {
		emailInput.setAttribute('placeholder', 'employee@company.com');
	} else {
		emailInput.setAttribute('placeholder', `${detailsForEditForm.email}`);
		emailInput.setAttribute('value', `${detailsForEditForm.email}`);		
	}
	
	emailField.appendChild(emailHeading);
	emailField.appendChild(emailInput);
	
	
	uiForm.appendChild(twoCategories);
	uiForm.appendChild(nameCategories);
	uiForm.appendChild(jobTitleField);
	uiForm.appendChild(emailField);
	
	//document.getElementById('employee-modal-create-fields').appendChild(uiForm);
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

				//document.getElementById('department-dropdown-menu').innerHTML = "";
			
				console.log('departments for edit ',result.data);

				
				for (let dc = 0; dc < result.data.length; dc ++ ) {

					let oneOption = document.createElement('div');
					oneOption.setAttribute('class', 'item');

					let outputValue = result.data[dc].id;
					oneOption.innerHTML = result.data[dc].name;
					oneOption.setAttribute('data-value', outputValue);
					
					if (detailsForEditForm.departmentID != outputValue) {
						document.getElementById('department-dropdown-menu').appendChild(oneOption);
					}

					
				}

				//$('.selection.dropdown').dropdown();								
				
				//document.getElementById('department-dropdown-placeholder-text').innerHTML = 'Select a department';
				//document.getElementById('disabled-departments-dropdown').setAttribute('class', 'required field');
				
				
				if (dropDownClicked == 0) {
					$('.selection.dropdown').click(function (){
						console.log('dropdown clicked', dropDownClicked);
						$('.selection.dropdown').dropdown();		
					});
					dropDownClicked ++;
				}
				
		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
	}
	
	if (dropDownClicked == 0) {
		$('.selection.dropdown').click(function (){
			console.log('dropdown clicked', dropDownClicked);
			$('.selection.dropdown').dropdown();		
		});
		dropDownClicked ++;
	}

}

function createEmployeeModalContent(editOrCreate, detailsForEditForm){
	
	console.log('editOrCreate', editOrCreate);
	
	let newEmployeeFieldsObj = {};
	let listOfLocationsUpdated = [];	
	let listOfDepartmentsUpdated = [];
	let listOfLocationIDs = [];
	
	
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('all locations create employee ',result.data);
			
			for (let loc = 0; loc < result.data.length; loc ++){
				listOfLocationsUpdated.push(result.data[loc].name);
				listOfLocationIDs.push(result.data[loc].id);
			}
			
			buildForm(listOfLocationsUpdated, listOfLocationIDs, editOrCreate, detailsForEditForm);
			
			//buildForm(result.data, locationOnly = true);
			
			let locationDropDown = document.getElementById('location-dropdown');
			
			locationDropDown.addEventListener('change', function(e){

						console.log('location changed');
						
						$.ajax({
						url: "assets/php/departmentsChange.php",
						type: "GET",
						dataType: "json",
						data: {
							locationID: e.target.value
						},
						success: function (result) {

								document.getElementById('department-dropdown-menu').innerHTML = "";
							
								console.log('departments change ',result.data);

								for (let dc = 0; dc < result.data.length; dc ++ ) {

									let oneOption = document.createElement('div');
									oneOption.setAttribute('class', 'item');

									let outputValue = result.data[dc].id;
									oneOption.innerHTML = result.data[dc].name;
									oneOption.setAttribute('data-value', outputValue);
									
									document.getElementById('department-dropdown-menu').appendChild(oneOption);
									

									
								}

								$('.selection.dropdown').dropdown();								
								
								document.getElementById('department-dropdown-placeholder-text').innerHTML = 'Select a department';
								if (editOrCreate == 'create') {
									document.getElementById('disabled-departments-dropdown').setAttribute('class', 'required field');
								}
						},
						error: function (jqXHR, textStatus, errorThrown) {
								console.log('error');
								console.log(textStatus);
								console.log(errorThrown);
							},
						});
									
			}); // end of event listener
			
			locationDropDownHolder.push(locationDropDown);
			

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
};


function editEmployeeModalContent(){
	
	let newEmployeeFieldsObj = {};
	let listOfLocationsUpdated = [];	
	let listOfDepartmentsUpdated = [];
	
	$.ajax({
	url: "assets/php/getAllLocations.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('all locations create employee ',result.data);
			
			//let locationsChangeObj = {};
			
			
			for (let l = 0; l < result.data.length; l ++) {
				listOfLocationsUpdated.push(result.data[l].name)
				//locationsChangeObj[result.data[l].name] = result.data[l].id;
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
			//console.log('locationchangeobj', locationsChangeObj);
			
			for (const [key, value] of Object.entries(newEmployeeFieldsObj)) {
				
				let inputField;
				//if (key == 'locationName' || key == 'department'){
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
							//locationChoice.setAttribute('placeholder-id', locationsChangeObj[listOfLocationsUpdated[lc]]);
							locationChoice.setAttribute('placeholder-id', locationsDropDownObj[listOfLocationsUpdated[lc]]);
							inputField.appendChild(locationChoice);
							
						}

					} 
					
					
					/*
					
					else if (key == 'department') {
						
						inputField = document.createElement('select');
						inputField.setAttribute('required', '');
						inputField.setAttribute('class', 'ui fluid dropdown');
						inputField.setAttribute('id', 'department-dropdown');
						
						let departmentSelectOption = document.createElement('option');
						departmentSelectOption.setAttribute('disabled', '');
						departmentSelectOption.setAttribute('value', '');
						departmentSelectOption.setAttribute('selected', '');
						departmentSelectOption.innerHTML = 'choose a department';

						let departmentChoice = document.createElement('option');
						departmentChoice.innerHTML = 'choice';

						inputField.appendChild(departmentSelectOption);
						inputField.appendChild(departmentChoice);

					}
					
					*/
					
					
				//} else {
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

$('#delete-employee-btn').click(function (){
	console.log('delete?');
	
	let employeeDetails = JSON.parse(document.getElementById('delete-employee-btn').getAttribute('employee-details'));
	//let employeeDetails = JSON.parse(this.getAttribute('employee-details'));
	//console.log(JSON.parse(this.getAttribute('employee-details')));
	$('#delete-employee-modal-btn').attr('style', 'display: inline')
	
	/*
	$('.ui.modal').modal('alert',{
   title: 'Are you sure you want to delete this employee?',
   content: 'I love Fomantic-UI',
   handler: function() {
     $('body').toast({message:'Great!'});
   }
 });
*/
	
	//$('#delete-employee-alert-modal').modal({
  //title: 'Are you sure you want to delete this employee?',
  // content: `${employeeDetails.firstName} ${employeeDetails.lastName}`,	
  //})
 
 //$('.ui.small.basic.test.modal').modal('show');
 $('#delete-employee-alert').modal(
 {
	 title: '<i class="archive icon"></i>',
	 content: `Delete this employee?  ${employeeDetails.firstName} ${employeeDetails.lastName}`
 }
 ).modal('show');
	
	
	/*
	$('.ui.modal').modal({
   title: 'Are you sure you want to delete this employee?',
   content: `${employeeDetails.firstName} ${employeeDetails.lastName}`,	
 }).modal('show');
	*/

 
});

$('#delete-employee-modal-btn').click(function (){
	
	console.log(JSON.parse(this.getAttribute('employee-details')));
	
	let employeeID = JSON.parse(this.getAttribute('employee-details')).id;
	
	$.ajax({
	url: "assets/php/deleteEmployeeByID.php",
	type: "GET",
	dataType: "json",
	data: {
		id: employeeID
	},
	success: function (result) {
		
		console.log('delete employee result',result);
		
		runSearch(orderBy, lastSearch);
		console.log('pause')
		let deletedEmployeeTimer = setTimeout(function () {
			document.getElementById('close-panel-icon').click();	
			console.log('done');
			clearTimeout(deletedEmployeeTimer);
		
		}, 1000);


	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	
});

function viewDetailsBtnFunctionality(){
	
	$('.employee-modal-btn').click(function(event){	
		
		//employeePropertiesObj = {};

		console.log('bla');

		let employeeProperties = JSON.parse($($(this).context.previousSibling.children[1]).attr('employee-properties'));
		let employeeDetails = $($(this).context.previousSibling.children[1]).attr('employee-properties');
				
		for (const [key, value] of Object.entries(employeeProperties)) {

			//document.getElementById(`employee-${key}-modal`).setAttribute('value',value);
			employeePropertiesObj[key] = value;
			
		}

		/*

		$('#employee-details-modal').modal(
			{
				//onHidden: function(){console.log('close')}
				onHidden: function(){
					console.log('close view employee modal');
					closeModal()
					}
			});

		$('').modal();
		*/
		document.getElementById('employee-modal-view-fields').setAttribute('style','display: inherit');
		document.getElementById('close-employee-modal').setAttribute('style','display: inline');
			
		//$('.ui.modal').modal('show');
		//$('.ui.modal.employee-details-modal').modal('show');
		
		$('.ui.modal.employee-details-modal').modal({
		title: 'Employee Details',
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
			//document.getElementById('employee-modal-create-fields').innerHTML = "";
			closeModal();
		}	
	}).modal('show');
		
		
	
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


//original edit employee button click - KEEP
$('#edit-employee-fields-btn').click(function(){
	
	document.getElementById('employee-modal-edit-fields').innerHTML = "";
	
	let employeeDetails = JSON.parse(this.getAttribute('employee-details'));

	console.log(employeeDetails);
	
	employeeDetails['jobTitle'] = 'TBC';
	
	dropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'edit', employeeDetails);	
	
	//createEmployeeModalContent(editOrCreate = 'create')
				
	for (const [key, value] of Object.entries(employeeDetails)) {

		//document.getElementById(`employee-${key}-modal`).setAttribute('value',value);
				
	}

	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-edit-employee').setAttribute('style','display: inline');

	//$('.selection.dropdown')
	//.dropdown();
				
	//document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails);
	//document.getElementById('delete-employee-btn').setAttribute('employee-details', employeeDetails);

	
	//$('.ui.modal').modal('show');
	$('.ui.modal.employee-details-modal').modal({
		title: 'Edit Employee',
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
			//document.getElementById('employee-modal-create-fields').innerHTML = "";
			closeModal();
		}	
	}).modal('show');

	// to set the fields to not read-only I think
	//$('#edit-employee-modal-btn').click();
	
	//$(".employee-editable-field").removeAttr('readonly');
	//$('.employee-editable-field').attr('style', 'border-color: blue');

});



/* // Another version, not needed?
$('#edit-employee-fields-btn').click(function(){
	
	
	editEmployeeModalContent();
	
	document.getElementById('employee-modal-view-fields').setAttribute('style','display: inherit');
	document.getElementById('submit-edit-employee').setAttribute('style', 'display: inline');

	let editEmployeeForm = document.getElementById('employee-modal-view-fields');
	
	editEmployeeForm.addEventListener( "submit", function ( event ) {
	
    event.preventDefault();

		//let FD = new FormData (createEmployeeForm);
    //sendData();
		
		//console.log('submitted', FD.values);

		console.log('elements', editEmployeeForm.elements);
		
		if (editEmployeeForm.elements) {
			//document.getElementById('submit-create-employee').setAttribute('class', 'ui primary approve button');
			//document.getElementById('submit-create-employee').setAttribute('style', 'display: inline');
			document.getElementById('close-employee-modal').click();
			//document.getElementById('employee-modal-create-fields').innerHTML = "";
			//document.getElementById('try-to-submit').setAttribute('style', 'display: none');
		}
		
		editEmployeeDataObj = {
			firstName: '',
			lastName: '',
			jobTitle: '',
			email: '',
			departmentID: '',
			locationName: '',
			locationID: '',
			department: '',
			id: ''
	}
		console.log('LOCATIONS OBJ', locationsObj);
		
		for (let e = 0; e < editEmployeeForm.elements.length; e ++) {
		
			if (editEmployeeForm.elements[e].tagName == 'INPUT') {
				console.log(editEmployeeForm.elements[e].placeholder, editEmployeeForm.elements[e].value);
				if (editEmployeeForm.elements[e].value) {
				editEmployeeDataObj[editEmployeeForm.elements[e].placeholder] = editEmployeeForm.elements[e].value;
				}
			} else if (editEmployeeForm.elements[e].tagName == 'SELECT'){
				
					if (editEmployeeForm.elements[e].id == 'location-dropdown') {

						console.log('location dropdown value', editEmployeeForm.elements[e].value);
						editEmployeeDataObj['locationName'] = editEmployeeForm.elements[e].value;
						editEmployeeDataObj['locationID'] = locationsDropDownObj[editEmployeeForm.elements[e].value];
				
					} else if (createEmployeeForm.elements[e].id == 'department-dropdown'){
						
						editEmployeeDataObj['departmentID'] = departmentsDropDownObj[editEmployeeForm.elements[e].value];
						editEmployeeDataObj['department'] = editEmployeeForm.elements[e].value;
					}
				
				
				}

		}
		
		console.log(editEmployeeDataObj);
		
		$.ajax({
		url: "assets/php/insertEmployee.php",
		type: "GET",
		dataType: "json",
		data: createEmployeeDataObj,
		success: function (result) {
			
				console.log('insertEmployee ',result.data);
				console.log('orderby', orderBy, 'lastSearch', lastSearch);
				runSearch(orderBy,'');

		},
		error: function (jqXHR, textStatus, errorThrown) {
				console.log('error');
				console.log(textStatus);
				console.log(errorThrown);
			},
		});
		
		
			
	});
	

	//$('#employee-details-modal').modal({
	$('.ui.modal.employee-details-modal').modal({
		
		title: 'Edit Employee',
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

*/

let editEmployeeForm = document.getElementById('employee-modal-edit-fields');

editEmployeeForm.addEventListener("submit", function ( event ) {

	event.preventDefault();
	
	console.log('edit employee form submitted');
	
	//document.getElementById('close-employee-modal').click();

	console.log('elements', editEmployeeForm.elements);
	
	if (editEmployeeForm.elements) {

			document.getElementById('close-employee-modal').click();

		}
	
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
	//console.log('LOCATIONS OBJ', locationsObj);
	
	for (let e = 0; e < editEmployeeForm.elements.length; e ++) {
	
		if (editEmployeeForm.elements[e].tagName != 'BUTTON') {			
			
			//console.log('element', createEmployeeForm.elements[e], 'value', createEmployeeForm.elements[e].value);
		
			editEmployeeDataObj[editEmployeeForm.elements[e].getAttribute('fieldname')] = editEmployeeForm.elements[e].value;
			
		}

	}
	
	console.log(editEmployeeDataObj);
	
	/*
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
	
	*/
	
	
	/*
	for (let elem = 0; elem < editEmployeeForm.elements.length; elem ++){
		
		if (editEmployeeForm.elements[elem].tagName != 'BUTTON') {
		console.log(editEmployeeForm.elements[elem])
		console.log(editEmployeeForm.elements[elem].getAttribute('fieldname'), editEmployeeForm.elements[elem].value);
		}	
	}
	*/
	
	
	/*
	if (editEmployeeForm.elements) {

		document.getElementById('close-employee-modal').click();

	}
	
	createEmployeeDataObj = {
		firstName: '',
		lastName: '',
		jobTitle: '',
		email: '',
		departmentID: '',
		locationName: '',
		locationID: '',
		department: '',
		id: ''
}
	console.log('LOCATIONS OBJ', locationsObj);
	
	for (let e = 0; e < createEmployeeForm.elements.length; e ++) {
	
		if (createEmployeeForm.elements[e].tagName == 'INPUT') {
			console.log(createEmployeeForm.elements[e].placeholder, createEmployeeForm.elements[e].value);
			if (createEmployeeForm.elements[e].value) {
			createEmployeeDataObj[createEmployeeForm.elements[e].placeholder] = createEmployeeForm.elements[e].value;
			}
		} else if (createEmployeeForm.elements[e].tagName == 'SELECT'){
			
				if (createEmployeeForm.elements[e].id == 'location-dropdown') {

					console.log('location dropdown value', createEmployeeForm.elements[e].value);
					createEmployeeDataObj['locationName'] = createEmployeeForm.elements[e].value;
					createEmployeeDataObj['locationID'] = locationsDropDownObj[createEmployeeForm.elements[e].value];
			
				} else if (createEmployeeForm.elements[e].id == 'department-dropdown'){
					
					createEmployeeDataObj['departmentID'] = departmentsDropDownObj[createEmployeeForm.elements[e].value];
					createEmployeeDataObj['department'] = createEmployeeForm.elements[e].value;
				}
			
			
			}

	}
	
	console.log(createEmployeeDataObj);
	
	
	$.ajax({
	url: "assets/php/insertEmployee.php",
	type: "GET",
	dataType: "json",
	data: createEmployeeDataObj,
	success: function (result) {
		
			console.log('insertEmployee ',result.data);
			console.log('orderby', orderBy, 'lastSearch', lastSearch);
			runSearch(orderBy,'');

	},
	error: function (jqXHR, textStatus, errorThrown) {
			console.log('error');
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
	*/
	
		
});

let createEmployeeForm = document.getElementById('employee-modal-create-fields');

createEmployeeForm.addEventListener("submit", function ( event ) {

	event.preventDefault();

	console.log('elements', createEmployeeForm.elements);
	
	if (createEmployeeForm.elements) {

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
	console.log('LOCATIONS OBJ', locationsObj);
	
	for (let e = 0; e < createEmployeeForm.elements.length; e ++) {
	
		if (createEmployeeForm.elements[e].tagName != 'BUTTON') {			
			
			//console.log('element', createEmployeeForm.elements[e], 'value', createEmployeeForm.elements[e].value);
		
			createEmployeeDataObj[createEmployeeForm.elements[e].getAttribute('fieldname')] = createEmployeeForm.elements[e].value;
			
		}

	}
	
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

$('#create-employee-btn-mobile').click(function(){

	$('#create-employee-btn').click();

});

$('#create-employee-btn').click(function(){
	
	let noDetailsRequired = {};
	dropDownClicked = 0;
	createEmployeeModalContent(editOrCreate = 'create', noDetailsRequired);
	//createEmployeeModalContent(editOrCreate = 'edit')
	
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

$('#close-modal-btn').click(function(){
		
	//document.getElementById(`employee-modal-form`).reset();
	
	//$(".employee-editable-modal-field").attr('readonly', 'readOnly');

});

function runSearch(orderBy, searchTerm){

	let departments = "";

	for (const [key, value] of Object.entries(departmentsObj)) {
						
		if (value == true) {
			departments += `${key},`;
		}
	}

	let departmentsStr = departments.slice(0,-1);

	let locations = "";

	for (const [key, value] of Object.entries(locationsObj)) {
						
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
	
				let nextNewestElement;
				let newestEmployeeObj = {};

				for (let e = 0; e < rowsToCreate; e ++) {

					if (e < result.data.length) {
												
						for (const [key, value] of Object.entries(result.data[e])) {
						
							employeePropertiesObj[key] = value;
						
						}
						
						newestEmployeeObj[JSON.parse(createEmployeeRow(employeePropertiesObj).getElementsByTagName('div')[0].attributes[1].textContent).id] = createEmployeeRow(employeePropertiesObj);
						
						//let elementID = JSON.parse(createEmployeeRow(employeePropertiesObj).getElementsByTagName('div')[0].attributes[1].textContent).id;
						
						//console.log('elementid', elementID);
						//if (JSON.parse(createEmployeeRow(employeePropertiesObj).getElementsByTagName('div')[0].attributes[1].textContent).id > maxNewEmployeeID) {

						///	console.log(JSON.parse(createEmployeeRow(employeePropertiesObj).getElementsByTagName('div')[0].attributes[1].textContent));
						//};
						
						
						//if (elementID == maxNewEmployeeID) {
						//	nextNewestElement = employeePropertiesObj;
						//	console.log('match',JSON.stringify(nextNewestElement));
						//}
						
						otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj));
					
					
					} else {
						
						otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj));
						
					}
				}

				//console.log('newestelement', JSON.stringify(nextNewestElement));

				//newestEmployeeObj[maxNewEmployeeID].getElementsByTagName('tr').setAttribute('style', 'display: none');
				

				
				function newElem (){
					finalMaxID = maxNewEmployeeID;
					return newestEmployeeObj[maxNewEmployeeID] 
				}

				if (newElem()) {
				
				//newElem().getElementsByTagName('td')[0].parentNode.setAttribute('style', 'display: none');
				//newElem().getElementsByTagName('td')[0].parentNode.setAttribute('id', 'newest-employee');

				//newElem().getElementsByTagName('td')[0].children[1].setAttribute('id', 'newest-employee-btn')
				
				//console.log('try obj', newElem().getElementsByTagName('td')[0].parentNode);

				//console.log('td', newElem().getElementsByTagName('td'));
				//console.log('td', newElem().getElementsByTagName('td')[0].children[0].children[1].attributes[1].textContent);

				

				console.log('creates newest employee on first search');
				otherEmployees.appendChild(createEmployeeRow(JSON.parse(newElem().getElementsByTagName('td')[0].children[0].children[1].attributes[1].textContent)));

				}

				

				viewDetailsBtnFunctionality()

				//document.getElementById('newest-employee-btn').click(); 
				
				selectEmployeeFunctionality()

				if (employeeJustCreated) {
					console.log('employee jc');
					//document.getElementById('newest-employee').click();
					console.log(newestElement);
					
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

				employeeJustCreated = false;

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

function sendRadioSelection(value){
	
		orderBy = value;
		runSearch(orderBy, lastSearch);
		
};

function getAllDepartments(){
	$.ajax({
	url: "assets/php/getAllDepartments.php",
	type: "GET",
	dataType: "json",
	data: {},
	success: function (result) {
		
			console.log('getAllDepartments ',result);
			//$('#getAllDepartments').html(JSON.stringify(result, null, 2));
			let listOfDepts = [];
			
			for (let d = 0; d < result.data.length; d++) {
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
				departmentsObj[deptName] = checkedStatus;
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
			//$('#getAllDepartments').html(JSON.stringify(result, null, 2));

			let listOfLocations = [];
			
			for (let l = 0; l < result.data.length; l++) {
				if (!listOfLocations.includes(result.data[l].name)) {
					listOfLocations.push(result.data[l].name);
				}
			}

			console.log('listOfLocations', listOfLocations);

			countOfLocations = listOfLocations.length;
			countOfCheckedLocations = listOfLocations.length;

			for (lol = 0; lol < listOfLocations.length; lol ++) {
				let locName = listOfLocations[lol];
				let checkedStatus = createCheckbox(locName, 'location').getAttribute('class').includes('checked');
				document.getElementById('location-checkboxes').appendChild(createCheckbox(locName, 'location'));
				locationsObj[locName] = checkedStatus;
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
						//blankEmployeeObj[key] = 'what is this';						
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

function closeModal(){	

	console.log('closeModal func run');
	
	//locationDropDownHolder[0].remove();
	locationDropDownHolder = [];
	
	$('.selection.dropdown').remove();	

	document.getElementById('employee-modal-create-fields').reset();
	document.getElementById('employee-modal-edit-fields').reset();

	document.getElementById('employee-modal-edit-fields').setAttribute('style','display: none');
	document.getElementById('employee-modal-create-fields').setAttribute('style','display: none');

	document.getElementById('submit-create-employee').setAttribute('style','display: none');
	document.getElementById('submit-edit-employee').setAttribute('style', 'display: none');

	$(".employee-editable-modal-field").attr('readonly', 'readonly');
	$('.employee-editable-modal-field').attr('style', 'border-color: black');

};

/*
function closeCreateEmployeeModal(){
	console.log('close');

	document.getElementById('create-employee-modal-form').reset();

	$(".employee-editable-modal-field").attr('readonly', 'readonly');
	$('.employee-editable-modal-field').attr('style', 'border-color: black');

};

*/

window.onload = (event) => {	
		
		$(document).ready(function () {
			
			document.getElementById('search-input').value = ""; 
			
			$('.ui.accordion').accordion();

			$('.ui.modal').modal({
			//$('#employee-details-modal').modal({
				onHidden: function(){	
					console.log('close view employee modal');
					closeModal();
				}
			});
			
			$('#delete-employee-alert-modal').modal({
				onHidden: function(){	
					console.log('close delete employee modal');
					//closeModal();
				}
			});

			$('.message .close')
				.on('click', function() {
					$(this)
						.closest('.message')
						.transition('fade')
					;
				});
				
			$('.selection.dropdown')
				.dropdown();

/*
	$('#employee-details-modal').modal({
		//onHidden: function(){console.log('close')}
		onHidden: function(){
			console.log('close view employee modal');
			closeModal()
		}
	});
*/

			/*
			$('#modal0').modal(
				{
				//title: 'IDIOT', 
				//preserveHTML: false,
				//onHidden: function(){console.log('close')}
				onHidden: function(){closeModal()}
				//onHidden: closeModal()
				});
			*/
			
			/*
			$('.ui.modal').modal(
				{
				//title: 'IDIOT', 
				//preserveHTML: false,
				onHidden: function(){closeModal()}
				//onHidden: closeModal()
			});
			*/
			
			/*	
			$('#create-employee-modal').modal(
				{
				//title: 'IDIOT', 
				//preserveHTML: false,
				//onHidden: function(){console.log('close')}
				onHidden: function(){closeCreateEmployeeModal()}
				//onHidden: closeModal()
				});
			*/
			
			/*
			$('.ui.radio.checkbox').checkbox({
				onChecked: function(){
					sendRadioSelection(this.value);
					console.log(this.name);
				},	
			});
			*/
			
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
