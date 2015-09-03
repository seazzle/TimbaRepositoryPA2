var then;
var now;
var pause;
var min = 0;
var hour = 0;

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
	
	var stunden = document.getElementById("h").innerHTML;
	var minuten = document.getElementById("m").innerHTML;
	var industrieMinute = ((stunden*1) + (minuten / 60));
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

/**
 * stoppuhr zuruecksetzten
 */
function reset(){
	document.getElementById("s").firstChild.nodeValue = "00";
	document.getElementById("m").firstChild.nodeValue = "00";
	document.getElementById("h").firstChild.nodeValue = "0";
	
	document.getElementById("a1").style.display = "inline";
	document.getElementById("a2").style.display = "none";
	document.getElementById("a3").style.display = "none";
	document.getElementById("a4").style.display = "none";
	document.getElementById("a5").style.display = "none";
	
	document.getElementById("zeit").innerHTML = "";
	min = 0;
	hour = 0;
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
