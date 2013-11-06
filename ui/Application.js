define([
	'backbone.marionette',
	'../model/Model',
	'../model/Collection'
], function (Marionette, SagaModel, SagaCollection) {
	
	return Marionette.Application.extend({

		constructor: function(options){
			Marionette.Application.prototype.constructor.apply(this, arguments);
			if(options && options.models){
				var me = this;
				this.fetchModels().done(function(data){
					me.merge(data);
					me.triggerMethod('models:fetched');
				});
			}
			var me = this;
			$(window).scroll(function(evt){
				if(me.isBottomReached()){
					me.trigger("bottomReached");
				}
			});
		},

		fetchModels: function(){
			var deferred = $.Deferred();
			$.get('/api/app_models', function(structure){
				var App = {};
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
						idAttribute: "_id",
					});
					var Collection = App.collections[schemaName + 'Collection'] = SagaCollection.extend({
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

		isBottomReached: function(){
			return document.body.scrollTop == (document.body.scrollHeight-window.innerHeight);
		}
	});

});