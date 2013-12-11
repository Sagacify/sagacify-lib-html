define([], function (is) {

	return {

		Object: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Object]';
		},

		Array: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},

		String: function (obj) {
			return Object.prototype.toString.call(obj) === '[object String]';
		},

		DateString: function (obj) {
			return this.String(obj) && obj.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z$/);
		},

		Function: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Function]';
		},

		Date: function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Date]') && !isNaN(obj.getTime());
		},

		Number: function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Number]') && !isNaN(obj);
		},

		NotNull: function (obj) {
			return obj != null;
		},

		Null: function (obj) {
			return obj == null;
		}

	};

});