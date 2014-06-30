define([
	'./MongooseElement',
	'../Model/v2/Model',
	'../Collection/Collection'
], function (MongooseElement, DefaultModel, DefaultCollection) {

	return MongooseElement.extend({
		initialize: function(schema){
			_.extend(this, schema);
			MongooseElement.prototype.initialize.apply(this, arguments);
		}, 

		isModelReference: function(){
			return !!this.ref;
		}, 

		getModelClass: function(){
			return app.models[this.ref+'Model'];
		},

		getCollectionClass: function(){

		},

	});

});
