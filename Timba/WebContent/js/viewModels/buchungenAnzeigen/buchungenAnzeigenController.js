'use strict';

/**
 * buchungen fuer die Tabellendarstellung
 */
angular.module('BuchungenAnzeigen').config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller(
		'buchungenAnzeigenController',
		[
				'$scope',
				'$http',
				'$rootScope',
				'$log',
				function($scope, $http, $rootScope, $log) {

					/**
					 * steuert die Sichtbarkeit der Error Box
					 */
					$scope.showErrorBox = false;

					/**
					 * steuert die Sichtbarkeit der Success Box diese wird nur
					 * aufgerufen, wenn es sich bei der function um eine POST
					 * Methode handelt Bei GET wird nur ueber Error
					 * benachrichtig, erfolg zeigt das Ergebnis
					 */
					$scope.showSuccessBox = false;

					/**
					 * initialiesiert die Datumsfelder
					 */
					$scope.initBuchungenAnzeigen = function() {
						var today = new Date();
						var sevenDaysAgo = today - 1000 * 60 * 60 * 24 * 7;
						sevenDaysAgo = new Date(sevenDaysAgo);

						$scope.beginnDatum = {
							value : "" + dateFormatter(today),
						}
						$scope.endDatum = {
							value : "" + dateFormatter(sevenDaysAgo),
						};

						/**
						 * datepicker fuer IE und Firefox
						 */
						$('#endBtn').click(function() {
							$(document).ready(function() {
								$("#endDatum").datepicker({
									dateFormat : 'dd.mm.yy',
									minDate : '-12M',
									maxDate : '+0D',
									monthNames : [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
									dayNames : [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
									dayNamesMin : [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ]
								}).focus();
							});
						});

						/**
						 * datepicker fuer IE und Firefox
						 */
						$('#begBtn').click(function() {
							$(document).ready(function() {
								$("#beginnDatum").datepicker({
									dateFormat : 'dd.mm.yy',
									minDate : '-12M',
									maxDate : '+0D',
									monthNames : [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
									dayNames : [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
									dayNamesMin : [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ]
								}).focus();
							});
						});

					}
					/**
					 * fuehrt eine erste Abfrage mit den initialwerten aus
					 * <code>initBuchungenAnzeigen()</code> durch
					 */
					$scope.buchungenAnzeigen = function() {
						$log.debug("buchungenAnzeigen: " + serviceURL + '/zeiterfassung/ermittleBuchungen/' + $rootScope.user + '/' + germanDateFormatter($scope.beginnDatum.value) + '/'
								+ germanDateFormatter($scope.endDatum.value));
						$http(
								{
									url : serviceURL + '/zeiterfassung/ermittleBuchungen/' + $rootScope.user + '/' + germanDateFormatter($scope.beginnDatum.value) + '/'
											+ germanDateFormatter($scope.endDatum.value) + '',
									method : "GET",
								}).success(function(data) {
							if (data.success == true) {
								$scope.showErrorBox = false;
								$scope.buchungen = data.content;
							} else {
								$scope.showErrorBox = true;
								$scope.errorMessage = "Rochade Antwortet: " + data.message;
							}
						}).error(function(data, status) {
							$scope.showErrorBox = true;
							$scope.errorMessage = "Fehler beim Anzeigen der Buchungen";
						});
					}

					/**
					 * variablen zum sortieren und suchen in der Tabelle
					 */
					$scope.sortType = 'buchungsDatum'; // set the
					// default sort
					// type
					$scope.sortReverse = true; // set the default sort
					// order
					$scope.searchAuftrag = ''; // set the default
					// search/filter term

					/**
					 * Einblenden des Kommentars
					 */
					$scope.tableRowExpanded = false;
					$scope.tableRowIndexExpandedCurr = "";
					$scope.tableRowIndexExpandedPrev = "";
					$scope.storeIdExpanded = "";

					$scope.dayDataCollapseFn = function() {
						$scope.dayDataCollapse = [];
						for (var i = 0; i < $scope.buchungen.length; i += 1) {
							$scope.dayDataCollapse.push(false);
						}
					};

					$scope.selectTableRow = function(index, storeId) {
						if (typeof $scope.dayDataCollapse === 'undefined') {
							$scope.dayDataCollapseFn();
						}
						if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
							$scope.tableRowIndexExpandedPrev = "";
							$scope.tableRowExpanded = true;
							$scope.tableRowIndexExpandedCurr = index;
							$scope.storeIdExpanded = storeId;
							$scope.dayDataCollapse[index] = true;
						} else if ($scope.tableRowExpanded === true) {
							if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === storeId) {
								$scope.tableRowExpanded = false;
								$scope.tableRowIndexExpandedCurr = "";
								$scope.storeIdExpanded = "";
								$scope.dayDataCollapse[index] = false;
							} else {
								$scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
								$scope.tableRowIndexExpandedCurr = index;
								$scope.storeIdExpanded = storeId;
								$scope.dayDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
								$scope.dayDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
							}
						}
					};

					/**
					 * legt eine Korrekturbuchung mit negativen Aufwand an
					 */
					$scope.storniereBuchung = function(arbeitspaket, istAufwand, kommentar) {
						$log.debug("storniereBuchung: ");
						var negativerAufwand = istAufwand * (-1);

						var buchung = {
							"arbeitsPaket" : arbeitspaket,
							"aufwand" : negativerAufwand,
							"kommentar" : "Stornobuchung zu: " + kommentar,
							"buchungsErsteller" : $rootScope.user
						}
						$log.debug("buchung: " + angular.toJson(buchung));

						if (confirm("Willst du die Buchung wirklich Stornieren") == true) {
							$log.debug("stornieren: " + serviceURL + '/zeiterfassung/buchen');
							$http({
								url : serviceURL + '/zeiterfassung/buchen',
								method : "POST",
								data : angular.toJson(buchung),
							}).success(function(data) {
								if (data.success == true) {
									$scope.showErrorBox = false;
									$rootScope.getUserInfo();
									$scope.buchungenAnzeigen();
									$scope.showSuccessBox = true;
									$scope.successMessage = "Die Buchung wurde storniert";
								} else {
									$scope.showErrorBox = true;
									$scope.errorMessage = "Rochade Antwortet: " + data.message;
								}
							}).error(function(data, status) {
								$scope.showErrorBox = true;
								$scope.errorMessage = "Fehler beim Stornieren der Buchung";
							});
						}
					}
				} ]);