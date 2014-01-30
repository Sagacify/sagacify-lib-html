define([
	'backbone.marionette',
	'../model/Model',
	'../model/Collection'
], function (Marionette, SagaModel, SagaCollection) {
	
	return Marionette.Application.extend({

		constructor: function(options) {
			var me = this;
			Marionette.Application.prototype.constructor.apply(this, arguments);
			if(options && options.models) {
				this.fetchModels().done(function (data){
					me.merge(data);
					me.triggerMethod('models:fetched');
				});
			}

			$(window).scroll(function (evt){
				if(me.isBottomReached()) {
					me.trigger("bottomReached");
				}
			});

			Object.defineProperties(this, {user: {get:this.getUser, set:this.setUser}});
		},

		fetchModels: function (){
			var deferred = $.Deferred();
			var me = this;
			$.get('/api/app_models', function (structure){
				var App = {};
				App.server_routes = structure.routes;
				App.models = {};
				App.collections = {};
				console.log('Models structure : ');
				console.log(structure);
				var schemas = structure.schemas;
				for(var schemaName in schemas){
					var collectionName = schemas[schemaName].collection.name;
					var Model = App.models[schemaName+'Model'] = SagaModel.extend({
						urlRoot:'/api/'+collectionName+'/',
						schema: schemas[schemaName].doc,
						idAttribute: "_id"
					});
					var Collection = App.collections[schemaName+'Collection'] = SagaCollection.extend({
						model: Model,
						url: '/api/'+collectionName,
						schema: schemas[schemaName].collection
					});
					App[collectionName] = new Collection();
				}

				deferred.resolve(App);
			});
			return deferred.promise();
		},

		// modelExtension: function(){
		// 	return {__tIsValid:function(){return false}};
		// },

		// collectionExtension: function(){
		// 	return {};
		// },

		createModel : function(ModelName, rawData) {
			// debugger
			var Model = this.getModelClass(ModelName);
			return new Model(rawData);
		},	

		getModelClass: function(modelName){
			// debugger
			if ((modelName+'Model') in App.models) {
				return App.models[(modelName+'Model')];
			};
			return null;
		},

		isBottomReached: function () {
			// body.scrollTop is deprecated in strict mode. 
			// Please use 'documentElement.scrollTop' if in strict mode and 'body.scrollTop' only if in quirks mode.
			return (document.body.scrollTop || document.documentElement.scrollTop) == (document.body.scrollHeight-window.innerHeight);
			// console.log(document.body.scrollHeight, window.innerHeight, document.documentElement.scrollTop, document.body.scrollTop);
			// return (document.body.scrollHeight - window.innerHeight - 5) < document.documentElement.scrollTop
			// 	|| (document.body.scrollHeight - window.innerHeight + 5) < document.documentElement.scrollTop;
		},

		getUser: function(){
			if(!this._user){
				this._user = new this.models.UserModel({}, {url:"/api/user"});
			}
			return this._user;
		},

		setUser: function(user){
			this._user = user;
		}
		
	});

});