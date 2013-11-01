define(['backbone'], function(){
	return Backbone.Collection.extend({

		_isLoading: false,

		_sort: {
			//field: asc|desc
		},

		_filters: {

		},

		_paginate: {
		    currentPage: 0, // which page should pagination start from
		    perPage: 0, // how many items per page should be shown (0 is no limit)
		    maxPages: 0, // max pages (0 is not limit) 
		    _maxPagesReached: false
		},

		constructor: function(models, options){
			if(models && !(models instanceof Array)){
				options = models;
			}
			if(options){
				if(options.url)
					this.url = options.url;
			}

			this._virtuals = {};
			this.defineSchemaProperties();
			Backbone.Collection.prototype.constructor.apply(this, arguments);
		},

		get: function(id){
			if(id instanceof this.model){
				return Backbone.Collection.prototype.get.apply(this, arguments);
			}
			var url = this.url instanceof Function?this.url():this.url;
			if(this.schema.virtuals[id]){
				if(!this._virtuals[id]){
					if(this.schema.virtuals[id] instanceof Array){
						var model = App.models[this.schema.virtuals[id][0].type+"Model"].extend({urlRoot:url+'/'+id});
						this._virtuals[id] = new App.collections[this.schema.virtuals[id][0].type+"Collection"]([], {url:url+'/'+id, model:model});
					}
					else{
						this._virtuals[id] = new App.models[this.schema.virtuals[id].type+"Model"]({}, {url:url+'/'+id});
					}
				}
				return this._virtuals[id];
			}
			else if(!id || id == "new"){
				return new this.model({}, {urlRoot: url});
			}
			else{
				return Backbone.Collection.prototype.get.apply(this, arguments) || new this.model({_id:id}, {urlRoot: url});
			}
		},

		set: function(){
			Backbone.Collection.prototype.set.apply(this, arguments);
			console.log('set')
			//this.trigger('set');
		},

		do: function(action, args){
			var url = this.url instanceof Function?this.url():this.url;
			if(args instanceof Array){
				argsObj = {};
				if(this.schema.actions[action]){
					this.schema.actions[action].args.forEach(function(arg, i){
						argsObj[arg] = args[i];
					});
				}
				args = argsObj;
			}
			return $.post(url+'/'+action, args||{});
		},

		clientSort: function(){
			return Backbone.Collection.prototype.sort.apply(this, arguments);
		},

		sort: function(sort){
			this._sort = sort;
			return this;
		},

		filter: function(filters){
			this._filters = filters;
			return this;
		},

		paginate: function(paginate){
			_.extend(this._paginate, paginate);
			return this;
		},

		fetch: function(options){
			if(!options)
				options = {data:{}};
			if(!options.data)
				options.data = {};
			if(this._sort){
				if(typeof this._sort == "string"){
					options.data.sort_by = this._sort;
				}
				else{
					options.data.sort_by = this._sort.keys()[0];
					options.data.sort_how = this._sort[options.data.sort_by];
				}
			}
			for(var key in this._filters){
				options.data[key] = this._filters[key];
			}

			this._isLoading = true;
			var fetch = Backbone.Collection.prototype.fetch.apply(this, [options]);
			var me = this;
			fetch.always(function(data){
				me._isLoading = false;
			});
			return fetch;
		},

		nextPage: function(options){
			if(!options)
				options = {data:{}};
			options.remove = false;
			if(!options.data)
				options.data = {};
			if(this._paginate.perPage){
				options.data.offset = this._paginate.currentPage*this._paginate.perPage;
				options.data.limit = this._paginate.perPage;
			}
			var nextFetch = this.fetch(options);
			var me = this;
			nextFetch.done(function(data){
				me._paginate.currentPage++;
				me._paginate._maxPagesReached = me._paginate.currentPage==me._paginate.maxPages||data.length<me._paginate.perPage;
			});
			return nextFetch;
		},

		isMaxReached: function(){
			return this._paginate._maxPagesReached;
		},

		isLoading: function(){
			return this._isLoading;
		},

		clone: function(options) {
			if(!options)
				options = {};
			var models = options.models?this.models:null;
      		return new this.constructor(models, {url:this.url});
    	},

		defineSchemaProperties: function(){
			if(!this.schema)
				return;

			var properties = {};

			var get = function(attr){
				return function(){
					return this.get(attr);
				}
			};

			var getAction = function(action){
				return function(){
					return function(){
						var argsArray = Array.apply(null, arguments);
						return this.do.apply(this, [action, argsArray]);
					};
				};
			};

			this.schema.virtuals.keys().forEach(function(key){
				properties[key] = {get: get(key)};
			});

			this.schema.actions.keys().forEach(function(key){
				properties[key] = {get: getAction(key)};
			});

			Object.defineProperties(this, properties);
		},

		addGetterProperty: function(id){
			if(!id)
				return;

			var get = function(attr){
				return function(){
					return this.get(attr);
				}
			};
			var properties = {};
			properties["id_"+id] = {get: get(id)};
			Object.defineProperties(this, properties);
		}

	});
});