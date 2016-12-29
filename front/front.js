var front = angular.module('backOffice', ['ui.router']);

//Do not display issues angular.js:14324
front.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

// Routes
front.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl:'views/login.html',
		controller: 'authCtrl',
	})
	.state('projects', {
		url: '/',
		templateUrl: 'views/projects.html',
		controller: 'projectsCtrl',
		onEnter: function($state, auth){
			if(!auth.isloggedIn()) {
				$state.go('login');
			}
		},
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
				return projects.getAll();//projects.getOne to do !
			}
		}
	})
	$urlRouterProvider.otherwise('/');
})


// Controllers
front.controller('navCtrl', function($scope, $window, $state) {
	$scope.logOut = function() {
		$window.localStorage.removeItem('crud-token');
		$state.go('login');
	};
});

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

front.controller('authCtrl', function($scope, $http, $state, $window) {
	$scope.logIn = function() {
		$http.post('/authenticate', $scope.user).then(function(res) {
			if(!res.data.success) {
				$scope.message = res.data.message;
			} else {
				$window.localStorage['crud-token'] = res.data.token;
				$state.go('projects');
			}
		})
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

front.factory('auth', function($http, $window) {
	var auth = {};

	auth.isloggedIn = function() {
		var token = $window.localStorage['crud-token'];
		if(!token) {
			console.log('no token');
			return false;
		} else {
			console.log('you got a token');
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			if(payload.exp > Date.now() / 1000) { 
				//Token has not expired
				return true;
			}
		}
	};

	return auth;
});