// starch-utils.js
// This file merges all utility functions from starch/ and utils/ for easy inclusion in any project.
// It includes extensions and helpers for Array, String, Number, Object, Date, Math, Function, and more.
// Usage: include this file in your project to access all the merged utilities.

// --- starch/number.js ---
Number.prototype.define('isOdd', function isOdd(obj) {
	return (obj % 2 === 1 || obj % 2 === -1)
})
Number.prototype.define('isEven', function isEven(obj) {
	return obj % 2 === 0
})
Number.prototype.define('isInteger', function isInteger(obj) {
	return obj % 1 === 0
})
Number.prototype.define('isFloat', function isFloat(obj) {
	return obj % 1 !== 0
})
Number.prototype.define('isPositive', function isPositive(obj) {
	return obj > 0
})
Number.prototype.define('isNegative', function isNegative(obj) {
	return obj < 0
})
Number.prototype.define("isMultipleOf", function isMultipleOf(multiple) {
	return this % multiple === 0
})
Number.prototype.define("isLuhn", function isLuhn(num) {
	num = (num + '').split('').reverse()
	var sum = 0,
		i, digit
	for (i = 0; i < num.length; i++) {
		digit = parseInt(num[i], 10) * ((i + 1) % 2 ? 1 : 2)
		sum += digit > 9 ? digit - 9 : digit
	}
	return (sum % 10) === 0
})
Number.prototype.define("base", function(b, c) {
	var s = "",
		n = this
	if (b > (c = (c || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").length) || b < 2) {
		return ""
	}
	while (n) {
		s = c[n % b] + s, n = Math.floor(n / b)
	}
	return s
})
Number.prototype.define("abs", function() {
	return Math.abs(this)
})
Number.prototype.base26 = (function() {
	return function base26() {
		n = this
		ret = ""
		while (parseInt(n) > 0) {
			--n
			ret += String.fromCharCode("A".charCodeAt(0) + (n % 26))
			n /= 26
		}
		return ret.split("").reverse().join("")
	}
}())

// --- starch/range.js ---
function range(start, end, step) {
	var range = []
	var typeofStart = typeof start
	var typeofEnd = typeof end

	if (step === 0) {
		throw TypeError("Step cannot be zero.")
	}
	if (typeofStart == "undefined" || typeofEnd == "undefined") {
		throw TypeError("Must pass start and end arguments.")
	} else if (typeofStart != typeofEnd) {
		throw TypeError("Start and end arguments must be of same type." + typeofStart + typeofEnd)
	}
	typeof step == "undefined" && (step = 1)
	if (end < start) {
		step = -step
	}
	if (typeofStart == "number") {
		while (step > 0 ? end >= start : end <= start) {
			range.push(start);
			start += step
		}
	} else if (typeofStart == "string") {
		if (start.length != 1 || end.length != 1) {
			throw TypeError("Only strings with one character are supported.")
		}
		start = start.charCodeAt(0)
		end = end.charCodeAt(0)
		while (step > 0 ? end >= start : end <= start) {
			range.push(String.fromCharCode(start));
			start += step
		}
	}
	else {
		throw TypeError("Only string and number types are supported")
	}
	return range
}

// --- starch/element.js ---
Element.define("create", function(tag, arg) {
	var elem = document.createElement(tag)
	if (arg) {
		var attrs = arg
		for (var attr in attrs) {
			elem.setAttribute([attr], attrs[attr])
		}
	}
	return elem
})
window.define("create", Element.create)
Element.prototype.define("inner", function() {
	if (arguments.length === 0) {
		return this.innerHTML
	}
	this.innerHTML = arguments[0]
	return this
})
Element.prototype.define("replaceWith", function(newNode) {
	return this.parentNode.replaceChild(newNode, this)
})
Element.prototype.define("before", function(htmlString) {
	return this.insertAdjacentHTML('beforebegin', htmlString)
})
Element.prototype.define("after", function(htmlString) {
	return this.insertAdjacentHTML('afterend', htmlString)
})
Element.prototype.define("append", function(htmlString) {
	return this.insertAdjacentHTML('beforeend', htmlString)
})
Element.prototype.define("prepend", function(htmlString) {
	log(htmlString)
	return this.insertAdjacentHTML('afterbegin', htmlString)
})
Element.prototype.define("hide", function() {
	this.style.display = 'none'
	return this
})
Element.prototype.define("show", function() {
	this.style.display = ''
	return this
})

// --- starch/is.js ---
Object.prototype.define('isObject', function(obj, strict) {
	if (strict) {
		return typeof obj === 'object' && !isNull(obj) && !isArray(obj) && !isDate(obj)
	}
	return Object.prototype.toString.call(obj) === '[object Object]' && obj !== void 0
})

// --- starch/util.js ---
(function() {
	if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = {};
	}
	for (c in console) {
		if (c === "memory") {
			continue
		}
		eval(c + " = console." + c + ".bind(console)")
	}
	function Nihil() {}
	Nihil.prototype = Object.create(null)
	window.$_GET = function(name) {
		if (!name) {
			return new Url(window.location.href).queryPairs;
		}
		var nameEQ = name + '=',
			url = window.location.href,
			pos = url.indexOf('?'),
			url = url.slice(pos + 1),
			arr = url.split('&'),
			i = 0,
			pair = '',
			arrl = arr.length;
		for (i = 0; i < arrl; i++) {
			var pair = arr[i];
			if (pair.indexOf(nameEQ) === 0) {
				return decodeURIComponent(pair.slice(nameEQ.length).replace(/\+/g, '%20'));
			}
		}
		return null;
	}
	function loadCSS(href, tag, n) {
		"use strict"
		var link = window.document.createElement("link")
		var script = tag || window.document.getElementsByTagName("script")[0]
		link.rel = "stylesheet"
		link.href = href
		link.media = "only x"
		script.parentNode.insertBefore(link, script)
		setTimeout(function() {
			link.media = n || "all"
		})
	}
	window.nativeAlert = window.alert
	window.alert = function() {
		return window.nativeAlert(Array.prototype.slice.call(arguments).join(", "))
	}
	window.onerror = function(msg, url, line) {
		window.nativeAlert("Message: " + msg, "\nurl: " + url, "\nLine Number: " + line)
	}
	window.connect = function(a) {
		if (a == true) {
			window.addEventListener("offline", function(e) {
				alert("offline")
			}, false)
			window.addEventListener("online", function(e) {
				alert("online")
			}, false)
		}
		return window.navigator.onLine
	}
	window.js = function(a) {
		window.navigator.javaEnabled(a);
		return window.navigator.javaEnabled()
	}
	window.taint = function(a) {
		window.navigator.taintEnabled(a);
		return window.navigator.taintEnabled()
	}
	window.title = function() {
		document.title(Array.prototype.slice.call(arguments).join(", "))
	}
	window.video = function() {
		return !!document.createel('video').canPlayType
	}
	window.empty = function(a) {
		return !(typeof a === "undefined")
	}
	window.type = function(input) {
		if (input instanceof String) {
			return "String"
		}
		if (input instanceof Number) {
			return "Number"
		}
		if (input instanceof Boolean) {
			return "Boolean"
		}
		if (input instanceof Object) {
			return "Object"
		}
		if (input instanceof Array) {
			return "Array"
		}
		return typeof input
	}
	window.url = function() {
		return window.location.pathname
	}
	window.goto = function(url) {
		window.location.href = url
	}
	window.getWindowCoords = (navigator.userAgent.toLowerCase().indexOf('opera') > 0 || navigator.appVersion.toLowerCase().indexOf('safari') != -1) ? function() {
		canvasX = window.innerWidth;
		canvasY = window.innerHeight;
	} : function() {
		canvasX = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
		canvasY = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
	}
	window.onresize = window.getWindowCoords
	window.apiload = function() {
		$("head").append('<script src="http://www.google.com/jsapi" type="text/javascript"></script>')
		google.load('jquery', '1.9.1')
		google.load('jqueryui', '1.5.3')
	}
	function isLessThanIE(version) {
		if (navigator.appName === 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent,
				re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})")
			if (re.exec(ua) !== null) {
				if (parseFloat(RegExp.$1) < version) {
					return true
				}
			}
		}
		return false
	}
	function insertAtCursor(myField, myValue) {
		if (document.selection) {
			myField.focus()
			sel = document.selection.createRange()
			sel.text = myValue
		}
		else if (myField.selectionStart || myField.selectionStart == '0') {
			var startPos = myField.selectionStart
			var endPos = myField.selectionEnd
			restoreTop = myField.scrollTop
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
			myField.selectionStart = startPos + myValue.length
			myField.selectionEnd = startPos + myValue.length
			if (restoreTop > 0) {
				myField.scrollTop = restoreTop
			}
		}
		else {
			myField.value += myValue
		}
	}
})()

