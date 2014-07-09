define([
	'./MongooseElement',
	'../Model/Model',
	'../Collection/Collection'
], function (MongooseElement, DefaultModel, DefaultCollection) {

	return MongooseElement.extend({
		initialize: function(options){
			_.extend(this, options.schema);
			MongooseElement.prototype.initialize.apply(this, arguments);
		}, 

		isModelReference: function(){
			return !!this.ref;
		}, 

		freeType : function(){
			return !this.isModelReference() && !this.type;
		},

		getModelClass: function(){
			return app.MongooseSchemas[this.ref].getModelClass()
			// debugger
			// return app.models[this.ref+'Model'];
		},

		getCollectionClass: function(){

		},

	});

});
