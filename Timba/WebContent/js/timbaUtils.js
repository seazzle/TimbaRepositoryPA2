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

function germanDateFormatter(stringDate) {
	try {
		var split = stringDate.split(".");
		console.log(split);
		yyyy = split[2];
		mm = split[1];
		dd = split[0];
		console.log(yyyy + "-" + mm + "-" + dd);
		return yyyy + "-" + mm + "-" + dd
	} catch (e) {
		throw "Fehler beim Date parsen";
	}
}