// --- starch/Cookie.js ---
function Cookie() {
	this.get = function(name) {
		var i, x, y, ARRcookies = document.cookie.split(";")
		for (i = 0; i < ARRcookies.length; i++) {
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="))
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1)
			x = x.replace(/^\s+|\s+$/g, "")
			if (x == name) {
				return unescape(y)
			}
		}
	}
	this.set = function(name, value, exdays) {
		var exdate = new Date()
		exdate.setDate(exdate.getDate() + exdays)
		var cvalue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString())
		document.cookie = name + "=" + cvalue
	}
	this.unset = function(name) {
		setCookie(name, "", -1)
		return name
	}
	this.clear = function() {
		var cookies = document.cookie.split(";")
		for (var i = 0; i < cookies.length; i++) {
			unsetCookie(cookies[i].split("=")[0])
		}
	}
}

// --- starch/$.util.js ---
if (!jQuery) {
	var jq = document.createElement('script')
	jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"
	document.getElementsByTagName('head')[0].appendChild(jq)
}
(function($) {
	$.file_get_contents = function(address) {
		return $.ajax({
			url: address,
			async: false
		}).responseText
	}
	$.uppercase = function(input) {
		if (typeof input !== "string" || !input) {
			return null;
		}
		return input.toUpperCase()
	}
	$.lowercase = function(input) {
		if (typeof input !== "string" || !input) {
			return null;
		}
		return input.toLowerCase()
	}
	$.capitalize = function(input) {
		if (typeof input !== "string" || !input) {
			return null;
		}
		return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
	}
	$.chomp = function(input, offset) {
		if (typeof input !== "string" || !input) {
			return null;
		}
		return input.substring(0, input.length - offset)
	}
	$.title = function(input) {
		if (arguments.length == 0) {
			return $("title").html()
		}
		$("title").html(input)
	}
	$.fn.repeat = function(input, n) {
		var result = ""
		for (var i = 0; i < n; i++) {
			result += input
		}
		return result
	}
})(jQuery)

