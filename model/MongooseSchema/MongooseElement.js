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

		setSuperSchema: function(superSchema){
			this._superSchema = superSchema;
		},

		getModelClass: function(){},

		getCollectionClass: function(){},

		defaultModelClass: function(){
			if (this._superSchema) {
				return this._superSchema.getModelClass();
			};
			return  DefaultModel
		},

		defaultCollectionClass: function(){
			if (this._superSchema) {
				return this._superSchema.getCollectionClass();
			};
			return  DefaultCollection
		},

		generateSubSchema: function(){
			
		}

	});
});
