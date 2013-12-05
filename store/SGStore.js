define([], function () {

	return {

		loggedIn: false,

		rememberMe: true, // should be false but true is more convenient in dev.

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
		},

		getBearer: function () {
			var id;
			var token;
			if(id = this.get('id')) && (token = this.get('token')) {
				return 'bearer ' + id + '|' + token;
			}
			return null;
		}

	};

});