// --- starch/file.js ---
function file_exists(url) {
	if (url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		req.send();
		return req.status == 200;
	}
	else {
		return false;
	}
}
function file_get_contents(url) {
	if (url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		req.send();
		return req.responseText;
	}
	else {
		return false;
	}
}
function file(url) {
	if (url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		req.send();
		return req.responseText.split("\n");
	}
	else {
		return false;
	}
}

// --- starch/Date.js ---
Date.define("getMonthNumberFromName", function(name) {
	var n = Date.CultureInfo.monthNames,
		m = Date.CultureInfo.abbreviatedMonthNames,
		s = name.toLowerCase();
	for (var i = 0; i < n.length; i++) {
		if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
			return i;
		}
	}
	return -1;
})
Date.define("getDayNumberFromName", function(name) {
	var n = Date.CultureInfo.dayNames,
		m = Date.CultureInfo.abbreviatedDayNames,
		o = Date.CultureInfo.shortestDayNames,
		s = name.toLowerCase();
	for (var i = 0; i < n.length; i++) {
		if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
			return i;
		}
	}
	return -1;
})
Date.define("isLeapYear", function(year) {
	return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
})
Date.define("getDaysInMonth", function(year, month) {
	return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
})
Date.define("getTimezoneOffset", function(s, dst) {
	return (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];
})
Date.define("getTimezoneAbbreviation", function(offset, dst) {
	var n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard,
		p;
	for (p in n) {
		if (n[p] === offset) {
			return p;
		}
	}
	return null;
})
Date.define("now", function() {
	return new Date();
})
Date.define("today", function() {
	return Date.now().clearTime();
})

