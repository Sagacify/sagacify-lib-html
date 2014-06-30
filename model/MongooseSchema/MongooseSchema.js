define([
	'./MongooseElement',
	'../../types/validateType'
], function (
	MongooseElement,
	is
) {

	return MongooseElement.extend({
		
		getRawSubSchema: function(attribute){
			return this.getDocument().tree[attribute] || this.getDocument().virtuals[attribute];
		},

		rootUrl: function(){
			return '/api/'+this.getCollection().name;
		},

		initialize: function(schema){
			MongooseElement.prototype.initialize.apply(this, arguments);
			this._schema = schema;
			this.generateSubSchema();
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
			this.getAttributes()[attribute] = app.SchemaFactory(jsonSchema);
			this[attribute] = this.getAttributes()[attribute];
			return this[attribute]
		},

		loadClasses: function() {
			this.getModelClass();
			this.getCollectionClass();
		},

		setParentSchema: function(parentSchema){
			this._parentSchema = parentSchema;
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
				this._modelClass = this.defaultModelClass().extend({
					mongooseSchema: this,

					//Deprecated
					urlRoot:this.rootUrl()+"/",
					collectionName:this.getCollection().name,
					schemaName:this.getModelName(),
					schema: this.getDocument(),
					// idAttribute: "_id"		
				});
			};
			return this._modelClass; 
		},

		// defaultModelClass: function(){
		// 	if (this._parentSchema) {
		// 		return this._parentSchema.getModelClass();
		// 	};
		// 	return  DefaultModel
		// },

		// defaultCollectionClass: function(){
		// 	if (this._parentSchema) {
		// 		return this._parentSchema.getCollectionClass();
		// 	};
		// 	return  DefaultCollection
		// },

		getCollectionClass: function(){
			if(!this._collectionClass){
				this._collectionClass = this.defaultCollectionClass().extend({
					mongooseSchema: this,

					//Deprecated
					model: this.getModelClass(),
					url: this.rootUrl(),
					schema: this.getCollection()
				});				
			}
			return this._collectionClass;
		},
	});
});
