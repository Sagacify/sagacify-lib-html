define([], function () {

	return {
		rememberMe: null,
		configNamespace: '__CONF__',
		sessionNamespace: '__AUTH__',
		getStore: function (secure) {
			return secure ? sessionStorage : localStorage;
		},
		get: function (key, secure) {
			var store = this.getStore(secure);
			return JSON.parse(store.getItem(key));
		},
		set: function (key, value, secure) {
			var store = this.getStore(secure);
			return JSON.stringify(store.setItem(key, value));
		},
		length: function (secure) {
			return this.getStore(secure).length;
		},
		remove: function (key, secure) {
			var store = this.getStore(secure);
			return store.removeItem(key);
		},
		key: function (n, secure) {
			var store = this.getStore(secure);
			return store.key(n);
		},
		clear: function (secure) {
			var store = this.getStore(secure);
			return store.clear();
		},
		setObject: function (obj, secure) {
			var keys = Object.keys(obj);
			var key;
			var i = keys.length;
			while(i--) {
				key = keys[i];
				this.set(key, obj[key], secure);
			}
		},
		setSession: function (object) {
			this.setObject(object, true);
		},
		getBearer: function () {
			return 'bearer ' + this.get('userID', true) + '|' + this.get('access_token', true);
		},
		isRemembered: function (secure) {
			return this.get(this.configNamespace + 'rememberMe', secure);
		},
		shouldRemember: function (value, secure) {
			this.set(this.configNamespace + 'rememberMe', value, secure);
		},
		onDisconnect: function () {
			if(this.rememberMe) {
				var i = this.length(true);
				var key;
				var value;
				while(i--) {
					key = this.key(i, true);
					value = this.get(key, true);
					this.set(this.sessionNamespace + key, value);
				}
				this.shouldRemember(this.rememberMe);
			}
			else {
				this.clear();
			}
			this.clear(true);
		},
		onConnect: function () {
			if(this.isRemembered()) {
				var i = this.length();
				var key;
				var value;
				var namespace;
				while(i--) {
					key = this.key(i);
					value = this.get(key);
					namespace = key.substr(0, 8);
					if(namespace === this.sessionNamespace) {
						this.set(key.substr(8, key.length), value, true);
						
					}
					else if(namespace === this.configNamespace) {
						this.rememberMe = value;
					}
					this.remove(key);
				}
			}
		},
		constructor: function (options) {
			var me = this;
			window.onbeforeunload = function () {
				me.onDisconnect();
			};
		}
	};

});