// --- starch/Canvas.js ---
function Canvas() {
	this.canvas = create("canvas")
	this.canvas.width = this.width = 100
	this.canvas.height = this.height = 100
	this.context = this.canvas.getContext("2d")
	this.c = this.context
	return this
}
Canvas.prototype.clear = function() {
	this.c.clearRect(0, 0, this.width, this.height)
	return this
}
Canvas.prototype.line = function(x1, y1, x2, y2, color, width) {
	if (x1.isArray()) {
		color = y1 || "black"
		width = x2 || 5
		y1 = x1.y1
		x2 = x1.x2
		y2 = x1.y2
		x1 = x1.x1
	}
	this.c.beginPath()
	this.c.moveTo(x1, y1)
	this.c.lineTo(x2, y2)
	this.c.strokeStyle = color || "black"
	this.c.lineWidth = width || 5
	this.c.stroke()
	this.c.closePath()
	return this
}
Canvas.prototype.square = function(x, y, e, w, color, fill) {
	if (color == '') {
		color = 'rgba(0, 0, 0, 0)'
	}
	this.c.beginPath()
	this.c.rect(x, y, e, e)
	this.c.lineWidth = w
	this.c.strokeStyle = color
	this.c.stroke()
	if (fill) {
		this.c.fillStyle = fill
		this.c.fillRect(x, y, e, e)
	}
	return this
}

// --- starch/function.js ---
Function.prototype.define("repeat", function(n) {
	n = n || 2
	var m = 0,
		p = "",
		r = ""
	while (m < n) {
		p = 0
		p = "" + this.call()
		if (p) {
			r += p
		}
		m++
	}
	return "" + r
})
Function.prototype.define("proxy", function() {
	this.apply(context, arguments.slice(1))
})
Function.prototype.define("iter", function() {
	var internal = 0
	return function() {
		internal++
		return internal.base(26)
	}
})

// --- starch/Math.js ---
function comp_sum(array) {
	var sum = 0
	for (i in array) {
		sum += parseInt(array[i])
	}
	return sum
}
function comp_ave(array) {
	var ave = comp_sum(array) / array.length
	return ave
}
function comp_dev(array) {
	var mean = comp_ave(array)
	var dev = 0
	for (i in array) {
		array[i] = (array[i] - mean)
	}
	for (i in array) {
		array[i] = (array[i] * array[i])
	}
	for (i in array) {
		dev += array[i]
	}
	dev /= (array.length - 1)
	dev = Math.sqrt(dev)
	return dev
}
function get_r(xs, ys, xbar, ybar, sdx, sdy) {
	var xy = 0
	for (var j = 0; j < xs.length; j++) {
		xs[j] = parseFloat(xs[j])
		ys[j] = parseFloat(ys[j])
		xy += (xs[j] - xbar) * (ys[j] - ybar)
	}
	corr = Math.round(1 / (xs.length - 1) * xy / (sdx * sdy) * 10000) / 10000
	return corr
}
function least_squares(twodarray) {
	var ave = []
	for (var j = 0; j < twodarray[0].length; j++) {
		aver = []
		for (var i = 0; i < twodarray.length; i++) {
			aver.push(twodarray[i][j])
		}
		ave.push(aver)
	}
	var xbar = comp_ave(ave[0].slice())
	var ybar = comp_ave(ave[1].slice())
	var sdx = comp_dev(ave[0].slice())
	var sdy = comp_dev(ave[1].slice())
	var r = get_r(ave[0].slice(), ave[1].slice(), xbar, ybar, sdx, sdy)
	var b = r * (sdy / sdx)
	var a = ybar - (b * xbar)
	return [a, b].slice()
}
function convert(src, srcAlphabet, dstAlphabet, caps) {
	alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
	if (caps == true) {
		alphabet = alphabet.toUpperCase()
	}
	if (typeof src === "number") {
		src = String(src)
	}
	if (typeof srcAlphabet !== typeof dstAlphabet) {
		TypeError("Alphabet types don't match. ")
	}
	if (typeof srcAlphabet === "number") {
		var srcBase = srcAlphabet
		var dstBase = dstAlphabet
		srcAlphabet = alphabet.substring(0, srcBase)
		dstAlphabet = alphabet.substring(0, dstBase)
	}
	if (typeof srcAlphabet === "string") {
		var srcBase = srcAlphabet.length
		var dstBase = dstAlphabet.length
	}
	var wet = src,
		val = 0,
		mlt = 1
	while (wet.length > 0) {
		var digit = wet.charAt(wet.length - 1)
		val += mlt * srcAlphabet.indexOf(digit)
		wet = wet.substring(0, wet.length - 1)
		mlt *= srcBase
	}
	wet = val
	var ret = ""
	while (wet >= dstBase) {
		var digitVal = wet % dstBase
		var digit = dstAlphabet.charAt(digitVal)
		ret = digit + ret
		wet /= dstBase
	}
	var digit = dstAlphabet.charAt(wet)
	return digit + ret
}
function base26(value) {
	var converted = ""
	var iteration = false
	do {
		var remainder = value % 26 + 1
		if (iteration == false && value < 26) {
			remainder--
		}
		converted = String.fromCharCode(64 + remainder) + converted
		value = (value - remainder) / 26
		iteration = true
	}
	while (value > 0)
	return converted
}

