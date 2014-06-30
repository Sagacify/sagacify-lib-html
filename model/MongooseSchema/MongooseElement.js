define([
	'backbone',
	'../../types/validateType',
	'../Model/Model',
	'../Collection/Collection',
], function (
	Backbone, 
	is, 
	DefaultModel, 
	DefaultCollection 
) {

	return Backbone.Model.extend({

		initialize: function(schema){
			this._schema = schema;
			Backbone.Model.prototype.initialize.apply(this, arguments);
		}, 


		getModelClass: function(){
		},


		getCollectionClass: function(){
		},

		defaultModelClass: function(){
			if (this._parentSchema) {
				return this._parentSchema.getModelClass();
			};
			return  DefaultModel
		},

		defaultCollectionClass: function(){
			if (this._parentSchema) {
				return this._parentSchema.getCollectionClass();
			};
			return  DefaultCollection
		},


	});
});
