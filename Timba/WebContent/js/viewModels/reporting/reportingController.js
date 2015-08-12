/**
 * 
 */

angular.module('Reporting').config(function($sceProvider, $httpProvider) {
	$sceProvider.enabled(false);
}).controller('reportingController', [ '$scope', '$http', '$rootScope', '$log', function($scope, $http, $rootScope, $log) {

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	$scope.isGruppenLeiter = true;

	$scope.ermittleReportConfig = function(auftragsName) {
		$log.debug("ermittleReportConfig:"+serviceURL + '/report/reportConfig/' + $rootScope.user);
		$http({
			url : serviceURL + '/report/reportConfig/' + $rootScope.user,
			method : "GET",
		}).success(function(data) {
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

	$scope.selectedReport = "aufwandNachAuftragArbeitspaket";
	$scope.serviceCall = $scope.selectedReport;
	

	$scope.reportingUser = {
		"name" : $rootScope.user,
		"kurzbeschreibung" : $rootScope.angemeldeterUser
	};

	$scope.downloadReport = function() {
		if($scope.selectedReport=='aufwandNachAuftragArbeitspaket'){
			$log.debug("ausgewaehlter Bericht: "+$scope.selectedReport);
			$log.debug("downloadReport: "+serviceURL + "/report/" + "aufwandNachAuftragArbeitspaket" + "/" + $scope.reportingUser.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value));
			$http.get(serviceURL + "/report/" + "aufwandNachAuftragArbeitspaket" + "/" + $scope.reportingUser.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value), {
				responseType : 'arraybuffer'
			}).success(function(data) {
				$log.debug("erfolgreich?"+data);
				var file = new Blob([ data ], {
				});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "beim Download des Mitarbeiterberichts ist ein Fehler aufgetreten";
			});
		}
		if($scope.selectedReport=='aufwandNachAuftragMitarbeiter'){
			$log.debug($scope.selectedReport);
			$log.debug(serviceURL + "/report/" + "aufwandNachAuftragMitarbeiter" + "/" + $scope.selectedAuftrag.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value));
			$http.get(serviceURL + "/report/" + "aufwandNachAuftragMitarbeiter" + "/" + $scope.selectedAuftrag.name + "/" + germanDateFormatter($scope.beginnDatum.value) + "/" + germanDateFormatter($scope.endDatum.value), {
				responseType : 'arraybuffer'
			}).success(function(data) {
				var file = new Blob([ data ], {
					type : 'application/pdf'
				});
				var fileURL = URL.createObjectURL(file);
				window.open(fileURL);
			}).error(function(data, status) {
				$scope.showErrorBox = true;
				$scope.errorMessage = "beim Download des Auftrag- / Projektberichts ist ein Fehler aufgetreten";
			});
		}
	}
} ]);