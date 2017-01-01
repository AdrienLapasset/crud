var office = angular.module('office', ['ui.router']);

//Do not display issues angular.js:14324
office.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

// Routes
office.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl:'office/views/login.html',
		controller: 'authCtrl',
		onEnter: function($state, auth){
			if(auth.isloggedIn()) {
				$state.go('home');
			}
		},
	})
	.state('projects', {
		url: '/',
		templateUrl: 'office/views/projects.html',
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
		templateUrl: 'office/views/addProject.html',
		controller: 'addProjectCtrl'
	})
	.state('project', {
		url: '/project/{id}',
		templateUrl: 'office/views/project.html',
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
office.controller('navCtrl', function($scope, $window, $state, auth) {
	$scope.isloggedIn = auth.isloggedIn;
	$scope.logOut = function() {
		$window.localStorage.removeItem('crud-token');
		$state.go('login');
	};
});

office.controller('projectsCtrl', function($scope, projects) {
	$scope.projects = projects;
});

office.controller('addProjectCtrl', function($scope, projects) {
});

office.controller('projectCtrl', function($scope, $stateParams, projects) {
	$scope.project = projects[$stateParams.id];
	$scope.projectUrl = 'updateProject/' + projects[$stateParams.id]._id;
	$scope.removeProject = function() {
		projects.delete($scope.project._id);
	};
});	

office.controller('authCtrl', function($scope, $http, $state, $window) {
	$scope.logIn = function() {
		$http.post('/authenticate', $scope.user).then(function(res) {
			if(!res.data.success) {
				Materialize.toast(res.data.message, 4000, 'toast-alert');
			} else {
				$window.localStorage['crud-token'] = res.data.token;
				$state.go('projects');
			}
		})
	};
});


// Services
office.factory('projects', function($http, $state, $stateParams) {
	var projects = [];

	projects.getAll = function() {
		$http.get('/projects').then(function(response) {
			angular.copy(response.data, projects);
		});
	};

	projects.delete = function(_id) {
		$http.delete('/removeProject/' + _id).then(function(response) {
			$state.go('projects');
		});
	};
	return projects;
});

office.factory('auth', function($http, $window) {
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