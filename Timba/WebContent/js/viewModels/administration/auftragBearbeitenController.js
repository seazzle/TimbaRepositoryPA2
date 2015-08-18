'use strict';

/**
 * Auftrag bearbeiten
 */
angular.module('AuftragBearbeiten').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('auftragBearbeitenController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {
	$scope.showErrorBox = false;

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

	$scope.initAuftragBearbeiten = function() {
		$scope.name = $rootScope.rsAuftrag.name;
		$scope.kurzbeschreibung = $rootScope.rsAuftrag.kurzbeschreibung;
		$scope.beschreibung = $rootScope.rsAuftrag.beschreibung;
		$scope.planBeginn = rochadeDateFormatter($rootScope.rsAuftrag.planBeginn);
		$scope.planEnde = rochadeDateFormatter($rootScope.rsAuftrag.planEnde);
		$scope.buchungsberechtigte = $rootScope.rsAuftrag.buchungsberechtigte;
		$scope.ermittleMitarbeiterUndOrga($rootScope.rsAuftrag.name);
		$scope.type = $rootScope.rsAuftrag.type;
		$rootScope.clearRootScope();
	}
	
	/**
	 * variablen zum sortieren und suchen in der Tabelle
	 */
	$scope.sortType = 'name'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchMitarbeiter = ''; // set the default search/filter term

	$scope.ermittleMitarbeiterUndOrga = function(auftragsName) {
		$log.debug("ermittleMitarbeiterUndOrga: "+serviceURL + '/zeiterfassung/' + auftragsName + '/ermittleMitarbeiterUndOrga/');
		$http({
			url : serviceURL + '/zeiterfassung/' + auftragsName + '/ermittleMitarbeiterUndOrga/',
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.nichtBuchungsberechtigte = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Ermitteln der Mitarbeiter- und Organisationsstruktur";
		});
	}

	/**
	 * fuehrt die funktionen abhaengig vom aktuellen zustand aus
	 */
	$scope.change = function(mitarbeiter, checkboxValue) {
		if (checkboxValue == true) {
			$scope.addToBuchungsberechtigte(mitarbeiter);
		} else {
			$scope.removeFromBuchungsberechtige(mitarbeiter);
		}
	}

	/**
	 * fuegt einen uebergebenen Mitarbeiter aus der Menge der nicht
	 * buchungsberechtigten zu den buchungsberechtigten hinzu
	 */
	$scope.addToBuchungsberechtigte = function(mitarbeiter) {
		$log.debug("angeklickter mitarbeiter: \n" + (angular.toJson(mitarbeiter)));
		removeItem($scope.nichtBuchungsberechtigte, 'id', mitarbeiter.id);
		$scope.buchungsberechtigte.push(mitarbeiter);
		$log.debug("neue Buchungsberechtigte \n" + angular.toJson($scope.buchungsberechtigte));
	}

	/**
	 * fuegt den uebergebenen Mitarbeiter aus der Menge der buchungsberechtigten
	 * in die Menge der nicht Buchungsberechtigten hinzu
	 */
	$scope.removeFromBuchungsberechtige = function(mitarbeiter) {
		$log.debug("angeklickter mitarbeiter: \n" + (angular.toJson(mitarbeiter)));
		removeItem($scope.buchungsberechtigte, 'id', mitarbeiter.id);
		$log.debug("neue Buchungsberechtigte \n" + (angular.toJson($scope.buchungsberechtigte)));
		$scope.nichtBuchungsberechtigte.push(mitarbeiter);
	}

	/**
	 * zurueckschicken des AuftragObjektes an den Serivce
	 */
	$scope.editAuftrag = function() {
		var auftrag = {
			"kurzbeschreibung" : $scope.kurzbeschreibung,
			"beschreibung" : $scope.beschreibung,
			"buchungsberechtigte" : ($scope.buchungsberechtigte),
			"status" : $scope.selected.status
		}
		$log.debug(angular.toJson(auftrag));

		$log.debug("POST: "+serviceURL + '/zeiterfassung/' + $scope.name + '/edit');
		$http({
			url : serviceURL + '/zeiterfassung/' + $scope.name + '/edit',
			method : "POST",
			data : angular.toJson(auftrag),
		}).success(function(data) {
			if (data.success == true) {
				$rootScope.rsSuccessMessage = "Auftrag " + data.content.kurzbeschreibung + " wurde bearbeitet";
				$rootScope.rsShowSuccessBox = true;
				location.href = "#administration";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Fehler beim Speichern des Auftrages / Projektes";
		});
	}
} ]);