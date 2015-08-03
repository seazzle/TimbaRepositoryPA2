'use strict';
 
angular.module('Authentication')
 
.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', '$log',
    function (Base64, $http, $cookieStore, $rootScope, $timeout, $log) {
        var service = {};
        service.Login = function (username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
//            $timeout(function(){
//			            	var response = {
//				success : username == password
//			};
//			$rootScope.user = username;
//			$log.debug("angemeldeter User: "+$rootScope.user);
//			if (!response.success) {
//				response.message = 'Deine Sachbearbeiternummer oder dein Passwort sind falsch';
//			}
//			callback(response);
//            }, 1000);


            /*
			 * Use this for real authentication
			 * ----------------------------------------------
			 */
        	/**
        	 * URL setzen ob intern oder extern
        	 */
        	originEndpoint = window.location.protocol + "//" + window.location.host;
        	if (originEndpoint == localDevEndpoint) {
        		serviceURL = externalEndpoint + serviceName; // for localhost e.g.
        	} else {
        		serviceURL = originEndpoint + serviceName;
        	}

        	console.log(serviceURL, { username: "TimbaUser", password: "resuabmit" });
        	$http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode('TimbaUser' + ':' + 'resuabmit');
            $http.post(serviceURL, { username: "TimbaUser", password: "resuabmit" })
                .success(function (response) {
                	var response = {
            				success : username == password
            			};
                	$rootScope.user = username;
                	$log.debug("angemeldeter User: "+$rootScope.user);
                    callback(response);
                });
        	
//        	$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('TimbaUser' + ':' + 'resuabmit');
            console.log(Base64.encode('TimbaUser' + ':' + 'resuabmit'));
//            $http({method: 'GET', url: serviceURL}).
//                    success(function(data, status, headers, config) {
//                        $scope.pets = data;
//                        // this callback will be called asynchronously
//                        // when the response is available
//                    }).
//                    error(function(data, status, headers, config) {
//                        alert(data+" "+ headers);
//                        // called asynchronously if an error occurs
//                        // or server returns response with an error status.
//                    });

        };
 
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode("TimbaUser" + ':' + "resuabmit");
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
 
            console.log("authdata "+authdata);
            console.log();
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }])
 
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
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
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
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
 
    /* jshint ignore:end */
});