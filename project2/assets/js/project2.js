let employeeDetailsVisibility = 0;
let employeeModalCount = 0;
let employeePropertiesObj = {};
let blankEmployeeObj = {};
let inputField = document.getElementById('search-input');
let t;
let lastSearch = "";
let orderBy = 'lastName';
let departmentsObj = {};
let countOfDepts;
let countOfCheckedDepts;
let locationsObj = {};


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

window.onresize = () => {
	resizing(this, this.innerWidth, this.innerHeight) //1
	if (typeof t == 'undefined') resStarted() //2
	clearTimeout(t); t = setTimeout(() => { t = undefined; resEnded() }, 200) //3
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

inputField.addEventListener('input', delay(function () {
  
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

		let checkNull = value == null ? 'null' : value;

		let textValue = checkNull == "" ? 'TBC' : checkNull;

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
	employeeSubHeader.innerHTML = `${employeePropertiesObj.department}`;
	
	employeeDiv.appendChild(employeeSubHeader);
	
	employeeH4.appendChild(employeeImg);
	employeeH4.appendChild(employeeDiv);	
		
	let employeeModalBtn = document.createElement('div');
	employeeModalBtn.setAttribute('class', 'employee-modal-btn ui button');
	employeeModalBtn.setAttribute('id', 'modalBtn');
	employeeModalBtn.innerHTML = 'View Details';
	
	let employeeBtn = document.createElement('div');
	employeeBtn.setAttribute('class', 'employee-btn ui button');
	employeeBtn.setAttribute('id', 'modalBtn');
	employeeBtn.innerHTML = 'View';
	
	return [employeeH4, employeeModalBtn, employeeBtn];
	
};

function appendEmployee(elementToAppend, employeeElements){
	elementToAppend.innerHTML = '';
	elementToAppend.appendChild(employeeElements[0]);
	elementToAppend.appendChild(employeeElements[1]);
	elementToAppend.appendChild(employeeElements[2]);	
}

function createEmployeeRow(employeePropertiesObj) {
	let tableRow = document.createElement('tr');
	tableRow.setAttribute('class', 'result-row');
	if (employeePropertiesObj.firstName == 'no data') {
		tableRow.setAttribute('style', 'visibility: hidden');
	}
	let tableData = document.createElement('td');

	let employeeElements = createEmployee(employeePropertiesObj);
					
	tableData.appendChild(employeeElements[0]);
	tableData.appendChild(employeeElements[1]);
	tableData.appendChild(employeeElements[2]);
	
	tableRow.appendChild(tableData);
	return tableRow;
}


function renderEmployee(employeeProperties){
	
	//document.getElementById(`employee-segment`).reset();
	
	for (const [key, value] of Object.entries(employeeProperties)) {
					
		document.getElementById(`employee-${key}-field`).innerHTML = value;

	}
	
}


function createCheckbox (checkboxName){
	let checkboxDiv = document.createElement('div');
	checkboxDiv.setAttribute('class', 'ui checkbox department-checkbox checked');
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
			},
			onUnchecked: function(){
				departmentsObj[this.name] = this.checked;
				countOfCheckedDepts --;
				setSelectAllCheckBox(countOfDepts);
			},				
		});
		
		//$('.department-checkbox').checkbox('attach events', '#select-all-departments', 'check');

		//$('.department-checkbox').checkbox('attach events', '#select-none-departments', 'uncheck');
		
		
		$('#select-none-departments').checkbox({
			onChecked: function(){
			  //$('.department-checkbox').checkbox('set checked');
			  $('.department-checkbox').checkbox('uncheck');
			},
		});

		$('#select-all-departments').checkbox({
			onChecked: function(){
			  //$('.department-checkbox').checkbox('set checked');
			  $('.department-checkbox').checkbox('check');
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
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails)
				employeeDetailsVisibility ++;
			} else {
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails)
			}
			 
		});
	}
	
}

