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
	showSettingsForm: function ($form) {
	    var $tab = $form.parents('.tab')
	    $form.show();
	    $('.settings-btn', $tab).addClass('active');
	    $('iframe', $tab).hide();
	    $('.expand-btn', $tab).hide();
	    $('.select-site', $tab).hide();
	},
	hideSettingsForm: function ($form) {
	    var $tab = $form.parents('.tab')
	    $form.hide();
	    $('.settings-btn', $tab).removeClass('active');
	    $('iframe', $tab).show();
	    $('.expand-btn', $tab).show();
	    $('.select-site', $tab).show();
	},
	toggleSettingsForm: function ($form) {
	    var $tab = $form.parents('.tab')
	    $form.toggle();
	    if ($form.is(':hidden')) {
		$('.settings-btn', $tab).removeClass('active');
		$('iframe', $tab).show();
		$('.expand-btn', $tab).show();
		$('.select-site', $tab).show();
	    }
	    else {
		$('.settings-btn', $tab).addClass('active');
		$('iframe', $tab).hide();
		$('.expand-btn', $tab).hide();
		$('.select-site', $tab).hide();
	    }
	},
	validURL: function (str) {
	    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	    if (!pattern.test(str)) {
		return false;
	    } else {
		return true;
	    }
	},
	validateSettingsForm: function ($form) {
	    var valid = true;
	    $form.find('fieldset').each(function (index) {
		var $nameInput = $(this).find('input[type="text"]');
		var $urlInput = $(this).find('input[type="url"]');
		$nameInput.removeClass('inputError');
		$urlInput.removeClass('inputError');

		if ($nameInput.val() !== '' && ($urlInput.val() === '' || !UTILS.validURL($urlInput.val()))) {
		    $urlInput.addClass('inputError');
		    valid = false;
		}

		if ($nameInput.val() === '' && $urlInput.val() !== '') {
		    $nameInput.addClass('inputError');
		    valid = false;
		}

	    });

	    $form.find('.inputError:first').focus();
	    return valid;
	},
	saveSettingsForm: function ($form) {
	    var arr = [];
	    var id = $form.parents('.tab').attr('id');
	    $form.find('fieldset').each(function (index) {
		var $nameInput = $(this).find('input[type="text"]');
		var $urlInput = $(this).find('input[type="url"]');

		if ($nameInput.val() !== '' && $urlInput.val() !== '' && UTILS.validURL($urlInput.val())) {

		    url = $urlInput.val();

		    var pattern = new RegExp('^(https?:\\/\\/)', 'i'); // fragment locator
		    if (!pattern.test(url)) {
			url = "http://" + url;
		    }


		    arr.push({
			name: $nameInput.val(),
			url: url,
		    });
		}
	    });
	    localStorage.setItem('settingsForm' + id, JSON.stringify(arr));
	},
	loadIframe: function ($tab, url) {
	    var id = $tab.attr('id');

	    if (!url) {
		var jsonStr = localStorage.getItem('settingsForm' + id);
		if (jsonStr) {
		    var settings = JSON.parse(jsonStr);
		    for (var index in settings) {
			url = settings[index].url;
		    }
		}
	    }

	    $('iframe', $tab).attr('src', url);
	    $('iframe', $tab).show();
	    $('.expand-btn', $tab).attr('href', url);
	    $('.expand-btn', $tab).show();

	    var $form = $('.settings-form', $tab);
	    $form.hide();
	    $('.settings-btn', $tab).removeClass('active');

	},
	loadSettingsForm: function ($form) {
	    var $tab = $form.parents('.tab');
	    var id = $form.parents('.tab').attr('id');
	    var jsonStr = localStorage.getItem('settingsForm' + id);
	    var $select = $('.select-site', $tab);
	    if (jsonStr) {
		var settings = JSON.parse(jsonStr);
		if (settings && settings.length > 0) {
		    $select.html('');
		    var name;
		    var url;
		    for (var index in settings) {
			name = settings[index].name;
			url = settings[index].url;
			$('input[type="text"]', $form).eq(index).val(name);
			$('input[type="url"]', $form).eq(index).val(url);
			$select.append('<option value="' + url + '">' + name + '</option>')
		    }
		    $select.val(url);
		    $select.show();
		    UTILS.loadIframe($tab, url);
		}
		else {
		    UTILS.showSettingsForm($form);
		}
	    }
	    else {
		UTILS.showSettingsForm($form);
	    }
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
			    $('.notifications').text(data.notification);
			    $('.notifications').show();
			    return true;
			}
		    }
		}
	    });

	    $('.settings-btn').click(function () {
		var $form = $(this).parents('.tab').find('.settings-form');
		UTILS.toggleSettingsForm($form);
	    });

	    $('.cancel-btn').click(function () {
		var $form = $(this).parents('.tab').find('.settings-form');
		UTILS.hideSettingsForm($form);
	    });

	    $('.settings-form').submit(function (e) {
		var $tab = $(this).parents('.tab');
		var $form = $('.settings-form', $tab);
		if (UTILS.validateSettingsForm($form)) {
		    UTILS.saveSettingsForm($form);
		    UTILS.loadSettingsForm($form);

		}
		return false;
	    });

	    $('.settings-form').each(function () {
		UTILS.loadSettingsForm($(this));
	    });


	    $('.select-site').change(function () {
		var $tab = $(this).parents('.tab');
		UTILS.loadIframe($tab, $(this).val());
	    });

	}

    };
}());
