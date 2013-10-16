define(['./models/Model', './models/Collection','./prototypes/prototypes'], function(SagaModel, SagaCollection){
	return {
		fetchModels: function(){
			var deferred = $.Deferred();
			$.get('/api/app_models', function(structure){
				var App = {};
				App.models = {};
				App.collections = {};
				console.log(structure)
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
				// App.users.views.fetch().done(function (data) {
				// 	debugger
				// });
				// App.users.get('new').save().done(function (data) {
				// 	debugger
				// });
			});
			return deferred.promise();
		}
	};
});