define(['backbone'], function(){
	return Backbone.Model.extend({

		constructor: function(attributes, options){
			if(options){
				if(options.url)
					this.url = options.url;
			}
			this.defineSchemaProperties();
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},

		primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectId"],

		// get: function(attribute){
		// 	var schemaElement = this.schema.tree[attribute] || this.schema.views[attribute];
		// 	if(schemaElement){
		// 		var type = schemaElement instanceof Array?schemaElement[0].type:schemaElement.type;
		// 		var value = Backbone.Model.prototype.get.apply(this, arguments);
		// 		if(!this.primitiveTypes.contains(type)){
		// 			var url = this.url instanceof Function?this.url():this.url;
		// 			if(schemaElement instanceof Array){
		// 				return new App.collections[type+"Collection"](value||[], {url:url+'/'+attribute});
		// 			}
		// 			else{
		// 				return new App.models[type+"Model"](value||{}, {url:url+'/'+attribute});
		// 			}
		// 		}
		// 		else{
		// 			return value;
		// 		}
		// 	}
		// 	else{
		// 		return null;
		// 	}
		// },

		set: function(){
			if(arguments[0].url){
				console.log(arguments[0])
				console.logStack()
			}
			var me = this;
			var getset = function(attribute, raw){
				var schemaElement = me.schema.tree[attribute] || me.schema.views[attribute];
				if(schemaElement){
					var type = schemaElement instanceof Array?schemaElement[0].type:schemaElement.type;
					if(!me.primitiveTypes.contains(type)){
						var docColl = me.get(attribute);
						if(docColl){
							docColl.set(raw);
							return null;
						}

						var url = me.url instanceof Function?me.url():me.url;
						if(schemaElement instanceof Array){
							return new App.collections[type+"Collection"](raw||[], {url:url+'/'+attribute});
						}
						else{
							return new App.models[type+"Model"](raw||{}, {url:url+'/'+attribute});
						}
					}
					else{
						return raw;
					}
				}
				else{
					return null;
				}
			}

			var args = Array.apply(null, arguments);
			if(arguments[0].url)
			console.log("ha")

			if(args[0] && args[0].isString()){
				var value = getset(args[0], args[1]);
				if(!value){
					return;
				}
				else{
					args[1] = value;
				}
			}
			else if(args[0] && args[0].isObject()){
				if(args[0]._id){
					this.set("_id", args[0]._id);
					delete args[0]._id;
				}

				if(arguments[0].url)
					console.log(2)
				args[0].keys().forEach(function(key){
					var value = getset(key, args[0][key]);
					if(!value){
						delete args[0][key];	
					}
					else{
						args[0][key] = value;
					}
				});
				if(arguments[0].url)
					console.log(2)
			}
			if(arguments[0].url)
				console.log("args")

			return Backbone.Model.prototype.set.apply(this, args);
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

			var get = function(attr){
				return function(){
					return this.get(attr);
				};
			};

			var set = function(attr){
				return function(value){
					return this.set(attr, value);
				};
			};

			var getAction = function(action){
				return function(){
					return function(){
						var argsArray = Array.apply(null, arguments);
						return this.do.apply(this, [action, argsArray]);
					};
				};
			};

			var properties = {id: {get:get("_id")}};

			this.schema.tree.keys().forEach(function(key){
				properties[key] = {get: get(key), set:set(key)};
			});

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