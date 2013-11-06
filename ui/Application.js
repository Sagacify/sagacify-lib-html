define([
	'backbone.marionette',
	'../model/Model',
	'../model/Collection'
], function (Marionette, SagaModel, SagaCollection) {
	
	return Marionette.Application.extend({

		constructor: function(options){
			var me = this;
			Marionette.Application.prototype.constructor.apply(this, arguments);
			if(options && options.models){
				this.fetchModels().done(function(data){
					me.merge(data);
					me.triggerMethod('models:fetched');
				});
			}
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
				for(var schemaName in structure){
					var collectionName = structure[schemaName].collection.name;
					var Model = App.models[key+'Model'] = SagaModel.extend({
						urlRoot:'/api/'+collectionName+'/',
						schema: structure[schemaName].doc,
						idAttribute: '_id',
					});
					var Collection = App.collections[key + 'Collection'] = SagaCollection.extend({
						model: Model,
						url: '/api/'+collectionName,
						schema: structure[schemaName].collection
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