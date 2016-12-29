var index = angular.module('index', ['ui.router']);

index.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'index/views/home.html',
		controller: 'homeCtrl',
	})
	$urlRouterProvider.otherwise('/');
});

index.controller('navCtrl', function() {

});

index.controller('homeCtrl', function($scope, projects) {
	projects.getAll().then(function(res) {
		$scope.projects = res.data;
	});
});

index.factory('projects', function($http) {
	return {
		getAll: function() {
			return $http.get('/projects')
		}
	}
});