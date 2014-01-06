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

		validateToken: function(email, password, token) {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/validation',
				type: 'POST',
				data: {
					email: email,
					password: password,
					token: token
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('id', results.user.email);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
				}
			})
			.fail(function (error) {
				App.store.clear();
				App.memory.free();
			});

			return deferred;
		},

		login: function (email, password) {
			var me = this;
			App.store.clear();
			App.memory.free();
			App.user = null;

			var deferred = SGAjax.ajax({
				url: '/auth/login',
				type: 'POST',
				data: {
					email: email,
					password: password
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					// App.store.set('firstname', results.user.firstname);
					// App.store.set('lastname', results.user.lastname);
					App.store.set('id', results.user.email);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
				}
			})
			.fail(function (error) {
				App.store.clear();
				App.memory.free();
			});

			return deferred;
		},

		forgotPassword: function (email) {
			var me = this;
			return SGAjax.ajax({
				url: '/auth/forgot_password',
				type: 'POST',
				data: {
					email: email
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
					callback(null);
				}
				else {
					callback(results.error);
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
				App.user = null;
				App.router.navigate('/');
			});

			return deferred;
		},

		resetPassword: function (email, password, token) {
			var me = this;
			var deferred = SGAjax.ajax({
				url: '/auth/user/reset_password',
				type: 'POST',
				data: {
					email: email,
					password: password,
					token: token
				}
			});

			deferred.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('firstname', results.user.firstname);
					App.store.set('lastname', results.user.lastname);
					App.store.set('id', results.user.email);
					App.store.set('title', results.user.title);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
					callback(null);
				}
			});

			return deferred;
		}

	};

});