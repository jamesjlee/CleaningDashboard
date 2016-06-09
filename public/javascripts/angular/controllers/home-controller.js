angular.module('cleaningDashboard').controller('HomeCtrl', [
	'$scope',
	'$state',
	'$http',
	'$timeout',
	'$uibModal',
	'$rootScope',
	'service',
	'$timeout',
	function($scope, $state, $http, $timeout, $uibModal, $rootScope, service, $timeout) {
		$scope.editAppointment = function(grid, row) {
			$uibModal.open({
			  templateUrl: '/partials/edit-appointment-modal.html',
			  controller: ['$scope', '$uibModalInstance', 'service', 'grid', 'row', 'getClientNames', '$http', 'getMaids', editAppointmentCtrl],
			  resolve: {
			    grid: function () { return grid; },
			    row: function () { return row; },
			    getClientNames: ['service', function(service){
					return service.getClients();
				}],
				getMaids:  ['service', function(service){
					return service.getMaids();
				}],
			  }
			});
		}

		$scope.deleteAppointment = function(grid, row){ 
			$uibModal.open({
			  templateUrl: '/partials/delete-appointment-modal.html',
			  controller: ['$scope', '$uibModalInstance', 'service', 'grid', 'row', '$http', deleteAppointmentCtrl],
			  resolve: {
			    grid: function () { return grid; },
			    row: function () { return row; }
			  }
			});
		}

		$scope.createAppointment = function() {
			$uibModal.open({
		      templateUrl: '/partials/create-appointment-modal.html',
		      controller: ['$scope', '$uibModalInstance', 'service', 'getClientNames', 'getMaids', createAppointmentCtrl],
		      resolve: {
		      	getClientNames:  ['service', function(service){
					return service.getClients();
				}],
				getMaids:  ['service', function(service){
					return service.getMaids();
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
		      controller: ['$scope', '$uibModalInstance', '$uibModal', 'service', 'getMaids', 'getClientInfo', 'grid', 'row', 'Excel', '$timeout', editClientCtrl],
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

		$scope.showCalendar = function() {
			$uibModal.open({
		  		templateUrl: '/partials/main-calendar-modal.html',
		  		controller: ['$scope', '$rootScope', 'service', '$uibModalInstance', 'clients', 'appointments', mainCalendarCtrl],
		  		resolve: {
		  			// clientAssetGrid: function () { return $scope.grid; },
					// clientAssetRow: function () { return $scope.row; },
					// clientInfo: function () {return $scope.clientInfo; }
					clients:  ['service', function(service){
						return service.getClients();
					}],
					appointments:  ['service', function(service){
						return service.getAppointments();
					}],
		  		}
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
			{field: 'buttons', name: '', cellTemplate: '/partials/buttons.html', enableCellEdit: false, enableFiltering: false, pinnedLeft: true, width: '5%'},
    		{field: 'name', name: 'Name', cellTemplate: '/partials/client-profile-modal.html', enableCellEdit: false, pinnedLeft: true, width: '25%'},
    		{field: 'sharedDate', name: 'Appointment (yyyy-mm-dd)', cellFilter: 'formatDateTime', enableCellEdit: false, pinnedLeft: true, width: '15%'},
    		{field: 'address', name: 'Address', enableCellEdit: false, width: '25%'},
    		{field: 'maid1', name: 'Maid 1', enableCellEdit: false, width: '10%'},
    		{field: 'maid2', name: 'Maid 2', enableCellEdit: false, width: '10%'},
    		{field: 'maid2', name: 'Maid 3', enableCellEdit: false, width: '10%'},
    		{field: 'paid', name: 'Paid (true/false)', cellFilter: 'paidNotpaid', enableCellEdit: false, width: '10%'},
    		{field: 'maidpaid', name: 'Maid Paid (true/false)', cellFilter: 'paidNotpaid', enableCellEdit: false, width: '10%'},
    		{field: 'notes', name: 'Notes', enableCellEdit: false, width: '50%'},
	    ]
	  };

	  	function showErrorAlert() {
	  		$('#gridErrorAlert').show();
	  	}

		$scope.hideErrorAlert = function() {
			$('#gridErrorAlert').hide();
		}
		console.log(service.appointments);
		$scope.gridOptions.data = service.appointments;
	}
]);

function mainCalendarCtrl($scope, $rootScope, service, $uibModalInstance, clients, appointments) {
	$scope.calendarView = 'month';
	$scope.calendarDate = new Date();
	var check = moment.utc();
	var day = check.format('dddd');
	var month = check.format('MMMM');
	var year = check.format('YYYY');
	$scope.calendarTitle = month + " " + year;
	$scope.events = [];

	for(var i=0; i<appointments.data.length; i++) {
		var paid = appointments.data[i].paid;
		var eventType = '';
		if(paid) {
			eventType = 'info';
		} else {
			eventType = 'important';
		}
		var date = appointments.data[i].sharedDate;
		// console.log(date)
		var eventsObj = {
			title: appointments.data[i].name,
			startsAt: new Date(date),
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

function editAppointmentCtrl($scope, $uibModalInstance, service, grid, row, getClientNames, $http, getMaids) {
	$scope.onSubmit = onSubmit;
	function getMaidNames() {
		var maids = [];
		for(var i=0;i<getMaids.data.length;i++){
			maids.push(getMaids.data[i].name);
		}
		return maids;
	}
	if(row.entity.sharedDate) {
		var oldDate = row.entity.sharedDate;
		$scope.sharedDate = new Date(row.entity.sharedDate);
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			name: {
				type: 'string',
				title: 'Client',
				readonly: true,
			},
			// date: {type: 'string', format: 'date', title: 'Appointment Date'},
			address: {type: 'string', title: 'Address'},
			maid1: {
				type: 'string', 
				title: 'Maid1',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			maid2: {
				type: 'string', 
				title: 'Maid2',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			maid3: {
				type: 'string', 
				title: 'Maid3',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			paid: {
				type: 'boolean',
				title: 'Paid',
			},
			maidpaid: {
				type: 'boolean',
				title: 'Maid Paid',
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
		{
			"key" : "name",
		},
		'address',
		'maid1',
		'maid2',
		'maid3',
		'paid',
		'maidpaid',
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
	];

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			console.log($scope.sharedDate);
			if($scope.sharedDate) {
				 var isoDate = new Date($scope.sharedDate).toISOString();
				$scope.entity.sharedDate = isoDate;
				var data = {
					oldDate: oldDate,
					newDate: isoDate,
					name: $scope.entity.name,
				}
				$http.post('/updateClientAppointments', data).then(function(result){
					console.log(result);
				});
			}
			service.updateAppointment($scope.entity);
			row.entity = $scope.entity;
			$uibModalInstance.dismiss('cancel');
		}
	}
}

function deleteAppointmentCtrl($scope, $uibModalInstance, service, grid, row, $http) {
	$scope.deleteAppointment = function() {
		service.deleteAppointment(row.entity);
		console.log(row.entity);
		var data = {
			name: row.entity.name,
			date: row.entity.sharedDate,
		};
		$http.post('/deleteClientAppointment', data).then(function(result){

		});
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
			notes: {type: 'string', title: 'Notes'},
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
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
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

function editClientCtrl($scope, $uibModalInstance, $uibModal, service, getMaids, getClientInfo, grid, row, Excel, $timeout) {
	var oldName = row.entity.name;
	$scope.grid = grid;
	$scope.row = row;
	$scope.onSubmit = onSubmit;
	$scope.clientInfo = getClientInfo;
	$scope.hideEditClientModalError = hideEditClientModalError;
	$scope.showCalendar = showCalendar;
	$scope.allInfo = [];

	console.log(grid.rows);
	for(var i=0;i<grid.rows.length;i++) {
		if(grid.rows[i].entity.name === row.entity.name) {
			var obj = {
				name: $scope.grid.rows[i].entity.name,
				address: $scope.grid.rows[i].entity.address,
				cleaningCost: getClientInfo.data.cleaningCost,
				sharedDate: $scope.grid.rows[i].entity.sharedDate,
				paid: $scope.grid.rows[i].entity.paid,
			}
			$scope.allInfo.push(obj);
		}
	}

	$scope.exportToExcel = function(tableId){
        var exportHref=Excel.tableToExcel(tableId,'report');
		var a = document.createElement('a');
		a.href = exportHref;
		a.download = oldName + '.xls';
		a.click();
    }

    $scope.exportToExcelHistory = function(tableId) {
    	var exportHref=Excel.tableToExcel(tableId,'report');
		var a = document.createElement('a');
		a.href = exportHref;
		a.download = oldName + '-history.xls';
		a.click();
    }

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
			notes: {type: 'string', title: 'Notes'}
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
		notes: getClientInfo.data.notes,
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
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
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
				// clientInfo: function () {return $scope.clientInfo; }
				clientInfo:  ['service', function(service){
					return service.getClientInfo($scope.row.entity);
				}],
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
		console.log(clientInfo.data);

		for(var i=0; i<clientInfo.data.appointments.length;i++) {
			// console.log(clientInfo.data.appointments[i]);

			for(var j=0; j<clientAssetGrid.rows.length;j++) {
				// console.log(clientAssetGrid.rows[j].entity.sharedDate);
				if(clientAssetGrid.rows[j].entity.name === clientInfo.data.name && clientAssetGrid.rows[j].entity.sharedDate === clientInfo.data.appointments[i]) {
					var paid = clientAssetGrid.rows[j].entity.paid;
					var eventType = '';
					if(paid) {
						eventType = 'info';
					} else {
						eventType = 'important';
					}
					var date = clientInfo.data.appointments[i];
					// console.log(date)
					var eventsObj = {
						title: clientInfo.data.name,
						startsAt: new Date(date),
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


function createAppointmentCtrl($scope, $uibModalInstance, service, getClientNames, getMaids) {
	$scope.onSubmit = onSubmit;
	function getClients() {
		var clients = [];
		for(var i=0;i<getClientNames.data.length;i++){
			clients.push(getClientNames.data[i].name);
		}
		return clients;
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
			name: {
				type: 'string',
				title: 'Client',
				enum: getClients(),
				placeholder: '--- Select One ---',
			},
			address: {type: 'string', title: 'Address'},
			maid1: {
				type: 'string', 
				title: 'Maid1',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			maid2: {
				type: 'string', 
				title: 'Maid2',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			maid3: {
				type: 'string', 
				title: 'Maid3',
				enum: getMaidNames(),
				placeholder: '--- Select One ---',
			},
			paid: {
				type: 'boolean',
				title: 'Paid',
			},
			maidpaid: {
				type: 'boolean',
				title: 'Maid Paid',
			},
			notes: {type: 'string', title: 'Notes'},
		},
		required: [
			'name',
			'date',
		]
  	};
 //  	var clientAddress;

	$scope.entity = {};
	$scope.form = [
		{
			'key': 'name',
			'onChange': function(val, form) {
				for(var i=0;i<getClientNames.data.length;i++){
					if(val === getClientNames.data[i].name) {
						$scope.entity.address = getClientNames.data[i].address;						
					}
				}
			}
		},
		'address',
		'maid1',
		'maid2',
		'maid3',
		'paid',
		'maidpaid',
		{
			'key': 'notes',
			'type': 'textarea',
			'placeholder': 'Make a note'
		},
	];

	function onSubmit(form) {
		$scope.$broadcast('schemaFormValidate');
		if (form.$valid) {
			if($scope.sharedDate) {
				var isoDate = new Date($scope.sharedDate).toISOString();
				$scope.entity.sharedDate = isoDate;	
			}
			service.createAppointment($scope.entity);
			$uibModalInstance.dismiss('cancel');
		}
	}
}


angular.module('cleaningDashboard').filter('formatDateTime', function () {
  return function (value) {
  	if(value) {
  		var v = moment(value).format('MMMM Do YYYY, h:mm:ss a'); // June 8th 2016, 11:50:41 am;

  		return v;
  	}
  };
});

angular.module('cleaningDashboard').factory('Excel',function($window){
    var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    return {
        tableToExcel:function(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            return href;
        }
    };
});

angular.module('cleaningDashboard').filter('paidNotpaid', function () {
  return function(input) {
  	return input ? 'Paid' : 'Not Paid';
  }
});