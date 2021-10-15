let employeeDetailsVisibility = 0;
let employeeModalCount = 0;
let employeePropertiesObj = {};
let inputField = document.getElementById('search-input');
let t;
let lastSearch = "";
let orderBy = 'lastName';
let departmentsObj = {
	marketing: true,
	legal: true
	};
	
let blankEmployeeObj = {};


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

			console.log('epo', employeePropertiesObj);
			renderEmployee(employeePropertiesObj);

			if (employeeDetailsVisibility == 0) {
				$('.employee-detail-fields').attr('style', 'visibility: visible');
				document.getElementById('edit-employee-fields-btn').setAttribute('employee-details', employeeDetails)
				employeeDetailsVisibility ++;
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

function renderEmployee(employeeProperties){
	
	document.getElementById(`employee-form`).reset();
	
	for (const [key, value] of Object.entries(employeeProperties)) {
				
		//let checkNull = value == null ? 'null' : value;
		
		//let textValue = checkNull == "" ? 'TBC' : checkNull;
		
		document.getElementById(`employee-${key}-field`).innerHTML = value;

	}
	
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
		
	document.getElementById(`employee-modal-form`).reset();
	
	$(".employee-editable-modal-field").attr('readonly', 'readOnly');

});

function runSearch(orderBy, searchTerm){

	$.ajax({
		url: "assets/php/searchAll.php",
		type: "GET",
		dataType: "json",
		data: {
			searchTerm: `${searchTerm}%`,
			//searchEmail: `%${searchTerm}%`, // this one searches anywhere in email
			searchEmail: `${searchTerm}%`, // email starts with term
			orderBy: orderBy
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

inputField.addEventListener('input', delay(function () {
  
	console.log('search term:', this.value.toLowerCase());
	
	console.log('order by: ', orderBy);

	let searchTerm = this.value.toLowerCase();
	lastSearch = searchTerm;
	
	runSearch(orderBy, searchTerm);
	
}, 500));

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


window.onload = (event) => {	
		
		$(document).ready(function () {
			
			document.getElementById('search-input').value = ""; 
			
			$('.ui.accordion').accordion();

			$(`#modal${employeeModalCount}`).modal({
				//title: 'IDIOT', 
				//preserveHTML: false,
				//onShow: function(){console.log('show')}
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
			
			/* this is overlapping with radio buttons create distinct classes
			$('.ui.checkbox').checkbox({
				onChecked: function(){
					console.log(this.name);
					console.log(this.checked);
					departmentsObj[this.name] = this.checked;
					console.log(departmentsObj);
				},
				onUnchecked: function(){
					console.log(this.name);
					console.log(this.checked);
					departmentsObj[this.name] = this.checked;
					console.log(departmentsObj);
				},				
			});
			
			*/

			$('#order-by-first-name-mobile').checkbox('attach events', '#order-by-first-name', 'check');
			$('#order-by-last-name-mobile').checkbox('attach events', '#order-by-last-name', 'check');

			$('#order-by-first-name').checkbox('attach events', '#order-by-first-name-mobile', 'check');
			$('#order-by-last-name').checkbox('attach events', '#order-by-last-name-mobile', 'check');		
			
			getAllEmployees();

			getAllDepartments();

		});

}; //END OF WINDOW ON LOAD
