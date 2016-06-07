angular.module('cleaningDashboard').controller('HomeCtrl', [
	'$scope',
	'$state',
	'$http',
	'$timeout',
	'$uibModal',
	'$rootScope',
	'service',
	function($scope, $state, $http, $timeout, $uibModal, $rootScope, service) {
		$scope.editAppointment = function(grid, row) {
			$uibModal.open({
			  templateUrl: '/partials/edit-appointment-modal.html',
			  controller: ['$scope', '$uibModalInstance', 'service', 'grid', 'row', 'getClientNames', editAppointmentCtrl],
			  resolve: {
			    grid: function () { return grid; },
			    row: function () { return row; },
			    getClientNames: ['service', function(service){
					return service.getClients();
				}],
			  }
			});
		}

		$scope.deleteAppointment = function(grid, row){ 
			$uibModal.open({
			  templateUrl: '/partials/delete-appointment-modal.html',
			  controller: ['$scope', '$uibModalInstance', 'service', 'grid', 'row', deleteAppointmentCtrl],
			  resolve: {
			    grid: function () { return grid; },
			    row: function () { return row; }
			  }
			});
		}

		$scope.createAppointment = function() {
			$uibModal.open({
		      templateUrl: '/partials/create-appointment-modal.html',
		      controller: ['$scope', '$uibModalInstance', 'service', 'getClientNames', createAppointmentCtrl],
		      resolve: {
		      	getClientNames:  ['service', function(service){
					return service.getClients();
				}],
		      }
		    });
		}

		$scope.createClient = function() {
			$uibModal.open({
		      templateUrl: '/partials/create-client-modal.html',
		      controller: ['$scope', '$uibModalInstance', 'service', 'getMaids', createClientCtrl],
		      resolve: {
		      	getMaids:  ['service', function(service){
					return service.getMaids();
				}],
		      }
		    });
		}

		$scope.editClient = function(grid, row) {
			var entity = angular.copy(row.entity);
			$uibModal.open({
		      templateUrl: '/partials/edit-client-modal.html',
		      controller: ['$scope', '$uibModalInstance', '$uibModal', 'service', 'getMaids', 'getClientInfo', 'grid', 'row', editClientCtrl],
		      resolve: {
		      	getMaids:  ['service', function(service){
					return service.getMaids();
				}],
				getClientInfo:  ['service', function(service){
					return service.getClientInfo(entity);
				}],
				grid: function () { return grid; },
			    row: function () { return row; }

		      }
		    });
		}

		$scope.createMaid = function() {
			$uibModal.open({
		      templateUrl: '/partials/create-maid-modal.html',
		      controller: ['$scope', '$uibModalInstance', 'service', createMaidCtrl]
		    });
		}
		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
	    	paginationPageSize: 25,
			enableColumnResizing: true,
		    enableFiltering: true,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
	      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
          });
	    },
	    columnDefs: [
			{field: 'buttons', name: '', cellTemplate: '/partials/buttons.html', enableCellEdit: false, enableFiltering: false, pinnedLeft: true, width: 65},
    		{field: 'name', name: 'Name', cellTemplate: '/partials/client-profile-modal.html', enableCellEdit: false, pinnedLeft: true, width: '25%'},
    		{field: 'date', name: 'Appointment (yyyy-mm-dd)', cellFilter: 'formatDateTime', enableCellEdit: false, pinnedLeft: true, width: '15%'},
    		{field: 'address', name: 'Address', enableCellEdit: false, width: '25%'},
    		{field: 'paid', name: 'Paid', width: '10%'},
    		{field: 'notes', name: 'Notes', enableCellEdit: false, width: '50%'},
			// {field: 'project', name: 'Project', cellTemplate: '/partials/project.html', enableCellEdit: false, pinnedLeft: true, width: 100},
			// {field: 'releaseName', name: 'Release Name', pinnedLeft: true, width: 100, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'type', name: 'Type', width: 110,  enableCellEdit: false},
			// {field: 'startDate', name: 'Reporting Start Date', cellFilter: 'formatDateTime', width: 110, enableCellEdit: false},
			// {field: 'endDate', name: 'Reporting End Date', cellFilter: 'formatDateTime', width: 110, enableCellEdit: false},
			// {field: 'newTestsAutomated', name: 'New Tests Automated', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'manualExecutionTimeNewTests', name:'Manual Execution Time (New Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'automatedExecutionTimeNewTests', name: 'Automated Execution Time (New Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'cycleTimeSavingsNewTests', name: 'Cycle Time Savings (New Tests)', width: 150, enableCellEdit: false},
			// {field: 'maintainedTests', name: 'Maintained Tests', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'manualExecutionTimeMaintainedTests', name: 'Manual Execution Time (Maintained Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'automatedExecutionTimeMaintainedTests', name: 'Automated Execution Time (Maintained Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'cycleTimeSavingsMaintainedTests', name: 'Cycle Time Savings (Maintained Tests)', width: 150, enableCellEdit: false},
			// {field: 'executedTests', name: 'Executed Tests', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'manualExecutionTimeExecutedTests', name: 'Manual Execution Time (Executed Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'automatedExecutionTimeExecutedTests', name: 'Automated Execution Time (Executed Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			// {field: 'cycleTimeSavingsExecutedTests', name: 'Cycle Time Savings (Executed Tests)', width: 150, enableCellEdit: false},
			// {field: 'comment', name: 'Comment', width: 1000, cellEditableCondition: function(){return $scope.isLoggedIn()}},
	    ]
	  };

	  	function showErrorAlert() {
	  		$('#gridErrorAlert').show();
	  	}

		$scope.hideErrorAlert = function() {
			$('#gridErrorAlert').hide();
		}
	
		$scope.gridOptions.data = service.appointments;
	}
]);

