/**
 * das JavaScript beinhaltet saemtliche funktionalitaeten welche die TimbaApp am Client ausfuehrt.
 * Genutzt wird hierfuer Angular.js, weshalb in den HTML Elementen spezielle Attribute gesetzt werden muessen.
 * Angular Attribute beginnen mit dem Prefix <cod>ng-*</code>
 */

/**
 * Angular modul welches in der index.html hinterlegt ist wird hier als objekt
 * in einer Variabe gehalten. <code>ng-app="timba"</code>
 */
var timba = angular.module('timba', [ 'ngRoute', 'ngCookies', 'ui.bootstrap' ]);

var user = "1270";

/**
 * Routing um die Pages zu injecten
 */
timba.config([ '$routeProvider', function($routeProvider) {
	$routeProvider
	// route zur login page
	.when('/login', {
		templateUrl : 'pages/login.html',
		controller : 'loginController',
		hideMenus : true
	})

	// route zur zuletztBebuchte page
	.when('/zuletztBebuchte', {
		templateUrl : 'pages/zuletztBebuchte.html',
		controller : 'zuletztBebuchteController'
	})

	// route zur alle Auftraege page
	.when('/alleAuftraege', {
		templateUrl : 'pages/alleAuftraege.html',
		controller : 'alleAuftraegeController'
	})

	// route zur Buchungen anzeigen page
	.when('/buchungenAnzeigen', {
		templateUrl : 'pages/buchungenAnzeigen.html',
		controller : 'buchungenAnzeigenController'
	})

	// route zur buchungErstellen page
	.when('/buchungErstellen', {
		templateUrl : 'pages/buchungErstellen.html',
		controller : 'buchungErstellenController'
	})

	// route zur administration page
	.when('/administration', {
		templateUrl : 'pages/administration.html',
		controller : 'administrationController'
	})

	// route zur arbeitspaketAnlegen page
	.when('/arbeitspaketAnlegen', {
		templateUrl : 'pages/arbeitspaketAnlegen.html',
		controller : 'arbeitspaketAnlegenController'
	})

	// route zur auftragBearbeiten page
	.when('/arbeitspaketBearbeiten', {
		templateUrl : 'pages/arbeitspaketBearbeiten.html',
		controller : 'arbeitspaketBearbeitenController'
	})

	// route zur auftragBearbeiten page
	.when('/auftragBearbeiten', {
		templateUrl : 'pages/auftragBearbeiten.html',
		controller : 'auftragBearbeitenController'
	})

	// wird keine der routen gewaehlt wird zur login page verbunden
	.otherwise({
		redirectTo : '/login'
	});
} ])

/**
 * prueft ob der user noch eingeloggt ist
 */
.run(
		[
				'$rootScope',
				'$location',
				'$cookieStore',
				'$http',
				function($rootScope, $location, $cookieStore, $http) {
					// keep user logged in after page refresh
					$rootScope.globals = $cookieStore.get('globals') || {};
					if ($rootScope.globals.currentUser) {
						// $http.defaults.headers.common['Authorization'] =
						// 'Basic ' + $rootScope.globals.currentUser.authdata;
						// // jshint ignore:line
					}

					$rootScope.$on('$locationChangeStart', function(event,
							next, current) {
						// redirect to login page if not logged in
						if ($location.path() !== '/login'
								&& !$rootScope.globals.currentUser) {
							$location.path('/login');
						}
					});
				} ]);

// create the controller and inject Angular's $scope
timba.controller('loginController', function($scope) {
	// create a message to display in our view
	$scope.message = 'willkommen beim TimbaLogin';
});

timba.controller('zuletztBebuchteController', function($scope) {
	// create a message to display in our view
	$scope.message = 'hier siehst du deine zuletzt bebuchten Auftraege';
});

timba
		.controller(
				'alleAuftraegeController',
				function($scope) {
					$scope.message = 'hier siehst du alle Auftraege auf denen du buchungsberechtigt bist';
				});

timba.controller('buchungenAnzeigenController', function($scope) {
	$scope.message = 'hier siehst du deine Buchungen der letzten 30 Tage';
});

timba.controller('buchungErstellenController', function($scope) {
	$scope.message = 'hier kannst du eine neue Buchung erstellen';
});

timba
		.controller(
				'administrationController',
				function($scope) {
					$scope.message = 'hier siehst du die Auftraege und die Arbeitspakete auf denen du Pflege-Rechte besitzt';
				});

timba.controller('arbeitspaketAnlegenController', function($scope) {
	$scope.message = 'hier kannst du ein Arbeitspaket anlegen';
});

timba.controller('arbeitspaketBearbeitenController', function($scope) {
	$scope.message = 'hier kannst du ein Arbeitspaket bearbeiten';
});

timba.controller('auftragBearbeitenController', function($scope) {
	$scope.message = 'hier kannst du einen Auftrag bearbeiten';
});

/**
 * prueft den Service redirected auf zuletzt bebuchte
 */
timba.controller('loginController', [
		'$scope',
		'$rootScope',
		'$http',
		'$location',
		'AuthenticationService',
		function($scope, $rootScope, $http, $location, AuthenticationService) {

			/**
			 * prueft ob es die login seite ist
			 */
			if ($location.path() === '/login') {
				$rootScope.hideNavbarIcon = true;
			}

			// reset login status
			AuthenticationService.ClearCredentials();

			$scope.login = function() {
				$scope.dataLoading = true;
				AuthenticationService.Login($scope.username, $scope.password,
						function(response) {
							if (response.success) {
								AuthenticationService.SetCredentials(
										$scope.username, $scope.password);
								$location.path('/zuletztBebuchte');
							} else {
								$scope.error = response.message;
								$scope.dataLoading = false;
							}
						});
			};
		} ]);

timba
		.factory(
				'AuthenticationService',
				[
						'Base64',
						'$http',
						'$cookieStore',
						'$rootScope',
						'$timeout',
						function(Base64, $http, $cookieStore, $rootScope,
								$timeout) {
							var service = {};
							service.Login = function(username, password,
									callback) {
								/*
								 * Dummy authentication for testing, uses
								 * $timeout to simulate api call
								 * ----------------------------------------------
								 */
								$timeout(
										function() {
											var response = {
												success : username == password
											};
											user = username;
											if (!response.success) {
												response.message = 'Deine Sachbearbeiternummer oder dein Passwort sind falsch';
											}
											callback(response);
										}, 1000);

								/*
								 * Use this for real authentication
								 * ----------------------------------------------
								 */
								// $http.post('/api/authenticate', { username:
								// username, password: password })
								// .success(function (response) {
								// callback(response);
								// });
							};

							service.SetCredentials = function(username,
									password) {
								var authdata = Base64.encode(username + ':'
										+ password);

								$rootScope.globals = {
									currentUser : {
										username : username,
										authdata : authdata
									}
								};

								// $http.defaults.headers.common['Authorization']
								// = 'Basic ' + authdata; // jshint ignore:line
								$cookieStore.put('globals', $rootScope.globals);
							};

							service.ClearCredentials = function() {
								$rootScope.globals = {};
								$cookieStore.remove('globals');
								// $http.defaults.headers.common.Authorization =
								// 'Basic ';
							};
							return service;
						} ])

		.factory(
				'Base64',
				function() {
					/* jshint ignore:start */

					var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

					return {
						encode : function(input) {
							var output = "";
							var chr1, chr2, chr3 = "";
							var enc1, enc2, enc3, enc4 = "";
							var i = 0;

							do {
								chr1 = input.charCodeAt(i++);
								chr2 = input.charCodeAt(i++);
								chr3 = input.charCodeAt(i++);

								enc1 = chr1 >> 2;
								enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
								enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
								enc4 = chr3 & 63;

								if (isNaN(chr2)) {
									enc3 = enc4 = 64;
								} else if (isNaN(chr3)) {
									enc4 = 64;
								}

								output = output + keyStr.charAt(enc1)
										+ keyStr.charAt(enc2)
										+ keyStr.charAt(enc3)
										+ keyStr.charAt(enc4);
								chr1 = chr2 = chr3 = "";
								enc1 = enc2 = enc3 = enc4 = "";
							} while (i < input.length);

							return output;
						},

						decode : function(input) {
							var output = "";
							var chr1, chr2, chr3 = "";
							var enc1, enc2, enc3, enc4 = "";
							var i = 0;

							// remove all characters that are not A-Z, a-z, 0-9,
							// +, /, or =
							var base64test = /[^A-Za-z0-9\+\/\=]/g;
							if (base64test.exec(input)) {
								window
										.alert("There were invalid base64 characters in the input text.\n"
												+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
												+ "Expect errors in decoding.");
							}
							input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

							do {
								enc1 = keyStr.indexOf(input.charAt(i++));
								enc2 = keyStr.indexOf(input.charAt(i++));
								enc3 = keyStr.indexOf(input.charAt(i++));
								enc4 = keyStr.indexOf(input.charAt(i++));

								chr1 = (enc1 << 2) | (enc2 >> 4);
								chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
								chr3 = ((enc3 & 3) << 6) | enc4;

								output = output + String.fromCharCode(chr1);

								if (enc3 != 64) {
									output = output + String.fromCharCode(chr2);
								}
								if (enc4 != 64) {
									output = output + String.fromCharCode(chr3);
								}

								chr1 = chr2 = chr3 = "";
								enc1 = enc2 = enc3 = enc4 = "";

							} while (i < input.length);

							return output;
						}
					};
				});

/**
 * Hier beginnen die Funktionen der eigentlichen Pages
 */
// daten lesen
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'zuletztBebuchteController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
							$rootScope.hideNavbarIcon = false;

							/**
							 * entfernt im rootScope gespeicherte Variablen
							 */
							$rootScope.clearRootScope = function() {
								delete $rootScope.rsAuftrag;
								delete $rootScope.rsArbeitspaket;
							}

							$scope.initZuletztBebucht = function() {
								$scope.getZuletztBebuchteAP();
								$rootScope.getUserInfo();
							}

							/**
							 * diese Funktion fordert ein UserInfo Objekt an,
							 * welches die sichtbarkeit der
							 * Administrationsperspektive steuert und die Anzahl
							 * der heute bebuchten Stunden aktualisiert
							 */
							$rootScope.getUserInfo = function() {
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleUserInfo/'
													+ user,
											method : "GET",
										// params: {action: 'getAllAuftraege'}
										// headers: {
										// 'Content-Type': application/json
										// },

										})
										.success(
												function(data) {
													// $rootScope.auftragEditPermission=data.content.permissions.editAuftrag;
													// $rootScope.arbeitspaketCreatePermission=data.content.permissions.createArbeitspaket;
													//         	
													// //FIXME nur zum
													// weiterarbeiten
													// $rootScope.auftragEditPermission=true;
													// $rootScope.arbeitspaketCreatePermission=true;

													$rootScope.heuteGebucht = data.content.heuteGebucht;
												});
							}

							$scope.getZuletztBebuchteAP = function() {
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleMeineLetztenBebuchtenArbeitspakete/'
													+ user,
											method : "GET",
										// params: {action:
										// 'getZuletztBebuchteAP'}
										// headers: {
										// 'Content-Type': application/json
										// }
										}).success(function(data) {
									if (data.success == false) {
										$scope.error = data.message;
									} else {
										$scope.auftraege = data.content;
									}
								});
							}

							/**
							 * die methode speichert die angeklickten daten im
							 * rootscope als variablen um sie zwischen
							 * controllern auszutauschen
							 */
							$scope.openBuchungErstellen = function(
									arbeitspaket, auftrag) {
								$rootScope.rsAuftrag = auftrag;
								$rootScope.rsArbeitspaket = arbeitspaket;
								$rootScope.rsStorno = false;
							}
						} ]);

timba
		.config(function($sceProvider, $httpProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'alleAuftraegeController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
							$scope.getAllAuftraege = function() {

								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAuftraege/'
													+ user,
											method : "GET",
										// params: {action: 'getAllAuftraege'}
										// headers: {
										// 'Content-Type': application/json
										// },

										}).success(function(data) {
									$scope.auftraege = data.content;
								});
							}

							/**
							 * die methode speichert die angeklickten daten im
							 * rootscope als variablen um sie zwischen
							 * controllern auszutauschen
							 */
							$scope.openBuchungErstellen = function(
									arbeitspaket, auftrag) {
								$rootScope.rsAuftrag = auftrag;
								$rootScope.rsArbeitspaket = arbeitspaket;
								$rootScope.rsStorno = false;
							}
						} ]);

timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'buchungErstellenController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
							// TODO
							$scope.initBuchungErstellen = function() {
								$scope.getAuftrageUndArbeitspakete();
								if (angular.isUndefined($rootScope.rsAuftrag)) {
									// alert("rootscope is undefined");
									// rootscope is undefined --> u called the
									// function without params
									// nothing more to do
								} else {
									$scope.selectedAuftrag = $rootScope.rsAuftrag;

									/**
									 * optischer workaround --> selected Auftrag
									 * ist vorausgewaehlt wird jedoch in der
									 * DropDownListe nicht richtig
									 * vorausgewaehlt inner HTML des
									 * chooseAuftrag Elements wird ausgetauscht
									 * nur optisch
									 * 
									 * BEGIN Workaround
									 */

									var jsonAuftrag = angular
											.fromJson($scope.selectedAuftrag);
									var chooseAuftragOption = document
											.getElementById("chooseAuftrag");
									chooseAuftragOption.innerHTML = jsonAuftrag.kurzbeschreibung;

									/**
									 * END Workaround
									 */

									$scope.selectedArbeitspaket = $rootScope.rsArbeitspaket;
									$rootScope.clearRootScope();
								}
							}

							$scope.getAuftrageUndArbeitspakete = function() {
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAuftraege/'
													+ user,
											method : "GET",
										// params: {action: 'getAllAuftraege'}
										}).success(function(data) {
									$scope.auftraege = data.content;
//									location.href = "#top";FIXME
								});
							}

							$scope.updateISTAufwand = function() {
								var industrieMinute = document
										.getElementById("zeit").innerHTML;
								if (industrieMinute != 0) {
									$scope.istAufwand = industrieMinute;
								}
							}

							$scope.confirmBuchen = function() {
								meldung.setAttribute("class",
										"alert alert-success");
								$(meldung).css("display", "block");
								$scope.message = 'dein Buchung wurde uebermittelt';
								var jsonAuftrag = angular
										.fromJson($scope.selectedAuftrag);
								$scope.selectedAuftrag = jsonAuftrag.name;
								var jsonArbeitspaket = angular
										.fromJson($scope.selectedArbeitspaket);
								$scope.selectedArbeitspaket = jsonArbeitspaket.name;

								var buchung = {
									"arbeitsPaket" : $scope.selectedArbeitspaket,
									"aufwand" : parseFloat($scope.istAufwand
											.replace(',', '.').replace(' ', '')),
									"kommentar" : $scope.kommentar,
									"buchungsErsteller" : user
								}

								console.log(buchung);

								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/buchen',
											method : "POST",
											data : buchung,
										})
										.success(
												function(data) {
													$scope.istAufwand = "";
													$scope.kommentar = "";
													document
															.getElementById(
																	"buchenButton")
															.setAttribute(
																	"style",
																	"display: block");
													document
															.getElementById(
																	"confirmButton")
															.setAttribute(
																	"style",
																	"display: none");
													$rootScope.getUserInfo();
													alert("die Buchung wurde hinzugefuegt");
												});
								// setTimeout("location.reload(true);",2000);
							}

							$scope.buchen = function() {
								var meldung = document
										.getElementById("meldung");
								if (angular.isUndefined($scope.selectedAuftrag)) {
									$(meldung).css("display", "block");
									$scope.message = 'waehle einen Auftrag';
								} else if (angular
										.isUndefined($scope.selectedArbeitspaket)) {
									$(meldung).css("display", "block");
									$scope.message = 'waehle ein Arbeitspaket';
								} else if (angular
										.isUndefined($scope.istAufwand)) {
									$(meldung).css("display", "block");
									$scope.message = 'gib deinen IST Aufwand in Stunden an';
								} else if ($scope.istAufwand > 30) {
									var confirmButton = document
											.getElementById("confirmButton");
									var buchenButton = document
											.getElementById("buchenButton");
									meldung.setAttribute("class",
											"alert alert-info");
									$(meldung).css("display", "block");
									$scope.message = 'willst du wirklich '
											+ $scope.istAufwand
											+ ' Stunden erfassen';
									$(confirmButton).css("display", "block");
									$(buchenButton).css("display", "none");
								} else {
									$scope.confirmBuchen();
								}
							}
						} ]);

/**
 * buchungen fuer die Tabellendarstellung
 */
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'buchungenAnzeigenController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {

							/**
							 * initialiesiert die Datumsfelder
							 */
							$scope.initBuchungenAnzeigen = function() {
								var today = new Date();
								var sevenDaysAgo = today - 1000 * 60 * 60 * 24
										* 7;
								sevenDaysAgo = new Date(sevenDaysAgo);

								$scope.beginnDatum = {
									value : today,
								}
								$scope.endDatum = {
									value : sevenDaysAgo,
								};
							}

							/**
							 * fuehrt eine erste Abfrage mit den initialwerten
							 * aus <code>initBuchungenAnzeigen()</code> durch
							 */
							$scope.buchungenAnzeigen = function() {
								// console.log(dateFormatter($scope.beginnDatum.value));
								// console.log(dateFormatter($scope.endDatum.value));
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleBuchungen/'
													+ user
													+ '/'
													+ dateFormatter($scope.beginnDatum.value)
													+ '/'
													+ dateFormatter($scope.endDatum.value)
													+ '',
											method : "GET",
										}).success(function(data) {
									$scope.buchungen = data.content;
								});
							}

							// $scope.openBuchungErstellen =
							// function(arbeitspaket, auftrag){
							// $rootScope.rsAuftrag=auftrag;
							// $rootScope.rsArbeitspaket=arbeitspaket;
							// $rootScope.rsStorno=false;
							// }

							/**
							 * variablen zum sortieren und suchen in der Tabelle
							 */
							$scope.sortType = 'buchungsDatum'; // set the
							// default sort
							// type
							$scope.sortReverse = false; // set the default sort
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

								if ($scope.tableRowExpanded === false
										&& $scope.tableRowIndexExpandedCurr === ""
										&& $scope.storeIdExpanded === "") {
									$scope.tableRowIndexExpandedPrev = "";
									$scope.tableRowExpanded = true;
									$scope.tableRowIndexExpandedCurr = index;
									$scope.storeIdExpanded = storeId;
									$scope.dayDataCollapse[index] = true;
								} else if ($scope.tableRowExpanded === true) {
									if ($scope.tableRowIndexExpandedCurr === index
											&& $scope.storeIdExpanded === storeId) {
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
							 * legt eine Korrekturbuchung mit negativen Aufwand
							 * an
							 */
							$scope.storniereBuchung = function(arbeitspaket,
									istAufwand, kommentar) {
								var negativerAufwand = istAufwand * (-1);
								console.log(negativerAufwand);

								var buchung = {
									"arbeitsPaket" : arbeitspaket,
									"aufwand" : negativerAufwand,
									"kommentar" : "Stornobuchung zu: "
											+ kommentar,
									"buchungsErsteller" : user
								}
								console.log(buchung);

								if (confirm("Willst du wirklich Stornieren") == true) {
									$http(
											{
												url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/buchen',
												method : "POST",
												data : buchung,
											}).success(function(data) {
										$rootScope.getUserInfo();
										alert("die Buchung wurde storniert");
									});
									// location.reload();
									$scope.buchungenAnzeigen();
								}
							}
						} ]);

/**
 * Steuert die Administrationsperspektiven: -AP anlegen -AP editieren -Auftrag
 * editieren
 */
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'administrationController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
							// $selectedAuftrag="";
							// $scope.auftraege = [ {id: 123, name: 1,
							// kurzbeschreibung: 'n1'}, {id: 234, name: 2,
							// kurzbeschreibung: 'n2'}];
							// $scope.permission = "CREATE_ARBEITSPAKET";

							$scope.ermittleAdminBerechtigteAuftraege = function() {
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAdminBerechtigteAuftraege/'
													+ user,
											method : "GET",
										// params: {action:
										// 'getZuletztBebuchteAP'}
										// headers: {
										// 'Content-Type': application/json
										// }
										}).success(function(data) {
									if (data.success == false) {
										$scope.error = data.message;
									} else {
										$scope.auftraege = data.content;
									}
								});

							}

							$scope.openCreateArbeitspaket = function(auftrag) {
								$rootScope.rsAuftrag = auftrag;
							}

							$scope.openEditArbeitspaket = function(
									arbeitspaket, auftrag) {
								$rootScope.rsAuftrag = auftrag;
								$rootScope.rsArbeitspaket = arbeitspaket;
							}

							$scope.openEditAuftrag = function(auftrag) {
								$rootScope.rsAuftrag = auftrag;
							}
						} ]);

/**
 * arbeitspaket anlegen
 */
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'arbeitspaketAnlegenController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
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

								console.log(arbeitspaket);

								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/'
													+ $scope.auftrag.name
													+ '/arbeitspaketAnlegen/',
											method : "POST",
											data : arbeitspaket,
										})
										.success(
												function(data) {
													$scope.kurzbeschreibung = "";
													$scope.beschreibung = "";
													$scope.planAufwand = "";
													// document.getElementById("buchenButton").setAttribute("style",
													// "display: block");
													// document.getElementById("confirmButton").setAttribute("style",
													// "display: none");
													// $rootScope.getUserInfo();
													alert("das Arbeitspaket wurde hinzugefuegt");
												});
							}

						} ]);

/**
 * Arbeitspaket bearbeiten
 */
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'arbeitspaketBearbeitenController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {
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

							// $status=arbeitspaketStatus.name;

							$scope.arbeitspaketBearbeiten = function() {
								var arbeitspaket = {
									"kurzbeschreibung" : $scope.kurzbeschreibung,
									"beschreibung" : $scope.beschreibung,
									"planAufwand" : $scope.planAufwand,
									"status" : $scope.selected.status
								}

								console.log(arbeitspaket);
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/'
													+ $scope.auftrag.name
													+ '/'
													+ $scope.arbeitspaket.name
													+ '/edit',
											method : "POST",
											data : arbeitspaket,
										}).success(function(data) {
									$scope.beschreibung = "";
									$rootScope.getUserInfo();
									alert("das Arbeitspaket wurde geändert");
								});
							}
						} ]);

/**
 * Auftrag bearbeiten
 */
