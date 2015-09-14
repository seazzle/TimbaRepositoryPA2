/**
 * 
 */
//describe('Controller: zuletztGebuchteControllerTest', function() {
//	var $scope, $http, $rootScope, $log;
//
//	beforeEach(module('zuletztGebuchte'));
//
//	beforeEach(inject(function(_$controller_,  _$rootScope_, _$httpBackend_, _$log_) {
//		$controller = _$controller_;
//		$rootScope = _$rootScope_;
//		$scope = _$rootScope_.$new();
//		$httpBackend = _$httpBackend_;
//		$log = _$log_;
//	}));
//
//	describe('clearing $rootScope Test', function() {
//		it('removes all rootscope entriys', function() {
//
////			$scope, $http, $rootScope, $log
//			var $rootScope = {};
//			var controller = $controller('zuletztGebuchteController', {
//				$scope : $scope,
//				$httpBackend : $httpBackend,
//				$rootScope : $rootScope,
//				$log : $log
//			});
//
//			$rootScope.rsAuftrag = "hallo";
//			expect($rootScope.rsAuftrag).toEqual('hallo');
//			$rootScope.clearRootScope();
//		});
//	});
//
//})

describe('Controller: zuletztGebuchteControllerTest', function() {
	var $scope, $http, $rootScope, $log, ctrl;

	beforeEach(module('ZuletztGebuchte'))
	
    beforeEach(inject(function($controller, _$rootScope_, $injector, _$log_) {
    	
    	$http = $injector.get('$httpBackend');;
    	$rootScope  = _$rootScope_;
        $rootScope.user = "0835";
        scope = _$rootScope_.$new();
        $log = _$log_;
        $controller('zuletztGebuchteController', {
        	$scope: $rootScope.$new(),
        	$http: $http,
        	$rootScope: $rootScope,
        	$log: $log,
        });
        $http.when('GET', serviceURL + '/zeiterfassung/ermittleUserInfo/' + $rootScope.user).respond("an order form");

    }));

    it("gets the list from the api and assigns it to scope", function() {
    	$http.expectGET('tactical/api/listOrderForms');
      expect(scope.orderFormList).toMatch("an order form");
    });
});
