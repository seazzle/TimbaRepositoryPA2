'use strict';

/**
 * Steuert die Administrationsperspektiven: -AP anlegen -AP editieren -Auftrag
 * editieren
 */
angular.module('Administration').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('administrationController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {
	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * steuert die Sichtbarkeit der Success Box diese wird nur aufgerufen, wenn
	 * es sich bei der function um eine POST Methode handelt Bei GET wird nur
	 * ueber Error benachrichtig, erfolg zeigt das Ergebnis
	 */
	$scope.showSuccessBox = false;

	$scope.initAdministration = function() {
		$scope.getSuccessMessages();
		$scope.ermittleAdminBerechtigteAuftraege();
	}

	/**
	 * ermittelt Auftraege auf denen der User ein bearbeitungsrecht hat
	 */
	$scope.ermittleAdminBerechtigteAuftraege = function() {
		$log.debug("ermittleAdminBerechtigteAuftraege: " + serviceURL + '/zeiterfassung/ermittleAdminBerechtigteAuftraege/' + $rootScope.user);
		$http({
			url : serviceURL + '/zeiterfassung/ermittleAdminBerechtigteAuftraege/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim ermitteln der admin-berechtigten Auftraege";
		});
	}

	/**
	 * speichert einen Auftrag im rootScope fuer die AP erstellen Page
	 */
	$scope.openCreateArbeitspaket = function(auftrag) {
		$rootScope.rsAuftrag = auftrag;
	}

	/**
	 * speichert einen Auftrag und ein AP fuer die AP bearbeiten Page
	 */
	$scope.openEditArbeitspaket = function(arbeitspaket, auftrag) {
		$rootScope.rsAuftrag = auftrag;
		$rootScope.rsArbeitspaket = arbeitspaket;
	}

	/**
	 * speichert einen Auftrag zum bearbeiten auf der Auftrag bearbeiten Page
	 */
	$scope.openEditAuftrag = function(auftrag) {
		$rootScope.rsAuftrag = auftrag;
	}

	$scope.getSuccessMessages = function() {
		$scope.successMessage = $rootScope.rsSuccessMessage;
		$scope.showSuccessBox = $rootScope.rsShowSuccessBox;
		$rootScope.clearRootScope();
	}
} ]);

