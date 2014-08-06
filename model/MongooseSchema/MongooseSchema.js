define([
	'./MongooseElement',
	'saga/types/validateType'
], function (
	MongooseElement,
	is
) {

	return MongooseElement.extend({


		initialize: function(options){
			MongooseElement.prototype.initialize.apply(this, arguments);
			this._schema = options.schema;

			this.removeMPathObjects();
		},

		getEmbbeddedObjects: function(){
			var res = [];
			_.each(this.getDocument().tree, function(schema, attribute){
				if (attribute.endsWith("._id") && schema.ref && schema.type) {
					res.push(attribute.replace("._id", ""));
				};
			}, this);
			return res;
		},

		removeMPathObjects: function(){
			var embbededs = this.getEmbbeddedObjects();
			for (var i = 0; i < embbededs.length; i++) {
				this.removeMPathForEmbbeded(embbededs[i])
			};
		},

		removeMPathForEmbbeded: function(attribute){
			var res = this.mPathFor(attribute);
			var pathToRemove = _.keys(res);
			
			var tree = {};
			_.each(res, function(treeSchema, subAttribute){
				subAttribute = subAttribute.replace(attribute+".", "");
				tree[subAttribute] = treeSchema;
			}, this);
			
			this.getDocument().tree[attribute] = {
				collection:{action:{}, name:app.rawSchemas[tree._id.ref].collection.name, virtuals:{}},
				doc:{
					tree:tree,
					modelName:tree._id.ref, 
					virtuals:{},
					actions:{}
				}
			}

			return res;
		},

		mPathFor: function(embeddedAttr){
			var res = {};
			_.each(this.getDocument().tree, function(schema, attribute){
				if (attribute.startsWith(embeddedAttr)) {
					res[attribute] = schema
				};
			}, this);
			return res;
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

		getAttributes: function(){
			if (!this._allAttributes) {
				this._allAttributes = {};
			};
			return this._allAttributes;
		},

		getActions: function(){
			return this.getDocument().actions
		},

		generateSubSchema: function(){
			this.generateDocumentSubSchemas();
			this.generateCollectionSubSchemas();
		},

		generateDocumentSubSchemas: function(){
			for(var attribute in this.getDocument().tree){
				this[attribute] = this.getAttributes()[attribute] = this.generateSubSchemaForAttribute(attribute, this.getDocument().tree[attribute]);
			}
			for(var attribute in this.getDocument().virtuals){
				this[attribute] = this.getAttributes()[attribute] = this.generateSubSchemaForAttribute(attribute, this.getDocument().virtuals[attribute]);
			}
		},

		generateCollectionSubSchemas: function(){
			this.collection = {};
			for(var attribute in this.getCollection().virtuals){

				this.collection[attribute] = this.generateSubSchemaForAttribute(attribute, this.getCollection().virtuals[attribute]);
			}
		},

		generateSubSchemaForAttribute: function(attribute, jsonSchema){
		

			// if (attribute == "stream") {
			// 	if (this.getExtendsPath()== 'Resource') {
			// 		debugger
			// 	};

			// 	this.showPath();

			// };

			var subSchema = app.SchemaFactory(jsonSchema, this, attribute, this._override.model.attrs[attribute]||this._override.collection.attrs[attribute]);

			if (subSchema instanceof app.MongooseSchema) {
				subSchema.isEmbedded = true;
			};

			if (this._superSchema && (attribute in this._superSchema)) {
				subSchema.setSuperSchema(this._superSchema[attribute])
				// this.getAttributes()[attribute].setSuperSchema(this._superSchema[attribute])
			};

			// var subSchema = this.getAttributes()[attribute];
			subSchema.generateSubSchema();
			return subSchema;
			// this[attribute] = this.getAttributes()[attribute];
			// this[attribute].generateSubSchema();
			// return this[attribute]
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

				// if (!_.keys(clazzOverride).length && !_.keys(instanceOverride).length) {
				// 	this._modelClass = defaultClass;
				// } else {
					var options = _.extend({
							mongooseSchema: this,

							//Deprecated
							collectionName:this.getCollection().name,
							schemaName:this.getModelName(),
							schema: this.getDocument(),
						}, instanceOverride
					);
					this._modelClass = defaultClass.extend(options, clazzOverride);
				// }
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

				// if (!_.keys(clazzOverride).length && !_.keys(instanceOverride).length) {
				// 	this._collectionClass = defaultClass;
				// } else {
					var options = _.extend({
							mongooseSchema: this,

							//Deprecated
							model: this.getModelClass(),
							url: this.rootUrl(),
							schema: this.getCollection()
						}, instanceOverride
					);
					this._collectionClass = defaultClass.extend(options, clazzOverride)					
				// }

			}
			return this._collectionClass;
		},
	});
});
