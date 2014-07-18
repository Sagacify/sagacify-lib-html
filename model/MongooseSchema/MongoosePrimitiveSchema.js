define([
	'./MongooseElement',
	'../Model/Model',
	'../Collection/Collection'
], function (MongooseElement, DefaultModel, DefaultCollection) {

	return MongooseElement.extend({
		initialize: function(options){
			_.extend(this, options.schema);
			// this._schema = options.schema;
			MongooseElement.prototype.initialize.apply(this, arguments);
		}, 

		isModelReference: function(){
			return !!this.ref;
		}, 

		freeType : function(){
			return !this.isModelReference() && !this.type;
		},

		getModelClass: function(){
			if (!this._modelClass) {
				this._override.model.instance()

				var defaultClass = this.defaultModelClass();
				var instanceOverride = this._override.model.instance(defaultClass);
				var clazzOverride = this._override.model.clazz(defaultClass);
				this._modelClass = defaultClass.extend(instanceOverride, clazzOverride);
			};
			return this._modelClass
		},

		defaultModelClass: function(){
			if (this._superSchema) {
				return this._superSchema.getModelClass();
			};

			return app.MongooseSchemas[this.ref].getModelClass()
		},	

		getCollectionClass: function(){

		},

	});

});
