define(['backbone'], function(){
	return Backbone.Collection.extend({
		constructor: function(models, options){
			if(models && !(models instanceof Array)){
				options = models;
			}
			if(options){
				this.url = options.url;
			}

			this._views = {};
			this.defineSchemaProperties();
			Backbone.Collection.prototype.constructor.apply(this, arguments);
		},

		get: function(id){
			if(id instanceof this.model){
				return Backbone.Collection.prototype.get.apply(this, arguments);
			}

			var url = this.url instanceof Function?this.url():this.url;
			if(this.schema.views[id]){
				if(!this._views[id]){
					if(this.schema.views[id] instanceof Array){
						var model = App.models[this.schema.views[id][0].type+"Model"].extend({urlRoot:url+'/'+id});
						this._views[id] = new App.collections[this.schema.views[id][0].type+"Collection"]({url:url+'/'+id, model:model});
					}
					else{
						this._views[id] = new App.models[this.schema.views[id].type+"Model"]({}, {url:url+'/'+id});
					}
				}
				return this._views[id];
			}
			else if(!id || id == "new"){
				return new this.model({}, {urlRoot: url});
			}
			else{
				return Backbone.Collection.prototype.get.apply(this, arguments) || new this.model({_id:id}, {urlRoot: url});
			}
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

			this.schema.views.keys().forEach(function(key){
				properties[key] = {get: get(key)};
			});

			this.schema.actions.keys().forEach(function(key){
				properties[key] = {get: getAction(key)};
			});

			Object.defineProperties(this, properties);
		}
	});
});