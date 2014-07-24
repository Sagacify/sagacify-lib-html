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

		// _isLoading: false,

		// _sort: {
		// 	//field: asc|desc
		// },

		// _filters: {

		// },

		// parent: {
		// 	instance: null,
		// 	path: null
		// },

		constructor: function (models, options) {
			// this._paginate = {
			// 	currentPage: 0,
			// 	perPage: 0,
			// 	maxPages: 0,
			// 	_maxPagesReached: false
			// }

			if (models && !(models instanceof Array)) {
				options = models;
			}
			// if (options) {
			// 	if (options.url) {
			// 		this.url = options.url;
					
			// 	}
			// 	if (options.parent) {
			// 		this.parent = options.parent;
			// 	}
			// }


			this._virtuals = {};
			this.defineSchemaProperties();
			Collection.prototype.constructor.apply(this, arguments);
			// this.updateUrl()
			// this._handleCustomEvents();
			
		},
		
		// updateUrl: function(){
		// 	if (this.parent.instance) {
		// 		if (!this.parent.instance.id) {
		// 			var me = this;
		// 			this.listenTo(this.parent.instance, 'change:'+this.parent.instance.idAttribute, function(parentModel, parentIdentifier){
		// 				var regeneratedUrl = parentModel.getUrlFor(me);
		// 				me.url = regeneratedUrl||me.url;
		// 				me.stopListening(this.parent.instance, 'change:'+this.parent.instance.idAttribute);
		// 			})
		// 		};
		// 	};
		// },

		// _handleCustomEvents: function () {
		// 	this.on('add', function () {
		// 		var added = arguments[0];
		// 		var me = this;
		// 		this.listenTo(added, 'sync:destroy', function (res) {
		// 			me.trigger('sync:remove');
		// 		});
		// 	});
		// },

		get: function (id, options) {
			if (id instanceof this.model) {
				return Collection.prototype.get.apply(this, arguments);
			}
			var url = this.url instanceof Function ? this.url() : this.url;
			if (this.schema && this.schema.virtuals[id]) {
				if (!this._virtuals[id]) {
					if (this.schema.virtuals[id] instanceof Array) {
						var model = App.models[this.schema.virtuals[id][0].ref + "Model"].extend({
							urlRoot: url + '/' + id
						});
						this._virtuals[id] = new App.collections[this.schema.virtuals[id][0].ref + "Collection"]([], {
							url: url + '/' + id,
							model: model,
							parent: {
								instance: this,
								path: ""
							}
						});
					} else {
						this._virtuals[id] = new App.models[this.schema.virtuals[id].ref + "Model"]({}, {
							url: url + '/' + id,
							parent: {
								instance: this,
								path: ""
							}
						});
					}
				}
				return this._virtuals[id];
			} else if (id == "new") {
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
			} else {
				var doc = Collection.prototype.get.apply(this, arguments);
				if (!doc && arguments.callee.caller != Collection.prototype.set) {
					this.add(new this.model({
						_id: id
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
			}
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

		// set: function (models, options) {
		// 	//ids array
		// 	if (is.Array(models) && models.length && !is.Object(models[0])) {
		// 		wrappedModels = [];
		// 		models.forEach(function (model) {
		// 			wrappedModels.push({
		// 				_id: model
		// 			});
		// 		});
		// 		models = wrappedModels;
		// 		return this.set(models, options);
		// 	}

		// 	return Collection.prototype.set.apply(this, arguments);
		// },

		add: function (model, options) {
			// _isId -> will be deprecated
			var _isId = false;



			var ret = Collection.prototype.add.apply(this, arguments);
			
			// //Try add simple _id
			// if (is.String(model)) {
			// 	_isId = true;
			// 	this.add({_id:model});
			// }
			// var ret = Collection.prototype.add.apply(this, [model, options]);

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