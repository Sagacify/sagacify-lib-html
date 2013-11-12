define([
	'../types/validateType'
], function (is) {
	return {

		validate: function (ele, ele_config) {
			var isOptional = false;
			if(ele_config.length) {
				isOptional = this.hasOptionalFlag(ele_config);
				ele_config = ele_config.clone().splice(isOptional, ele_config.length);
			}
			if(isOptional && (ele == null)) {
				return true;
			}
			else if(ele_config.length && (ele != null)) {
				var expected_methods = ele_config;
				var expected_Type;
				var has_ValidType = true;
				if(ele_config[0] in is){
					var expected_Type = expected_methods.splice(0, 1)[0];
					var has_ValidType = this.validate_Type(ele, expected_Type);
				}

				if(is.Array(expected_methods)) {
					var has_ValidFormat = this.validate_Format(ele, expected_methods);
					return !!(has_ValidType && has_ValidFormat);
				}
				else{
					return false;
				}
			}
			else {
				return false;
			}
		},

		validate_Type: function (obj, type) {
			return (type in is) && (is[type](obj));
		},

		validate_Format: function (obj, method_list) {
			var valid = true;
			var validation_method;
			var validation_args;
			var method;
			for(var i = 0, len = method_list.length; i < len; i++) {
				method = method_list[i];
				if(is.String(method)) {
					valid = !this[method] || this[method](obj);
				}
				else if(is.Object(method)) {
					validation_method = Object.keys(method)[0];
					validation_args = [obj].concat(method[validation_method]);
					valid = this[validation_method].apply(this, validation_args);
				}
				else {
					valid = false;
					break;
				}
			}
			return valid;
		},

		hasOptionalFlag: function (conditions) {
			var first_condition = conditions[0];
			return (first_condition === 'isOptional');
		},

		isLowerHexadecimal: function () {
			return str.match(/^[0-9a-f]+$/);
		},

		isBase64: function (str, isWeb) {
			return isWeb ? str.match(/^[0-9a-zA-Z\-\_]+$/) : str.match(/^[0-9a-zA-Z\+\/]+$/);
		},

		isEmail: function (str) {
			return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
		},

		isUrl: function (str) {
			//A modified version of the validator from @diegoperini / https://gist.github.com/729294
			return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
		},

		isIP: function (str) {
			return this.isIPv4(str) || this.isIPv6(str);
		},

		isIPv4: function (str) {
			if(/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
				var parts = str.split('.').sort();
				// no need to check for < 0 as regex won't match in that case
				if(parts[3] > 255) {
					return false;
				}
				return true;
			}
			return false;
		},

		isIPv6: function (str) {
			if(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(str)) {
				return true;
			}
			return false;
		},

		isIPNet: function (str) {
			return validators.isIP(str) !== 0;
		},

		isAlpha: function (str) {
			return str.match(/^[a-zA-Z]+$/);
		},

		isAlphanumeric: function (str) {
			return str.match(/^[a-zA-Z0-9]+$/);
		},

		isNumeric: function (str) {
			return str.match(/^-?[0-9]+$/);
		},

		isHexadecimal: function (str) {
			return str.match(/^[0-9a-fA-F]+$/);
		},

		isHexColor: function (str) {
			return str.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
		},

		isLowercase: function (str) {
			return str === str.toLowerCase();
		},

		isUppercase: function (str) {
			return str === str.toUpperCase();
		},

		isInt: function (str) {
			return str.match(/^(?:-?(?:0|[1-9][0-9]*))$/);
		},

		isDecimal: function (str) {
			return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
		},

		isFloat: function (str) {
			return this.isDecimal(str);
		},

		isDivisibleBy: function (str, n) {
			return (parseFloat(str) % parseInt(n, 10)) === 0;
		},

		notNull: function (str) {
			return str !== '';
		},

		isNull: function (str) {
			return str === '';
		},

		notEmpty: function (str) {
			return !str.match(/^[\s\t\r\n]*$/);
		},

		equals: function (a, b) {
			return a == b;
		},

		contains: function (str, elem) {
			return str.indexOf(elem) >= 0 && !!elem;
		},

		notContains: function (str, elem) {
			return !this.contains(str, elem);
		},

		isUUID: function (str, version) {
			var pattern;
			if(version == 3 || version == 'v3') {
				pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
			} else if(version == 4 || version == 'v4') {
				pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
			} else if(version == 5 || version == 'v5') {
				pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
			} else {
				pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
			}
			return pattern.test(str);
		},

		isUUIDv3: function (str) {
			return this.isUUID(str, 3);
		},

		isUUIDv4: function (str) {
			return this.isUUID(str, 4);
		},

		isUUIDv5: function (str) {
			return this.isUUID(str, 5);
		},

		lenInferiorTo: function (str, maxLen) {
			return str.length < maxLen;
		},

		lenEqualTo: function (str, maxLen) {
			return str.length === maxLen;
		},

		lenSuperiorTo: function (str, maxLen) {
			return str.length > maxLen;
		}

	};
});