define([], function () {

	return {

		loggedIn: false,

		rememberMe: false,

		getStore: function () {
			return this.rememberMe ? localStorage : sessionStorage;
		},

		get: function (key) {
			return this.getStore().getItem(key);
		},

		set: function (key, value) {
			return this.getStore().setItem(key, value);
		},

		setObject: function (obj) {
			var keys = Object.keys(obj);
			var len = keys.length;
			var i;
			while(i--) {
				i = keys[len];
				this.set(i, obj[i]);
			}
		},

		clear: function () {
			return this.getStore().clear();
		}

	};

});