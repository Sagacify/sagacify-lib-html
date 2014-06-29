define([
	'saga/validation/ValidateFormat',
	'./../Collection',
	'../../types/validateType',
	'../../ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			parent: {
				instance: null,
				path: null
			},

			primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectId"],

			//model to be transformed in id in toJSON if _isId
			_isId: false,

			isSchemaAttribute: function(attribute){
				return !!this.getSchemaForAttribute(attribute);
			},


			isPrimitive: function(attribute){
				var schema = this.getSchemaForAttribute(attribute);
				if (schema.ref) {
					return false;
				};

				switch(this.getTypeForSchemaAttribut(attribute)){
					case "ObjectId":
						return false;
					break;

					case "Array":
						return false;
					break;

					case "Object":
						return false;
					break;

					default:
						return true;
					break;
				}
			},

			getTypeForSchemaAttribut: function(attribute){
				var schemaElement = this.getSchemaForAttribute(attribute);
				return schemaElement && (is.Array(schemaElement) ? "Array" : schemaElement.type);
			},

			getRefForSchemaAttribut: function(attribute){
				var schemaElement = this.getSchemaForAttribute(attribute);
				return schemaElement && (is.Array(schemaElement) ? schemaElement[0].ref : schemaElement.ref);
			},

			getSchemaForAttribute: function(attribute){
				return this.schema.tree[attribute] || this.schema.virtuals[attribute];
			},

			get: function(attribute){
				var getterName = "get"+attribute.capitalize();

				if(is.Function(this[getterName]) && this[getterName] != arguments.callee.caller)
					return this[getterName]();

				if (this.isSchemaAttribute(attribute)) {
					return this.schemaGet(attribute);
				};

				return Backbone.Model.prototype.get.apply(this, arguments);
			},

			schemaGet: function(attribute){
				if (attribute == "_id") {
					return Backbone.Model.prototype.get.apply(this, [attribute]);
				};

				if (!this.isSchemaAttribute(attribute)) {
					return null;
				};

				var currentData = undefined;
				currentData = Backbone.Model.prototype.get.apply(this, [attribute]);
				if (currentData != undefined) {
					return currentData;
				};

				var schemaElement = this.getSchemaForAttribute(attribute);

				// ->new refactoring; attribute.type();
				// ->new refactoring; attribute.ref();
				var type = is.Array(schemaElement) ? "Array" : schemaElement.type;
				var ref = is.Array(schemaElement) ? schemaElement[0].ref : schemaElement.ref;

				var res = null;
				if (type == "Array") {
					res = this.initializeCollection(attribute);
					Backbone.Model.prototype.set.apply(this, [attribute, res]);
					return res;
				};
				
				if (ref) {
					res = this.initializeModel(attribute);
					Backbone.Model.prototype.set.apply(this, [attribute, res]);
					return res;
				};

				Backbone.Model.prototype.set.apply(this, [attribute, res]);
				return res;

			},

			generateUrl: function(){
				 return is.Function(this.url) ? this.url(): this.url;
			},


			//Pre attribute is in tree||virtual && is an array
			initializeCollection: function(attribute){

				var contentSchema = this.getSchemaForAttribute(attribute)[0];

				if (!contentSchema) {
					debugger
				};

				var ref = contentSchema.ref;
				var type = contentSchema.type;


				var res = null;
				//collection of ref
				if(ref){
					return this.initializeModelCollection(attribute);
				}

				//Collection of embedded schema
				if (!type) {
					return this.initializeEmbeddedCollection(attribute);
				}

				if (type) {
					//Primitive case
					return [];
				};

			},


			initializeEmbeddedCollection: function(attribute){
				var collectionUrl = this.generateUrl()+'/'+attribute;
				var contentSchema = this.getSchemaForAttribute(attribute)[0];

				var Model = SagaModel.extend({
					urlRoot: collectionUrl+'/',
					schema: contentSchema.doc,
					idAttribute: "_id"
				});
				var Collection = SagaCollection.extend({
					model: Model,
					url: collectionUrl,
					schema: contentSchema.collection
				});
				return new Collection([], {parent:{instance:this, path:attribute}});
			},
							
			initializeModelCollection: function(attribute){
				
				var contentSchema = this.getSchemaForAttribute(attribute)[0];
				var ref = contentSchema.ref;

				var collectionUrl = this.generateUrl()+'/'+attribute;
				if (!App.collections[ref+"Collection"]) {
					debugger
				};
				var newCollection = new App.collections[ref+"Collection"]([], {url:collectionUrl, parent:{instance:this, path:attribute}});
				return newCollection;
			},

			//Future->manage semi embedded doc
			initializeEmbedCollection: function(attribute){
				var ref = this.getRefForSchemaAttribut(attribute);
				var collectionUrl = this.generateUrl()+'/'+attribute;

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
				var newCollection = new Collection([], {url:collectionUrl, parent:{instance:this, path:attribute}});

				return newCollection;
			},


			//Pre attribute is in tree||virtual && is an ref
			initializeModel: function(attribute){
				if (Backbone.Model.prototype.get.apply(this, [attribute])) {
					return;
				};
				var ref = this.getRefForSchemaAttribut(attribute);

				//URL ? francois
				var model = new App.models[ref+"Model"]({}, {
					// url:this.isNew()&& typeof this.url == "function"?"":(url+'/'+attribute), 
					url: this.generateUrl(),
					parent:{
						instance:this, 
						path:attribute
					}
				});
				// Backbone.Model.prototype.set.apply(this, [model]); 
				return model;
			},


			schemaSet: function(attribute, raw){
					if (attribute == "_id") {
						return Backbone.Model.prototype.set.apply(this, arguments);
					};

					if (!this.isSchemaAttribute(attribute)) {
						return false;
					};

					//Unauthorized
					if(raw instanceof SagaModel || raw instanceof SagaCollection){
						debugger
						return raw;
					}

					var schemaElement = this.getSchemaForAttribute(attribute)

					if(schemaElement){
						if (this.isPrimitive(attribute)) {
							if(schemaElement.type == "Date"){
								return Backbone.Model.prototype.set.apply(this, [attribute, new Date(raw)]); 
							} else {
								return Backbone.Model.prototype.set.apply(this, [attribute, raw]); 
							}
						} else {
							//Object ID ou Array
							//SagaModel || SagaCollection

							var val = this.schemaGet(attribute)

							if (val instanceof SagaCollection) {
								return val.set(raw);
							};
							if (val instanceof SagaModel) {
								if (is.Object(raw)) {
									val.batchSet(raw);
								}
								if (is.String(raw)) {
									val._id = raw;
								}
								
							};

							if (is.Array(val)) {
								//Primitive case
								Backbone.Model.prototype.set.apply(this, [attribute, raw]); 
							};

						}
				}

			},

			batchSet: function(dict){

				//Batch set
				if(dict instanceof SagaModel){
					// Pourquoi pas return this.batchSet(dict.toJSON()); ? Francois?
					return Backbone.Model.prototype.set.apply(this, [dict.toJSON()]);

				}

				dict = dict.clone();
				if(dict._id){
					this.set("_id", dict._id);
					delete dict._id;
				}
				
				var res = {};
				var me = this;
				dict.keys().forEach(function(key){

					if (key == "snapshots") {
						debugger
					};

					res[key] = me.set(key, dict[key]);
				});
				return res;
			},	

			set: function SGSetter(){
				if(arguments.callee.caller == Backbone.Model.prototype.save){
					return true;
				}

				var args = Array.apply(null, arguments);

				var attribute = args[0];
				var newValue  = args[1];

				if(args[1] && args[1].add === true && !is.Object(attribute)){
					console.log(attribute)
					console.log(args[1])
					throw new Error('String cannot be directly added.');
					return;
				}

				if(attribute && attribute.isString()){
					//Simple set

					//Call custom setter
					var setterName = "set"+attribute.capitalize();
					if(is.Function(this[setterName]) && this[setterName]!=arguments.callee.caller){
						//Custom setter function (overrided)
						return this[setterName](newValue);
					}

					if (this.isSchemaAttribute(attribute)) {
						return this.schemaSet(attribute, newValue);
					};

					return;
				}
				
				if(attribute && attribute.isObject()){
					return this.batchSet(attribute, newValue);
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
						//francois?
						if(attr == '__t' && (typeof this.__tIsValid != "function" || !this.__tIsValid(value))){
							return;
						}
						return this.set(attr, value);
					};
				};

				var getAction = function(action){
					return function(){
						return function(args, options){
							return this.do.apply(this, [action, args, options]);
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
						// debugger
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
					if(path && parent.path)
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


			validForSave : function(){
				return null;
			},

		}		
	}


});