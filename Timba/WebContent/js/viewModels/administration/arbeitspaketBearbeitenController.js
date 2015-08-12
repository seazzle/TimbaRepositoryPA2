'use strict';
/**
 * Arbeitspaket bearbeiten
 */
angular.module('ArbeitspaketBearbeiten').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('arbeitspaketBearbeitenController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {
	$scope.statusOptions = [ {
		name : 'Offen',
		value : 'offen'
	}, {
		name : 'Geschlossen',
		value : 'geschlossen'
	} ];

	$scope.selected = {
		status : $scope.statusOptions[0].value
	};

	$scope.initArbeitspaketBearbeiten = function() {
		$scope.auftrag = $rootScope.rsAuftrag;
		$scope.arbeitspaket = $rootScope.rsArbeitspaket;

		$scope.name = $rootScope.rsArbeitspaket.name;
		$scope.kurzbeschreibung = $rootScope.rsArbeitspaket.kurzbeschreibung;
		$scope.beschreibung = $rootScope.rsArbeitspaket.beschreibung;
		$scope.planAufwand = $rootScope.rsArbeitspaket.planAufwand;
	}

	$scope.arbeitspaketBearbeiten = function() {
		var arbeitspaket = {
			"kurzbeschreibung" : $scope.kurzbeschreibung,
			"beschreibung" : $scope.beschreibung,
			"planAufwand" : $scope.planAufwand,
			"status" : $scope.selected.status
		}

		$log.debug(angular.toJson(arbeitspaket));

		$http({
			url : serviceURL + '/zeiterfassung/' + $scope.auftrag.name + '/' + $scope.arbeitspaket.name + '/edit',
			method : "POST",
			data : angular.toJson(arbeitspaket),
		}).success(function(data) {
			if (data.success == true) {
				$rootScope.rsSuccessMessage = "Arbeitspaket " + data.content.kurzbeschreibung + " wurde erfolgreich geaendert";
				$rootScope.rsShowSuccessBox = true;
				$log.debug($rootScope.rsShowSuccessBox);
				location.href = "#administration";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Speichern des Arbeitspaketes";
		});
	}
} ]);
