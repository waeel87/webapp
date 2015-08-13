// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
	'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
	'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
	'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
	'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
	method = methods[length];

	// Only stub undefined methods.
	if (!console[method]) {
	    console[method] = noop;
	}
    }
}());

// Place any jQuery/helper plugins in here.


/**
 * JS Library v0
 */

var UTILS = (function () {

    return {
	/**
	 * Check if a given value is a plain Object
	 *
	 * @param  {*}       o Any value to be checked
	 * @return {Boolean}   true if it's an Object
	 */
	isObject: function (o) {
	    var toString = Object.prototype.toString;
	    return (toString.call(o) === toString.call({}));
	},
	addEvent: function (element, event, handler) {
	    if (window.addEventListener) { // modern browsers including IE9+
		element.addEventListener(event, handler, false);
	    } else if (window.attachEvent) { // IE8 and below
		element.attachEvent('on' + event, handler);
	    } else {
		element['on' + event] = handler;
	    }
	},
	removeEvent: function (element, event, handler) {
	    if (window.removeEventListener) {
		element.removeEventListener(element, handler, false);
	    } else if (window.detachEvent) {
		element.detachEvent('on' + event, handler);
	    } else {
		element['on' + event] = null;
	    }
	},
	openTab: function (tabId) {
	    $tab = $(tabId + ".tab");
	    $('.tab').removeClass('active');
	    $('.tabs-actions a').removeClass('active');
	    $('.tab').hide();
	    $tab.show();
	    $tab.addClass('active');
	    $('.tabs-actions a[href="#' + $tab.attr('id') + '"]').addClass('active');

	},
	ajax: function (url, options) {
	    var xhr = new XMLHttpRequest(),
		    method = 'GET',
		    options = UTILS.isObject(options) ? options : {};

	    // Check if "method" was supplied
	    if (options.method) {
		method = options.method;
	    }

	    // Setup the request
	    xhr.open(method.toUpperCase(), url);

	    xhr.onreadystatechange = function () {
		var status;

		// If request finished
		if (xhr.readyState === 4) {
		    status = xhr.status;

		    // If response is OK or fetched from cache
		    if ((status >= 200 && status < 300) || status === 304) {
			var res = xhr.responseText,
				contentType = xhr.getResponseHeader('Content-Type');

			// If server sent a content type header, handle formats
			if (contentType) {
			    // Handle JSON format
			    if (contentType === 'text/json' ||
				    contentType === 'application/json') {

				// JSON throws an exception on invalid JSON
				try {
				    res = JSON.parse(res);
				} catch (err) {
				    // Trigger "fail" callback if set
				    if (options.fail) {
					options.fail.call(xhr, err);
					return;
				    }
				}
				// Handle XML format
			    } else if (contentType === 'text/xml' ||
				    contentType === 'application/xml') {
				// responseXML returns a document object
				res = xhr.responseXML;

				// if XML was invalid, trigger fail callback
				if (res === null && options.fail) {
				    options.fail.call(xhr, 'Bad XML file');
				    return;
				}
			    }
			}

			// Trigger done callback with the proper response
			if (options.done) {
			    options.done.call(xhr, res);
			}
		    }

		}
	    };

	    // Fire the request
	    xhr.send(null);
	},
	init: function () {


	    UTILS.addEvent(window, 'hashchange', function () {
		$tab = $(location.hash + ".tab");
		if ($tab.length > 0) {
		    UTILS.openTab(location.hash);
		}
	    });

	    UTILS.addEvent(window, 'load', function () {
		window.dispatchEvent(new Event("hashchange"));
	    });

	    //load notification by ajax
	    UTILS.ajax('data/config.json', {
		done: function (data) {
		    if (data) {
			if (data.notification != "") {
			    $('.notifications').html(data.notification);
			    $('.notifications').show();
			    return true;
			}
		    }    
		}
	    });
	}

    };
}());
