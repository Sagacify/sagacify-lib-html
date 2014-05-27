define([
	'backbone',
	'saga/validation/ValidateFormat',
	'./Collection',
	'../types/validateType',
	'../ajax/SGAjax'
], function (Backbone, ValidateFormat, SagaCollection, is, SGAjax) {

	var SagaModel = Backbone.Model.extend({

		parent: {
			instance: null,
			path: null
		},

		primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectId"],

		//model to be transformed in id in toJSON if _isId
		_isId: false,

		constructor: function(attributes, options){
			if(options){
				if("url" in options)
					this.url = options.url;
				if(options.parent)
					this.parent = options.parent;
				this.isValidationRef = options.isValidationRef;
			}

			this._originalAttributes = {};
			this.defineSchemaProperties();
			this.handleMattributes();
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},

		get: function(attribute){
			var getterName = "get"+attribute.capitalize();

			if(is.Function(this[getterName]) && this[getterName] != arguments.callee.caller)
				return this[getterName]();

			var value = Backbone.Model.prototype.get.apply(this, arguments);

			if(!value){
				var schemaElement = this.schema.tree[attribute] || this.schema.virtuals[attribute];
				if(schemaElement && schemaElement.ref && attribute != '_id'){
					this.set(attribute, {});
					value = Backbone.Model.prototype.get.apply(this, arguments);
				}
				if(schemaElement instanceof Array && is.Object(schemaElement[0])){
					this.set(attribute, []);
					value = Backbone.Model.prototype.get.apply(this, arguments);

					//hum
					if(schemaElement[0].single)
						value.add({});
				}
			}
			return value;
		},

		set: function SGSetter(){
			if(arguments.callee.caller == Backbone.Model.prototype.save){
				return true;
			}

			var me = this;
			var getset = function(attribute, raw){
				if(raw instanceof SagaModel || raw instanceof SagaCollection){
					return raw;
				}

				var schemaElement = me.schema.tree[attribute] || me.schema.virtuals[attribute];
				if(schemaElement){
					//Contain a Schema element
					var type = is.Array(schemaElement) ? schemaElement[0].type : schemaElement.type;
					var ref = is.Array(schemaElement) ? schemaElement[0].ref : schemaElement.ref;
					//handle as model or collection
					if(is.Object(raw) && ref || is.Array(raw)){
						var docColl = Backbone.Model.prototype.get.apply(me, [attribute]);
						if(docColl instanceof SagaModel || docColl instanceof SagaCollection){
							docColl.set(raw);
							return undefined;
						}
						var url = is.Function(me.url)?me.url():me.url;
						if(is.Array(schemaElement)){
							var collectionUrl = url+'/'+attribute;
							//collection of ref
							if(ref){
								if (!App.collections[ref+"Collection"]) {
									debugger
								};
								return new App.collections[ref+"Collection"](raw||[], {url:collectionUrl, parent:{instance:me, path:attribute}});
							}
							//collection of primitives
							else if(type){
								return raw;
							}
							//embedded
							else{
								var Model = SagaModel.extend({
									urlRoot: collectionUrl+'/',
									schema: schemaElement[0].doc,
									idAttribute: "_id"
								});
								var Collection = SagaCollection.extend({
									model: Model,
									url: collectionUrl,
									schema: schemaElement[0].collection
								});
								return new Collection(raw||[], {parent:{instance:me, path:attribute}});
							}
						} else {
							return new App.models[ref+"Model"](raw||{}, {url:me.isNew()?"":(url+'/'+attribute), parent:{instance:me, path:attribute}});
						}
					} else {
						//handle as primitive
						if(schemaElement.type == "Date"){
							raw = new Date(raw);
						}
						// take trace of initial attributes for revert
						if(me.schema.tree[attribute] && !(attribute in me._originalAttributes)){
							me._originalAttributes[attribute] = raw;
						}
						return raw;
					}
				} else {
					//if the attribute is the first part of a composed attribute and the server has sent the value as object, e.g.: waited attr is user.name and server has sent user:{name:"..."} 
					if(is.Object(raw)){
						for(var key in raw){
							me.set(attribute+"."+key, raw[key]);
						}
					}
					if (args[2] && args[2].force) {
						return raw;
					};

					return undefined;
				}
			}

			var args = Array.apply(null, arguments);

			if(args[1] && args[1].add === true && !is.Object(args[0])){
				throw new Error('String cannot be directly added.');
				return;
			}
			else if(args[0] && args[0].isString()){
				var setterName = "set"+args[0].capitalize();
				if(is.Function(this[setterName]) && this[setterName]!=arguments.callee.caller){
					return this[setterName](args[0], args[1]);
				}
				var value = getset(args[0], args[1]);
				if(value === undefined){
					return;
				}
				else{
					args[1] = value;
				}
			}
			else if(args[0] && args[0].isObject()){
				if(args[0] instanceof SagaModel){
					return Backbone.Model.prototype.set.apply(this, [args[0].toJSON()]);
				}

				args[0] = args[0].clone();
				if(args[0]._id){
					this.set("_id", args[0]._id);
					delete args[0]._id;
				}

				
				args[0].keys().forEach(function(key){
					var value = getset(key, args[0][key]);
					if(value === undefined){
						delete args[0][key];	
					}
					else{
						// if(key == '__t'){
						// 	console.log(args[0][key])
						// 	console.log(value)
						// }
						args[0][key] = value;
					}
				});
			}

			return Backbone.Model.prototype.set.apply(this, args);
		},

		do: function(action, args, options){
			var url = this.url instanceof Function?this.url(options):this.url;
			if(args instanceof Array) {
				argsObj = {};

				if(this.schema.actions[action]){
					if (this.schema.actions[action].args) {
						this.schema.actions[action].args.forEach(function(arg, i){
							argsObj[arg] = args[i];
						});
					}
				}
				args = argsObj;
			}

			var deferred = SGAjax.ajax({
				type: 'POST',
				url: url + '/' + action,
				data: args || {}
			});

			var me = this;
			deferred.done(function(data){
				me.trigger('action', args);
				me.trigger('action:'+action, args);
			});

			return deferred;
		},

		defineSchemaProperties: function(){
			if(!this.schema)
				return;

			var get = function(attr){
				return function(){
					return this.get(attr);
				};
			};

			var mget = function(attr){
				return function(){
					return this._mattributes[attr];
				};
			};

			var set = function(attr){
				return function(value){
					if(attr == '__t' && (typeof this.__tIsValid != "function" || !this.__tIsValid(value))){
						return;
					}
					return this.set(attr, value);
				};
			};

			var getAction = function(action){
				return function(){
					return function(args, options){
						// var argsArray = Array.apply(null, arguments);
						return this.do.apply(this, [action, args, options]);
						// return this.do.apply(this, [action, argsArray[0], argsArray[1]]);
					};
				};
			};

			var properties = {id: {get:get("_id")}};

			var me = this;
			this.schema.tree.keys().forEach(function(key){
				if(key in me)
					key = "_"+key;
				properties[key] = {get: get(key), set:set(key)};

				if(key.contains(".")){
					var attr = key.split(".")[0];
					properties[attr] = {get: mget(attr)};
				}
			});

			this.schema.virtuals.keys().forEach(function(key){
				if(key in me)
					key = "_"+key;
				properties[key] = {get: get(key), set:set(key)};
				if(key.contains(".")){
					var attr = key.split(".")[0];
					properties[attr] = {get: mget(attr)};
				}
			});

			this.schema.actions.keys().forEach(function(key){
				if(key in me)
					key = "_"+key;
				properties[key] = {get: getAction(key)};
			});

			Object.defineProperties(this, properties);
		},

		root: function(){
			var instance = this;
			var path = "";
			while(instance.parent.instance){
				var parent = instance.parent;
				instance = parent.instance;
				path += parent.path;
			}
			return {instance:instance, path:path};
		},

		handleMattributes: function(){
			this._mattributes = {};
			var me = this;
			var handleMattribute = function(attr){
				me.on("change:"+attr, function(model, value, options){
					me._mattributes._set(attr, value);
				});
			}

			for(var attr in this.schema.tree){
				handleMattribute(attr);
			}
			for(var attr in this.schema.virtuals){
				handleMattribute(attr);
			}
		},

		toJSON: function(notmpath){
			if(this._isId){
				return this._id;
			}
			var json;
			if(notmpath !== true)
				json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			else
				json = _.clone(this._mattributes);

			childToJSON = function(parent){
				for(var attr in parent){
					if(parent[attr] && typeof parent[attr].toJSON == "function"){
						var val = parent[attr].toJSON(notmpath);
						if(parent[attr] instanceof SagaModel){
							if(val && !val.isEmpty()){
								parent[attr] = val;
							}
							else{
								delete parent[attr];
							}
						}
						else{
							parent[attr] = val;
						}
					}
					else if(is.Object(parent[attr])||is.Array(parent[attr])){
						childToJSON(parent[attr]);
					}
				}
			}
			childToJSON(json);
			return json;
		},

		revert: function(){
			for(var key in this._originalAttributes){
				this.set(key, this._originalAttributes[key]);
			}
		},

		treeVirtuals: function(){
			return this.schema.virtuals.clone().merge(this.schema.tree);
		},

		isValidationRef: false,

		validationRef: function(){
			var instance = this;
			var path = "";
			while(instance){
				if(instance.isValidationRef){
					break;
				}
				var parent = instance.parent;
				instance = parent.instance;
				if(!instance){
					instance = this;
					path = "";
					break;
				}
				if(path&&parent.path)
					path = "."+path;
				path = parent.path+path;
			}
			return {instance:instance, path:path};
		},

		sgValidate: function(attr) {
			if(is.Array(attr)) {
				var me = this;
				var success = true;
				attr.forEach(function (attr) {
					success &= me.sgValidate(attr).success;
				});
				return {
					success: success
				};
			}
			if(!attr) {
				for(var attr in this.treeVirtuals()) {
					var val = this.sgValidate(attr);
					if(!val.success)
						return val;
				}
				return {
					success: true
				};
			}
			var validationRef = this.validationRef();
			var model = validationRef.instance;
			var path = validationRef.path;
			var pathAttr = path ? path + '.' + attr : attr;
			var url = model.url instanceof Function ? model.url() : model.url;
			var method;
			if(model.isNew()) {
				method = "post";
			}
			else {
				method = "put";
			}
			if(url.endsWith('/')) {
				url = url.substring(0, url.length-1);
			}
			if(url && App.server_routes[method][url] && App.server_routes[method][url].validation && App.server_routes[method][url].validation[pathAttr]) {
				return {
					success: ValidateFormat.validate(attr, this[attr], App.server_routes[method][url].validation[pathAttr] || [])
				};
			}
			else {
				return {
					success:
					true
				};
			}
		},

		fetch: function(attr, data, options){
			if(is.String(attr)){
				var url = typeof this.url == "function"?this.url():this.url;
				if(!url.endsWith('/')){
					url += '/';
				}
				var promise = SGAjax.ajax({
					url: url+attr,
					type: 'GET',
					data: data
				});

				if(options && options.merge){
					var me = this;
					promise.done(function(result){
						me[attr] = result;
					});
				}

				return promise;
			}
			else{
				return Backbone.Model.prototype.fetch.apply(this, arguments);
			}
		},

		save: function(){
			if(arguments[0] instanceof Array){
				var fields = arguments[0];
				var json = this.toJSON();
				var partJson = {};
				fields.forEach(function(field){
					partJson[field] = json[field];
				});
				return this.save(partJson, {patch:true});
			}
			else{
				return Backbone.Model.prototype.save.apply(this, arguments);
			}
		},

		url: function(options){
			if(!this._id && this.slug || options && options.slug){
				return this.urlRoot + this.slug;
			}
			else{
				return Backbone.Model.prototype.url.apply(this, arguments);
			}
		},

		destroy: function(){
			var deferred = Backbone.Model.prototype.destroy.apply(this, arguments);

			var me = this;
			deferred.done(function (res) {
				me.trigger('sync:destroy');
			});

			return deferred;
		},

		//TODO: improve function to avoid remove embedded models and collections, and clear them
		clear: function(){
			this.attributes = {};
			this._mattributes = {};
			this.changed = {};
			this.src = null;
			return Backbone.Model.prototype.clear.apply(this, arguments);
		},

		validForSave: function(){
			return null;
		},

		__tIsValid: function(__t){
			if(!App.__t_valids){
				return false;
			}
			else{
				return App.__t_valids.contains(__t);
			}
		}

	});

	return SagaModel;
});