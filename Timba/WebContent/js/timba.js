/**
 * das JavaScript beinhaltet saemtliche funktionalitaeten welche die TimbaApp am
 * Client ausfuehrt. Genutzt wird hierfuer Angular.js, weshalb in den HTML
 * Elementen spezielle Attribute gesetzt werden muessen. Angular Attribute
 * beginnen mit dem Prefix <code>ng-*</code>
 */

'use strict';
/**
 * die einzelnen Controller werden als Angular Module deklariert
 */
angular.module('Authentication', []);
angular.module('ZuletztGebuchte', []);
angular.module('AlleAuftraege', []);
angular.module('BuchungErstellen', []);
angular.module('BuchungenAnzeigen', []);
angular.module('Administration', []);
angular.module('ArbeitspaketAnlegen', []);
angular.module('ArbeitspaketBearbeiten', []);
angular.module('AuftragBearbeiten', []);
angular.module('Reporting', []);

/**
 * Angular modul welches in der index.html hinterlegt ist wird hier als objekt
 * in einer Variabe gehalten. <code>ng-app="timba"</code>
 */
var timba = angular.module('timba', [ 'Authentication', 'ZuletztGebuchte', 'AlleAuftraege', 'BuchungErstellen', 'BuchungenAnzeigen', 'Administration', 'ArbeitspaketAnlegen', 'ArbeitspaketBearbeiten',
		'AuftragBearbeiten', 'Reporting', 'ngRoute', 'ngCookies', 'ui.bootstrap', 'angular-loading-bar' ]);


var localDevEndpoint = 'http://localhost:8080';
var externalEndpoint = 'https://webservices-test.badenia.de:8085';
var serviceName = '/BadeniaRochadeZeiterfassungRESTService';
var originEndpoint = window.location.protocol + "//" + window.location.host;;

/**
 * der Endpunkt wird nach der Anmeldung ueberschrieben
 */
var serviceURL = 'https://webservices-test.badenia.de:8085' + serviceName;

/**
 * aktiviert das Logging in der JavaScript Konsole
 */
timba.config([ '$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
} ]);

timba.directive('autoComplete', function($timeout) {
	return function(scope, iElement, iAttrs) {
		iElement.autocomplete({
			source : scope[iAttrs.uiItems],
			select : function() {
				$timeout(function() {
					iElement.trigger('input');
				}, 0);
			}
		});
	};
});

// timba.config(function($provide) {
// $provide.decorator("$exceptionHandler", function($delegate) {
// return function(exception, cause) {
// $delegate(exception, cause);
// alert(exception.message);
// };
// });
// });

// FIXME
// timba.factory('$exceptionHandler', function($injector) {
// return function(exception, cause) {
// var $rootScope = $injector.get("$rootScope");
// exception.message += ' (caused by "' + cause + '")';
// alert(exception);
// $rootScope.showErrorBox = true;
// $rootScope.errorMessage = "Client-Side Error" + exception;
// throw exception;
// };
// });

/**
 * Routing um die views zu injecten
 */
timba.config([ '$routeProvider', function($routeProvider) {
	$routeProvider
	// route zur login page
	.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'loginController',
		hideMenus : true
	})

	// route zur zuletztGebuchte page
	.when('/zuletztGebuchte', {
		templateUrl : 'views/zuletztGebuchte.html',
		controller : 'zuletztGebuchteController'
	})

	// route zur alle Auftraege page
	.when('/alleAuftraege', {
		templateUrl : 'views/alleAuftraege.html',
		controller : 'alleAuftraegeController'
	})

	// route zur Buchungen anzeigen page
	.when('/buchungenAnzeigen', {
		templateUrl : 'views/buchungenAnzeigen.html',
		controller : 'buchungenAnzeigenController'
	})

	// route zur buchungErstellen page
	.when('/buchungErstellen', {
		templateUrl : 'views/buchungErstellen.html',
		controller : 'buchungErstellenController'
	})

	// route zur administration page
	.when('/administration', {
		templateUrl : 'views/administration.html',
		controller : 'administrationController'
	})

	// route zur arbeitspaketAnlegen page
	.when('/arbeitspaketAnlegen', {
		templateUrl : 'views/arbeitspaketAnlegen.html',
		controller : 'arbeitspaketAnlegenController'
	})

	// route zur auftragBearbeiten page
	.when('/arbeitspaketBearbeiten', {
		templateUrl : 'views/arbeitspaketBearbeiten.html',
		controller : 'arbeitspaketBearbeitenController'
	})

	// route zur auftragBearbeiten page
	.when('/auftragBearbeiten', {
		templateUrl : 'views/auftragBearbeiten.html',
		controller : 'auftragBearbeitenController'
	})

	// route zur auftragBearbeiten page
	.when('/reporting', {
		templateUrl : 'views/reporting.html',
		controller : 'reportingController'
	})

	// wird keine der routen gewaehlt wird zur login page verbunden
	.otherwise({
		redirectTo : '/login'
	});
} ])

.run([ '$rootScope', '$location', '$cookieStore', '$http', function($rootScope, $location, $cookieStore, $http) {
	// keep user logged in after page refresh
	$rootScope.globals = $cookieStore.get('globals') || {};
	if ($rootScope.globals.currentUser) {
		// $http.defaults.headers.common['Authorization'] = 'Basic ' +
		// $rootScope.globals.currentUser.authdata; // jshint
		// ignore:line
	}

	$rootScope.$on('$locationChangeStart', function(event, next, current) {
		// redirect to login page if not logged in
		if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
			$location.path('/login');
		}
	});
} ]);
