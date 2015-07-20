/**
 * prueft den Service redirected auf zuletzt bebuchte
 */

angular.module('Authentication')

.controller('loginController', [ '$scope', '$rootScope', '$http', '$location', '$log', 'AuthenticationService', function($scope, $rootScope, $http, $location, $log, AuthenticationService) {

	$log.debug('You Run Debug Mode - logging is engabled');

	/**
	 * prueft ob es die login seite ist
	 */
	if ($location.path() === '/login') {
		$rootScope.hideNavbarIcon = true;
	}

	// reset login status
	AuthenticationService.ClearCredentials();

	$scope.login = function() {
		$scope.dataLoading = true;
		AuthenticationService.Login($scope.username, $scope.password, function(response) {
			if (response.success) {
				AuthenticationService.SetCredentials($scope.username, $scope.password);
				$location.path('/zuletztGebuchte');
			} else {
				$scope.error = response.message;
				$scope.dataLoading = false;
			}
		});
	};
} ]);