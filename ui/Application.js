define([
	'backbone.marionette',
	'../prototypes/backbone/backbone',
	'../model/MongooseSchema/MongooseSchema',
	'jquery',
], function (Marionette, backbone, MongooseSchema) {
	
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

			this.configureScrollEvent();

			Object.defineProperties(this, {user: {get:this.getUser, set:this.setUser}});
		},

		configureScrollEvent: function(){
			var me = this;
			$(window).scroll(function (evt){
				if(me.isBottomReached()) {
					me.trigger("bottomReached");
				}
			});
		},

		fetchModels: function (){
			var deferred = $.Deferred();
			var me = this;

			$.get('/api/app_models', function (structure){
				App.server_routes = structure.routes;

				// console.log('Models structure : ');
				// console.log(structure);

				App.models = {};
				App.collections = {};

				var schemas = structure.schemas;
				me.prepareSchemaClasses(schemas);
				me.loadSchemaClasses();

				deferred.resolve(App);
				
			}).fail(function(err){
				debugger
			});;

			return deferred.promise();
		},

		getModelOverrides: function(){
			return {};
		},

		prepareSchemaClasses: function(schemas){
			app.MongooseSchemas = {};
			app.rawSchemas = schemas;
			for(var ModelName in schemas){
				app.MongooseSchemas[ModelName] = new MongooseSchema({schema:schemas[ModelName], parent:null, override:this.getModelOverrides()[ModelName]});
			}
			delete app['rawSchemas'];
		},

		loadSchemaClasses: function(){

			//Load meta constructor
			for(var modelName in app.MongooseSchemas){
				app.MongooseSchemas[modelName].generateSubSchema();
				var currentSchema = app.MongooseSchemas[modelName];
				currentSchema.loadClasses();
				App.collections[modelName+'Collection'] =  currentSchema.getCollectionClass()
			}		

			// set root collections
			//Load root collection (for )
			for(var modelName in app.MongooseSchemas){
				var currentSchema = app.MongooseSchemas[modelName];
				App[currentSchema.getCollectionName()] = new (currentSchema.getCollectionClass())();
				//For compatibility
				App.models[modelName+'Model'] =  currentSchema.getModelClass()
				App.models[modelName+'Model'].prototype.urlRoot = "/api/"+currentSchema.getCollectionName();

			}

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
		},

		getUser: function(){
			if(!this._user){
				this._user = new (app.MongooseSchemas.User.getModelClass())({}, {url:"/api/user"});
			}
			return this._user;
		},

		setUser: function(user){
			this._user = user;
		}
		
	});

});