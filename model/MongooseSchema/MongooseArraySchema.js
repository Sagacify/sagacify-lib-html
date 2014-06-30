define([
	'./MongooseElement',
], function (MongooseElement) {

	return  MongooseElement.extend({
		initialize: function(content){
			this._rawContentSchema = content;
			this.contentSchema = app.SchemaFactory(content);
			MongooseElement.prototype.initialize.apply(this, arguments);
		}, 

		getContent: function(){
			return this.contentSchema;
		},

		primitifContent: function(){
			return this.getContent() instanceof app.MongoosePrimitiveSchema;
		},

		cannotGenerateCollection: function(){
			return this.primitifContent() && !this.getContent().isModelReference() 
		},

		getCollectionClass: function(){
			if (this.cannotGenerateCollection()) {
				return null;
			};

			return this.defaultCollectionClass().extend({
				mongooseSchema: this,

				//deprecatel
				model: this.getModelClass(),
				schema: this._rawContentSchema.collection
			});
		}, 

		getModelClass: function(){
			return this.contentSchema.getModelClass();
		}

	});
});
