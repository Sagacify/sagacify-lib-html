define([
	'backbone',
	'../../types/validateType',
	'../../ajax/SGAjax',
	'../ModelError',

	'./mixins/CollectionHelpers',
	'./mixins/CollectionPagination',
	'./mixins/CollectionPropertiesDefinitions',
	'./mixins/CollectionSync',
	'./mixins/CollectionValidation',


], function (
	Backbone, 
	is, 
	SGAjax,
	ModelError,

	CollectionHelpers,
	CollectionPagination,
	CollectionPropertiesDefinitions,
	CollectionSync,
	CollectionValidation

) {
	var SagaCollection = Backbone.Collection.extend({

		_isLoading: false,

		_sort: {
			//field: asc|desc
		},

		_filters: {

		},

		parent: {
			instance: null,
			path: null
		},

		constructor: function (models, options) {
			this._paginate = {
				currentPage: 0,
				perPage: 0,
				maxPages: 0,
				_maxPagesReached: false
			}

			if (models && !(models instanceof Array)) {
				options = models;
			}
			if (options) {
				if (options.url) {
					this.url = options.url;
					
				}
				if (options.parent) {
					this.parent = options.parent;
				}
			}


			this._virtuals = {};
			this.defineSchemaProperties();
			Backbone.Collection.prototype.constructor.apply(this, arguments);
			this.updateUrl()
			this._handleCustomEvents();
			
		},
		
		updateUrl: function(){
			if (this.parent.instance) {
				if (!this.parent.instance.id) {
					var me = this;
					this.listenTo(this.parent.instance, 'change:'+this.parent.instance.idAttribute, function(parentModel, parentIdentifier){
						var regeneratedUrl = parentModel.getUrlFor(me);
						me.url = regeneratedUrl||me.url;
						me.stopListening(this.parent.instance, 'change:'+this.parent.instance.idAttribute);
					})
				};
			};
		},

		_handleCustomEvents: function () {
			this.on('add', function () {
				var added = arguments[0];
				var me = this;
				this.listenTo(added, 'sync:destroy', function (res) {
					me.trigger('sync:remove');
				});
			});
		},

		get: function (id, options) {
			if (id instanceof this.model) {
				return Backbone.Collection.prototype.get.apply(this, arguments);
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
				var doc = Backbone.Collection.prototype.get.apply(this, arguments);
				if (!doc && arguments.callee.caller != Backbone.Collection.prototype.set) {
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

		set: function (models, options) {
			//ids array
			if (is.Array(models) && models.length && !is.Object(models[0])) {
				wrappedModels = [];
				models.forEach(function (model) {
					wrappedModels.push({
						_id: model
					});
				});
				models = wrappedModels;
				return this.set(models, options);
			}

			return Backbone.Collection.prototype.set.apply(this, arguments);
		},

		add: function (model, options) {
			// _isId -> will be deprecated
			var _isId = false;

			//Try add simple _id
			if (is.String(model)) {
				_isId = true;
				this.add({_id:model});
			}
			var ret = Backbone.Collection.prototype.add.apply(this, [model, options]);

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
	
	_.extend(SagaCollection.prototype, CollectionHelpers(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionPagination(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionPropertiesDefinitions(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionSync(SagaCollection));
	_.extend(SagaCollection.prototype, CollectionValidation(SagaCollection));
	

	return SagaCollection;
});