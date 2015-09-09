'use strict';

/**
 * dieser Controller steuert die Buchung erstellen Page
 */
angular.module('BuchungErstellen')

.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('buchungErstellenController', [ '$scope', '$http', '$rootScope', '$log', '$filter', '$timeout', function($scope, $http, $rootScope, $log, $filter, $timeout) {
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

	/**
	 * initialiesiert die buchungsErstellen Page
	 */
	$scope.initBuchungErstellen = function() {
		$scope.getAuftrageUndArbeitspakete();
	}
	
	/**
	 * fordert alle Auftraege und Arbeitspakete an auf denen der User
	 * buchungsberechtigt ist um sie ihm im Dropdown als verbindliche
	 * vorschlagswerte anzuzeigen
	 */
	$scope.getAuftrageUndArbeitspakete = function() {
		$log.debug("getAuftragUndArbeitspakete: "+serviceURL + '/zeiterfassung/ermittleAuftraege/' + $rootScope.user);
		$http({
			url : serviceURL + '/zeiterfassung/ermittleAuftraege/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.auftraege = data.content;
				if (!angular.isUndefined($rootScope.rsAuftrag)) {
					$scope.selectedAuftrag= getById($scope.auftraege, $rootScope.rsAuftrag.id);
					$scope.selectedArbeitspaket = $rootScope.rsArbeitspaket;
					$rootScope.clearRootScope();
				}
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Beim Ermitteln der Projekte / Auftraege und ihrer Arbeitspakete ist ein Fehler aufgetreten";
		});
	}

	/**
	 * binding vom Inputfeld Industrie Stunde bei der Stopuhr zum IST Aufwand 
	 */
	$scope.updateISTAufwand = function() {
		var industrieMinute = document.getElementById("zeit").innerHTML;
		if (industrieMinute != 0) {
			$scope.istAufwand = industrieMinute;
		}
	}

	/**
	 * erstellt eine Buchung
	 */
	$scope.buchen = function() {
		$log.debug("buchen: ");
		if (angular.isUndefined($scope.selectedArbeitspaket)||angular.isUndefined($scope.selectedAuftrag)) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Waehle einen Auftrag und / oder ein Arbeitspaket";
		} else {
			var buchung = {
				"arbeitsPaket" : $scope.selectedArbeitspaket.name,
				"aufwand" : parseFloat($scope.istAufwand.replace(',', '.').replace(' ', '')),
				"kommentar" : $scope.kommentar,
				"buchungsErsteller" : $rootScope.user
			}

			$log.debug("buchung: "+angular.toJson(buchung));

			$log.debug("POST: "+serviceURL + '/zeiterfassung/buchen');
			$http({
				url : serviceURL + '/zeiterfassung/buchen',
				method : "POST",
				data : buchung,
			}).success(function(data) {
				$log.debug("Antwort-Objekt: "+angular.toJson(data.content));
				if (data.success == true) {
					$scope.showSuccessBox = true;
					$scope.showErrorBox = false;
					$scope.successMessage = "Buchung wurde erfolgreich erstellt";
					$scope.istAufwand = "";
					$scope.kommentar = "";
					$rootScope.getUserInfo();

					reset();
				} else {
					$scope.showErrorBox = true;
					$scope.errorMessage = "Rochade Antwortet: " + data.message;
				}
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Beim Anlegen der Buchung ist ein Fehler aufgetreten";
			});
		}
	}
}]);