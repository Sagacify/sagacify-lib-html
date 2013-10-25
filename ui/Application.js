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
					me.triggerMethod("models:fetched");
				});
			}
		},

		fetchModels: function(){
			var deferred = $.Deferred();
			$.get('/api/app_models', function(structure){
				var App = {};
				App.models = {};
				App.collections = {};
				console.log("Models structure : ");
				console.log(structure);
				for(var key in structure.schemas){
					var collectionName = structure.schemas[key].collection.name;
					var Model = App.models[key+'Model'] = SagaModel.extend({
						urlRoot:'/api/'+collectionName+'/',
						schema: structure.schemas[key].doc,
						idAttribute: "_id",
					});
					var Collection = App.collections[key+'Collection'] = SagaCollection.extend({
						model: Model,
						url: '/api/'+collectionName,
						schema: structure.schemas[key].collection
					});
					App[collectionName] = new Collection();
				}
				deferred.resolve(App); 
			});
			return deferred.promise();
		}
	});

});