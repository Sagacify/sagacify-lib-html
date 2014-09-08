define([
	'saga/validation/ValidateFormat',
	'saga/model/MongooseModel/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {

	return function (SagaModel) {

		return {

			__generateModelFor: function (attribute, options) {
				var mSchema = this.mongooseSchema[attribute];
				var Model = mSchema.getModelClass();
				return new Model({}, {
					url: this._generateUrl() + '/' + attribute,
					parent: {
						instance: this,
						path: attribute
					},
					mongooseSchema: this,
				});
			},

			__generateCollectionFor: function (attribute, options) {

				// if (attribute == "comments") {
				// 	debugger
				// };

				var mSchema = this.mongooseSchema[attribute];

				var Collection = mSchema.getCollectionClass();
				if (!Collection) {this
					//Primitive array?
					return [];
				}

				var collectionUrl = this._generateUrl() + '/' + attribute;
				var collection = new Collection([], {
					parent: {
						instance: this,
						path: attribute
					},
					url: collectionUrl
				});

				return collection;
			},

			_isARelationship: function (attribute) {
				if (attribute === "_id") {
					return false;
				}

				var mSchema = this.mongooseSchema[attribute];
				if (!mSchema) {
					return false;
				}

				if (this._isACollectionAttribute(attribute)) {
					return true;
				}

				if (this._isAModelAttribute(attribute)) {
					return true;
				}

				return false;
			},

			//Pre attribute in this.mongooseSchema
			_isACollectionAttribute: function (attribute) {
				//Represent collection relationship
				return this.mongooseSchema[attribute] instanceof app.MongooseArraySchema && this.mongooseSchema[attribute].getCollectionClass() /*Primitive case*/
			},

			//Pre attribute in this.mongooseSchema
			_isAModelAttribute: function (attribute) {
				if (attribute == '_id') {
					return false;
				}
				if (this._isAPrimitive(attribute) && (this.mongooseSchema[attribute].isModelReference())) {
					return true;
				}
				if (this.mongooseSchema[attribute] instanceof app.MongooseSchema) {
					return true;
				}

				return false;
			},

			//Pre attribute in this.mongooseSchema
			_isADateAttribute: function (attribute) {
				return this._isAPrimitive(attribute) && this.mongooseSchema[attribute].type == "Date";
			},

			_isAPrimitive: function (attribute) {
				return this.mongooseSchema[attribute] instanceof app.MongoosePrimitiveSchema;
			},

			//@pre attribute in this.mongooseSchema
			getMSchemaAttribute: function (attribute, options) {
				var mSchema = this.mongooseSchema[attribute];
				//Try pregenerate it with schema (model or collection)
				var defaultVal = null;

				if (this._isACollectionAttribute(attribute)) {
					defaultVal = this.__generateCollectionFor(attribute, options);
				}

				if (this._isAModelAttribute(attribute)) {
					defaultVal = this.__generateModelFor(attribute, options);
				}

				//Free type
				if ((mSchema instanceof app.MongoosePrimitiveSchema) && mSchema.freeType()) {
					defaultVal = {};
				}

				if (defaultVal) {
					SagaModel.__super__.set.apply(this, [attribute, defaultVal]);
					// Backbone.Model.prototype.set.apply(this, [attribute, defaultVal]);
				}

				return defaultVal;
			},

			get: function (attribute, options) {
				options = _.defaults(options || {}, {
					lazyCreation: true,
				});

				//mPath management
				if (attribute.contains('.')) {

					var firstAttr = attribute.split('.')[0];
					var subModel = this.get(firstAttr, {
						lazyCreation: options.lazyCreation
					});

					if (subModel && subModel instanceof Backbone.Model) {
						var subAttri = attribute.slice(firstAttr.length + 1, attribute.length)
						return subModel.get(subAttri, {
							lazyCreation: options.lazyCreation
						});
					}
				}
				
				var value = SagaModel.__super__.get.apply(this, arguments);

				if (!options.lazyCreation) {
					return value;
				}

				if (value !== undefined) {
					return value;
				}

				//Lazy creation
				var mSchema = this.mongooseSchema[attribute];
				if (mSchema) {
					//try lazy creation with schema
					return this.getMSchemaAttribute(attribute, options);
				}

				return value;
			},

			//Sub set of objects containing only collection
			getAllCollections: function (options) {
				var attrs = this.mongooseSchema.getAttributes();
				var res = {};
				for (attribute in attrs) {
					// if (attrs[attribute] instanceof app.MongooseArraySchema && !attrs[attribute].contentIsPrimitiveArray()) {
					if (this._isACollectionAttribute(attribute)) {
						var value = this.get(attribute, options);
						if (value != undefined) {
							res[attribute] = value;	
						};						
					}
				}
				return res;
			},

			//Sub set of emebeded model objects
			getAllModels: function (options) {
				var res = {}
				var attributes = this.mongooseSchema.getAttributes();
				for(var attr in attributes){
					if (this._isAModelAttribute(attr)) {
						var value = this.get(attr, options);
						if (value != undefined && value instanceof Backbone.Model) {
							res[attr] = value;
						};
					};
				}
				return res;
			}
		};
	}
});