timba
		.config(function($sceProvider) {
			$sceProvider.enabled(false);
		})
		.controller(
				'auftragBearbeitenController',
				[
						'$scope',
						'$http',
						'$rootScope',
						function($scope, $http, $rootScope) {

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
								$scope.planBeginn = $rootScope.rsAuftrag.planBeginn
								$scope.planEnde = $rootScope.rsAuftrag.planEnde
								$scope.buchungsberechtigte = $rootScope.rsAuftrag.buchungsberechtigte;
								$scope
										.ermittleMitarbeiterUndOrga($rootScope.rsAuftrag.name);
								$rootScope.clearRootScope();
							}

							/**
							 * variablen zum sortieren und suchen in der Tabelle
							 */
							$scope.sortType = 'name'; // set the default sort
							// type
							$scope.sortReverse = false; // set the default sort
							// order
							$scope.searchMitarbeiter = ''; // set the default
							// search/filter
							// term

							$scope.ermittleMitarbeiterUndOrga = function(
									auftragsName) {
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/'
													+ auftragsName
													+ '/ermittleMitarbeiterUndOrga/',
											method : "GET",
										// params: {action:
										// 'getZuletztBebuchteAP'}
										// headers: {
										// 'Content-Type': application/json
										// }
										})
										.success(
												function(data) {
													if (data.success == false) {
														$scope.error = data.message;
													} else {
														$scope.nichtBuchungsberechtigte = data.content;
													}
												});
							}

							/**
							 * fuehrt die funktionen abhaengig vom aktuellen
							 * zustand aus
							 */
							$scope.change = function(mitarbeiter, checkboxValue) {
								if (checkboxValue == true) {
									$scope.addToBuchungsberechtigte(mitarbeiter);
								} else {
									$scope.removeFromBuchungsberechtige(mitarbeiter);
								}

							}

							/**
							 * fuegt einen uebergebenen Mitarbeiter aus der
							 * Menge der nicht buchungsberechtigten zu den
							 * buchungsberechtigten hinzu
							 */
							$scope.addToBuchungsberechtigte = function(mitarbeiter) {
								console.log(JSON.stringify(mitarbeiter));
								removeItem($scope.nichtBuchungsberechtigte,'id',mitarbeiter.id);
//								console.log(JSON.stringify($scope.nichtBuchungsberechtigte));
								$scope.buchungsberechtigte.push(mitarbeiter);
								console.log(JSON.stringify($scope.buchungsberechtigte));
//								alert("bin hier add to ");
							}

							/**
							 * fuegt den uebergebenen Mitarbeiter aus der Menge
							 * der buchungsberechtigten in die Menge der nicht
							 * Buchungsberechtigten hinzu
							 */
							$scope.removeFromBuchungsberechtige = function(mitarbeiter) {
								console.log(JSON.stringify(mitarbeiter));
//								findAndRemove($scope.buchungsberechtigte, 'name', mitarbeiter.name);
								removeItem($scope.buchungsberechtigte,'id',mitarbeiter.id);
								console.log(JSON.stringify($scope.buchungsberechtigte));
								$scope.nichtBuchungsberechtigte.push(mitarbeiter);
//								alert("bin hier remove from  ");
//								console.log(JSON.stringify($scope.nichtBuchungsberechtigte));
							}

							/**
							 * zurueckschicken des AuftragObjektes an den
							 * Serivce
							 */
							$scope.editAuftrag = function() {
								var auftrag = {
									"kurzbeschreibung" : $scope.kurzbeschreibung,
									// "name" : "20150138",
									"bescshreibung" : $scope.beschreibung,
									// "planBeginn" : "",
									// "planEnde" : "",
									"buchungsberechtigte" : JSON.stringify($scope.buchungsberechtigte),
									// [ {
									// "kurzbeschreibung" : "Roman Richter",
									// "name" : "0851",
									// "id" : 18013
									// }, {
									// "kurzbeschreibung" : "Volker Sengler",
									// "name" : "0964",
									// "id" : 18074
									// }, {
									// "kurzbeschreibung" : "Oliver Kühn",
									// "name" : "0980",
									// "id" : 18087
									// } ],
									// "type" : "PROJEKT",
									// "editPermission" : true,
									"status" : $scope.selected.status
								}
								console.log(auftrag);
								
								$http(
										{
											url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/'
													+ $scope.name
													+ '/edit',
											method : "POST",
											data : auftrag,
										}).success(function(data) {
									$scope.beschreibung = "";
									$rootScope.getUserInfo();
									alert("der Auftrag wurde geändert");
								});
							}
						} ]);

/**
 * @param array jsonArray
 * @param property identifier e.g. id
 * @param value wert der id
 * 
 * loescht ein jsonObjekt, welches ueber die id identifiziert wurde aus dem
 * jsonArray
 */
function findAndRemove(array, property, value) {
	$.each(array, function(index, result) {
		if (result[property] == value) {
			// Remove from array
			array.splice(index, 1);
		}
	});
}

                 function removeItem(obj, prop, val) {
                     var c, found=false;
                     for(c in obj) {
                         if(obj[c][prop] == val) {
                             found=true;
                             console.log("hab ihn gefunden");
                             break;
                         }
                     }
                     if(found){
                         delete obj[c];
                     }
                 }
               



/**
 * @param date
 *            datumsObjekt
 * @returns {String} Datum im Format yyyy-MM-dd
 */
function dateFormatter(date) {
	var dd = date.getDate();
	var mm = date.getMonth() + 1; // January is 0!
	var yyyy = date.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	return yyyy + "-" + mm + "-" + dd;
}

/**
 * @param cname
 *            cookie name
 * @returns wert des cookie
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}

/**
 * Stoppuhr Funktion ANFANG
 */
var then;
var now;
var pause;
var min = 0;
var hour = 0;
// edit
var zeit;

function startwatch() {
	then = new Date();
	startnow();
}

function startnow() {
	document.getElementById("a1").style.display = "none";
	document.getElementById("a2").style.display = "inline";
	document.getElementById("a3").style.display = "none";
	document.getElementById("a4").style.display = "none";
	document.getElementById("a5").style.display = "inline";
	timer = setTimeout("go()", 1000);
}

function go() {
	now = new Date();
	sec = now.getSeconds() - then.getSeconds();
	if (sec < 0)
		sec += 60;
	if (sec == 0)
		min++;
	if (min > 59) {
		min -= 60;
		hour++;
	}
	document.getElementById("s").firstChild.nodeValue = sec;
	if (document.getElementById("s").firstChild.nodeValue.length < 2)
		document.getElementById("s").firstChild.nodeValue = "0"
				+ document.getElementById("s").firstChild.nodeValue;
	document.getElementById("m").firstChild.nodeValue = min;
	if (document.getElementById("m").firstChild.nodeValue.length < 2)
		document.getElementById("m").firstChild.nodeValue = "0"
				+ document.getElementById("m").firstChild.nodeValue;
	document.getElementById("h").firstChild.nodeValue = hour;

	startnow();
}

function stop() {
	pause = new Date();
	clearTimeout(timer);
	document.getElementById("a2").style.display = "none";
	document.getElementById("a3").style.display = "inline";
	document.getElementById("a4").style.display = "inline";
	// edit
	var stunden = document.getElementById("h").innerHTML;
	var minuten = document.getElementById("m").innerHTML;
	var industrieMinute = stunden + (minuten / 60);
	industrieMinute = kaufm(industrieMinute);

	document.getElementById("zeit").innerHTML = industrieMinute;
}

/**
 * @param x
 *            eine Gleitkommazahl mit mehreren nachkommastellen
 * @returns eine kaufmaennisch gerundete Gleitkommazahl mit zwei
 *          nachkommastellen
 */
function kaufm(x) {
	var k = (Math.round(x * 100) / 100).toString();
	k += (k.indexOf('.') == -1) ? '.00' : '00';
	return k.substring(0, k.indexOf('.') + 3);
}

function cont() {
	pauseoff = new Date();
	ss = pauseoff.getSeconds() - pause.getSeconds() + then.getSeconds() + 1;
	mm = pauseoff.getMinutes() - pause.getMinutes() + then.getMinutes();
	hh = pauseoff.getHours() - pause.getHours() + then.getHours();
	dd = pauseoff.getDate();
	mo = pauseoff.getMonth();
	yy = pauseoff.getYear();
	if (ss > 60) {
		ss -= 60;
		mm++;
	} else if (ss < 0) {
		ss += 60;
		mm--;
	}
	if (mm > 60) {
		mm -= 60;
		hh++;
	} else if (mm < 0) {
		mm += 60;
		hh--;
	}
	then = new Date(yy, mo, dd, hh, mm, ss);
	startnow();
}

function newstart() {
	clearTimeout(timer);
	document.getElementById("s").firstChild.nodeValue = "00";
	document.getElementById("m").firstChild.nodeValue = "00";
	document.getElementById("h").firstChild.nodeValue = "0";
	min = 0;
	hour = 0;
	startwatch();
}

function conton() {
	now = new Date();
	min = now.getMinutes() - then.getMinutes();
	if (now.getSeconds() < then.getSeconds())
		min--;
	hour = now.getHours() - then.getHours();
	if (now.getMinutes() < then.getMinutes())
		hour--;
	startnow();
}

/**
 * Stoppuhr Funktion ENDE
 */

