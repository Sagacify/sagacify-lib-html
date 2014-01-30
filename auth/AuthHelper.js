define([
	'../ajax/SGAjax'
], function (SGAjax) {

	'use strict';

	return {

		register: function(args) {
			var me = this;
			return SGAjax.ajax({
				url: '/auth/user/register',
				type: 'POST',
				data: args
			});
		},

		validateToken: function(username, password, token) {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/validation',
				type: 'POST',
				data: {
					username: username,
					password: password,
					token: token
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('id', results.user.username);
					App.user = new App.models.UserModel(results.user, {
						url:'/api/user'
					});
					App.layout.isLoggedIn();
				}
			})
			.fail(function (error) {
				App.store.logout();
				App.memory.free();
			});

			return deferred;
		},

		login: function (username, password) {
			var me = this;
			App.store.clear();
			App.memory.free();

			var deferred = SGAjax.ajax({
				url: '/auth/login',
				type: 'POST',
				data: {
					username: username,
					password: password
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('id', results.user.username);
					App.user = new App.models.UserModel(results.user, {
						url:'/api/user'
					});
					App.layout.isLoggedIn();
				}
			})
			.fail(function (error) {
				// App.store.logout();
				App.memory.free();
			});

			return deferred;
		},

		forgotPassword: function (username, lang) {
			var me = this;
			return SGAjax.ajax({
				url: '/auth/forgot_password',
				type: 'POST',
				data: {
					username: username,
					lang: lang
				}
			});
		},

		changePassword: function (current_password, new_password) {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/change_password',
				type: 'POST',
				data: {
					password: current_password,
					new_password: new_password
				},
				auth: true
			});

			deferred.done(function (results) {
				if('token' in results) {
					App.store.set('token', results.token);
				}
			});

			return deferred;
		},

		logout: function () {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/logout',
				type: 'POST',
				data: {},
				auth: true
			})
			.always(function (results) {
				App.store.clear();
				App.memory.free();
				App.user.clear();
				App.layout.isLoggedOut();
			});

			return deferred;
		},

		resetPassword: function (username, password, token) {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/user/reset_password',
				type: 'POST',
				data: {
					username: username,
					password: password,
					token: token
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('id', results.user.username);
					App.user = new App.models.UserModel(results.user, {
						url:'/api/user'
					});
					App.layout.isLoggedIn(); // not sure it should be called ?!
				}
			});

			return deferred;
		}

	};

});