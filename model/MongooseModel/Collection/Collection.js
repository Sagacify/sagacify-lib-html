define([
	'saga/model/SagaModel/Collection/Collection',
	
	'saga/types/validateType',
	'saga/model/ModelError',

	'./mixins/CollectionHelpers',
	'./mixins/CollectionPropertiesDefinitions',
	'./mixins/CollectionSync',
	'./mixins/CollectionValidation',


], function (
	Collection, 
	is,
	ModelError,

	CollectionHelpers,
	CollectionPropertiesDefinitions,
	CollectionSync,
	CollectionValidation

) {
	var MongooseCollection = Collection.extend({


		constructor: function (models, options) {

			if (models && !(models instanceof Array)) {
				options = models;
			}

			console.log("XX");
			this._virtuals = {};
			this.defineSchemaProperties();
			Collection.prototype.constructor.apply(this, arguments);
		},

		__isAVirtual: function(attribute){
			return !!this.mongooseSchemaForVirtual(attribute);
		},

		mongooseSchemaForVirtual: function(attribute){
			if (!this.mongooseSchema || !this.mongooseSchema.collection || !this.mongooseSchema.collection[attribute]) {
				return false
			};
			return this.mongooseSchema.collection && this.mongooseSchema.collection[attribute];	
		},

		getVirtualAttribute: function(virtualAttribute, options){

			var currentValue = this._virtuals[virtualAttribute];

			if (currentValue != undefined) {
				return currentValue;
			};

			var subMongooseSchema = this.mongooseSchemaForVirtual(virtualAttribute);

			if (subMongooseSchema instanceof app.MongooseArraySchema) {
				var Collection = subMongooseSchema.getCollectionClass()
				currentValue = new Collection(null, {
					parent: {
						instance: this,
						path: ""
					},					
					url:this.url+"/"+virtualAttribute
				});
			};

			//other case...
			this.setVirtualAttribute(virtualAttribute, currentValue);

			return this._virtuals[virtualAttribute];
		},

		setVirtualAttribute: function(virtualAttribute, newValue){
			this._virtuals[virtualAttribute] = newValue;
		},



		get: function (id, options) {
			if (id instanceof this.model) {
				return Collection.prototype.get.apply(this, arguments);
			}
			var url = this.url instanceof Function ? this.url() : this.url;

			if (this.__isAVirtual(id)) {
				return this.getVirtualAttribute(id, options);
			};

			if (id == "new") {
				var doc = new this.model({}, {
					urlRoot: url,
					parent: {
						instance: this,
						path: ""
					}
				});

				if(options && options.add){
					this.add(doc);
				}

				return doc;
			}

			return Collection.prototype.get.apply(this, arguments);
			//  else {
			// 	// ??
			// 	var doc = Collection.prototype.get.apply(this, arguments);
			// 	if (!doc && arguments.callee.caller != Collection.prototype.set) {
			// 		this.add(new this.model({
			// 			_id: id
			// 		}, {
			// 			urlRoot: url,
			// 			parent: {
			// 				instance: this,
			// 				path: ""
			// 			}
			// 		}));
			// 		doc = this.last();
			// 	}
			// 	return doc;
			// }
		},

		getBySlug: function (slug) {
			var doc = this.findWhere({
				slug: slug
			});
			var url = this.url instanceof Function ? this.url() : this.url;
			if (!doc) {
				this.add(new this.model({
					slug: slug
				}, {
					urlRoot: url,
					parent: {
						instance: this,
						path: ""
					}
				}));
				doc = this.last();
			}
			return doc;
		},

		add: function (model, options) {
			// _isId -> will be deprecated
			var _isId = false;

			var ret = Collection.prototype.add.apply(this, arguments);
			
			var added = this.last();

			if (added) {
				added.parent = {
					instance: this,
					path: ""
				};
				added._isId = _isId;
			}

			return ret;
		},



	});
	
	_.extend(MongooseCollection.prototype, CollectionHelpers(MongooseCollection));
	_.extend(MongooseCollection.prototype, CollectionPropertiesDefinitions(MongooseCollection));
	_.extend(MongooseCollection.prototype, CollectionSync(MongooseCollection));
	_.extend(MongooseCollection.prototype, CollectionValidation(MongooseCollection));
	

	return MongooseCollection;
});