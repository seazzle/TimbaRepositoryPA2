/**
 * 
 */

// FIXME
angular.module('Reporting').config(function($sceProvider, $httpProvider) {
	$sceProvider.enabled(false);
}).controller(
		'reportingController',
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

					$scope.isGruppenLeiter = true;

					$scope.ermittleReportConfig = function(auftragsName) {
						$http({
							url : serviceURL + '/report/reportConfig/' + $rootScope.user,
							method : "GET",
						// params: {action:
						// 'getZuletztBebuchteAP'}
						// headers: {
						// 'Content-Type': application/json
						// }
						}).success(function(data) {
							if (data.success == true) {
								$scope.showErrorBox = false;
								$scope.reportConfig = data.content;
							} else {
								$scope.showErrorBox = true;
								$scope.errorMessage = "Rochade Antwortet: " + data.message;
							}
						}).error(function(data, status) {
							$scope.showErrorBox = true;
							$scope.errorMessage = "bei der Anfrage ist ein Fehler aufgetreten";
							// $scope.errorMessage = "Status Code: " + status +
							// " Response Data
							// " + data || "Request failed";
						});
					}

					/**
					 * initialiesiert die Datumsfelder
					 */
					$scope.initReporting = function() {
						$scope.ermittleReportConfig();

						var today = new Date();
						var sevenDaysAgo = today - 1000 * 60 * 60 * 24 * 10;
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
						$('#endReportBtn').click(function() {
							// alert('clcikec');
							$(document).ready(function() {
								$("#endDatumReport").datepicker({
									dateFormat : 'dd.mm.yy',
									minDate : '-36M',
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
						$('#begReportBtn').click(function() {
							// alert('clcikec');
							$(document).ready(function() {
								$("#beginnDatumReport").datepicker({
									dateFormat : 'dd.mm.yy',
									minDate : '-36M',
									maxDate : '+0D',
									monthNames : [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
									dayNames : [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
									dayNamesMin : [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ]
								}).focus();
							});
						});
					}

					$scope.selectedReport = "aufwandNachAuftragArbeitspaket";
					$scope.serviceCall = $scope.selectedReport;

					$scope.reportingUser = {
						"name" : $rootScope.user,
						"kurzbeschreibung" : $rootScope.angemeldeterUser
					};

					// FIXME
					// mitarbeiteraufwand --> mitarbeiter aendern zurueck auf
					// mein aufwand --> falscher MA

					// $scope.changeSelect = function(){
					// if($scope.selectedReport=="aufwandNachAuftragArbeitspaketFuerMitarbeiter"||$scope.selectedReport=="aufwandNachAuftragArbeitspaket"){
					// $scope.serviceCall==aufwandNachAuftragArbeitspaket;
					//							
					// }else{
					// $scope.serviceCall="aufwandNachAuftragArbeitspaket";
					// }
					// }

					$scope.downloadReport = function() {
						window.open(serviceURL + "/report/" + $scope.serviceCall + "/" + $scope.reportingUser.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/"
								+ germanDateFormatter($scope.endDatum.value), '_blank');
					}
				} ]);