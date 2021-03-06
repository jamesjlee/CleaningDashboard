var app = angular.module('cleaningDashboard', ['mwl.calendar', 'ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.resizeColumns','ui.grid.pagination', 'ui.grid.pinning', 'ui.grid.moveColumns', 'ui.grid.edit', 'schemaForm', 'mgcrea.ngStrap', 'mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.datepicker', 'ngSanitize']);

app.run(function($rootScope){
	$rootScope
		.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){

		});
	$rootScope
		.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){

		});
});

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				controller: 'HomeCtrl',
				templateUrl: 'partials/homeView.html',
				resolve: {
					getAppointments: ['service', function(service){
						return service.getAppointments();
					}],
					getMaids: ['service', function(service){
						return service.getMaids();
					}],
					getClients: ['service', function(service){
						return service.getClients();
					}],
				}
			})
		$urlRouterProvider.otherwise('home');
	}
]);

app.config(
	function(calendarConfig){

		calendarConfig.dateFormatter = 'moment';
		calendarConfig.allDateFormats.moment.date.hour = 'hh:mm A';
		calendarConfig.allDateFormats.moment.date.time = 'hh:mm A';
});