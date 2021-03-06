/**
 * TimbaUtils beinhalten allgemeine funktionen
 */

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
		// delete obj[c];
		obj.splice(c, 1);
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
	return dd + "." + mm + "." + yyyy;
}

/**
 * @param stringDate im Format dd.MM.yyyy
 * @returns {String} im Format yyyy-MM-dd
 */
function germanDateFormatter(stringDate) {
	try {
		var split = stringDate.split(".");
		yyyy = split[2];
		mm = split[1];
		dd = split[0];
		return yyyy + "-" + mm + "-" + dd
	} catch (e) {
		throw "Fehler beim Date parsen germanDateFormatter";
	}
}

/**
 * @param stringDate im Format yyyyMMddhhmmss
 * @returns {String} im Format dd.MM.yyyy
 */
function rochadeDateFormatter(stringDate){
	if(!stringDate==='undefined'||!stringDate==null||!stringDate==""){
		try{
			var year=stringDate.substring(0, 4);
			var month=stringDate.substring(4,6);
			var day=stringDate.substring(6,8);
			return day+"."+month+"."+year;
		}catch(e){
			throw "Fehler beim Date parsen - RochadeDateFormatter";
		}
	}
}

/**
 * @param arr array of Objects
 * @param id id value of a single Object
 * @returns the Object where the id matches
 */
function getById(arr, id) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].id === id) {
            return arr[d];
        }
    }
}