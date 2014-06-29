define([
	'backbone.marionette',
	'../prototypes/backbone/backbone',
	'../model/Model/Model',
	'../model/Collection',
	'jquery',
], function (Marionette, backbone, SagaModel, SagaCollection) {
	
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
				App.server_routes = structure.routes;

				console.log('Models structure : ');
				console.log(structure);

				App.models = {};
				App.collections = {};

				var schemas = structure.schemas;
				
				me.loadSchemas(schemas)

				deferred.resolve(App);
				
			}).fail(function(err){
				debugger
			});;

			return deferred.promise();
		},

		loadSchemas: function(schemas){
			for(var schemaName in schemas){
				this.loadSchema(schemas[schemaName])
			}
		},

		loadSchema: function(schema){
			this.generateModel(schema);
			this.generateCollection(schema);
		},

		generateModel: function(schema){
			App.models[schema.doc.modelName+'Model'] = (this.modelClassForSchema(schema)).extend({
				urlRoot:'/api/'+schema.collection.name+'/',
				collectionName:schema.collection.name,
				schemaName:schema.doc.modelName,
				schema: schema.doc,
				idAttribute: "_id"
			});
		},	

		modelClassForSchema: function(schema){
			return SagaModel;
		},	

		generateCollection: function(schema){
			var Collection = App.collections[schema.doc.modelName+'Collection'] = SagaCollection.extend({
				model: App.models[schema.doc.modelName+'Model'],
				url: '/api/'+schema.collection.name,
				schema: schema.collection
			});
			App[schema.collection.name] = new Collection();
		},	

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