function editAppointmentCtrl($scope, $uibModalInstance, service, grid, row, getClientNames) {
	$scope.onSubmit = onSubmit;
	function getClients() {
		var clients = [];
		for(var i=0;i<getClientNames.data.length;i++){
			clients.push(getClientNames.data[i].name);
		}
		return clients;
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			name: {
				type: 'string',
				title: 'Client',
				enum: getClients(),
				placeholder: '--- Select One ---',
			},
			date: {type: 'string', format: 'date', title: 'Appointment Date'},
			address: {type: 'string', title: 'Address'},
			paid: {
				type: 'boolean',
				title: 'Paid',
			},
			notes: {type: 'string', title: 'Notes'},
		},
		required: [
			'name',
			'date',
		]
  	};
	$scope.entity = angular.copy(row.entity);
	$scope.form = [
		'name',
		{
		"key": "date",
		"minDate": "1995-09-01",
		},
		'address',
		'paid',
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
	];

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			service.updateAppointment($scope.entity);
			row.entity = $scope.entity;
			$uibModalInstance.dismiss('cancel');
		}
	}
}

function deleteAppointmentCtrl($scope, $uibModalInstance, service, grid, row) {
	$scope.deleteAppointment = function() {
		service.deleteAppointment(row.entity);
		$uibModalInstance.dismiss('cancel');
	}
}

function createMaidCtrl($scope, $uibModalInstance, service) {
	$scope.onSubmit = onSubmit;
	$scope.createMaidModalError = createMaidModalError;
	$scope.schema = {
		type: 'object',
		properties: {
			name: {type: 'string', title: 'Name'},
			notes: {type: 'string', title: 'Notes'},
		},
		required: [
			'name',
		]
  	};
	$scope.entity = {};
	$scope.form = [
		'name',
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
	];

	function createMaidModalError() {
		$('#createMaidModalError').hide();
	}

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			service.createMaid($scope.entity).then(function(result){
				// console.log(result);
				if(result.data.message === "Maid already exists!") {
					$('#createMaidModalError').show();
					$scope.error = 'Maid already exists! Please choose another maid name.';
				} else {
					$uibModalInstance.dismiss('cancel');
				}
			});
		}
	}
}

