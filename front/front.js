var front = angular.module('backOffice', ['ui.router']);

// Routes
front.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('projects', {
		url: '/',
		templateUrl: 'views/projects.html',
		controller: 'projectsCtrl',
		resolve: {
			projectPromise: function(projects){
				return projects.getAll();
			}
		}
	})
	.state('addProject', {
		url: '/addProject',
		templateUrl: 'views/addProject.html',
		controller: 'addProjectCtrl'
	})
	.state('project', {
		url: '/project/{id}',
		templateUrl: 'views/project.html',
		controller: 'projectCtrl',
		resolve: {
			projectPromise: function(projects){
				return projects.getAll();
			}
		}
	})
	$urlRouterProvider.otherwise('/');
})


// Controllers
front.controller('projectsCtrl', function($scope, projects) {
	$scope.projects = projects;
});

front.controller('addProjectCtrl', function($scope, projects) {
});

front.controller('projectCtrl', function($scope, $stateParams, projects) {
	$scope.project = projects[$stateParams.id];
	$scope.projectUrl = 'updateProject/' + projects[$stateParams.id]._id;
	$scope.removeProject = function() {
		projects.delete($scope.project._id);
	};
});	


// Services
front.factory('projects', function($http, $state, $stateParams) {
	var projects = [];

	projects.getAll = function() {
		 $http.get('/projects').then(function(response) {
			angular.copy(response.data, projects);
		});
	};

	// projects.getOne = function(p) {
	// 	$http.get('/project/' + p._id).then(function(response) {
	// 		$state.go('projects');
	// 	});
	// };

	projects.delete = function(_id) {
		$http.delete('/removeProject/' + _id).then(function(response) {
			$state.go('projects');
		});
	};

	return projects;
});



