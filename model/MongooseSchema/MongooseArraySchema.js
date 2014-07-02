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

		contentIsPrimitiveArray: function(){
			return this.cannotGenerateCollection();
		},

		cannotGenerateCollection: function(){
			return this.primitifContent() && !this.getContent().isModelReference() 
		},

		setSuperSchema: function(superSchema){
			this.getContent().setSuperSchema(superSchema.getContent());
			MongooseElement.prototype.setSuperSchema.apply(this, arguments);
		},

		getCollectionClass: function(){
			if (this.cannotGenerateCollection()) {
				return null;
			};

			if (!this._generatedDefaultCollection) {
				this._generatedDefaultCollection = this.defaultCollectionClass().extend(
				{
					mongooseSchema: this,

					//deprecatel
					model: this.getModelClass(),
					schema: this._rawContentSchema.collection
				});
			};

			return this._generatedDefaultCollection;
		}, 

		generateSubSchema: function(){
			if (this.getContent() instanceof app.MongooseSchema) {
				this.getContent().generateSubSchema()
			};
		},


		getModelClass: function(){
			return this.contentSchema.getModelClass();
		}

	});
});
