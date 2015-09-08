/**
 * 
 */
//
// describe('Controller: zuletztGebuchte', function() {
// beforeEach(module('ZuletztGebuchte'));
//
// var $scope, $rootScope, $http, $log;
//
// beforeEach(inject(function(_$rootScope_, _$controller_, $httpBackend) {
// $rootScope = _$rootScope_;
// $scope = $rootScope.$new();
// $controller = _$controller_;
//
// $controller('zuletztGebuchteController', {
// '$scope' : $scope,
// '$http' : $http,
// '$rootScope' : $rootScope,
// '$log' : $log
// });
// }));
//
// describe('clearing rootScope', function() {
// it('rootScope should be undefined', function() {
//
// var controller = $controller('zuletztGebuchteController', {
// $scope : $scope,
// $rootScope : $rootScope,
// $http : $http,
// $log : $log
// });
//
// $rootScope.rsAuftrag = "auftrag";
// $rootScope.rsArbeitspaket = "arbeitspaket";
// $rootScope.rsSuccessMessage = true;
// $rootScope.rsShowSuccessBox = false;
//
// // function call
// $rootScope.clearRootScope();
//
// // expect($rootScope.rsAuftrag).toBeUndefined();
// });
// });
// });
describe('zuletztGebuchteControllerTest', function() {

	beforeEach(function() {

		// load the module you're testing.
		module('timba');

		inject(function($rootScope, $controller, $q, _$timeout_, $httpBackend) {
			// create a scope object for us to use.
			$scope = $rootScope.$new();
			$timeout = _$timeout_;
			ctrl = $controller('zuletztGebuchteController', {
				$scope : $scope,
				$http : $httpBackend,
				$rootScope : $rootScope,
				$log : $log,
			});
		});

		it('should start with foo and bar populated', function() {
			$rootScope.rsAuftrag = "hello";
			console.log($rootScope.rsAuftrag);
			$rootScope.clearRootScope();
			console.log($rootScope.rsAuftrag);
		});
	});
})