function createClientCtrl($scope, $uibModalInstance, service, getMaids) {
	$scope.onSubmit = onSubmit;
	$scope.createClientModalError = createClientModalError;
	function getMaidNames() {
		var maids = [];
		for(var i=0;i<getMaids.data.length;i++){
			maids.push(getMaids.data[i].name);
		}
		return maids;
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			name: {type: 'string', title: 'Name'},
			address: {type: 'string', title: 'Address'},
			cleaningCost: {type: 'number', title: 'Cleaning Cost'},
			preferredPaymentType: {
				type: 'string',
				title: 'Preferred Payment Type',
				enum: ['Cash', 'Check', 'Credit Card'],
				placeholder: '--- Select One ---',
			},
			cleaningSchedule: {
				type: 'string',
				title: 'Cleaning Schedule',
				enum: ['Weekly', 'Biweekly', 'Monthly'],
				placeholder: '--- Select One ---',
			},
			requestedMaid: {
				type: 'string',
				title: 'Requested Maid',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			credit: {type: 'number', title: 'Credit'},
		},
		required: [
			'name',
		]
  	};
	$scope.entity = {};
	$scope.form = [
		'name',
		'address',
		'cleaningCost',
		{
			"key": "preferredPaymentType",
		},
		{
			"key": "cleaningSchedule",
  		},
		{
			'key': 'requestedMaid',
		},
		'credit',
	];

	function createClientModalError() {
		$('#createClientModalError').hide();
	}

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			service.createClient($scope.entity).then(function(result){
				if(result.data.message === "Client already exists!") {
					$('#createClientModalError').show();
					$scope.error = 'Client already exists! Please choose another client name.';
				} else {
					$uibModalInstance.dismiss('cancel');
				}
			});
		}
	}
}

