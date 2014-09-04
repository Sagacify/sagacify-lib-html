define([

], function () {

	var HTML_ENTITY_MAP = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'/': '&#x2F;'
	};

	var HTML_MAP = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#x27;': '\'',
		'&#x2F;': '/'
	};

	// OSWASP Guidlines: &, <, >, ", ' plus forward slash.
	var HTML_CHARACTERS_EXPRESSION = /[&"'<>\/]/gm;
	var HTML_ENTITIES_EXPRESSION = /&[^;]{2,5};/gm;

	return {

		escapeHTML: function (text) {
			return text && text.replace(HTML_CHARACTERS_EXPRESSION, function (c) {
				return HTML_ENTITY_MAP[c] || c;
			});
		},

		decodeHTML: function (text) {
			return text && text.replace(HTML_ENTITIES_EXPRESSION, function (c) {
				return HTML_MAP[c] || c;
			});
		}

	};

});
