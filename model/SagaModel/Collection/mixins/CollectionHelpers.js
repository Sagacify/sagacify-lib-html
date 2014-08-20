define([
	'saga/types/validateType'
], function (is) {
	return function(SagaCollection){
		return {
			isEmpty: function(){
				return !!!this.length;
			},

			previousModel: function(model){
				if (!model) {
					return;
				}

				var index = this.indexOf(model);
				if (index === undefined) {
					return;
				}

				return this.at(index - 1);
			},

			remove: function(predicate){
				if (predicate && _.isFunction(predicate)) {
					var toRemove = [];
					this.each(function(model){
						if (predicate(model)) {
							toRemove.push(model);
						}
					});
					this.remove(toRemove);
					return;
				}

				return Backbone.Collection.prototype.remove.apply(this, arguments);
			},

			nextModel: function(model){
				if (!model) {
					return;
				}

				var index = this.indexOf(model);
				if (index === undefined) {
					return;
				}

				return this.at(index + 1);
			},

			removeAll: function () {
				var removed = [];
				for (var i = this.models.length - 1; i >= 0; i--) {
					removed.push(this.models[i]);
				}
				this.remove(removed);
				this.resetPaginate();
				this.trigger('remove:all');
				return removed;
			},

			clear: function ()  {
				// var len = this.models.length;
				// while (len--) {
				// 	this.models[len].clear();
				// 	this.remove(this.models[len]);
				// }
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

			sgClientFilter: function (attrs) {
				var items = this.where(attrs);
				var Collection = SagaCollection.extend({
					model: this.model,
					url: this.url,
					schema: this.schema
				});
				return new Collection(items);
			},

			mergeWithCollection: function(anotherCollection){
				for (var i = 0; i < anotherCollection.models.length; i++) {
					this.add(anotherCollection.models[i]);
				}
			},

			saveAndMergeByPosition: function () {
				var clonedCollection = this.clone();
				var me = this;

				var deferred = clonedCollection.save();

				deferred.done(function () {
					for (var i = 0; i < clonedCollection.models.length; i++) {
						me.models[i].set(clonedCollection.models[i]);
					}
				});

				return deferred;
			},
			clientSort: function () {
				return Backbone.Collection.prototype.sort.apply(this, arguments);
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

				var res = Backbone.Collection.prototype.set.apply(this, arguments);

			},


			add: function (model, options) {
				//Try add simple _id
				if (is.String(model)) {
					_isId = true;
					this.add({_id:model}, options);
				}
				return  Backbone.Collection.prototype.add.apply(this, [model, options]);
			},
		};
	};
});