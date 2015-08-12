'use strict';

/**
 * arbeitspaket anlegen
 */
angular.module('ArbeitspaketAnlegen').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('arbeitspaketAnlegenController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {
	$log.debug("ArbeitspaketAnlegen: ");
	$scope.showErrorBox = false;
	$scope.showSuccessBox = false;
	$scope.initArbeitspaketAnlegen = function() {
		$scope.auftrag = $rootScope.rsAuftrag;
		$scope.auftragKurzbeschreibung = $scope.auftrag.kurzbeschreibung;
		$rootScope.clearRootScope();
	}

	$scope.arbeitspaketAnlegen = function() {
		var arbeitspaket = {
			"kurzbeschreibung" : $scope.kurzbeschreibung,
			"beschreibung" : $scope.beschreibung,
			"planAufwand" : $scope.planAufwand
		}

		$log.debug(angular.toJson(arbeitspaket));

		$http({
			url : serviceURL + '/zeiterfassung/' + $scope.auftrag.name + '/arbeitspaketAnlegen/',
			method : "POST",
			data : angular.toJson(arbeitspaket),
		}).success(function(data) {
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.showSuccessBox = true;
				$scope.successMessage = "das Arbeitspaket wurde erfolgreich angelegt";
				$scope.kurzbeschreibung = "";
				$scope.beschreibung = ""
				$scope.planAufwand = "";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Anlegen des Arbeitspaketes";
		});
	}

} ]);