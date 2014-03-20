define([], function () {

	return {

		maxIdleTime: 20,

		getStore: function () {
			//return this.rememberMe ? localStorage : sessionStorage;
			return localStorage;
		},

		get: function (key) {
			return this.getStore().getItem(key);
		},

		set: function (key, value) {
			return this.getStore().setItem(key, value);
		},

		unset: function (key) {
			return this.getStore().removeItem(key);
		},

		clear: function () {
			this.getStore().clear();
		},

		getBearer: function () {
			var id;
			var token;
			if((id = this.get('id')) && (token = this.get('token'))) {
				return 'bearer ' + id + '|' + token;
			}
			return null;
		},

		logout: function () {
			var rememberMe = App.store.get('rememberMe');
			if(!((rememberMe === 'true') || (rememberMe === true))) {
				App.layout.logout();
			}
		},

		changeRememberMe: function (rememberMe) {
			if((rememberMe === 'true') || (rememberMe === true)) {
				this.setRememberMe();
			}
			else {
				this.unsetRememberMe();
			}
		},

		unsetRememberMe: function () {
			var me = this;
			App.ActivityController && App.ActivityController.on('inactivity:' + this.maxIdleTime, function () {
				if(me.getBearer()) {
					me.logout();
				}
			});
			this.set('rememberMe', false);
		},

		setRememberMe: function () {
			App.ActivityController && App.ActivityController.off('inactivity:' + this.maxIdleTime);
			this.set('rememberMe', true);
		},

		init: function (initialRememberMe) {
			this.maxIdleTime = App.config.disconnectedAfter;
			this.changeRememberMe(initialRememberMe);
		}

	};

});