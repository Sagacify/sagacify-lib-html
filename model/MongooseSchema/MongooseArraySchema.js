define([
	'./MongooseElement',
], function (MongooseElement) {

	return  MongooseElement.extend({
		initialize: function(options){
			MongooseElement.prototype.initialize.apply(this, arguments);
			this._rawContentSchema = options.content;
			this.contentSchema = app.SchemaFactory(options.content, this, 'content', this._override);
			this.contentSchema.isEmbedded = true;
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
			// if (this.getExtendsPath() == "EventResource.relatedResources") {
			// 	debugger
			// };

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

				var defaultClass = this.defaultCollectionClass();
				var classOverride = this._override.collection.clazz(defaultClass);
				var instanceOverride = this._override.collection.instance(defaultClass);

				var options = _.extend({
					mongooseSchema: this,
					model: this.getModelClass(),
					schema: this._rawContentSchema.collection
				}, instanceOverride);					
				this._generatedDefaultCollection = defaultClass.extend(options, classOverride);
			};

			return this._generatedDefaultCollection;
		}, 

		generateSubSchema: function(){
			if (this.getContent() instanceof app.MongooseSchema) {
				this.getContent().generateSubSchema()
			};
		},

		getModelClass: function(){
			return this.getContent().getModelClass();
		}

	});
});
