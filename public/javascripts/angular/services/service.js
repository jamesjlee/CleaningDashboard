angular.module('cleaningDashboard').factory('service', [
	'$http',
	'$state',
	function($http, $state) {
		var o = {
			appointments: [],
			maids: [],
			clients: [],
		};

		o.getAppointments = function() {
			return $http.get('/appointments').success(function(data){
				// console.log(data);
				angular.copy(data, o.appointments);
				console.log(o.appointments);
			});
		};

		o.createAppointment = function(data) {
			console.log(data);
			return $http.post('/appointments', data).success(function(res){
				console.log(res);
				o.appointments.unshift(res);

				$http.post('/pushToClientsArr', data).success(function(data){
					console.log(data);
				});
			});
		}

		o.updateAppointment = function(data) {
			console.log(data);
			return $http.put('/appointments/' + data._id, data).success(function(data){
				console.log(data.message);
			});
		}

		o.deleteAppointment = function(data) {
			var index = -1;
			for(var i=0;i<o.appointments.length;i++) {
				if(o.appointments[i]._id === data._id) {
					index = i;
					break;
				}
			}
			o.appointments.splice(index, 1);
			return $http.delete('/appointments/' + data._id).success(function(data){
				console.log(data.message);
			});
		}


		o.getMaids = function() {
			return $http.get('/maids').success(function(data){
				// console.log(data);
				angular.copy(data, o.maids);
				console.log(o.maids);
			});
		};

		o.createMaid = function(data) {
			console.log(data);
			return $http.post('/maids', data).success(function(data){
				if(data.message === "Maid already exists!") {
				} else {
					o.maids.unshift(data);
				}
			});
		}

		o.updateMaid = function(data) {
			console.log(data);
			return $http.put('/maids/' + data._id, data).success(function(data){
				console.log(data.message);
			});
		}

		o.deleteMaid = function(data) {
			var index = -1;
			for(var i=0;i<o.maids.length;i++) {
				if(o.maids[i]._id === data._id) {
					index = i;
					break;
				}
			}
			o.maids.splice(index, 1);
			return $http.delete('/maids/' + data._id).success(function(data){
				console.log(data.message);
			});
		}


		o.getClients = function() {
			return $http.get('/clients').success(function(data){
				// console.log(data);
				angular.copy(data, o.clients);
			});
		};

		o.getClientInfo = function(data) {
			var _id;
			for(var i=0; i<o.clients.length;i++) {
				if(o.clients[i].name === data.name) {
					console.log(o.clients[i]);
					_id = o.clients[i]._id;
				}
			}
			return $http.get('/clients/' + _id).success(function(data){
				console.log(data);
			});
		}

		o.createClient = function(data) {
			console.log(data);
			return $http.post('/clients', data).success(function(data){
				if(data.message === "Client already exists!") {
				} else {
					o.clients.unshift(data);
				}
			});
		}

		o.updateClient = function(data) {
			console.log(data);
			return $http.put('/clients/' + data._id, data).success(function(res){
				if(res.message === 'Client already exists!') {
				} else {
					var oldName;
					var newName;
					console.log(data._id);
					for(var i=0;i<o.clients.length;i++) {
						if(o.clients[i]._id === data._id) {
							oldName = o.clients[i].name;
							newName = data.name;
							o.clients[i].name = data.name;
							o.clients[i].address = data.address;
							o.clients[i].cleaningCost = data.cleaningCost;
							o.clients[i].preferredPaymentType = data.preferredPaymentType;
							o.clients[i].cleaningSchedule = data.cleaningSchedule;
							o.clients[i].requestedMaid = data.requestedMaid;
							o.clients[i].credit = data.credit;
							o.clients[i].notes = data.notes;
							break;
						}
					}

					$http.put('/updateAppointmentName?oldName='+oldName+'&newName='+newName).success(function(data){
						console.log(data)
					});
				}
			});
		}

		o.deleteClient = function(data) {
			var index = -1;
			for(var i=0;i<o.clients.length;i++) {
				if(o.clients[i]._id === data._id) {
					index = i;
					break;
				}
			}
			o.clients.splice(index, 1);
			return $http.delete('/clients/' + data._id).success(function(data){
				console.log(data.message);
			});
		}

		return o;
	}
]);