// --- starch/String.js ---
String.prototype.define('parse', function(reviver) {
  return JSON.parse(this, reviver);
})
String.define("random", function(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text
})
String.define("format", function(format) {
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match
  })
})
String.prototype.define("format", function() {
  var args = arguments
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match
  })
})

// --- starch/Array.js ---
Array.define("fill", function(n) {
	return Array.apply(null, Array(n)).map(function(_, i) {
		return i
	})
})
Array.prototype.define("each", Array.prototype.forEach)
Array.prototype.define('remove', function(obj) {
	var i = this.indexOf(obj)
	if (~i) {
		return this.splice(i, 1)[0]
	}
	else {
		return false
	}
})
Array.prototype.define('removeAll', function(obj) {
	var removed = []
	while (true) {
		var i = this.indexOf(obj)
		if (~i) {
			removed[removed.length] = this.splice(i, 1)
		}
		else {
			break
		}
	}
	return removed
})
Array.prototype.define('contains', function(obj) {
	var i = this.indexOf(obj)
	return !!~i;
})
Array.prototype.define('toString', function() {
	return this.join(", ")
})
Array.prototype.define("pick", function() {
	return this[Math.floor((Math.random() * this.length))];
})
Array.prototype.define("randomize", function() {
	return this.sort(function() {
		return (Math.round(Math.random()) - 0.5)
	});
})
Array.prototype.define("shuffle", function() {
	var i = this.length, j, temp
	if (i == 0) {
		return
	}
	while (--i) {
		j = Math.floor(Math.random() * (i + 1))
		temp = this[i]
		this[i] = this[j]
		this[j] = temp
	}
	return this
})

// --- starch/Color.js ---
Color = Object.create(Object.prototype)
Color.define("random", function() {
	return "rgb(" + (Math.random() * 100) + "%, " + (Math.random() * 100) + "%, " + (Math.random() * 100) + "%)"
})
function Color(r, g, b, a) {
	if (!a) {
		a = 1
	}
	this.r = r
	this.g = g
	this.b = b
	this.a = a
	this.rgb = function() {
		return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")"
	}
	this.rgba = function() {
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
	}
	this.rgb2hex = function(r, g, b) {
		var hex = [r.toString(16), g.toString(16), b.toString(16)]
		$.each(hex, function(nr, val) {
			if (val.length === 1) {
				hex[nr] = "0" + val;
			}
		})
		return hex.join("").toUpperCase()
	}
	this.hex2rgb = function(hex) {
		R = hexToR(hex);
		G = hexToG(hex);
		B = hexToB(hex);
		return "rgb(" + R + ", " + G + ", " + B + ")"
	}
	function hexToR(h) {
		return parseInt((cutHex(h)).substring(0, 2), 16)
	}
	function hexToG(h) {
		return parseInt((cutHex(h)).substring(2, 4), 16)
	}
	function hexToB(h) {
		return parseInt((cutHex(h)).substring(4, 6), 16)
	}
	function cutHex(h) {
		return (h.charAt(0) == "#") ? h.substring(1, 7) : h
	}
	this.random = function(a) {
		if (a == "hex") {
			var letters = '0123456789ABCDEF'.split('')
			var color = '#'
			for (var i = 0; i < 6; i++) {
				color += letters[Math.round(Math.random() * 15)]
			}
			return color
		}
		if (a == "rgb") {
			return "rgb(" + randomnumber(0, 255, 0) + ", " + randomnumber(0, 255, 0) + ", " + randomnumber(0, 255, 0) + ")"
		}
		if (a == "rgba") {
			return "rgba(" + randomnumber(0, 255, 0) + ", " + randomnumber(0, 255, 0) + ", " + randomnumber(0, 255, 0) + ", " + alpha + ")"
		}
	}
}

