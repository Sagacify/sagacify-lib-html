define([
	'../types/validatType'
], function (is) {

	return {

		MongooseDocument: function() {
			return exports.isObject(obj) && ('_id' in obj);
		},

		Object: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Object]';
		},

		Array: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},

		String: function (obj) {
			return Object.prototype.toString.call(obj) === '[object String]';
		},

		Function: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Function]';
		},

		Number: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Number]';
		},

		NotNull: function (obj) {
			return obj != null;
		},

		Null: function (obj) {
			return obj == null;
		}

	}

});