/**
 * Controller fuer Reporting Funktionen
 */
angular.module('Reporting').config(function($sceProvider, $httpProvider) {
	$sceProvider.enabled(false);
}).controller('reportingController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	$scope.isGruppenLeiter = true;

	/**
	 * ermittelt die Konfiguration fuer das Reporting
	 * diese binhaltet welche Berichte erlaubt werden fuer den User sowie die Daten die fuer die Berichte benoetigt werden
	 */
	$scope.ermittleReportConfig = function(auftragsName) {
		$log.debug("ermittleReportConfig:"+serviceURL + '/report/reportConfig/' + $rootScope.user);
		$http({
			url : serviceURL + '/report/reportConfig/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
			$log.debug("Antwort-Objekt: "+angular.toJson(data.content));
			if (data.success == true) {
				$scope.showErrorBox = false;
				$scope.reportConfig = data.content;
				if($scope.reportConfig.auftraege.length>0){
					$scope.selectedAuftrag=$scope.reportConfig.auftraege[0];
				}
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "beim Laden der ReportConfig ist ein Fehler aufgetreten";
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

	/**
	 * initiale Auswahl welcher Report verfuegbar ist
	 * Mitarbeiterbericht fuer den User ist immer verfuegbar
	 */
	$scope.selectedReport = "aufwandNachAuftragArbeitspaket";
	$scope.serviceCall = $scope.selectedReport;
	

	/**
	 * User fuer den der Bericht ausgefuehrt wird.
	 * Nicht immer gleich der angemeldete User --> Gruppenleitung.
	 */
	$scope.reportingUser = {
		"name" : $rootScope.user,
		"kurzbeschreibung" : $rootScope.angemeldeterUser
	};

	/**
	 * Downloaded den ausgewaehlten Report abhaengig von <code>selectedReport</code>
	 */
	$scope.downloadReport = function() {
		/**
		 * download fuer den Mitarbeiterbericht
		 */
		if($scope.selectedReport=='aufwandNachAuftragArbeitspaket'){
			$log.debug("ausgewaehlter Bericht: "+$scope.selectedReport);
			$log.debug("downloadReport: "+serviceURL + "/report/" + "aufwandNachAuftragArbeitspaket" + "/" + $scope.reportingUser.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value));
			
			$http.get(serviceURL + "/report/" + "aufwandNachAuftragArbeitspaket" + "/" + $scope.reportingUser.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value), {
				responseType : 'arraybuffer'
			}).success(function(data) {
				$log.debug("der Aufruf war erfolgreich");
				
				var a = document.createElement("a");
			    document.body.appendChild(a);
			    a.style = "display: none";
				
				var file = new Blob([ data ], {
					type : 'application/pdf'
				});
				
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				    window.navigator.msSaveOrOpenBlob(file, "Mitarbeiterbericht-"+$scope.reportingUser.name + "-" + germanDateFormatter($scope.beginnDatum.value) + "-" + germanDateFormatter($scope.endDatum.value)+".pdf");
				}
				else {
				    var objectUrl = URL.createObjectURL(file);
				    
				    a.href = objectUrl;
			        a.download = ("Mitarbeiterbericht-"+$scope.reportingUser.name + "-" + germanDateFormatter($scope.beginnDatum.value) + "-" + germanDateFormatter($scope.endDatum.value)+".pdf");
			        a.click();
				    
			        window.URL.revokeObjectURL(objectUrl);
				}
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "beim Download des Mitarbeiterberichts ist ein Fehler aufgetreten";
			});
		}
		
		/**
		 * Download fuer den Auftragsbericht
		 */
		if($scope.selectedReport=='aufwandNachAuftragMitarbeiter'){
			$log.debug("ausgewaehlter Bericht: "+$scope.selectedReport);
			$log.debug(serviceURL + "/report/" + "aufwandNachAuftragMitarbeiter" + "/" + $scope.selectedAuftrag.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value));
			
			$http.get(serviceURL + "/report/" + "aufwandNachAuftragMitarbeiter" + "/" + $scope.selectedAuftrag.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value), {
				responseType : 'arraybuffer'
			}).success(function(data) {
				$log.debug("der Aufruf war erfolgreich");
				
				var a = document.createElement("a");
			    document.body.appendChild(a);
			    a.style = "display: none";
				
				var file = new Blob([ data ], {
					type : 'application/pdf'
				});
				
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				    window.navigator.msSaveOrOpenBlob(file, "Bericht-"+$scope.selectedAuftrag.name + "-" + germanDateFormatter($scope.beginnDatum.value) + "-" + germanDateFormatter($scope.endDatum.value)+".pdf");
				}
				else {
				    var objectUrl = URL.createObjectURL(file);
				    
				    a.href = objectUrl;
			        a.download = "Bericht-"+$scope.selectedAuftrag.name + "-" + germanDateFormatter($scope.beginnDatum.value) + "-" + germanDateFormatter($scope.endDatum.value)+".pdf";
			        a.click();
				    
			        window.URL.revokeObjectURL(objectUrl);
				}
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "beim Download des Auftrag- / Projektberichts ist ein Fehler aufgetreten";
			});
		}
	}
} ]);