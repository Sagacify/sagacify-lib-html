define(['../types/validateType'], function (is) {
	return {

		validate: function (attr, ele, ele_config) {
			var isOptional = false;
			if (ele_config.length) {
				isOptional = this.hasOptionalFlag(ele_config);
				ele_config = ele_config.clone().splice(isOptional, ele_config.length);
			}
			if (isOptional && (ele == null)) {
				return true;
			} else if (ele_config.length &&   (ele != null)) {
				var expected_methods = ele_config;
				var expected_Type;
				var has_ValidType = true;
				if (ele_config[0] in is) {
					expected_Type = expected_methods.splice(0, 1)[0];
					has_ValidType = this.validate_Type(ele, expected_Type);
				}
				if (is.Array(expected_methods)) {
					var has_ValidFormat = this.validate_Format(attr, ele, expected_methods);
					return !!(has_ValidType && has_ValidFormat);
				} else {
					return false;
				}
			} else {
				App.alert($.t('DATA_VALIDATION.missing'));
				return false;
			}
		},

		validate_Type: function (obj, type) {
			return (type in is) && (is[type](obj));
		},

		clean_ErrorArgs: function (alert_arg) {
			alert_arg = is.DateString(alert_arg) ? new Date(alert_arg) : alert_arg;
			alert_arg = is.Date(alert_arg) ? moment(alert_arg).format('DD-MM-YYYY') : alert_arg;
			return !is.String(alert_arg) ? JSON.stringify(alert_arg) : alert_arg;
		},

		validate_Format: function (attr, obj, method_list) {
			var valid = true;
			var validation_method;
			var validation_args;
			var method;
			for (var i = 0, len = method_list.length; i < len; i++) {
				method = method_list[i];
				// For development only, in case we forgot a method
				if (is.String(method)) {
					valid = !this[method] || this[method](obj);
					if (!valid) {
						App.alert('In field "' + attr + '", ' + $.t('DATA_VALIDATION.' + method, {
							val: this.clean_ErrorArgs(obj)
						}));
					}
					// For development only, in case we forgot a method
					/* START */
					if (!(Object.prototype.toString.call(valid) === '[object Boolean]')) {
						console.error('Format validation result for ' + method + ' is not a Boolean.');
						console.error(valid);
					}
					if ((method in this) && (valid !== true)) console.error('Failling ' + method + '() !');
					if (!(method in this)) console.error('[1] - Missing format validation method ' + method + '() !'); /* END */
				} else if (is.Object(method)) {
					validation_method = Object.keys(method)[0];
					validation_args = [obj].concat(method[validation_method]);
					valid = !this[validation_method] || this[validation_method].apply(this, validation_args);
					if (!valid) {
						App.alert('In field "' + attr + '", ' + $.t('DATA_VALIDATION.' + validation_method, {
							val: this.clean_ErrorArgs(obj),
							arg: this.clean_ErrorArgs(validation_args[1])
						}));
					}
					// For development only, in case we forgot a method
					/* START */
					if (!(Object.prototype.toString.call(valid) === '[object Boolean]')) {
						console.error('Format validation result for ' + validation_method + ' is not a Boolean.');
						console.error(valid);
					}
					if ((validation_method in this) && (valid !== true)) console.error('Failling ' + validation_method + '() !');
					if (!(validation_method in this)) console.error('[2] - Missing format validation method ' + validation_method + '() !'); /* END */
				} else {
					valid = false;
				}
				if (valid !== true) {
					break;
				}
			}
			return valid;
		},

		hasOptionalFlag: function (conditions) {
			var first_condition = conditions[0];
			return (first_condition === 'isOptional');
		},

		isEmail: function (str) {
			return !!str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
		},
		isUrl: function (str) {
			//A modified version of the validator from @diegoperini / https://gist.github.com/729294
			return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
		},

		isYoutubeVideo: function (url) {
			return this.getYoutubeVideoID(url) ? true : false;
		},

		getYoutubeVideoID: function (url) {
			var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
			return (url.match(p)) ? RegExp.$1 : false;
		},

		isNumeric: function (str) {
			return !!str.match(/^[0-9]+$/);
		},

		notNull: function (str) {
			return str !== '';
		},

		notEmpty: function (str) {
			return !str.match(/^[\s\t\r\n]*$/);
		},

		lenInferiorTo: function (str, maxLen) {
			return str.length < maxLen;
		},

		lenEqualTo: function (str, maxLen) {
			return str.length === maxLen;
		},

		lenSuperiorTo: function (str, maxLen) {
			return str.length > maxLen;
		},

		minDate: function (date, minDate) {
			return date >= new Date(minDate);
		},

		maxDate: function (date, maxDate) {
			return date <= new Date(maxDate);
		},

		isBelgianVat: function (str) {
			return !!str.match(/^BE0[0-9]{3}\.[0-9]{3}\.[0-9]{3}$/i);
		},

		isPhoneNumber: function (str) {
			return !!str.match(/^[0-9\s\+]+$/);
		}
	};
});