// --- starch/object.js ---
Object.defineProperty(Object.prototype, "define", {
	configurable: true,
	enumerable: false,
	writable: true,
	value: function(name, value) {
		if (Object[name]) {
			delete Object[name]
		}
		Object.defineProperty(this, name, {
			configurable: true,
			enumerable: false,
			writable: true,
			value: value
		})
		return this
	}
})
Object.prototype.define("extend", function(src) {
	var target = this
	if (isObject(src)) {
		for (var o in src) {
			if (Object[src[o]]) {
				delete Object[src[o]]
			}
			this.define(o, src[o])
		}
	}
	return this
})
Object.define("setPrototypeOf", function(obj, proto) {
	obj.__proto__ = proto
	return obj
})
Object.prototype.define("setPrototypeOf", function(obj, proto) {
	obj.__proto__ = proto
	return obj
})
Object.prototype.extend({
	"hasProperty": function(a) {
		return Object.hasOwnProperty(this, a)
	},
	"getPropertyName": function(a) {
		return Object.getOwnPropertyName(this, a)
	},
	"getPropertyNames": function() {
		return Object.getOwnPropertyNames(this)
	},
	"getPropertyDescriptor": function(a) {
		return Object.getOwnPropertyDescriptor(this, a)
	},
	"getPropertyDescriptors": function() {
		var result = {}
		Object.getOwnPropertyNames(this).each(function(a, b) {
			result[a] = Object.getOwnPropertyDescriptor(this, a)
		}, this)
		return result
	},
	"each": function(f) {
		for (var i in this) {
			f && this.hasProperty(i) && f.call(this, this[i], i)
		}
		return this
	}
})
Object.prototype.define("eachOwn", function(fn) {
	var o = this
	Object.keys(o).each(function(key) {
		fn.call(o, o[key], key)
	})
})
Object.prototype.define("forEach", function(callback, scope) {
	var collection = this
	if (Object.prototype.toString.call(collection) === '[object Object]') {
		for (var prop in collection) {
			if (Object.prototype.hasOwnProperty.call(collection, prop)) {
				callback.call(scope, collection[prop], prop, collection)
			}
		}
	}
	else {
		for (var i = 0, len = collection.length; i < len; i++) {
			callback.call(scope, collection[i], i, collection)
		}
	}
})
Object.prototype.define("assign", function(...sources) {
	var target = this
	sources.forEach(source => {
		var descriptors = Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key)
			return descriptors;
		}, {})
		Object.getOwnPropertySymbols(source).forEach(sym => {
			var descriptor = Object.getOwnPropertyDescriptor(source, sym)
			if (descriptor.enumerable) {
				descriptors[sym] = descriptor
			}
		})
		Object.defineProperties(target, descriptors)
	})
	return target;
})
Object.prototype.define("map", function(fn, ctx) {
	var ctx = ctx || this,
		self = this,
		result = {}
	Object.keys(self).each(function(v, k) {
		result[k] = fn.call(ctx, self[k], k, self)
	})
	return result
})
Object.define('clone', function(obj) {
	if (Array.isArray(obj)) {
		result = []
	}
	else {
		var result = {};
	}
	for (var key in obj) {
		var val = obj[key];
		if (Array.isArray(val)) {
			result[key] = Object.clone(val.slice());
		}
		else if (val === null) {
			result[key] = val;
		}
		else if (val === undefined) {
			continue;
		}
		else if (typeof val === "object") {
			result[key] = Object.clone(val);
		}
		else {
			result[key] = val;
		}
	}
	return result;
})
Object.prototype.define("clone", function() {
	return JSON.parse(JSON.stringify(this))
})
Object.define('merge', function(target, obj) {
	for (var key in obj) {
		var next = obj[key];
		var current = target[key];
		if (Array.isArray(next)) {
			target[key] = Object.clone(next.slice());
		}
		else if (next === null) {
			target[key] = next;
		}
		else if (next === undefined) {
			continue;
		}
		else if (typeof next === 'object') {
			if (current === null) {
				current = Object.clone(next);
			}
			else if (typeof current === 'object') {
				current.absorb(next);
			}
			else if (current === undefined) {
				current = Object.clone(next);
			}
		}
		else {
			target[key] = next;
		}
	}
	return target;
})
Object.prototype.define('stringify', function(replacer, space) {
	return JSON.stringify(this, replacer, space);
})
Object.prototype.define("type", function() {
	var x = this
	if (x === null) {
		return 'Null'
	}
	if (x === undefined) {
		return 'Undefined'
	}
	var type = x.toString()
	return type.slice(type.indexOf(' ' + 1), -1)
})
Object.prototype.define("log", function() {
	return log(this)
})
Object.prototype.define("size", function() {
	return this.length || Object.keys(this).length
})
Object.prototype.define("str", function() {
	return JSON.stringify(this)
})
Object.prototype.define("toInt", function() {
	return parseInt(this, (arguments[0] || 10))
})
Object.prototype.define("values", function() {
	var keys = Object.keys(this)
	var ret = []
	for (var i = 0; i < keys.length; i++) {
		ret.push(this[keys[i]])
	}
	return ret
})

