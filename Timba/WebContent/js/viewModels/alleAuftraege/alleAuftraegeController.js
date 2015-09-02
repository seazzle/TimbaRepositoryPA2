'use strict';
/**
 * dieser Controller steuert die Page, wo alle Auftraege angezeigt werden, auf
 * denen der user buchungsberechtigt ist
 */
angular.module('AlleAuftraege').config(function($sceProvider, $httpProvider) {
	$sceProvider.enabled(false);
}).controller('alleAuftraegeController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * diese Funktion ruft den Rochade Service um alle Auftraege zu bekommen
	 */
	$scope.getAllAuftraege = function() {
		$log.debug("getAllAuftraege: "+serviceURL + '/zeiterfassung/ermittleAuftraege/' + $rootScope.user);
		$http({
			url : serviceURL + '/zeiterfassung/ermittleAuftraege/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			$log.debug("Antwort-Objekt: "+angular.toJson(data.content));
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Ermitteln der buchungsberechtigten Auftraege";
		});
	}

	/**
	 * die methode speichert die angeklickten daten im rootscope als variablen
	 * um sie zwischen controllern auszutauschen
	 */
	$scope.openBuchungErstellen = function(arbeitspaket, auftrag) {
		$rootScope.rsAuftrag = auftrag;
		$rootScope.rsArbeitspaket = arbeitspaket;
	}
} ]);