/**
 * aufträge admin page
 * {"success":true,"content":[{"id":1957938,"kurzbeschreibung":"Vorstudie ADABAS
 * Natural
 * Migrationsstrategie","name":"20150138","beschreibung":"","planBeginn":"","planEnde":"","arbeitspakete":[{"id":1957939,"kurzbeschreibung":"Anbieterauswahl","name":"201501380002","beschreibung":"","planAufwand":60},{"id":1957953,"kurzbeschreibung":"Vorbereitung
 * PoC (Proof Of
 * Concept)","name":"201501380003","beschreibung":"","planAufwand":240},{"id":1957959,"kurzbeschreibung":"Projektmanagement
 * und
 * Kommunikation","name":"201501380006","beschreibung":"","planAufwand":110}],"buchungsberechtigte":[{"kurzbeschreibung":"Roman
 * Richter","name":"0851","id":18013},{"kurzbeschreibung":"Volker
 * Sengler","name":"0964","id":18074},{"kurzbeschreibung":"Oliver
 * Kühn","name":"0980","id":18087}],"type":"PROJEKT","editPermission":true,"status":null},{"id":1953292,"kurzbeschreibung":"2015
 * IEP-BS
 * Hinweise","name":"20150025","beschreibung":"","planBeginn":null,"planEnde":null,"arbeitspakete":[{"id":1953305,"kurzbeschreibung":"HBD-681
 * E-Mail-Sortierung","name":"201500250004","beschreibung":"","planAufwand":24}],"buchungsberechtigte":[{"kurzbeschreibung":"Marcel
 * Presser","name":"0821","id":17995},{"kurzbeschreibung":"Andreas
 * Homfeldt","name":"0849","id":18011},{"kurzbeschreibung":"Boris
 * Goll","name":"1270","id":18181}],"type":"WARTUNGSAUFTRAG","editPermission":false,"status":null},{"id":1953313,"kurzbeschreibung":"2015
 * IEP-BS
 * Führung","name":"20150026","beschreibung":"","planBeginn":null,"planEnde":null,"arbeitspakete":[{"id":1953314,"kurzbeschreibung":"Besprechungen
 * GL (nicht
 * Projekt)","name":"201500260001","beschreibung":"","planAufwand":500},{"id":1953327,"kurzbeschreibung":"Eigene
 * Aufgaben und
 * Notes","name":"201500260002","beschreibung":"","planAufwand":800},{"id":1953343,"kurzbeschreibung":"Mitarbeitergespräche
 * (inkl Vor und
 * Nachbereitung)","name":"201500260003","beschreibung":"","planAufwand":200}],"buchungsberechtigte":[{"kurzbeschreibung":"Alexander
 * Schleif","name":"0839","id":18007}],"type":"WARTUNGSAUFTRAG","editPermission":false,"status":null},{"id":1953350,"kurzbeschreibung":"2015
 * IEP-BS Besprechungen und interne
 * Prozesse","name":"20150027","beschreibung":"","planBeginn":null,"planEnde":null,"arbeitspakete":[{"id":1953351,"kurzbeschreibung":"Gruppenrunden /
 * Abteilungsrunden","name":"201500270001","beschreibung":"","planAufwand":500},{"id":1953504,"kurzbeschreibung":"Sonstige
 * Besprechung (nicht
 * Projekte/Hinweise)","name":"201500270002","beschreibung":"","planAufwand":200},{"id":1953606,"kurzbeschreibung":"Mitarbeitergespräche /
 * Beurteilung","name":"201500270003","beschreibung":"","planAufwand":200}],"buchungsberechtigte":[{"kurzbeschreibung":"Constantin
 * Krüger","name":"1472","id":6418},{"kurzbeschreibung":"Marcel
 * Presser","name":"0821","id":17995},{"kurzbeschreibung":"Andreas
 * Homfeldt","name":"0849","id":18011},{"kurzbeschreibung":"Mark
 * Maltring","name":"0922","id":18038},{"kurzbeschreibung":"Beate
 * Jungert","name":"0937","id":18052},{"kurzbeschreibung":"Ingrid
 * Dehnert","name":"0954","id":18064},{"kurzbeschreibung":"Gunter
 * Wunderlich","name":"0965","id":18075},{"kurzbeschreibung":"Pieter
 * Buthmann","name":"0977","id":18084},{"kurzbeschreibung":"Henning
 * Meyer","name":"0979","id":18086},{"kurzbeschreibung":"Vanessa
 * Sprißler","name":"0991","id":18097},{"kurzbeschreibung":"Ursula
 * Schönau","name":"0996","id":18102},{"kurzbeschreibung":"Boris
 * Goll","name":"1270","id":18181},{"kurzbeschreibung":"Artur
 * Ott","name":"1487","id":18283}],"type":"WARTUNGSAUFTRAG","editPermission":false,"status":null},{"id":1953634,"kurzbeschreibung":"2015
 * IEP-BS Anwendungsbetrieb","name":"20150029","beschreibung":"Hier kommt alles
 * rein, was im täglichen Anwendungsbetrieb
 * anfällt","planBeginn":null,"planEnde":null,"arbeitspakete":[{"id":1953635,"kurzbeschreibung":"Archivierung
 * Kontoauszug 2013 +
 * 2014","name":"201500290001","beschreibung":"","planAufwand":1},{"id":1953644,"kurzbeschreibung":"Betrieb
 * Foxpro-Anwendungen","name":"201500290002","beschreibung":"","planAufwand":40},{"id":1953650,"kurzbeschreibung":"Betrieb
 * Rochade","name":"201500290003","beschreibung":"","planAufwand":200},{"id":1953740,"kurzbeschreibung":"Betrieb
 * CS-Systeme","name":"201500290004","beschreibung":"","planAufwand":60},{"id":1953754,"kurzbeschreibung":"Betrieb
 * Jira","name":"201500290005","beschreibung":"","planAufwand":250},{"id":1953793,"kurzbeschreibung":"Betrieb
 * Host-Basissysteme","name":"201500290006","beschreibung":"","planAufwand":150},{"id":1953823,"kurzbeschreibung":"Tagesbericht
 * Betrieb Badok / Poseidon / Sonst.
 * Systeme","name":"201500290007","beschreibung":"","planAufwand":300},{"id":1953916,"kurzbeschreibung":"Betriebsaufgaben
 * Badok (Notes PK Badok-Admin) - Betrieb
 * BS","name":"201500290008","beschreibung":"","planAufwand":800},{"id":1954042,"kurzbeschreibung":"Systemstörungen
 * Badok Poseidon ePost
 * 2015","name":"201500290009","beschreibung":"","planAufwand":300}],"buchungsberechtigte":[{"kurzbeschreibung":"Basissysteme","name":"135000","id":18519}],"type":"WARTUNGSAUFTRAG","editPermission":false,"status":null},{"id":1954064,"kurzbeschreibung":"2015
 * IEP-BS Texid und Formularwesen (ohne
 * Projektauftrag)","name":"20150030","beschreibung":"","planBeginn":null,"planEnde":null,"arbeitspakete":[{"id":1954065,"kurzbeschreibung":"Admin-Aufgaben
 * Texid/Formulare IEP-BS
 * 2015","name":"201500300001","beschreibung":"","planAufwand":200},{"id":1954102,"kurzbeschreibung":"Formularänderungen
 * (ohne Projektauftrag) IEP-BS
 * 2015","name":"201500300002","beschreibung":"","planAufwand":500},{"id":1954108,"kurzbeschreibung":"Texidänderungen
 * (ohne Projektauftrag) IEP-BS
 * 2015","name":"201500300003","beschreibung":"","planAufwand":800},{"id":1954231,"kurzbeschreibung":"Personelle
 * Veränderungen IEP-BS
 * 2015","name":"201500300004","beschreibung":"","planAufwand":100}],"buchungsberechtigte":[{"kurzbeschreibung":"Beate
 * Jungert","name":"0937","id":18052},{"kurzbeschreibung":"Ingrid
 * Dehnert","name":"0954","id":18064},{"kurzbeschreibung":"Gunter
 * Wunderlich","name":"0965","id":18075}],"type":"WARTUNGSAUFTRAG","editPermission":false,"status":null}]}
 * 
 * Mitarbeiter und Orga
 * 
 * {"success":true,"content":[{"kurzbeschreibung":"Ressort
 * 1","name":"100000","id":18511},{"kurzbeschreibung":"Ressort
 * 2","name":"200000","id":18533},{"kurzbeschreibung":"Ressort
 * 3","name":"300000","id":18550},{"kurzbeschreibung":"Aufsichtsrat","name":"500100","id":18572},{"kurzbeschreibung":"Betriebs
 * Organisation","name":"110000","id":440335},{"kurzbeschreibung":"Informatik
 * Entwicklung und
 * Prozesse","name":"130000","id":18513},{"kurzbeschreibung":"Informatik Betrieb
 * und Service","name":"140000","id":18521},{"kurzbeschreibung":"VB Konzern- und
 * Vertriebspartner-Betreuung","name":"180000","id":17495},{"kurzbeschreibung":"Bereich
 * Vertrieb","name":"190000","id":18524},{"kurzbeschreibung":"Innenrevision","name":"210000","id":18535},{"kurzbeschreibung":"Qualität,
 * Kredit,
 * Risikomanagement","name":"250000","id":18538},{"kurzbeschreibung":"Mathematik,
 * Produkt, Marketing","name":"260000","id":18543},{"kurzbeschreibung":"Human
 * Resources","name":"280000","id":18546},{"kurzbeschreibung":"Finanz- und
 * Rechnungswesen","name":"310000","id":18551},{"kurzbeschreibung":"KundenFachBetreuung","name":"330000","id":18555},{"kurzbeschreibung":"KundenSofortBetreuung","name":"340000","id":18561},{"kurzbeschreibung":"Recht/Kreditüberwachung","name":"360000","id":18567},{"kurzbeschreibung":"Unternehmenskommunikation","name":"100300","id":18512},{"kurzbeschreibung":"Betriebsorganisation","name":"111000","id":440336},{"kurzbeschreibung":"BO-Dienstleister","name":"119000","id":499477},{"kurzbeschreibung":"Facharchitektur","name":"130500","id":18514},{"kurzbeschreibung":"Darlehenssysteme","name":"132000","id":18516},{"kurzbeschreibung":"Sparen
 * und
 * Buchen","name":"133000","id":18517},{"kurzbeschreibung":"Vertriebssysteme","name":"134000","id":18518},{"kurzbeschreibung":"Basissysteme","name":"135000","id":18519},{"kurzbeschreibung":"IT-Management","name":"136000","id":18520},{"kurzbeschreibung":"Technologie
 * und
 * Infrastruktur","name":"141000","id":18522},{"kurzbeschreibung":"RZ-Koordination","name":"142000","id":18523},{"kurzbeschreibung":"Geldhandel","name":"190500","id":18525},{"kurzbeschreibung":"DVAG
 * Organisationsbereich I","name":"192000","id":18526},{"kurzbeschreibung":"DVAG
 * Organisationsbereich
 * II","name":"193000","id":18527},{"kurzbeschreibung":"DVAG
 * Organisationsbereich
 * III","name":"194000","id":18528},{"kurzbeschreibung":"DVAG Vertriebshotline /
 * Verkaufsförderung","name":"195000","id":18529},{"kurzbeschreibung":"DVAG
 * Vertriebsunterstützung
 * Darlehen","name":"196000","id":18530},{"kurzbeschreibung":"KVB
 * Vertriebshotline /
 * Verkaufsförderung","name":"197000","id":18531},{"kurzbeschreibung":"KVB
 * Organisationsbereich","name":"198000","id":18532},{"kurzbeschreibung":"KVB
 * Betreuungsbereich
 * Vertriebspartner","name":"199000","id":113734},{"kurzbeschreibung":"Wertermittlung","name":"205000","id":18534},{"kurzbeschreibung":"Revision","name":"211000","id":18536},{"kurzbeschreibung":"Beschwerdemanagement","name":"212000","id":18537},{"kurzbeschreibung":"QKR-Stab","name":"250500","id":18539},{"kurzbeschreibung":"Kreditrisiko-
 * und
 * Qualitäts-Management","name":"251000","id":18540},{"kurzbeschreibung":"Quantitatives
 * Risikomanagement","name":"252000","id":18541},{"kurzbeschreibung":"Operationelles
 * Risikomanagement","name":"254000","id":18542},{"kurzbeschreibung":"Mathematik/Produktentwicklung","name":"261000","id":18544},{"kurzbeschreibung":"Marketing","name":"263000","id":18545},{"kurzbeschreibung":"Personalbetreuung","name":"281000","id":18547},{"kurzbeschreibung":"Training
 * und
 * Entwicklung","name":"282000","id":18548},{"kurzbeschreibung":"Betriebsrat","name":"289000","id":18549},{"kurzbeschreibung":"Recht","name":"305000","id":493481},{"kurzbeschreibung":"Bilanzierung","name":"311000","id":18552},{"kurzbeschreibung":"Zahlungsverkehr","name":"312000","id":18553},{"kurzbeschreibung":"Controlling","name":"313000","id":18554},{"kurzbeschreibung":"KFB-Abwicklung
 * Badenia","name":"331000","id":113735},{"kurzbeschreibung":"KFB-Antrag
 * 2","name":"332000","id":18556},{"kurzbeschreibung":"KFB-Bestand
 * 1","name":"333000","id":18557},{"kurzbeschreibung":"KFB-Abwicklung
 * Mandanten","name":"334000","id":113736},{"kurzbeschreibung":"KFB-Intensivbetreuung","name":"335000","id":113737},{"kurzbeschreibung":"KFB-Bestand
 * 3","name":"336000","id":18558},{"kurzbeschreibung":"KFB-Antrag
 * 1","name":"337000","id":18559},{"kurzbeschreibung":"KFB-Bestand
 * 2","name":"338000","id":18560},{"kurzbeschreibung":"Zentrale
 * Kundenprozesse","name":"341000","id":18562},{"kurzbeschreibung":"Kunden
 * Service Center 1","name":"342000","id":18563},{"kurzbeschreibung":"Kunden
 * Service Center 2","name":"343000","id":18564},{"kurzbeschreibung":"Kunden
 * Sofort Betreuung 1","name":"345000","id":18565},{"kurzbeschreibung":"Kunden
 * Sofort Betreuung
 * 2","name":"346000","id":18566},{"kurzbeschreibung":"Abwicklung
 * Badenia","name":"361000","id":18568},{"kurzbeschreibung":"Abwicklung
 * Mandanten","name":"362000","id":18569},{"kurzbeschreibung":"Intensivbetreuung","name":"363000","id":18570},{"kurzbeschreibung":"RE","name":"365000","id":18571},{"kurzbeschreibung":"Prüfer
 * Dt.
 * Bankverein","name":"711000","id":18573},{"kurzbeschreibung":"QKR-Externe","name":"721000","id":18574},{"kurzbeschreibung":"IBS -
 * Externer Support","name":"731000","id":18575},{"kurzbeschreibung":"IEP -
 * Externer Support","name":"741000","id":18576},{"kurzbeschreibung":"Holger
 * Mößner","name":"0015","id":17587},{"kurzbeschreibung":"Helga
 * Torelli","name":"0019","id":17589},{"kurzbeschreibung":"Annelies
 * Hars","name":"0021","id":17590},{"kurzbeschreibung":"Oliver
 * Lutz","name":"0036","id":17594},{"kurzbeschreibung":"Gertrud
 * Amoroso","name":"0037","id":17595},{"kurzbeschreibung":"Jochen
 * Ament","name":"0045","id":17597},{"kurzbeschreibung":"Jens
 * Schweikert","name":"0047","id":17598},{"kurzbeschreibung":"Heinz
 * Zinkand","name":"0050","id":17599},{"kurzbeschreibung":"Ursula
 * Golenia","name":"0052","id":17600},{"kurzbeschreibung":"Birgit
 * Maurer","name":"0056","id":17601},{"kurzbeschreibung":"Nadine
 * Reichert","name":"0057","id":17602},{"kurzbeschreibung":"Cristina Pinilla
 * Rimbau","name":"0060","id":17603},{"kurzbeschreibung":"Ingrid
 * Mader","name":"0061","id":17604},{"kurzbeschreibung":"Ute
 * Blach","name":"0062","id":17605},{"kurzbeschreibung":"Helmut
 * Grajer","name":"0066","id":17607},{"kurzbeschreibung":"Gitte
 * Müller","name":"0068","id":17608},{"kurzbeschreibung":"Gisela
 * Hettel","name":"0076","id":17610},{"kurzbeschreibung":"Jochen
 * Wendel","name":"0079","id":17611},{"kurzbeschreibung":"Christine von
 * Löwe-Kiedrowski","name":"0093","id":17612},{"kurzbeschreibung":"Gabriele
 * Kowalczyk","name":"0095","id":17613},{"kurzbeschreibung":"Rüdiger
 * Doll","name":"0098","id":17614},{"kurzbeschreibung":"Martina
 * Hodapp-Maier","name":"0101","id":17615},{"kurzbeschreibung":"Oliver
 * Thiel","name":"0102","id":17616},{"kurzbeschreibung":"Elke
 * Müller","name":"0103","id":17617},{"kurzbeschreibung":"Werner
 * Bartel","name":"0108","id":17619},{"kurzbeschreibung":"Melitta
 * Bischoff","name":"0109","id":17620},{"kurzbeschreibung":"Gerhard
 * Hamfler","name":"0115","id":17621},{"kurzbeschreibung":"Martin
 * Diesner","name":"0117","id":17622},{"kurzbeschreibung":"Hubert
 * Meichel","name":"0119","id":17623},{"kurzbeschreibung":"Alexander
 * Schmidt","name":"0123","id":17625},{"kurzbeschreibung":"Rudolf
 * Wittmer","name":"0124","id":17626},{"kurzbeschreibung":"Peter
 * Schütz","name":"0126","id":17627},{"kurzbeschreibung":"Elke
 * Ott","name":"0127","id":17628},{"kurzbeschreibung":"Michael
 * Schär","name":"0128","id":17629},{"kurzbeschreibung":"Manuela
 * Stanko-Hüper","name":"0129","id":17630},{"kurzbeschreibung":"Renate
 * Diaz","name":"0132","id":17632},{"kurzbeschreibung":"Bernd
 * Seene","name":"0136","id":17633},{"kurzbeschreibung":"Gerald
 * Beyerle","name":"0137","id":17634},{"kurzbeschreibung":"Michael
 * Voelschow","name":"0140","id":17635},{"kurzbeschreibung":"Arthur
 * Ulmer","name":"0143","id":17636},{"kurzbeschreibung":"Heike
 * Schöffler","name":"0148","id":17637},{"kurzbeschreibung":"Dr. Matthias
 * Kauth","name":"0150","id":17638},{"kurzbeschreibung":"Susanne
 * Wimmer","name":"0152","id":17639},{"kurzbeschreibung":"Christopher
 * Beeh","name":"0154","id":17640},{"kurzbeschreibung":"Michael
 * Bade","name":"0157","id":17641},{"kurzbeschreibung":"Jürgen
 * Ehresmann","name":"0158","id":17642},{"kurzbeschreibung":"Ralf
 * Trotno","name":"0159","id":36086},{"kurzbeschreibung":"Horst
 * Ernst","name":"0160","id":17643},{"kurzbeschreibung":"Silvio
 * Albrecht","name":"0163","id":17645},{"kurzbeschreibung":"Natalie
 * Holl","name":"0168","id":17646},{"kurzbeschreibung":"Nicolas
 * Sämann","name":"0172","id":17647},{"kurzbeschreibung":"Dr. Thomas
 * Hermann","name":"0173","id":493693},{"kurzbeschreibung":"Kateryna
 * Kilimnik","name":"0174","id":496073},{"kurzbeschreibung":"Winfried
 * Grajer","name":"0176","id":17648},{"kurzbeschreibung":"Ursel
 * Mayer","name":"0178","id":17649},{"kurzbeschreibung":"Adolf
 * Brockhoff","name":"0180","id":17650},{"kurzbeschreibung":"Karin
 * Knebel","name":"0181","id":17651},{"kurzbeschreibung":"Sandra
 * Dörr","name":"0184","id":17652},{"kurzbeschreibung":"Michael
 * Lacher","name":"0189","id":17653},{"kurzbeschreibung":"Jörg
 * Giraud","name":"0191","id":17654},{"kurzbeschreibung":"Andreas
 * Hornung","name":"0192","id":17655},{"kurzbeschreibung":"Erik
 * Schuschu","name":"0195","id":17656},{"kurzbeschreibung":"Daniela
 * Wolf","name":"0196","id":17657},{"kurzbeschreibung":"Natascha
 * Dauth","name":"0198","id":17658},{"kurzbeschreibung":"Daniela
 * Hahne","name":"0199","id":17659},{"kurzbeschreibung":"Simone
 * Fischer","name":"0201","id":17660},{"kurzbeschreibung":"Petra
 * Wurz","name":"0202","id":17661},{"kurzbeschreibung":"Uwe
 * Weiss","name":"0203","id":17662},{"kurzbeschreibung":"Edward
 * Zahn","name":"0204","id":17663},{"kurzbeschreibung":"Andrea
 * Lindenfelser","name":"0207","id":17665},{"kurzbeschreibung":"Jürgen Xaver
 * Habich","name":"0208","id":17666},{"kurzbeschreibung":"Carina
 * Baars","name":"0209","id":17667},{"kurzbeschreibung":"Gudrun
 * Sahrbacher","name":"0210","id":17668},{"kurzbeschreibung":"Stephan
 * Wermke","name":"0212","id":17669},{"kurzbeschreibung":"Ulrike
 * Weser","name":"0213","id":17670},{"kurzbeschreibung":"Michael
 * Becker","name":"0214","id":17671},{"kurzbeschreibung":"Renata
 * Lichtenstein","name":"0218","id":17672},{"kurzbeschreibung":"Kai
 * Rinderknecht","name":"0225","id":17674},{"kurzbeschreibung":"Holger
 * Degelmann","name":"0226","id":17675},{"kurzbeschreibung":"Stefan
 * Friedmann","name":"0229","id":17676},{"kurzbeschreibung":"Beatrix
 * Schmidt","name":"0230","id":17677},{"kurzbeschreibung":"Rüdiger
 * Hannich","name":"0235","id":17678},{"kurzbeschreibung":"Susanne
 * Arnold","name":"0237","id":17679},{"kurzbeschreibung":"Nikolaus
 * Bernhard","name":"0238","id":17680},{"kurzbeschreibung":"Christof
 * Schick","name":"0240","id":17681},{"kurzbeschreibung":"Birgit
 * Hüfner","name":"0241","id":17682},{"kurzbeschreibung":"Piero
 * Pignone","name":"0242","id":17683},{"kurzbeschreibung":"Diana
 * Morlock","name":"0243","id":17684},{"kurzbeschreibung":"Richard
 * Wiedemann","name":"0244","id":17685},{"kurzbeschreibung":"Kurt
 * Tüg","name":"0248","id":17687},{"kurzbeschreibung":"Hans-Martin
 * Wanke","name":"0251","id":17689},{"kurzbeschreibung":"Isolde
 * Krämmer","name":"0253","id":17690},{"kurzbeschreibung":"Didem
 * Kunz","name":"0254","id":492296},{"kurzbeschreibung":"Tobias
 * Durian","name":"0255","id":17691},{"kurzbeschreibung":"Angelika
 * Haug","name":"0256","id":17692},{"kurzbeschreibung":"Mechthild
 * Weishaupt","name":"0258","id":17693},{"kurzbeschreibung":"Ewald
 * Reinhardt","name":"0262","id":17694},{"kurzbeschreibung":"Monika
 * Müller","name":"0263","id":17695},{"kurzbeschreibung":"Gabriele
 * Geißler","name":"0264","id":17696},{"kurzbeschreibung":"Klaus
 * Feidler","name":"0268","id":17697},{"kurzbeschreibung":"Helga
 * Maag","name":"0269","id":17698},{"kurzbeschreibung":"Bernd
 * Jaki","name":"0270","id":17699},{"kurzbeschreibung":"Denise
 * Heger","name":"0271","id":17700},{"kurzbeschreibung":"Anton
 * Köhler","name":"0272","id":17701},{"kurzbeschreibung":"Regina
 * Gerring","name":"0273","id":17702},{"kurzbeschreibung":"Frank
 * Dutzi","name":"0274","id":17703},{"kurzbeschreibung":"Gabriele
 * Schäfer","name":"0275","id":17704},{"kurzbeschreibung":"Natalie
 * Kristkeitz","name":"0278","id":17705},{"kurzbeschreibung":"Juliane
 * Zoll","name":"0279","id":17706},{"kurzbeschreibung":"Annette
 * Schär","name":"0281","id":17707},{"kurzbeschreibung":"Ulrich
 * Hertle","name":"0282","id":17708},{"kurzbeschreibung":"Klaus
 * Lepke","name":"0283","id":17709},{"kurzbeschreibung":"Reinhold
 * Speck","name":"0284","id":17710},{"kurzbeschreibung":"Johann
 * Weingärtner","name":"0286","id":17712},{"kurzbeschreibung":"Tanja
 * Stern","name":"0291","id":17715},{"kurzbeschreibung":"Klaus
 * Biedermann","name":"0293","id":17716},{"kurzbeschreibung":"Birgit
 * Speck","name":"0294","id":17717},{"kurzbeschreibung":"Thomas
 * Lagenstein","name":"0295","id":17718},{"kurzbeschreibung":"Andreas
 * Schmadel","name":"0296","id":17719},{"kurzbeschreibung":"Eduard
 * Bittner","name":"0297","id":17720},{"kurzbeschreibung":"Esther
 * Wolf","name":"0298","id":17721},{"kurzbeschreibung":"Petra
 * Krüger","name":"0300","id":17723},{"kurzbeschreibung":"Beate
 * Rogier","name":"0302","id":17724},{"kurzbeschreibung":"Jürgen
 * Bitterwolf","name":"0303","id":17725},{"kurzbeschreibung":"Udo
 * Weindel","name":"0304","id":17726},{"kurzbeschreibung":"Corina
 * Grassel","name":"0309","id":17727},{"kurzbeschreibung":"Cornelia
 * Bitterwolf-Schindele","name":"0310","id":17728},{"kurzbeschreibung":"Frank
 * Henninger","name":"0313","id":17729},{"kurzbeschreibung":"Doris
 * Lemon","name":"0315","id":17731},{"kurzbeschreibung":"Daniela
 * Raschke","name":"0316","id":17732},{"kurzbeschreibung":"Armin
 * Nagel","name":"0317","id":17733},{"kurzbeschreibung":"Markus
 * Götz","name":"0318","id":17734},{"kurzbeschreibung":"Manuel
 * Müller","name":"0320","id":17735},{"kurzbeschreibung":"Ina
 * Pengu","name":"0321","id":17736},{"kurzbeschreibung":"Bärbel
 * Hoffmann","name":"0322","id":17737},{"kurzbeschreibung":"Marco
 * Weber","name":"0324","id":17739},{"kurzbeschreibung":"Diana
 * Reusch","name":"0328","id":39582},{"kurzbeschreibung":"Gabriele
 * Christen","name":"0329","id":17741},{"kurzbeschreibung":"Patricia
 * Lott","name":"0331","id":17742},{"kurzbeschreibung":"Fred
 * Förster","name":"0335","id":17744},{"kurzbeschreibung":"Rüdiger
 * Oberst","name":"0338","id":17745},{"kurzbeschreibung":"Myriam
 * Kiefer","name":"0339","id":17746},{"kurzbeschreibung":"Alexander
 * Müller","name":"0340","id":17747},{"kurzbeschreibung":"Renate
 * Malo","name":"0342","id":17748},{"kurzbeschreibung":"Jürgen
 * Pfirrmann","name":"0344","id":17749},{"kurzbeschreibung":"Willi-Johannes
 * Hillmer","name":"0347","id":17750},{"kurzbeschreibung":"Christian
 * Braumandl","name":"0348","id":17751},{"kurzbeschreibung":"Gerd
 * Flick","name":"0349","id":17752},{"kurzbeschreibung":"Svea
 * Furmanek","name":"0353","id":17753},{"kurzbeschreibung":"Corinna
 * Brecht","name":"0354","id":499474},{"kurzbeschreibung":"Alexandra
 * Römhild","name":"0357","id":17754},{"kurzbeschreibung":"Peter
 * Geißler","name":"0358","id":17755},{"kurzbeschreibung":"Ute
 * Schlotzer","name":"0359","id":506896},{"kurzbeschreibung":"Achim
 * Rosenbruch","name":"0360","id":17757},{"kurzbeschreibung":"Brigitte
 * Seitz","name":"0361","id":17758},{"kurzbeschreibung":"Carolin
 * Bertsche","name":"0362","id":17759},{"kurzbeschreibung":"Dilcia
 * Mares","name":"0367","id":17761},{"kurzbeschreibung":"Jochen
 * Ruf","name":"0368","id":17762},{"kurzbeschreibung":"Reiner
 * Schnur","name":"0370","id":17763},{"kurzbeschreibung":"Christiane
 * Schmitt","name":"0374","id":17766},{"kurzbeschreibung":"Kerstin
 * Molter","name":"0376","id":17767},{"kurzbeschreibung":"Andreja
 * Müller-Susanj","name":"0377","id":17768},{"kurzbeschreibung":"Christoph
 * Köwler","name":"0380","id":17769},{"kurzbeschreibung":"Andreas
 * Bedau","name":"0382","id":17771},{"kurzbeschreibung":"Tanja
 * Dietl","name":"0383","id":17772},{"kurzbeschreibung":"Leobald
 * Kraft","name":"0384","id":17773},{"kurzbeschreibung":"Doris
 * Maier","name":"0385","id":17774},{"kurzbeschreibung":"Udo
 * Thürwächter","name":"0386","id":17775},{"kurzbeschreibung":"Barbara
 * Reiter","name":"0387","id":17776},{"kurzbeschreibung":"Andrea
 * Blesch","name":"0389","id":17777},{"kurzbeschreibung":"Markus
 * Schmitt","name":"0393","id":17778},{"kurzbeschreibung":"Claudia
 * Safferthal","name":"0395","id":17779},{"kurzbeschreibung":"Regine
 * Mussgnug","name":"0397","id":17781},{"kurzbeschreibung":"Jürgen
 * Krug","name":"0398","id":17782},{"kurzbeschreibung":"Joachim
 * Kaiser","name":"0399","id":17783},{"kurzbeschreibung":"Rosalie
 * Fischer","name":"0401","id":17784},{"kurzbeschreibung":"Anette
 * Volz","name":"0406","id":17785},{"kurzbeschreibung":"Tanja
 * Maier","name":"0407","id":17786},{"kurzbeschreibung":"Simone
 * Hornfeck","name":"0408","id":17787},{"kurzbeschreibung":"Daniela
 * Luft","name":"0409","id":17788},{"kurzbeschreibung":"Holger
 * Görrißen","name":"0413","id":17789},{"kurzbeschreibung":"Ursula
 * Tomaszewski","name":"0414","id":17790},{"kurzbeschreibung":"Sandra
 * Schommer","name":"0415","id":17791},{"kurzbeschreibung":"Bastian
 * Weber","name":"0416","id":17792},{"kurzbeschreibung":"Petar
 * Matenda","name":"0417","id":17793},{"kurzbeschreibung":"Achim
 * Morlock","name":"0419","id":17794},{"kurzbeschreibung":"Michaela
 * Kotulla","name":"0420","id":502099},{"kurzbeschreibung":"Joy
 * Dieckmann","name":"0421","id":17796},{"kurzbeschreibung":"Petra
 * Meyenberg","name":"0422","id":17797},{"kurzbeschreibung":"Werner
 * Janke","name":"0423","id":17798},{"kurzbeschreibung":"Anja
 * Waldenmaier","name":"0424","id":17799},{"kurzbeschreibung":"Borowicz
 * Alexandra","name":"0425","id":1488819},{"kurzbeschreibung":"Erika
 * Habich","name":"0426","id":17801},{"kurzbeschreibung":"Margit
 * Pokluda","name":"0427","id":17802},{"kurzbeschreibung":"Katharina
 * Machowsky","name":"0428","id":17803},{"kurzbeschreibung":"Jan
 * Schick","name":"0435","id":17804},{"kurzbeschreibung":"Nicole
 * Hacker","name":"0436","id":17805},{"kurzbeschreibung":"Roswitha
 * Boßlet","name":"0437","id":500228},{"kurzbeschreibung":"Stephan
 * Seebach","name":"0438","id":17807},{"kurzbeschreibung":"Martina
 * Gegner","name":"0444","id":17811},{"kurzbeschreibung":"Gerda
 * Hauck","name":"0446","id":17812},{"kurzbeschreibung":"Tanja
 * Bauer-Wurm","name":"0448","id":17813},{"kurzbeschreibung":"Andreas
 * Dürrschnabel-Enßlin","name":"0450","id":17814},{"kurzbeschreibung":"Dr.
 * Dieter Friedrich","name":"0454","id":17817},{"kurzbeschreibung":"Andreas
 * Bühler","name":"0456","id":17819},{"kurzbeschreibung":"Ulrike
 * Kindler","name":"0457","id":17820},{"kurzbeschreibung":"Karina
 * Bender","name":"0460","id":17821},{"kurzbeschreibung":"Kerstin
 * Zipf","name":"0463","id":497170},{"kurzbeschreibung":"Martina
 * Föhrenbach","name":"0466","id":17823},{"kurzbeschreibung":"Axel
 * Heilmann","name":"0469","id":17824},{"kurzbeschreibung":"Bärbel
 * Hagel","name":"0470","id":17825},{"kurzbeschreibung":"Dr. Dominik
 * Scherer","name":"0471","id":17826},{"kurzbeschreibung":"Karin
 * Fuchs","name":"0472","id":17827},{"kurzbeschreibung":"Karin
 * Kaiser","name":"0474","id":17828},{"kurzbeschreibung":"Alfred
 * Huber","name":"0477","id":17829},{"kurzbeschreibung":"Stephan
 * Rentschler","name":"0486","id":17833},{"kurzbeschreibung":"Nicole
 * Reinbold","name":"0488","id":17834},{"kurzbeschreibung":"Sabine
 * Lang","name":"0495","id":17838},{"kurzbeschreibung":"Marina
 * Sarchisova","name":"0496","id":17839},{"kurzbeschreibung":"Nicole
 * Hermann","name":"0497","id":17840},{"kurzbeschreibung":"Karl-Heinz
 * Heider","name":"0499","id":17841},{"kurzbeschreibung":"Sylvia
 * Borchers","name":"0506","id":17843},{"kurzbeschreibung":"Stefan
 * Schuh","name":"0509","id":502618},{"kurzbeschreibung":"Tanja
 * Simon","name":"0511","id":17847},{"kurzbeschreibung":"Heike
 * Jauer","name":"0516","id":40201},{"kurzbeschreibung":"Josefa
 * Perchio","name":"0527","id":17855},{"kurzbeschreibung":"Ayse
 * Cosar","name":"0531","id":17857},{"kurzbeschreibung":"Elke
 * Rosenthal","name":"0532","id":17858},{"kurzbeschreibung":"Nicole
 * Gottmann","name":"0537","id":17859},{"kurzbeschreibung":"Isabel
 * Peters","name":"0539","id":17860},{"kurzbeschreibung":"Huelya
 * Cakmakci","name":"0544","id":17862},{"kurzbeschreibung":"Janet
 * Herd","name":"0549","id":17866},{"kurzbeschreibung":"Silvia
 * Breßel","name":"0550","id":17867},{"kurzbeschreibung":"Stefanie
 * Schreiber","name":"0554","id":17868},{"kurzbeschreibung":"Michaela
 * Kiefer","name":"0556","id":17870},{"kurzbeschreibung":"Monika
 * Hottenrott","name":"0563","id":17871},{"kurzbeschreibung":"Jürgen
 * Schodlok","name":"0567","id":17872},{"kurzbeschreibung":"Claudia
 * Knöfel","name":"0573","id":17873},{"kurzbeschreibung":"Jutta
 * Pflaum","name":"0574","id":17874},{"kurzbeschreibung":"Ralf
 * Zimpelmann","name":"0575","id":17875},{"kurzbeschreibung":"Ulf
 * Klingenschmidt","name":"0579","id":17877},{"kurzbeschreibung":"Silvia
 * Schlager","name":"0580","id":17878},{"kurzbeschreibung":"Bernd
 * Wickenhäuser","name":"0581","id":17879},{"kurzbeschreibung":"Andreas
 * Eislöffel","name":"0594","id":17881},{"kurzbeschreibung":"Anke
 * Ernst","name":"0598","id":17883},{"kurzbeschreibung":"Nicole
 * Denninger","name":"0599","id":17884},{"kurzbeschreibung":"Andreas
 * Ochs","name":"0600","id":17885},{"kurzbeschreibung":"Peer
 * Feddersen","name":"0601","id":17886},{"kurzbeschreibung":"Stefan
 * Bukovac","name":"0603","id":17887},{"kurzbeschreibung":"Claudia
 * Mittel","name":"0605","id":17889},{"kurzbeschreibung":"Thomas
 * Hauth","name":"0610","id":17890},{"kurzbeschreibung":"Ingo
 * Österreicher","name":"0611","id":17891},{"kurzbeschreibung":"Michael
 * Seitz","name":"0642","id":17894},{"kurzbeschreibung":"Julia
 * Hess","name":"0643","id":17895},{"kurzbeschreibung":"Ines
 * Hoffmann","name":"0644","id":17896},{"kurzbeschreibung":"Jennifer
 * Becker","name":"0645","id":17897},{"kurzbeschreibung":"Sabine
 * Hauth-Frank","name":"0646","id":17898},{"kurzbeschreibung":"Kirsten
 * Fath-Mannek","name":"0649","id":17899},{"kurzbeschreibung":"Sibylle
 * Amberger","name":"0651","id":17900},{"kurzbeschreibung":"Carmen
 * Steiner","name":"0652","id":17901},{"kurzbeschreibung":"Michelle
 * Mock","name":"0653","id":17902},{"kurzbeschreibung":"Alexandra
 * Pflug","name":"0654","id":17903},{"kurzbeschreibung":"Sandra
 * Lepold","name":"0655","id":17904},{"kurzbeschreibung":"Stefan
 * Martin","name":"0662","id":17906},{"kurzbeschreibung":"Christine
 * Ramsteiner","name":"0663","id":17907},{"kurzbeschreibung":"Christian
 * König","name":"0664","id":17908},{"kurzbeschreibung":"Sylvia
 * Steigner-Brzenska","name":"0667","id":17909},{"kurzbeschreibung":"Corinna
 * Weisenburger","name":"0668","id":17910},{"kurzbeschreibung":"Kai
 * Rinck","name":"0671","id":17911},{"kurzbeschreibung":"Iris
 * Betsch","name":"0673","id":17912},{"kurzbeschreibung":"Nadine
 * Mitschele","name":"0677","id":528365},{"kurzbeschreibung":"Christine
 * Tudyka","name":"0680","id":17914},{"kurzbeschreibung":"Diana
 * Daum","name":"0685","id":17917},{"kurzbeschreibung":"Maik
 * Grafe","name":"0686","id":17918},{"kurzbeschreibung":"Dorothea
 * Gräßer","name":"0688","id":17920},{"kurzbeschreibung":"Andreas
 * Ernst","name":"0692","id":17922},{"kurzbeschreibung":"Heike
 * Fischer","name":"0693","id":17923},{"kurzbeschreibung":"Danny
 * Raschke","name":"0695","id":17924},{"kurzbeschreibung":"Christiane
 * Günther","name":"0696","id":17925},{"kurzbeschreibung":"Christin
 * Pacner","name":"0697","id":17926},{"kurzbeschreibung":"Yusuf
 * Aktas","name":"0698","id":17927},{"kurzbeschreibung":"Christian
 * Klinger","name":"0699","id":17928},{"kurzbeschreibung":"Carmen
 * Gargouri","name":"0704","id":17930},{"kurzbeschreibung":"Manuela
 * Reichert","name":"0705","id":17931},{"kurzbeschreibung":"Marianne
 * Seidenspinner","name":"0706","id":17932},{"kurzbeschreibung":"Uwe
 * Sickinger","name":"0707","id":17933},{"kurzbeschreibung":"Michaela
 * Hill","name":"0708","id":17934},{"kurzbeschreibung":"Markus
 * Ströbel","name":"0709","id":17935},{"kurzbeschreibung":"Tamara
 * Giehl","name":"0710","id":17936},{"kurzbeschreibung":"Maria
 * Kästel","name":"0711","id":17937},{"kurzbeschreibung":"Patricia
 * Stahl","name":"0712","id":17938},{"kurzbeschreibung":"Vlado
 * Grgas","name":"0714","id":17939},{"kurzbeschreibung":"Sandra
 * Kwast","name":"0718","id":17940},{"kurzbeschreibung":"Edith
 * Weick","name":"0719","id":17941},{"kurzbeschreibung":"Margot
 * Schneider","name":"0723","id":17943},{"kurzbeschreibung":"Karola
 * Holtz-Bajus","name":"0724","id":17944},{"kurzbeschreibung":"Gudrun
 * Klein","name":"0725","id":17945},{"kurzbeschreibung":"Rosa
 * Hörz","name":"0726","id":17946},{"kurzbeschreibung":"Doris
 * Wieser","name":"0727","id":17947},{"kurzbeschreibung":"Birgit
 * Reibold","name":"0728","id":17948},{"kurzbeschreibung":"Thomas
 * Dörr","name":"0729","id":17949},{"kurzbeschreibung":"Michael
 * Hofmann","name":"0730","id":17950},{"kurzbeschreibung":"Sabine
 * Reger","name":"0732","id":17952},{"kurzbeschreibung":"Silke
 * Biedermann","name":"0734","id":17953},{"kurzbeschreibung":"Heiko
 * Peuker","name":"0737","id":17954},{"kurzbeschreibung":"Karina
 * Pawelzik","name":"0741","id":17956},{"kurzbeschreibung":"Sabine
 * Speth","name":"0743","id":17957},{"kurzbeschreibung":"Johanna
 * Eitel","name":"0745","id":17958},{"kurzbeschreibung":"Roswitha
 * Hoferer","name":"0752","id":17959},{"kurzbeschreibung":"Stephan
 * Erdel","name":"0755","id":17960},{"kurzbeschreibung":"Natalie
 * Finger","name":"0756","id":17961},{"kurzbeschreibung":"Margit
 * Knörr","name":"0759","id":17962},{"kurzbeschreibung":"Petra
 * Pilger","name":"0765","id":17963},{"kurzbeschreibung":"Katharina
 * Matuschek","name":"0767","id":17964},{"kurzbeschreibung":"Daniela
 * Zilly","name":"0770","id":17965},{"kurzbeschreibung":"Petra
 * Koch","name":"0771","id":17966},{"kurzbeschreibung":"Manuela
 * Petini","name":"0772","id":17967},{"kurzbeschreibung":"Tamara
 * Kleiber","name":"0774","id":17969},{"kurzbeschreibung":"Diana
 * Paulick","name":"0775","id":17970},{"kurzbeschreibung":"Bettina
 * Fritschi","name":"0777","id":17971},{"kurzbeschreibung":"Vinka
 * Kovacevic","name":"0779","id":1488818},{"kurzbeschreibung":"Silke
 * Kaiser","name":"0780","id":17973},{"kurzbeschreibung":"Christine
 * Teci","name":"0781","id":17974},{"kurzbeschreibung":"Oliver
 * Klemt","name":"0782","id":17975},{"kurzbeschreibung":"Bettina
 * Retzer","name":"0783","id":17976},{"kurzbeschreibung":"Holger
 * Herd","name":"0786","id":17977},{"kurzbeschreibung":"Tanja
 * Ebner","name":"0788","id":17978},{"kurzbeschreibung":"Martina
 * Sitter","name":"0789","id":17979},{"kurzbeschreibung":"Tanja
 * Spitz","name":"0790","id":17980},{"kurzbeschreibung":"Jacek
 * Marczyk","name":"0792","id":17981},{"kurzbeschreibung":"Cornelia
 * Dwars","name":"0793","id":17982},{"kurzbeschreibung":"Tanja
 * Kristmann","name":"0794","id":17983},{"kurzbeschreibung":"Guido
 * Weiß","name":"0797","id":17985},{"kurzbeschreibung":"Sabine
 * Zimmer","name":"0799","id":17986},{"kurzbeschreibung":"Jürgen
 * Dühne","name":"0801","id":17987},{"kurzbeschreibung":"Tina
 * Bossert","name":"0802","id":17988},{"kurzbeschreibung":"Christel
 * Walz","name":"0805","id":17990},{"kurzbeschreibung":"Daniel
 * Theuerkauff","name":"0812","id":17992},{"kurzbeschreibung":"Ursula
 * Klöfer","name":"0820","id":17994},{"kurzbeschreibung":"Marcel
 * Presser","name":"0821","id":17995},{"kurzbeschreibung":"Pascal
 * Schmidt","name":"0822","id":17996},{"kurzbeschreibung":"Silke
 * Vincke","name":"0824","id":17997},{"kurzbeschreibung":"Jens
 * Kießlich","name":"0827","id":18000},{"kurzbeschreibung":"Tanja
 * Ulrich","name":"0832","id":1488822},{"kurzbeschreibung":"Andreas
 * Windisch","name":"0833","id":18003},{"kurzbeschreibung":"Dieter
 * Kloppe","name":"0834","id":18004},{"kurzbeschreibung":"Peter
 * Kaisinger","name":"0835","id":18623},{"kurzbeschreibung":"Jens-Holger
 * Bruns","name":"0836","id":18005},{"kurzbeschreibung":"Michael
 * Liberis","name":"0837","id":18006},{"kurzbeschreibung":"Alexander
 * Schleif","name":"0839","id":18007},{"kurzbeschreibung":"Markus
 * Golob","name":"0842","id":89135},{"kurzbeschreibung":"Andreas
 * Goldmann","name":"0843","id":87163},{"kurzbeschreibung":"Dieter
 * Tempel","name":"0848","id":18010},{"kurzbeschreibung":"Andreas
 * Homfeldt","name":"0849","id":18011},{"kurzbeschreibung":"Ruven
 * Graf","name":"0850","id":18012},{"kurzbeschreibung":"Hermann
 * Blanke","name":"0855","id":18015},{"kurzbeschreibung":"Anita
 * Ilijevec","name":"0858","id":18017},{"kurzbeschreibung":"Dr. Ulf
 * Morgenstern","name":"0861","id":89120},{"kurzbeschreibung":"Dr. Jana
 * Wagner","name":"0862","id":89121},{"kurzbeschreibung":"Andrei-Alexandru
 * Sava","name":"0868","id":18022},{"kurzbeschreibung":"Dominic
 * Kube","name":"0869","id":18023},{"kurzbeschreibung":"Harald
 * Lohrfink","name":"0895","id":89084},{"kurzbeschreibung":"Linda
 * Staiger","name":"0897","id":18639},{"kurzbeschreibung":"Dr. Hans-Joachim
 * Toussaint","name":"0898","id":89105},{"kurzbeschreibung":"Andrea
 * Schneider","name":"0900","id":18027},{"kurzbeschreibung":"Christina
 * Hauck","name":"0911","id":89115},{"kurzbeschreibung":"Jürgen
 * Müller","name":"0913","id":18030},{"kurzbeschreibung":"Peter
 * Rosenberg","name":"0915","id":18031},{"kurzbeschreibung":"Matthias
 * Schwarz","name":"0916","id":18032},{"kurzbeschreibung":"Jordan
 * Dukadinov","name":"0917","id":18033},{"kurzbeschreibung":"Marco
 * Bayerl","name":"0918","id":18034},{"kurzbeschreibung":"Ralf
 * Schlegel","name":"0919","id":18035},{"kurzbeschreibung":"Bernd
 * Wallisch","name":"0920","id":18036},{"kurzbeschreibung":"Susanne
 * Neubert","name":"0921","id":18037},{"kurzbeschreibung":"Mark
 * Maltring","name":"0922","id":18038},{"kurzbeschreibung":"Franz
 * Schindele","name":"0923","id":18039},{"kurzbeschreibung":"Selina
 * Fitterer","name":"0924","id":18040},{"kurzbeschreibung":"Michael
 * Jäck","name":"0925","id":18041},{"kurzbeschreibung":"Oliver
 * Roth","name":"0926","id":18042},{"kurzbeschreibung":"Hanno
 * Ritzerfeld","name":"0927","id":18043},{"kurzbeschreibung":"Ulrich
 * Schoppe","name":"0928","id":89085},{"kurzbeschreibung":"Knut
 * Kästel","name":"0929","id":18579},{"kurzbeschreibung":"Thomas
 * Wagner","name":"0931","id":18046},{"kurzbeschreibung":"Dirk
 * Schuster","name":"0933","id":18048},{"kurzbeschreibung":"Roland
 * Fieser","name":"0934","id":18049},{"kurzbeschreibung":"Reiner
 * Bürk","name":"0935","id":18050},{"kurzbeschreibung":"Christian
 * Rihm","name":"0936","id":18051},{"kurzbeschreibung":"Beate
 * Jungert","name":"0937","id":18052},{"kurzbeschreibung":"Thomas
 * Schmidt","name":"0938","id":18053},{"kurzbeschreibung":"Klaus
 * Lauinger","name":"0939","id":18054},{"kurzbeschreibung":"Clemens
 * Läufer","name":"0941","id":18055},{"kurzbeschreibung":"Franco
 * Pacilio","name":"0946","id":18057},{"kurzbeschreibung":"Anton
 * Ungemach","name":"0947","id":18058},{"kurzbeschreibung":"Sigbert
 * Rieger","name":"0948","id":18059},{"kurzbeschreibung":"Alexander
 * Adda","name":"0949","id":18060},{"kurzbeschreibung":"Uwe
 * Stephan","name":"0951","id":18061},{"kurzbeschreibung":"Daniel
 * Peifer","name":"0952","id":18062},{"kurzbeschreibung":"Florian
 * Jauer","name":"0953","id":18063},{"kurzbeschreibung":"Ingrid
 * Dehnert","name":"0954","id":18064},{"kurzbeschreibung":"Ulrich
 * Bruder","name":"0955","id":18065},{"kurzbeschreibung":"Beate
 * Waidner","name":"0957","id":18067},{"kurzbeschreibung":"Harald
 * Wagner","name":"0958","id":18068},{"kurzbeschreibung":"Stephan
 * Denschlag","name":"0959","id":18069},{"kurzbeschreibung":"Agneta
 * Weber","name":"0961","id":18071},{"kurzbeschreibung":"Lothar
 * Rittler","name":"0962","id":18072},{"kurzbeschreibung":"Bernd
 * Schönau","name":"0963","id":18073},{"kurzbeschreibung":"Gunter
 * Wunderlich","name":"0965","id":18075},{"kurzbeschreibung":"Matthias
 * Lott","name":"0967","id":18076},{"kurzbeschreibung":"Veronika
 * Ketterer","name":"0968","id":18077},{"kurzbeschreibung":"Horst
 * Dambach","name":"0969","id":18078},{"kurzbeschreibung":"Rolf
 * Gindler","name":"0970","id":18079},{"kurzbeschreibung":"Jakob
 * Lenz","name":"0972","id":18080},{"kurzbeschreibung":"Sylvia
 * Gob","name":"0973","id":18081},{"kurzbeschreibung":"Elfruhn
 * Scheel","name":"0975","id":18082},{"kurzbeschreibung":"Andrea
 * Schneider","name":"0976","id":18083},{"kurzbeschreibung":"Pieter
 * Buthmann","name":"0977","id":18084},{"kurzbeschreibung":"Melitta
 * Ludwig","name":"0978","id":18085},{"kurzbeschreibung":"Henning
 * Meyer","name":"0979","id":18086},{"kurzbeschreibung":"Thomas
 * Traub","name":"0982","id":18088},{"kurzbeschreibung":"Sabina
 * Rihm","name":"0983","id":18089},{"kurzbeschreibung":"Matthias
 * Brzenska","name":"0984","id":18090},{"kurzbeschreibung":"Volker
 * Fierhauser","name":"0985","id":18091},{"kurzbeschreibung":"Regina
 * Bader-Schwab","name":"0986","id":18092},{"kurzbeschreibung":"Winfried
 * Kuhn","name":"0987","id":18093},{"kurzbeschreibung":"Robert
 * Schroeder","name":"0988","id":18094},{"kurzbeschreibung":"Jürgen
 * Gurlin","name":"0989","id":18095},{"kurzbeschreibung":"Jörg-Mathias
 * Schulze","name":"0990","id":18096},{"kurzbeschreibung":"Vanessa
 * Sprißler","name":"0991","id":18097},{"kurzbeschreibung":"Marion
 * Güttner","name":"0993","id":18099},{"kurzbeschreibung":"Stephanie
 * Gierth","name":"0994","id":18100},{"kurzbeschreibung":"Dorothea
 * Bintakies","name":"0995","id":18101},{"kurzbeschreibung":"Ursula
 * Schönau","name":"0996","id":18102},{"kurzbeschreibung":"Michaele
 * Dollinger","name":"1002","id":18104},{"kurzbeschreibung":"Frank
 * Braun","name":"1006","id":18105},{"kurzbeschreibung":"Uwe
 * Teutscher","name":"1008","id":18106},{"kurzbeschreibung":"Ralf
 * Bendowski","name":"1030","id":18107},{"kurzbeschreibung":"Günther
 * Rapp","name":"1031","id":18108},{"kurzbeschreibung":"Rene
 * Datz","name":"1032","id":18109},{"kurzbeschreibung":"Matthias
 * Schuldt","name":"1034","id":18111},{"kurzbeschreibung":"Giuseppina
 * Selvarolo","name":"1038","id":18112},{"kurzbeschreibung":"Julia
 * Burger","name":"1040","id":18113},{"kurzbeschreibung":"Hans-Jörg
 * Weber","name":"1042","id":18114},{"kurzbeschreibung":"Angelika
 * Born-Dietrich","name":"1060","id":18121},{"kurzbeschreibung":"Nada
 * Blazenovic","name":"1062","id":18122},{"kurzbeschreibung":"Laura
 * Mehmeti","name":"1066","id":18123},{"kurzbeschreibung":"Martina
 * Kammerichs","name":"1067","id":18124},{"kurzbeschreibung":"Matthias
 * Sachs","name":"1069","id":18125},{"kurzbeschreibung":"Sylvia
 * Harlfinger","name":"1071","id":18126},{"kurzbeschreibung":"Laura
 * Fortino","name":"1072","id":18127},{"kurzbeschreibung":"Bernd
 * Vogel","name":"1074","id":18128},{"kurzbeschreibung":"Nathalie
 * Ruf","name":"1075","id":18129},{"kurzbeschreibung":"Suzane
 * Schulz","name":"1076","id":18130},{"kurzbeschreibung":"Thomas
 * Burkart","name":"1077","id":18131},{"kurzbeschreibung":"Can
 * Inci","name":"1079","id":18132},{"kurzbeschreibung":"Christel
 * Blödt","name":"1081","id":18133},{"kurzbeschreibung":"Tobias
 * Schröder","name":"1082","id":18134},{"kurzbeschreibung":"Kristina
 * Alexander","name":"1085","id":18135},{"kurzbeschreibung":"Antje
 * Pignone","name":"1087","id":18136},{"kurzbeschreibung":"Ralf
 * Fehling","name":"1088","id":18137},{"kurzbeschreibung":"Annemari
 * Kohler","name":"1089","id":18138},{"kurzbeschreibung":"Michaela
 * Warken","name":"1091","id":18139},{"kurzbeschreibung":"Johanna
 * Kaucher","name":"1096","id":18142},{"kurzbeschreibung":"Andrea
 * Schindler","name":"1098","id":18144},{"kurzbeschreibung":"Klaus
 * Amann","name":"1103","id":18146},{"kurzbeschreibung":"Christine
 * Maaß","name":"1122","id":18147},{"kurzbeschreibung":"Sandra
 * Heid","name":"1126","id":18149},{"kurzbeschreibung":"Helga
 * Fleck","name":"1127","id":18150},{"kurzbeschreibung":"Christian
 * Schulzky","name":"1144","id":89111},{"kurzbeschreibung":"Thomas
 * Bannert","name":"1146","id":89112},{"kurzbeschreibung":"Axel
 * Fessner","name":"1150","id":18153},{"kurzbeschreibung":"Marion
 * Behechti","name":"1155","id":18155},{"kurzbeschreibung":"Sabrina
 * Louis","name":"1169","id":18156},{"kurzbeschreibung":"Daniel
 * Schührer","name":"1171","id":18157},{"kurzbeschreibung":"Bettina
 * Goll","name":"1172","id":18158},{"kurzbeschreibung":"John
 * Davies","name":"1173","id":18159},{"kurzbeschreibung":"Karina
 * Brunner","name":"1178","id":18161},{"kurzbeschreibung":"Carolin
 * Lauckner","name":"1183","id":18163},{"kurzbeschreibung":"Klaus
 * Kistner","name":"1186","id":18166},{"kurzbeschreibung":"Claudia
 * Schehr","name":"1193","id":18167},{"kurzbeschreibung":"Markus
 * Ebert","name":"1195","id":18168},{"kurzbeschreibung":"Dirk
 * Szlamma","name":"1196","id":18169},{"kurzbeschreibung":"Jutta
 * Weber","name":"1199","id":18170},{"kurzbeschreibung":"Lilly
 * Vogt-Müller","name":"1201","id":18171},{"kurzbeschreibung":"Isabel
 * Kiefer","name":"1204","id":18172},{"kurzbeschreibung":"Frank
 * Grassel","name":"1208","id":18173},{"kurzbeschreibung":"Stefan
 * Kiesel","name":"1210","id":18174},{"kurzbeschreibung":"Hazel
 * Cakmak","name":"1212","id":508140},{"kurzbeschreibung":"Matthias
 * Scheel","name":"1215","id":18175},{"kurzbeschreibung":"Udo
 * Wassenhoven","name":"1216","id":18176},{"kurzbeschreibung":"Dagmar
 * Oppel","name":"1217","id":18177},{"kurzbeschreibung":"Georg
 * Coenen","name":"1263","id":18180},{"kurzbeschreibung":"Boris
 * Goll","name":"1270","id":18181},{"kurzbeschreibung":"Carolin
 * Fuchs","name":"1350","id":18200},{"kurzbeschreibung":"Olesya
 * Moor","name":"1355","id":18202},{"kurzbeschreibung":"Sandra
 * Kästel","name":"1356","id":18203},{"kurzbeschreibung":"Herolind
 * Topalli","name":"1360","id":18205},{"kurzbeschreibung":"Michael
 * Huber","name":"1361","id":18206},{"kurzbeschreibung":"Natalia
 * Gorjajewa","name":"1363","id":18207},{"kurzbeschreibung":"Natalia
 * Dudukov","name":"1364","id":18613},{"kurzbeschreibung":"Jessica
 * Becker","name":"1366","id":18209},{"kurzbeschreibung":"Dogan
 * Karasu","name":"1370","id":18210},{"kurzbeschreibung":"Uljana
 * Hilz","name":"1371","id":18211},{"kurzbeschreibung":"Sven
 * Kowalczyk","name":"1372","id":18212},{"kurzbeschreibung":"Nico
 * Hilker","name":"1380","id":18213},{"kurzbeschreibung":"Daniel
 * Estelmann","name":"1381","id":18214},{"kurzbeschreibung":"Justine
 * Reeb","name":"1382","id":18635},{"kurzbeschreibung":"Daniel
 * Seefing","name":"1384","id":18215},{"kurzbeschreibung":"Verena
 * Psarrakis","name":"1385","id":18216},{"kurzbeschreibung":"Belde
 * Vural","name":"1387","id":18645},{"kurzbeschreibung":"Arjeta
 * Sulejmani","name":"1391","id":18641},{"kurzbeschreibung":"Kristina
 * Münch","name":"1392","id":18217},{"kurzbeschreibung":"Nadja
 * Dorow","name":"1396","id":18218},{"kurzbeschreibung":"Marcel
 * Manke","name":"1397","id":18630},{"kurzbeschreibung":"Rosaria
 * Fama","name":"1398","id":18219},{"kurzbeschreibung":"Thomas
 * Jauer","name":"1400","id":18220},{"kurzbeschreibung":"Sylvia
 * Wendlandt","name":"1401","id":18221},{"kurzbeschreibung":"Sezen
 * Babat","name":"1402","id":18222},{"kurzbeschreibung":"Christian
 * Schmidt","name":"1403","id":18223},{"kurzbeschreibung":"Jasmin
 * Jödicke","name":"1404","id":18224},{"kurzbeschreibung":"Manuela
 * Fuchs","name":"1405","id":18225},{"kurzbeschreibung":"Dominic
 * Edelmann","name":"1406","id":18226},{"kurzbeschreibung":"Edgar
 * Eberhard","name":"1407","id":18227},{"kurzbeschreibung":"Julia
 * Dinges","name":"1413","id":18232},{"kurzbeschreibung":"Andreas
 * Dangelat","name":"1415","id":18234},{"kurzbeschreibung":"Marco
 * Dries","name":"1416","id":18235},{"kurzbeschreibung":"Sarah
 * Lauer","name":"1418","id":18237},{"kurzbeschreibung":"Natalie
 * Dettling","name":"1423","id":18240},{"kurzbeschreibung":"Marc
 * Gödelmann","name":"1424","id":18617},{"kurzbeschreibung":"Amanda
 * Kasapoglu","name":"1425","id":18625},{"kurzbeschreibung":"Laura
 * Nolte","name":"1426","id":18241},{"kurzbeschreibung":"Funda
 * Demir","name":"1427","id":18242},{"kurzbeschreibung":"Nadine
 * Schiller","name":"1428","id":18637},{"kurzbeschreibung":"Katarzyna
 * Armbruster","name":"1429","id":18607},{"kurzbeschreibung":"Eric
 * Siagam","name":"1432","id":18244},{"kurzbeschreibung":"Saskia
 * Zander","name":"1433","id":18245},{"kurzbeschreibung":"Nadja
 * Hornberger","name":"1434","id":18622},{"kurzbeschreibung":"Linda
 * Lange","name":"1437","id":18246},{"kurzbeschreibung":"Elisabeth
 * Lipp","name":"1438","id":18247},{"kurzbeschreibung":"Christine
 * Müller","name":"1439","id":18248},{"kurzbeschreibung":"Daniel
 * Nagel","name":"1440","id":18249},{"kurzbeschreibung":"Philipp
 * Sachs","name":"1443","id":18251},{"kurzbeschreibung":"Annegret
 * Schmitt","name":"1444","id":18252},{"kurzbeschreibung":"Felix-Simon
 * Ernst","name":"1454","id":18259},{"kurzbeschreibung":"Stefan
 * Hauser","name":"1457","id":18262},{"kurzbeschreibung":"Regina
 * Wegesend","name":"1458","id":18263},{"kurzbeschreibung":"Isabell
 * Hilker","name":"1459","id":18264},{"kurzbeschreibung":"Andreas
 * Lust","name":"1460","id":18265},{"kurzbeschreibung":"Corinna
 * Meckler","name":"1461","id":18266},{"kurzbeschreibung":"Lisa
 * Kranacher","name":"1462","id":18267},{"kurzbeschreibung":"Alexandra
 * Streit","name":"1467","id":18270},{"kurzbeschreibung":"Carina
 * Sydlo","name":"1469","id":18272},{"kurzbeschreibung":"Constantin
 * Krüger","name":"1472","id":6418},{"kurzbeschreibung":"Maik
 * Müller","name":"1474","id":18274},{"kurzbeschreibung":"Maria
 * Röhr","name":"1475","id":18275},{"kurzbeschreibung":"Adnan
 * Düner","name":"1476","id":18276},{"kurzbeschreibung":"Regina
 * Kärcher","name":"1477","id":18277},{"kurzbeschreibung":"Markus
 * Braun","name":"1479","id":18278},{"kurzbeschreibung":"Rebecca
 * Fauth","name":"1481","id":18279},{"kurzbeschreibung":"Eduard
 * Heibel","name":"1482","id":18280},{"kurzbeschreibung":"Anna
 * Dieser","name":"1483","id":18281},{"kurzbeschreibung":"Artur
 * Ott","name":"1487","id":18283},{"kurzbeschreibung":"Eric
 * Scholz","name":"1495","id":18287},{"kurzbeschreibung":"Laura
 * Rüff","name":"1498","id":18288},{"kurzbeschreibung":"Dietrich
 * Schroeder","name":"1500","id":18289},{"kurzbeschreibung":"Martin
 * Altenhoff","name":"1524","id":89126},{"kurzbeschreibung":"Justyna
 * Zeis","name":"1546","id":18299},{"kurzbeschreibung":"Dr. Jochen
 * Petin","name":"1550","id":18300},{"kurzbeschreibung":"Irina
 * Maryash","name":"1552","id":493589},{"kurzbeschreibung":"Wolfgang
 * Scholz","name":"7003","id":89119},{"kurzbeschreibung":"Stephan
 * Rohmann","name":"7203","id":89122},{"kurzbeschreibung":"Lukas
 * Schingen","name":"7204","id":89123},{"kurzbeschreibung":"David
 * Nielsen","name":"7206","id":89125},{"kurzbeschreibung":"Jan
 * Stosshoff","name":"7214","id":89128},{"kurzbeschreibung":"Gattner
 * Curator","name":"7216","id":89133},{"kurzbeschreibung":"Hendrik
 * Husmann","name":"7222","id":494671},{"kurzbeschreibung":"Moritz
 * Lehmensiek-Starke","name":"7223","id":499532},{"kurzbeschreibung":"Stefan
 * Heidekrüger","name":"7224","id":502619},{"kurzbeschreibung":"Dr. Hans
 * Schnabel","name":"7225","id":1488821},{"kurzbeschreibung":"Papadopullus
 * Ioanis","name":"7411","id":89129},{"kurzbeschreibung":"Rainer Gaab Icon
 * Systemhaus GmbH","name":"7500","id":89130},{"kurzbeschreibung":"Manuel Jung
 * Icon Sytemnhaus GmbH","name":"7501","id":89134},{"kurzbeschreibung":"Ruven
 * Test-User Graf","name":"8850","id":1488820}]}
 * 
 */

