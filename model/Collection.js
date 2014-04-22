define([
	'backbone',
	'../types/validateType',
	'../ajax/SGAjax'
], function (Backbone, is, SGAjax) {
	var SagaCollection = Backbone.Collection.extend({

		_isLoading: false,

		_sort: {
			//field: asc|desc
		},

		_filters: {

		},

		_paginate: {
			currentPage: 0,
			// which page should pagination start from
			perPage: 0,
			// how many items per page should be shown (0 is no limit)
			maxPages: 0,
			// max pages (0 is not limit) 
			_maxPagesReached: false
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
				if (options.url) this.url = options.url;
				if (options.parent) this.parent = options.parent;
			}

			this._virtuals = {};
			this.defineSchemaProperties();
			Backbone.Collection.prototype.constructor.apply(this, arguments);

			this._handleCustomEvents();
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
			if (is.Array(models) && models.length && !is.Object(models[0])) {
				wrappedModels = [];
				models.forEach(function (model) {
					wrappedModels.push({
						_id: model
					});
				});
				models = wrappedModels;
			}
			return Backbone.Collection.prototype.set.apply(this, arguments);
		},

		add: function () {
			// if(arguments[0] == 'new'){
			// 	return Backbone.Collection.prototype.add.apply(this, [this.get('new')]);
			// }

			var _isId = false;
			if (is.String(arguments[0])) {
				_isId = true;
				arguments[0] = {
					_id: arguments[0]
				};
			}
			var ret = Backbone.Collection.prototype.add.apply(this, arguments);
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

		do: function (action, args) {
			var url = this.url instanceof Function ? this.url() : this.url;
			if (args instanceof Array) {
				argsObj =   {};
				if (this.schema.actions[action]) {
					this.schema.actions[action].args.forEach(function (arg, i) {
						argsObj[arg] = args[i];
					});
				}
				args = argsObj;
			}
			return SGAjax.ajax({
				type: 'POST',
				url: url + '/' + action,
				data: args || {}
			});
		},

		clientSort: function () {
			return Backbone.Collection.prototype.sort.apply(this, arguments);
		},

		sgSort: function (sort) {
			this._sort = sort;
			return this;
		},

		sgFilter: function (filters) {
			this._filters = filters;
			return this;
		},

		sgPaginate: function (paginate) {
			_.extend(this._paginate, paginate);
			return this;
		},

		fetch: function (options) {
			if (!options) options = {
				data: {}
			};
			if (!options.data) options.data = {};
			if (this._sort) {
				if (typeof this._sort == "string") {
					options.data.sort_by = this._sort;
				} else {
					options.data.sort_by = this._sort.keys()[0];
					options.data.sort_how = this._sort[options.data.sort_by];
				}
			}
			for (var key in this._filters) {
				//options.data[key] = JSON.stringify(this._filters[key]);
				options.data[key] = this._filters[key];
			}

			this._isLoading = true;
			var fetch = Backbone.Collection.prototype.fetch.apply(this, [options]);
			var me = this;
			fetch.always(function (data) {
				me._isLoading = false;
			});
			return fetch;
		},

		nextPage: function (options) {
			if (!options) options = {
				data: {}
			};
			options.remove = false;
			if (!options.data) options.data = {};

			if (options.first) {
				this._paginate.currentPage = 0;
			}

			if (this._paginate.perPage) {
				options.data.offset = this._paginate.currentPage * this._paginate.perPage;
				options.data.limit = this._paginate.perPage;
			}
			var nextFetch = this.fetch(options);
			var me = this;
			nextFetch.done(function (data) {
				me._paginate.currentPage++;
				me._paginate._maxPagesReached = me._paginate.currentPage == me._paginate.maxPages || data.length < me._paginate.perPage;
			});
			return nextFetch;
		},

		isMaxReached: function () {
			return this._paginate._maxPagesReached;
		},

		isLoading: function () {
			return this._isLoading;
		},

		root: function () {
			var instance = this;
			var path = "";
			while (instance.parent.instance) {
				var parent = instance.parent;
				instance = parent.instance;
				path += parent.path;
			}
			return {
				instance: instance,
				path: path
			};
		},

		clone: function (options) {
			if (!options) options = {};
			var models = options.models ? this.models : null;
			return new this.constructor(models, {
				url: this.url
			});
		},

		defineSchemaProperties: function () {
			if (!this.schema) return;

			var properties = {};

			var get = function (attr) {
					return function () {
						return this.get(attr);
					};
				};

			var getAction = function (action) {
					return function () {
						return function () {
							var argsArray = Array.apply(null, arguments);
							//return this.do.apply(this, [action, argsArray]);
							return this.do.apply(this, [action, argsArray[0], argsArray[1]]);
						};
					};
				};

			this.schema.virtuals.keys().forEach(function (key) {
				properties[key] = {
					get: get(key)
				};
			});

			this.schema.actions.keys().forEach(function (key) {
				properties[key] = {
					get: getAction(key)
				};
			});

			Object.defineProperties(this, properties);
		},

		addGetterProperty: function (id) {
			if (!id) return;

			var get = function (attr) {
					return function () {
						return this.get(attr);
					};
				};
			var properties = {};
			properties["id_" + id] = {
				get: get(id)
			};
			Object.defineProperties(this, properties);
		},

		where: function (attrs, first) {
			var fun_attrs = {};
			for (var key in attrs) {
				if (typeof attrs[key] == "function") {
					fun_attrs[key] = attrs[key];
					delete attrs[key];
				}
			}
			var toFilter = this;
			var where;
			if (attrs.keys().length) {
				where = Backbone.Collection.prototype.where.apply(this, arguments);
			} else {
				where = this;
			}
			if (!where || !where.filter) {
				return where;
			}
			return where.filter(function (model) {
				for (var key in fun_attrs) {
					if (!fun_attrs[key](model[key])) return false;
				}
				return true;
			});
		},

		removePaginate: function(){
			this._paginate = {
				currentPage: 0,
				// which page should pagination start from
				perPage: 0,
				// how many items per page should be shown (0 is no limit)
				maxPages: 0,
				// max pages (0 is not limit) 
				_maxPagesReached: false
			};
		},

		clear: function ()  {
			var len = this.models.length;
			while (len--) {
				this.remove(this.models[len]);
			}
		},

		removeAll: function () {
			var removed = [];
			for (var i = this.models.length - 1; i >= 0; i--) {
				removed.push(this.models[i]);
			}
			this.clear();
			this.removePaginate()
			this.trigger('remove:all');
			return removed;
		},

		mergeWithCollection: function(anotherCollection){
			for (var i = 0; i < anotherCollection.models.length; i++) {
				this.add(anotherCollection.models[i])
			};
		},

		sgClientFilter: function (attrs) {
			var items = this.where(attrs);
			var Collection = SagaCollection.extend({
				model: this.model,
				url: this.url,
				schema: this.schema
			});
			return new Collection(items);
		}

	});

	return SagaCollection;
});