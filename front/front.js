var front = angular.module('backOffice', ['ui.router']);

// Routes
front.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl:'views/login.html',
		controller: 'authCtrl'
	})
	.state('projects', {
		url: '/',
		templateUrl: 'views/projects.html',
		controller: 'projectsCtrl',
		resolve: {
			projectPromise: function(projects){
				return projects.getAll();
			}
		},
		onEnter: function($state, auth){
			if(!auth.isloggedIn()) {
				$state.go('login');
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
				return projects.getAll();//projects.getOne to do !
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

front.controller('authCtrl', function($scope, auth) {
	$scope.logIn = function() {
		auth.logIn($scope.user);
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

front.factory('auth', function($http, $window, $state) {
	var auth = {};
	auth.logIn = function(user) {
		return $http.post('/authenticate', user).then(function(res) {
			if(!res.data.success) {
				console.log(res.data.message)
			} else {
				console.log(res.data.message)
				$window.localStorage['crud-token'] = res.data.token;
				$state.go('projects');
			}
		})
	};

	auth.isloggedIn = function() {
		var token = $window.localStorage['crud-token'];
		console.log('token:' + token)
		if(typeof token === undefined) {
			return false;
		} else {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			if(payload.exp > Date.now() / 1000) { 
				//Token has expired
				return true;
			}
		}
	};

	return auth;
});