function viewDetailsBtnFunctionality(){
	
	$('.employee-modal-btn').click(function(event){	
		
		//employeePropertiesObj = {};

		let employeeProperties = JSON.parse($($(this).context.previousSibling.children[1]).attr('employee-properties'));
		let employeeDetails = $($(this).context.previousSibling.children[1]).attr('employee-properties');
				
		for (const [key, value] of Object.entries(employeeProperties)) {

			document.getElementById(`employee-${key}-modal${employeeModalCount}`).setAttribute('value',value);
			employeePropertiesObj[key] = value;
			
		}
				
		$(`#modal${employeeModalCount}`).modal('show');

		if (employeeDetailsVisibility == 0) {
			renderEmployee(employeePropertiesObj);
			$('.employee-detail-fields').attr('style', 'visibility: visible');
			document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails)
			employeeDetailsVisibility ++;
		}
	
	});
	
}

$('#edit-employee-fields-btn').click(function(){

	let employeeDetails = JSON.parse(this.getAttribute('employee-details'));
				
	for (const [key, value] of Object.entries(employeeDetails)) {

		document.getElementById(`employee-${key}-modal${employeeModalCount}`).setAttribute('value',value);
				
	}
			
	$(`#modal${employeeModalCount}`).modal('show');
	$('#edit-employee-modal-btn').click();
	
	//$(".employee-editable-field").removeAttr('readonly');
	//$('.employee-editable-field').attr('style', 'border-color: blue');

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
	
	if (countOfCheckedDepts == 0) {

		$('.result-row').remove();

		let otherEmployees = document.getElementById('table-body');
		
		for (let e = 0; e < 20; e ++) {

			otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj));

		}
		
	} else {

	$.ajax({
		//url: "assets/php/searchAll.php",
		url: "assets/php/searchAllBuildInDepts.php",
		type: "GET",
		dataType: "json",
		data: {
			searchTerm: `${searchTerm}%`,
			//searchEmail: `%${searchTerm}%`, // this one searches anywhere in email
			searchEmail: `${searchTerm}%`, // email starts with term
			orderBy: orderBy,
			departments: departmentsStr
		},
		success: function (result) {
				
				$('.result-row').remove();

				let otherEmployees = document.getElementById('table-body');
				
				let rowsToCreate = result.data.length < 20 ? 20 : result.data.length;
				
				if (result.data.length < 8) {
					document.getElementById('body-tag').setAttribute('style', 'overflow: hidden');
				} else {
					document.getElementById('body-tag').setAttribute('style', 'overflow: auto');
				}

				console.log('orderby', orderBy);
				console.log('no of results', result.data.length);
	
				for (let e = 0; e < rowsToCreate; e ++) {

					if (e < result.data.length) {
												
						for (const [key, value] of Object.entries(result.data[e])) {
						
							employeePropertiesObj[key] = value;
						
						}
						
						otherEmployees.appendChild(createEmployeeRow(employeePropertiesObj));
					
					
					} else {
						
						otherEmployees.appendChild(createEmployeeRow(blankEmployeeObj));
						
					}
				}
				
				viewDetailsBtnFunctionality()
				
				selectEmployeeFunctionality()

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
				let checkedStatus = createCheckbox(deptName).getAttribute('class').includes('checked');
				document.getElementById('department-checkboxes').appendChild(createCheckbox(deptName));
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
					blankEmployeeObj[key] = "no data";						
				
				}
		
				let firstEmployee = document.getElementById('first-employee');

				appendEmployee(firstEmployee, createEmployee(blankEmployeeObj));

				let otherEmployees = document.getElementById('table-body');

				for (let e = 0; e < result.data.length; e ++) {
					
					for (const [key, value] of Object.entries(result.data[e])) {
					
						employeePropertiesObj[key] = value;
					
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
	console.log('close');

	document.getElementById(`employee-modal-form`).reset();

	$(".employee-editable-modal-field").attr('readonly', 'readonly');
	$('.employee-editable-modal-field').attr('style', 'border-color: black');

};

window.onload = (event) => {	
		
		$(document).ready(function () {
			
			document.getElementById('search-input').value = ""; 
			
			$('.ui.accordion').accordion();

			$(`#modal${employeeModalCount}`).modal(
				{
				//title: 'IDIOT', 
				//preserveHTML: false,
				//onHidden: function(){console.log('close')}
				onHidden: function(){closeModal()}
				//onHidden: closeModal()
				});
			
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
