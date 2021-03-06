/**
 * zuletzt bebuchte Arbeitspakete diese Page wird direkt nach dem Login
 * aufgerufen, wesehalb rootscope funktionen und variablen hier implementiert
 * werden, selbst wenn diese nicht in zuletzt bebuchte benoetigt werden
 */
angular.module('ZuletztGebuchte').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('zuletztGebuchteController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {

	/**
	 * steuert die Sichtbarkeit des Navigationsmenues nur beim LoginController
	 * true
	 */
	$rootScope.hideNavbarIcon = false;

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * entfernt die rootScope gespeicherten Variablen rsAuftrag und
	 * rsArbeitspakete diese Funktion wird in mehreren Controllern benoetigt, wo
	 * ein ein Auftrag oder ein Arbeitspaket transferiert werden muss
	 */
	$rootScope.clearRootScope = function() {
		delete $rootScope.rsAuftrag;
		delete $rootScope.rsArbeitspaket;
		delete $rootScope.rsSuccessMessage;
		delete $rootScope.rsShowSuccessBox;
	}

	/**
	 * initialiesiert die zuletzt bebuchte Page
	 */
	$scope.initZuletztGebucht = function() {
		$scope.getZuletztGebuchteAP();
		$rootScope.getUserInfo();
	}

	/**
	 * diese Funktion fordert ein UserInfo Objekt an, welches uebergreifende
	 * Informationen entaehlt e.g. die Anzahl der heute gebuchten Stunden
	 */
	$rootScope.getUserInfo = function() {
		$log.debug("getUserInfo: "+serviceURL + '/zeiterfassung/ermittleUserInfo/' + $rootScope.user);
		$http({
			url : serviceURL + '/zeiterfassung/ermittleUserInfo/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$rootScope.heuteGebucht = kaufm(data.content.heuteGebucht);
				$rootScope.angemeldeterUser = data.content.mitarbeiterName;
				$rootScope.angemeldeteSbNr = data.content.sbNr;
				$scope.showErrorBox = false;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Ermitteln der zuletzt gebuchten Arbeitspakete";
		});
	}

	/**
	 * laedt die zuletzt gebuchten Arbeitspakete vom Service und speichert das JSON in <code>$scope.auftraege</code>
	 */
	$scope.getZuletztGebuchteAP = function() {
		$log.debug("getZuletztGebuchteAP: "+serviceURL + '/zeiterfassung/ermittleMeineLetztenBebuchtenArbeitspakete/' + $rootScope.user);
		$http({
			url : serviceURL + '/zeiterfassung/ermittleMeineLetztenBebuchtenArbeitspakete/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
				$scope.showErrorBox = false;
				if (data.content.length == 0) {
					$scope.showInfoBox = true;
				}
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Beim Laden der zuletzt gebuchten Arbeitspakete ist ein Fehler aufgetreten";
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
	
	$scope.getSuccessMessages = function() {
		$scope.successMessage = $rootScope.rsSuccessMessage;
		$scope.showSuccessBox = $rootScope.rsShowSuccessBox;
		$rootScope.clearRootScope();
	}
} ]);