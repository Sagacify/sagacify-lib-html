define([
	'./MongooseElement',
	'../../types/validateType'
], function (
	MongooseElement,
	is
) {

	return MongooseElement.extend({


		initialize: function(options){
			MongooseElement.prototype.initialize.apply(this, arguments);
			this._schema = options.schema;
		},

		generateCompliantOverride: function(override){
			override = override||{};
			override.model = override.model||{};
			override.model.attributes = override.model.attributes||{};
			MongooseElement.prototype.generateCompliantOverride.apply(this, [override]);
		},

		isAModel: function(){
			return this._id && this._id.ref;
		},

		isAnEmbedded: function(){
			return this.isEmbedded;
		},

		isASemiEmbedded: function(){
			return this.isAnEmbedded() && this.isAModel()
		},
		
		getRawSubSchema: function(attribute){
			return this.getDocument().tree[attribute] || this.getDocument().virtuals[attribute];
		},

		rootUrl: function(){
			return '/api/'+this.getCollection().name;
		},

		generateSubSchema: function(){
			for(var attribute in this.getDocument().tree){
				this.generateSubSchemaForAttribute(attribute, this.getDocument().tree[attribute]);
			}
			for(var attribute in this.getDocument().virtuals){
				this.generateSubSchemaForAttribute(attribute, this.getDocument().virtuals[attribute]);
			}
		},

		getAttributes: function(){
			if (!this._allAttributes) {
				this._allAttributes = {};
			};
			return this._allAttributes;
		},

		getActions: function(){
			return this.getDocument().actions
		},

		generateSubSchemaForAttribute: function(attribute, jsonSchema){
		
			this.getAttributes()[attribute] = app.SchemaFactory(jsonSchema, this, attribute, this._override.model.attrs[attribute]);

			if (this._superSchema && (attribute in this._superSchema)) {
				this.getAttributes()[attribute].setSuperSchema(this._superSchema[attribute])
			};

			this[attribute] = this.getAttributes()[attribute];
			this[attribute].generateSubSchema();
			return this[attribute]
		},

		loadClasses: function() {
			this.getModelClass();
			this.getCollectionClass();
		},

		getModelName: function(){
			return this.getDocument().modelName;
		},

		getCollectionName: function(){
			return this.getCollection().name
		},

		getSchema: function(){
			return this._schema;			
		},	

		getDocument: function(){
			return this._schema.doc;			
		},

		getCollection: function(){
			return this._schema.collection;			
		},

		getModelClass: function(){

			if (!this._modelClass) {

				var defaultClass = this.defaultModelClass();
				var instanceOverride = this._override.model.instance(defaultClass);

				var clazzOverride = this._override.model.clazz(defaultClass);
				var options = _.extend({
						mongooseSchema: this,

						//Deprecated
						collectionName:this.getCollection().name,
						schemaName:this.getModelName(),
						schema: this.getDocument(),
					}, instanceOverride
				);
				this._modelClass = defaultClass.extend(options, clazzOverride);
			};
			return this._modelClass; 
		},

		defaultModelClass: function(){
			if (this.isASemiEmbedded() && !this._superSchema) {
				return app.MongooseSchemas[this._id.ref].getModelClass();
			};
			return MongooseElement.prototype.defaultModelClass.apply(this, arguments);
		},

		getCollectionClass: function(){
			if(!this._collectionClass){

				var defaultClass = this.defaultCollectionClass();
				var instanceOverride = this._override.collection.instance(defaultClass);
				var clazzOverride = this._override.collection.clazz(defaultClass);

				var options = _.extend({
						mongooseSchema: this,

						//Deprecated
						model: this.getModelClass(),
						url: this.rootUrl(),
						schema: this.getCollection()
					}, instanceOverride
				);
				this._collectionClass = defaultClass.extend(options, clazzOverride)
			}
			return this._collectionClass;
		},
	});
});