// --- starch/random.js ---
Object.prototype.define("pick", function() {
	var keys = Object.keys();
	return this[keys[Math.floor((Math.random() * keys.length))]];
})
function randomNumber(min, max, round) {
	result = (Math.random() * max) + min
	result *= Math.pow(10, round)
	result = Math.round(result)
	result /= Math.pow(10, round)
	return result
}
var Random = function Random() {}
var nativeRandom = Math.random;
var nativeRandom = Math.random
Math.random = function(min, max, round, mt) {
	if (arguments.length === 0) {
		return nativeRandom()
	}
	if (!round) {
		round = 1
	}
	if (!max) {
		var max = min
		min = 1
	}
	if (mt) {
		min = parseInt(min, 10)
		max = parseInt(max, 10)
	}
	return Math.floor(nativeRandom() * (max - min + 1)) + min
}
Math.random.range = function(min, max) {
	'use strict';
	min = parseFloat(min) || 0;
	max = parseFloat(max) || 0;
	return Math.floor(Math.random() * (max - min + 1)) + min
}
Random.prototype.define("boolean", function() {
	return Math.random() >= 0.5;
})

// --- utils/utils.js ---
"use strict"
const fs = require('fs')
const https = require("https")
const url = require("url")
const path = require('path')
const args = process.argv.slice(2)
Object.defineProperty(Object.prototype, "define", {
  writable:     false,
  enumerable:   false,
  configurable: true,
  value: function(key, value) {
    if (Object[key]) {
      delete Object[key]
    }
    Object.defineProperty(this, key, {
      writable:     false,
      enumerable:   false,
      configurable: true,
      value:        value
    })
    return this.key
  }
})
Array.prototype.define("each", Array.prototype.forEach)
String.prototype.define("each", function(fn) {
  let that = this
  that.split("").each(function(key) {
    fn.call(that, key)
  })
})
String.prototype.define("equals", function(that) {
  return this === that
})
Object.prototype.define("each", function(fn) {
  let obj = this
  Object.entries(obj).each(function(key) {
    fn.call(obj, key)
  })
})
Object.prototype.define("string", function(o) {
  return Object.prototype.toString.call(o)
})
Object.prototype.define("has", function(key) {
  return Object.prototype.hasOwnProperty.call(this, key)
})
Object.prototype.define("inherits", function(Parent) {
  let Child = this
  let hasProp = {}.hasOwnProperty
  function T() {
    this.constructor = Child
    this.constructor$ = Parent
    for(let propertyName in Parent.prototype) {
      if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length-1) !== "$") {
        this[propertyName + "$"] = Parent.prototype[propertyName]
      }
    }
  }
  T.prototype = Parent.prototype
  Child.prototype = new T()
  return Child.prototype
})

// --- utils/utils-2.js ---
"use strict"
if (!jQuery) {
    let jq = document.createElement('script')
    jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"
    document.getElementsByTagName('head')[0].appendChild(jq)
}
function Nihil() { }
Nihil.prototype = Object.create(null)
function isObject(object) {
    let type = typeof object
    return type === 'function' || type === 'object' && !!object
}
let nativeAlert = window.alert
window.alert = function() {
    return nativeAlert(arguments.join("\n"))
}
function loadCSS(e, t, n) {
    "use strict"
    let i = window.document.createElement("link")
    let o = t || window.document.getElementsByTagName("script")[0]
    i.rel = "stylesheet"
    i.href = e
    i.media = "only x"
    o.parentNode.insertBefore(i, o)
    setTimeout(function() {
        i.media = n || "all"
    })
}
Object.defineProperty(Object.prototype, "define", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function(name, value) {
        if (Object[name]) {
            delete Object[name]
        }
        Object.defineProperty(this, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: value
        })
        return this
    }
})
// All functions and prototype extensions are now available globally.
