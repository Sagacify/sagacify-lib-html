define([], function () {

	return function (string) {
		var specials = [
			// order matters for these
			'-',
			'[',
			']',
			// order doesn't matter for any of these
			'/',
			'{',
			'}',
			'(',
			')',
			'*',
			'+',
			'?',
			'.',
			'\\',
			'^',
			'$',
			'|',
			// from there on not obligatory but advised
			'~',
			'!',
			'@',
			'#',
			'%',
			'&',
			'´',
			'`',
			'/',
			'=',
			'_',
			':',
			';',
			'"',
			'\'',
			'<',
			'>',
			','
		];
		var regex = RegExp('[' + specials.join('\\') + ']', 'g');
		return string.replace(regex, '\\$&');
	}

});