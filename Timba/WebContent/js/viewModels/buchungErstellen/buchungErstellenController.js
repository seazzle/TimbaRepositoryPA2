'use strict';

/**
 * dieser Controller steuert die Buchung erstellen Page
 */
angular.module('BuchungErstellen')

.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('buchungErstellenController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {
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
		if (angular.isUndefined($rootScope.rsAuftrag)) {
			/**
			 * die funktion wurde nicht ueber eine andere Page gerufen es muss
			 * kein auftrag im dropdown vor selektiert werden
			 */
		} else {
			$scope.selectedAuftrag = $rootScope.rsAuftrag;
			/**
			 * optischer workaround --> selected Auftrag ist vorausgewaehlt wird
			 * jedoch in der DropDownListe nicht richtig vorausgewaehlt inner
			 * HTML des chooseAuftrag Elements wird ausgetauscht nur optisch
			 * 
			 * BEGIN Workaround
			 */
			var jsonAuftrag = angular.fromJson($scope.selectedAuftrag);
			var chooseAuftragOption = document.getElementById("chooseAuftrag");
			chooseAuftragOption.innerHTML = jsonAuftrag.kurzbeschreibung;
			/**
			 * END Workaround
			 */

			$scope.selectedArbeitspaket = $rootScope.rsArbeitspaket;
			$rootScope.clearRootScope();
		}
	}

	/**
	 * fordert alle Auftraege und Arbeitspakete an auf denen der User
	 * buchungsberechtigt ist um sie ihm im Dropdown als verbindliche
	 * vorschlagswerte anzuzeigen
	 */
	$scope.getAuftrageUndArbeitspakete = function() {
		$http({
			url : serviceURL + '/zeiterfassung/ermittleAuftraege/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "bei der Anfrage ist ein Fehler aufgetreten";
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
		if (angular.isUndefined($scope.selectedArbeitspaket)) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Waehle ein Arbeitspaket";
		} else {
			var buchung = {
				"arbeitsPaket" : $scope.selectedArbeitspaket.name,
				"aufwand" : parseFloat($scope.istAufwand.replace(',', '.').replace(' ', '')),
				"kommentar" : $scope.kommentar,
				"buchungsErsteller" : $rootScope.user
			}

			$log.debug("Buchung:\n" + buchung);

			$http({
				url : serviceURL + '/zeiterfassung/buchen',
				method : "POST",
				data : buchung,
			}).success(function(data) {
				if (data.success == true) {
					$scope.showSuccessBox = true;
					$scope.showErrorBox = false;
					$scope.successMessage = "Buchung wurde erfolgreich erstellt";
					$scope.istAufwand = "";
					$scope.kommentar = "";
					$rootScope.getUserInfo();

					/**
					 * stoppuhr zuruecksetzten
					 */
					reset();
				} else {
					$scope.showErrorBox = true;
					$scope.errorMessage = "Rochade Antwortet: " + data.message;
				}
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "bei der Anfrage ist ein Fehler aufgetreten";
			});
		}
	}
} ]);