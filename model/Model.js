define(['backbone', 'saga/validation/ValidateFormat', './Collection'], function(Backbone, ValidateFormat, SagaCollection){
	var SagaModel = Backbone.Model.extend({

		constructor: function(attributes, options){
			if(options){
				if("url" in options)
					this.url = options.url;
			}
			this._originalAttributes = {};
			this.defineSchemaProperties();
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},

		primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectID"],

		get: function(attribute){
			var value = Backbone.Model.prototype.get.apply(this, arguments);
			if(!value){
				var schemaElement = this.schema.tree[attribute] || this.schema.virtuals[attribute];
				if(schemaElement && schemaElement.type && !this.primitiveTypes.contains(schemaElement.type)){
					value = this.set(attribute, {});
				}
			}
			return value;
		},

		set: function(){
			var me = this;
			var getset = function(attribute, raw){
				var schemaElement = me.schema.tree[attribute] || me.schema.virtuals[attribute];
				if(schemaElement){
					var type = schemaElement instanceof Array?schemaElement[0].type:schemaElement.type;
					if(!me.primitiveTypes.contains(type)){
						var docColl = Backbone.Model.prototype.get.apply(me, [attribute]);
						if(docColl){
							docColl.set(raw);
							return null;
						}

						var url = me.url instanceof Function?me.url():me.url;
						if(schemaElement instanceof Array){
							var collectionUrl = me.isNew()?"":(url+'/'+attribute);
							if(type){
								return new App.collections[type+"Collection"](raw||[], {url:collectionUrl});
							}
							//embedded
							else{
								var Model = SagaModel.extend({
									urlRoot: collectionUrl+'/',
									schema: schemaElement.doc,
									idAttribute: "_id"
								});
								var Collection = SagaCollection.extend({
									model: Model,
									url: collectionUrl,
									schema: schemaElement.collection
								});
								return new Collection(raw||[]);
							}
						}
						else{
							console.log(schemaElement)
							return new App.models[type+"Model"](raw||{}, {url:me.isNew()?"":(url+'/'+attribute)});
						}
					}
					else{
						// take trace of initial attributes for revert
						if(me.schema.tree[attribute] && !(attribute in me._originalAttributes)){
							me._originalAttributes[attribute] = raw;
						}
						return raw;
					}
				}
				else{
					return null;
				}
			}

			var args = Array.apply(null, arguments);

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
				args[0].keys().forEach(function(key){
					var value = getset(key, args[0][key]);
					if(value == null){
						delete args[0][key];	
					}
					else{
						args[0][key] = value;
					}
				});
			}

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

			this.schema.virtuals.keys().forEach(function(key){
				properties[key] = {get: get(key)};
			});

			this.schema.actions.keys().forEach(function(key){
				properties[key] = {get: getAction(key)};
			});

			Object.defineProperties(this, properties);
		},

		revert: function(){
			for(var key in this._originalAttributes){
				this.set(key, this._originalAttributes[key]);
			}
		},

		validate: function(attr){
			var url = this.url instanceof Function?this.url():this.url;
			var method;
			if(this.isNew())
				method = "post";
			else
				method = "put";
			if(url.endsWith('/'))
				url = url.substring(0, url.length-1);
			if(url && App.server_routes[method][url] && App.server_routes[method][url].validation && App.server_routes[method][url].validation[attr])
				return {success:ValidateFormat.validate(this[attr], App.server_routes[method][url].validation[attr]||[])};
			return {success:true};
		}

	});

	return SagaModel;
});