define([
	'../ajax/SGAjax'
], function (SGAjax) {

	'use strict';

	return {

		validateToken: function(email, password, token, callback) {
			var me = this;
			SGAjax.ajax({
				url: '/auth/validation',
				type: 'POST',
				data: {
					email: email,
					password: password,
					token: token
				}
			})
			.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('firstname', results.user.firstname);
					App.store.set('lastname', results.user.lastname);
					App.store.set('id', results.user.email);
					App.store.set('isAPro', results.user.isAPro);
					App.store.set('title', results.user.title);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
					callback(null);
				}
			})
			.fail(function (error) {
				App.store.clear();
				App.memory.free();
				callback(error);
			});
		},

		login: function (email, password, callback) {
			var me = this;
			App.store.clear();
			App.memory.free();
			App.user = null;
			App.layout.isLoggedOut();

			SGAjax.ajax({
				url: '/auth/login',
				type: 'POST',
				data: {
					email: email,
					password: password
				}
			})
			.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('firstname', results.user.firstname);
					App.store.set('lastname', results.user.lastname);
					App.store.set('id', results.user.email);
					App.store.set('isAPro', results.user.isAPro);
					App.store.set('title', results.user.title);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
					callback(null);
				}
				else {
					callback(results.error);
				}
			})
			.fail(function (error) {
				App.store.clear();
				App.memory.free();
				callback(error);
			});
		},

		forgotPassword: function (email, callback) {
			var me = this;
			SGAjax.ajax({
				url: '/auth/forgot_password',
				type: 'POST',
				data: {
					email: email
				}
			})
			.done(function (results) {
				callback(null);
			})
			.fail(function (error) {
				callback(error);
			});
		},

		changePassword: function (current_password, new_password, callback) {
			var me = this;
			SGAjax.ajax({
				url: '/auth/change_password',
				type: 'POST',
				data: {
					password: current_password,
					new_password: new_password
				},
				auth: true
			})
			.always(function () {
				App.layout.modalRegion.close();
			})
			.done(function (results) {
				if('token' in results) {
					App.store.set('token', results.token);
					callback(null);
				}
				else {
					callback(results.error);
				}
			})
			.fail(function (error) {
				callback(error);
			});
		},

		logout: function () {
			var me = this;
			SGAjax.ajax({
				url: '/auth/logout',
				type: 'POST',
				data: {},
				auth: true
			})
			.always(function (results) {
				App.store.clear();
				App.memory.free();
				App.user = null;
				App.layout.isLoggedOut();
				App.router.navigate('/');
			});
		},

		resetPassword: function (email, password, token, callback) {
			var me = this;
			SGAjax.ajax({
				url: '/auth/user/reset_password',
				type: 'POST',
				data: {
					email: email,
					password: password,
					token: token
				}
			})
			.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					App.store.set('token', results.token);
					App.store.set('firstname', results.user.firstname);
					App.store.set('lastname', results.user.lastname);
					App.store.set('id', results.user.email);
					App.store.set('title', results.user.title);
					App.user = new App.models.UserModel(results.user, {url:'/api/user'});
					callback(null);
				}
				else {
					callback(results.error);
				}
			})
			.fail(function (error) {
				callback(error);
			});
		}

	};

});