function editClientCtrl($scope, $uibModalInstance, $uibModal, service, getMaids, getClientInfo, grid, row) {
	var oldName = row.entity.name;
	$scope.grid = grid;
	$scope.row = row;
	$scope.onSubmit = onSubmit;
	$scope.clientInfo = getClientInfo;
	$scope.hideEditClientModalError = hideEditClientModalError;
	$scope.showCalendar = showCalendar;

	$scope.deleteClient = function() {
		$uibModalInstance.dismiss('cancel');
		$uibModal.open({
	  		templateUrl: '/partials/delete-client-modal.html',
	  		controller: ['$scope', '$rootScope', 'service', '$uibModalInstance', 'clientAssetGrid', 'clientAssetRow', 'clientInfo', DeleteClientCtrl],
	  		resolve: {
	  			clientAssetGrid: function () { return $scope.grid; },
				clientAssetRow: function () { return $scope.row; },
				clientInfo: function () {return $scope.clientInfo; }
	  		}
	  	});
	}

	function DeleteClientCtrl($scope, $rootScope, service, $uibModalInstance, clientAssetGrid, clientAssetRow, clientInfo) {
		var rows = clientAssetGrid.rows;
		$scope.deleteAllClientAppointments = function() {
			service.deleteClient(clientInfo.data).then(function(result){
				for(var i=0;i<rows.length;i++) {
					if(rows[i].entity.name === clientAssetRow.entity.name) {
						var resultId = rows[i].entity._id;
						service.deleteAppointment(rows[i].entity);
					}
				}
			});
			$uibModalInstance.dismiss('cancel');
		}
	}

	function getMaidNames() {
		var maids = [];
		for(var i=0;i<getMaids.data.length;i++){
			maids.push(getMaids.data[i].name);
		}
		return maids;
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			name: {type: 'string', title: 'Name'},
			address: {type: 'string', title: 'Address'},
			cleaningCost: {type: 'number', title: 'Cleaning Cost'},
			preferredPaymentType: {
				type: 'string',
				title: 'Preferred Payment Type',
				enum: ['Cash', 'Check', 'Credit Card'],
				placeholder: '--- Select One ---',
			},
			cleaningSchedule: {
				type: 'string',
				title: 'Cleaning Schedule',
				enum: ['Weekly', 'Biweekly', 'Monthly'],
				placeholder: '--- Select One ---',
			},
			requestedMaid: {
				type: 'string',
				title: 'Requested Maid',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			credit: {type: 'number', title: 'Credit'},
		},
		required: [
			'name',
		]
  	};
	$scope.entity = {
		_id: getClientInfo.data._id,
		name: getClientInfo.data.name,
		address: getClientInfo.data.address,
		cleaningCost: getClientInfo.data.cleaningCost,
		preferredPaymentType: getClientInfo.data.preferredPaymentType,
		cleaningSchedule: getClientInfo.data.cleaningSchedule,
		requestedMaid: getClientInfo.data.requestedMaid,
		credit: getClientInfo.data.credit,
	}
	$scope.form = [
		'name',
		'address',
		'cleaningCost',
		{
			"key": "preferredPaymentType",
		},
		{
			"key": "cleaningSchedule",
  		},
		{
			'key': 'requestedMaid',
		},
		'credit',
	];

	function hideEditClientModalError() {
		$('#editClientModalError').hide();
	}

	function showCalendar() {
		$uibModalInstance.dismiss('cancel');
		$uibModal.open({
	  		templateUrl: '/partials/calendar-modal.html',
	  		controller: ['$scope', '$rootScope', 'service', '$uibModalInstance', 'clientAssetGrid', 'clientAssetRow', 'clientInfo', CalendarCtrl],
	  		resolve: {
	  			clientAssetGrid: function () { return $scope.grid; },
				clientAssetRow: function () { return $scope.row; },
				clientInfo: function () {return $scope.clientInfo; }
	  		}
	  	});
	}

	function CalendarCtrl($scope, $rootScope, service, $uibModalInstance, clientAssetGrid, clientAssetRow, clientInfo) {
		$scope.calendarView = 'month';
		$scope.calendarDate = new Date();
		var check = moment.utc();
		var day = check.format('dddd');
		var month = check.format('MMMM');
		var year = check.format('YYYY');
		$scope.calendarTitle = month + " " + year;
		$scope.events = [];
		// console.log(clientAssetRow.entity.paid);
		console.log(clientAssetGrid.rows.length);

		for(var i=0; i<clientInfo.data.appointments.length;i++) {
			for(var j=0; j<clientAssetGrid.rows.length;j++) {
				if(clientAssetGrid.rows[j].entity.name === clientInfo.data.name && clientAssetGrid.rows[j].entity.date === clientInfo.data.appointments[i]) {
					var paid = clientAssetGrid.rows[j].entity.paid;
					var eventType = '';
					if(paid) {
						eventType = 'info';
					} else {
						eventType = 'important';
					}
					var date = clientInfo.data.appointments[i];
					date = date.substring(0, date.indexOf("T"));
					var eventsObj = {
						title: clientInfo.data.name,
						startsAt: moment(date).utc(),
						type: eventType,
						editable: false,
						deletable: false, 
						draggable: true, 
						resizable: true,
						incrementsBadgeTotal: true, 
						cssClass: 'a-css-class-name',
						allDay: false 
					}
					$scope.events.push(eventsObj);
				}
			}
		}
		// $scope.events = [
		// 	{
		// 		title: 'My event title', // The title of the event
		// 		type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
		// 		startsAt: moment([2015, 5, 10]), // A javascript date object for when the event starts
		// 		editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
		// 		deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
		// 		draggable: true, //Allow an event to be dragged and dropped
		// 		resizable: true, //Allow an event to be resizable
		// 		incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
		// 		cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
		// 		allDay: false // set to true to display the event as an all day event on the day view
		// 	},
		// ];
	}

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			service.updateClient($scope.entity).then(function(result){
				if(result.data.message !== 'Client already exists!') {
					for(var i=0;i<grid.rows.length;i++) {
						if(grid.rows[i].entity.name == oldName) {
							grid.rows[i].entity.name = $scope.entity.name;;
						}
					}
					$uibModalInstance.dismiss('cancel');
				} else {
					$('#editAssetModalError').show();
					$scope.error = 'Client name already exists! Please choose another client name.'
				}
			})
		}
	}
}


function createAppointmentCtrl($scope, $uibModalInstance, service, getClientNames) {
	$scope.onSubmit = onSubmit;
	function getClients() {
		var clients = [];
		for(var i=0;i<getClientNames.data.length;i++){
			clients.push(getClientNames.data[i].name);
		}
		return clients;
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			name: {
				type: 'string',
				title: 'Client',
				enum: getClients(),
				placeholder: '--- Select One ---',
			},
			date: {type: 'string', format: 'date', title: 'Appointment Date'},
			address: {type: 'string', title: 'Address'},
			paid: {
				type: 'boolean',
				title: 'Paid',
			},
			notes: {type: 'string', title: 'Notes'},
		},
		required: [
			'name',
			'date',
		]
  	};
	$scope.entity = {};
	$scope.form = [
		'name',
		{
		"key": "date",
		"minDate": "1995-09-01",
		},
		'address',
		'paid',
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
	];

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			service.createAppointment($scope.entity);
			$uibModalInstance.dismiss('cancel');
		}
	}
}


angular.module('cleaningDashboard').filter('formatDateTime', function () {
  return function (value) {
  	if(value) {
  		var v = moment(value).utc().format('MM/DD/YYYY');
  		return v;
  	}
  };
});