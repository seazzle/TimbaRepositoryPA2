/**
 * zentrales ErrorHandling - saemtliche JavaScript Fehler werden ueber alert dem User sichtbar gemacht
 * andernfalls wuerde ausschliesslich logs in der Browser Konsole stattfinden, die ein Nutzer uebersehen kann
 * Fuer die Bearbeitung durch den Systembetreuer wird der StackTrace in der Konsole ausgegeben.
 */

angular.module('ScriptExceptionHandler', []).factory('$exceptionHandler', function() {
    return function(exception, cause) {
        alert("Es ist folgender JavaScript Fehler aufgetreten: \n"+exception.toString()+" \nBitte melden Sie das Problem an den zuständigen Systembetreuer.");
        
        var formatted = '';
        var properties = '';
        formatted += 'Exception: "' + exception.toString() + '"\n';
        formatted += 'Caused by: ' + cause + '\n';

        properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
        properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
        properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
        properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''

        if (properties) {
          formatted += properties;
        }

        console.log("Folgender Fehler ist aufgetreten: \n"+formatted);
    };
});