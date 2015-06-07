/**
 * das JavaScript beinhaltet saemtliche funktionalitaeten welche die TimbaApp am Client ausfuehrt.
 * Genutzt wird hierfuer Angular.js, weshalb in den HTML Elementen spezielle Attribute gesetzt werden muessen.
 * Angular Attribute beginnen mit dem Prefix <cod>ng-*</code>
 */

/**
 * Angular modul welches in der index.html hinterlegt ist wird hier als objekt
 * in einer Variabe gehalten. <code>ng-app="timba"</code>
 */
var timba = angular.module('timba', [ 'ngRoute', 'ngCookies', 'ui.bootstrap', 'angular-loading-bar']);
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
.run([ '$rootScope', '$location', '$cookieStore', '$http', function($rootScope, $location, $cookieStore, $http) {
	// keep user logged in after page refresh
	$rootScope.globals = $cookieStore.get('globals') || {};
	if ($rootScope.globals.currentUser) {
		// $http.defaults.headers.common['Authorization'] =
		// 'Basic ' + $rootScope.globals.currentUser.authdata;
		// // jshint ignore:line
	}

	$rootScope.$on('$locationChangeStart', function(event, next, current) {
		// redirect to login page if not logged in
		if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
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
	$scope.message = 'hier siehst du deine zuletzt bebuchten Auftraege';
});

timba.controller('alleAuftraegeController', function($scope) {
	$scope.message = 'hier siehst du alle Auftraege auf denen du buchungsberechtigt bist';
});

timba.controller('buchungenAnzeigenController', function($scope) {
	$scope.message = 'hier siehst du deine Buchungen der letzten 30 Tage';
});

timba.controller('buchungErstellenController', function($scope) {
	$scope.message = 'hier kannst du eine neue Buchung erstellen';
});

timba.controller('administrationController', function($scope) {
	$scope.message = 'hier siehst du die Auftraege auf denen du eine Pflege Berechtigung besitzt';
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
timba.controller('loginController', [ '$scope', '$rootScope', '$http', '$location', 'AuthenticationService', function($scope, $rootScope, $http, $location, AuthenticationService) {

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
		AuthenticationService.Login($scope.username, $scope.password, function(response) {
			if (response.success) {
				AuthenticationService.SetCredentials($scope.username, $scope.password);
				$location.path('/zuletztBebuchte');
			} else {
				$scope.error = response.message;
				$scope.dataLoading = false;
			}
		});
	};
} ]);

timba.factory('AuthenticationService', [ 'Base64', '$http', '$cookieStore', '$rootScope', '$timeout', function(Base64, $http, $cookieStore, $rootScope, $timeout) {
	var service = {};
	service.Login = function(username, password, callback) {
		/*
		 * Dummy authentication for testing, uses $timeout to simulate api call
		 * ----------------------------------------------
		 */
		$timeout(function() {
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

	service.SetCredentials = function(username, password) {
		var authdata = Base64.encode(username + ':' + password);

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

.factory('Base64', function() {
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

				output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
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
				window.alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
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

/**
 * zuletzt bebuchte Arbeitspakete diese Page wird direkt nach dem Login
 * aufgerufen, wesehalb rootscope funktionen und variablen hier implementiert
 * werden, selbst wenn diese nicht in zuletzt bebuchte benoetigt werden
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('zuletztBebuchteController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	/**
	 * steuert die Sichtbarkeit des Navigationsmenues nur beim LoginController
	 * true
	 */
	$rootScope.hideNavbarIcon = false;

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * entfernt die rootScope gespeicherten Variablen rsAuftrag und
	 * rsArbeitspakete diese Funktion wird in mehreren Controllern benoetigt, wo
	 * ein ein Auftrag oder ein Arbeitspaket transferiert werden muss
	 */
	$rootScope.clearRootScope = function() {
		delete $rootScope.rsAuftrag;
		delete $rootScope.rsArbeitspaket;
	}

	/**
	 * initialiesiert die zuletzt bebuchte Page
	 */
	$scope.initZuletztBebucht = function() {
		$scope.getZuletztBebuchteAP();
		$rootScope.getUserInfo();
	}

	/**
	 * diese Funktion fordert ein UserInfo Objekt an, welches uebergreifende
	 * Informationen entaehlt e.g. die Anzahl der heute gebuchten Stunden
	 */
	$rootScope.getUserInfo = function() {
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleUserInfo/' + user,
			method : "GET",
		// params: {action: 'getAllAuftraege'}
		// headers: {
		// 'Content-Type': application/json
		// },

		}).success(function(data) {
			if (data.success == true) {
				$rootScope.heuteGebucht = data.content.heuteGebucht;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}

	$scope.getZuletztBebuchteAP = function() {
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleMeineLetztenBebuchtenArbeitspakete/' + user,
			method : "GET",
		// params: {action:
		// 'getZuletztBebuchteAP'}
		// headers: {
		// 'Content-Type': application/json
		// }
		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				console.log($scope.showErrorBox);
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}

	/**
	 * die methode speichert die angeklickten daten im rootscope als variablen
	 * um sie zwischen controllern auszutauschen
	 */
	$scope.openBuchungErstellen = function(arbeitspaket, auftrag) {
		$rootScope.rsAuftrag = auftrag;
		$rootScope.rsArbeitspaket = arbeitspaket;
	}
} ]);

/**
 * dieser Controller steuert die Page, wo alle Auftraege angezeigt werden, auf
 * denen der user buchungsberechtigt ist
 */
timba.config(function($sceProvider, $httpProvider) {
	$sceProvider.enabled(false);
}).controller('alleAuftraegeController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * diese Funktion ruft den Rochade Service um alle Auftraege zu bekommen
	 */
	$scope.getAllAuftraege = function() {
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAuftraege/' + user,
			method : "GET",
		// params: {action: 'getAllAuftraege'}
		// headers: {
		// 'Content-Type': application/json
		// },

		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}

	/**
	 * die methode speichert die angeklickten daten im rootscope als variablen
	 * um sie zwischen controllern auszutauschen
	 */
	$scope.openBuchungErstellen = function(arbeitspaket, auftrag) {
		$rootScope.rsAuftrag = auftrag;
		$rootScope.rsArbeitspaket = arbeitspaket;
	}
} ]);

/**
 * dieser Controller steuert die Buchung erstellen Page
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('buchungErstellenController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
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
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAuftraege/' + user,
			method : "GET",
		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
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

	// TODO use Angular here
	$scope.buchen = function() {
		var buchung = {
			"arbeitsPaket" : $scope.selectedArbeitspaket.name,
			"aufwand" : parseFloat($scope.istAufwand.replace(',', '.').replace(' ', '')),
			"kommentar" : $scope.kommentar,
			"buchungsErsteller" : user
		}

		console.log(buchung);

		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/buchen',
			method : "POST",
			data : buchung,
		}).success(function(data) {
			if (data.success == true) {
				alert("Buchung wurde erfolgreich geändert");
				$scope.istAufwand = "";
				$scope.kommentar = "";
				$rootScope.getUserInfo();
				
				
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}
} ]);

/**
 * buchungen fuer die Tabellendarstellung
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('buchungenAnzeigenController', ['$scope','$http','$rootScope',
				function($scope, $http, $rootScope) {

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
					 * initialiesiert die Datumsfelder
					 */
					$scope.initBuchungenAnzeigen = function() {
						var today = new Date();
						var sevenDaysAgo = today - 1000 * 60 * 60 * 24 * 7;
						sevenDaysAgo = new Date(sevenDaysAgo);

						$scope.beginnDatum = {
							value : today,
						}
						$scope.endDatum = {
							value : sevenDaysAgo,
						};
					}

					/**
					 * fuehrt eine erste Abfrage mit den initialwerten aus
					 * <code>initBuchungenAnzeigen()</code> durch
					 */
					$scope.buchungenAnzeigen = function() {
						$http(
								{
									url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleBuchungen/' + user + '/' + dateFormatter($scope.beginnDatum.value) + '/'
											+ dateFormatter($scope.endDatum.value) + '',
									method : "GET",
								}).success(function(data) {
									if (data.success == true) {
										$scope.buchungen = data.content;
									} else {
										$scope.showErrorBox = true;
										$scope.errorMessage = "Rochade Antwortet: " + data.message;
									}
								}).error(function(data, status) {
									$scope.showErrorBox = true;
									$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
								});
					}

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
						var negativerAufwand = istAufwand * (-1);
						console.log(negativerAufwand);

						var buchung = {
							"arbeitsPaket" : arbeitspaket,
							"aufwand" : negativerAufwand,
							"kommentar" : "Stornobuchung zu: " + kommentar,
							"buchungsErsteller" : user
						}
						console.log(buchung);

						if (confirm("Willst du wirklich Stornieren") == true) {
							$http({
								url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/buchen',
								method : "POST",
								data : buchung,
							}).success(function(data) {
								if (data.success == true) {
									$rootScope.getUserInfo();
									$scope.buchungenAnzeigen();
									$scope.showSuccessBox = true;
									$scope.successMessage="die Buchung wurde storniert";
								} else {
									$scope.showErrorBox = true;
									$scope.errorMessage = "Rochade Antwortet: " + data.message;
								}
							}).error(function(data, status) {
								$scope.showErrorBox = true;
								$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
							});
						}
					}
				} ]);

/**
 * Steuert die Administrationsperspektiven: -AP anlegen -AP editieren -Auftrag
 * editieren
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('administrationController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	/**
	 * steuert die Sichtbarkeit der Error Box
	 */
	$scope.showErrorBox = false;

	/**
	 * ermittelt Auftraege auf denen der User ein bearbeitungsrecht hat
	 */
	$scope.ermittleAdminBerechtigteAuftraege = function() {
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/ermittleAdminBerechtigteAuftraege/' + user,
			method : "GET",
		// headers: {
		// 'Content-Type': application/json
		// }
		}).success(function(data) {
			if (data.success == true) {
				$scope.auftraege = data.content;
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}

	/**
	 * speichert einen Auftrag im rootScope fuer die AP erstellen Page
	 */
	$scope.openCreateArbeitspaket = function(auftrag) {
		$rootScope.rsAuftrag = auftrag;
	}

	/**
	 * speichert einen Auftrag und ein AP fuer die AP bearbeiten Page
	 */
	$scope.openEditArbeitspaket = function(arbeitspaket, auftrag) {
		$rootScope.rsAuftrag = auftrag;
		$rootScope.rsArbeitspaket = arbeitspaket;
	}

	/**
	 * speichert einen Auftrag zum bearbeiten auf der Auftrag bearbeiten Page
	 */
	$scope.openEditAuftrag = function(auftrag) {
		$rootScope.rsAuftrag = auftrag;
	}
} ]);

/**
 * arbeitspaket anlegen
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('arbeitspaketAnlegenController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$scope.showErrorBox=false;
	$scope.showSuccessBox=false;
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

		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/' + $scope.auftrag.name + '/arbeitspaketAnlegen/',
			method : "POST",
			data : arbeitspaket,
		}).success(function(data) {
			if (data.success == true) {
				$scope.showSuccessBox = true;
				$scope.successMessage="das Arbeitspaket wurde erfolgreich angelegt";
				$scope.kurzbeschreibung="";
				$scope.beschreibung=""
				$scope.planAufwand="";
				
//				location.href = "#administration";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}

} ]);

/**
 * Arbeitspaket bearbeiten
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('arbeitspaketBearbeitenController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
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

		console.log(arbeitspaket);
		
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/' + $scope.auftrag.name + '/' + $scope.arbeitspaket.name + '/edit',
			method : "POST",
			data : arbeitspaket,
		}).success(function(data) {
			if (data.success == true) {
				alert("Arbeitspaket wurde erfolgreich geändert");
				location.href = "#administration";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}
} ]);

/**
 * Auftrag bearbeiten
 */
timba.config(function($sceProvider) {
	$sceProvider.enabled(false);
}).controller('auftragBearbeitenController', [ '$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$scope.showErrorBox=false;
	
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
		$scope.ermittleMitarbeiterUndOrga($rootScope.rsAuftrag.name);
		$rootScope.clearRootScope();
	}

	/**
	 * variablen zum sortieren und suchen in der Tabelle
	 */
	$scope.sortType = 'name'; // set the default sort type
	$scope.sortReverse = false; // set the default sort order
	$scope.searchMitarbeiter = ''; // set the default search/filter term

	$scope.ermittleMitarbeiterUndOrga = function(auftragsName) {
		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/' + auftragsName + '/ermittleMitarbeiterUndOrga/',
			method : "GET",
		// params: {action:
		// 'getZuletztBebuchteAP'}
		// headers: {
		// 'Content-Type': application/json
		// }
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
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
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
		console.log(JSON.stringify("angeklickter mitarbeiter: \n"+mitarbeiter));
		removeItem($scope.nichtBuchungsberechtigte, 'id', mitarbeiter.id);
		// console.log(JSON.stringify($scope.nichtBuchungsberechtigte));
		$scope.buchungsberechtigte.push(mitarbeiter);
		console.log(JSON.stringify("neue Buchungsberechtigte \n"+$scope.buchungsberechtigte));
	}

	/**
	 * fuegt den uebergebenen Mitarbeiter aus der Menge der buchungsberechtigten
	 * in die Menge der nicht Buchungsberechtigten hinzu
	 */
	$scope.removeFromBuchungsberechtige = function(mitarbeiter) {
		console.log(JSON.stringify("angeklickter mitarbeiter: \n"+mitarbeiter));
		removeItem($scope.buchungsberechtigte, 'id', mitarbeiter.id);
		console.log(JSON.stringify("neue Buchungsberechtigte \n"+$scope.buchungsberechtigte));
		$scope.nichtBuchungsberechtigte.push(mitarbeiter);
		// console.log(JSON.stringify($scope.nichtBuchungsberechtigte));
	}

	/**
	 * zurueckschicken des AuftragObjektes an den Serivce
	 */
	$scope.editAuftrag = function() {
		var auftrag = {
			"kurzbeschreibung" : $scope.kurzbeschreibung,
			"bescshreibung" : $scope.beschreibung,
			"buchungsberechtigte" : JSON.stringify($scope.buchungsberechtigte),
			"status" : $scope.selected.status
		}
		
		console.log(auftrag);

		$http({
			url : 'https://webservices-test.badenia.de:8085/BadeniaRochadeRESTServices/zeiterfassung/' + $scope.name + '/edit',
			method : "POST",
			data : auftrag,
		}).success(function(data) {
			if (data.success == true) {
				alert("auftrag wurde bearbeitet");
				location.href = "#administration";
			} else {
				$scope.showErrorBox = true;
				$scope.errorMessage = "Rochade Antwortet: " + data.message;
			}
		}).error(function(data, status) {
			$scope.showErrorBox = true;
			$scope.errorMessage = "Status Code: " + status + " Response Data " + data || "Request failed";
		});
	}
} ]);

/**
 * @param obj
 *            jsonArray
 * @param prop
 *            identifier e.g. id
 * @param val
 *            wert der id
 * 
 * loescht ein jsonObjekt, welches ueber die id identifiziert wurde aus dem
 * jsonArray
 */
function removeItem(obj, prop, val) {
	var c, found = false;
	for (c in obj) {
		if (obj[c][prop] == val) {
			found = true;
			break;
		}
	}
	if (found) {
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
		document.getElementById("s").firstChild.nodeValue = "0" + document.getElementById("s").firstChild.nodeValue;
	document.getElementById("m").firstChild.nodeValue = min;
	if (document.getElementById("m").firstChild.nodeValue.length < 2)
		document.getElementById("m").firstChild.nodeValue = "0" + document.getElementById("m").firstChild.nodeValue;
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

