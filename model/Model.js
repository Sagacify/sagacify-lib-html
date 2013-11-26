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
			var getterName = "get";
			for(attrPart in attribute.split(".")){
				getterName+=attrPart.capitalize();
			}
			if(is.Function(this[getterName]) && this[getterName]!=arguments.callee.caller)
				return this[getterName]();
			var value = Backbone.Model.prototype.get.apply(this, arguments);
			if(!value){
				var schemaElement = this.schema.tree[attribute] || this.schema.virtuals[attribute];
				if(schemaElement && schemaElement.ref){
					this.set(attribute, {});
					value = Backbone.Model.prototype.get.apply(this, arguments);
				}
				if(schemaElement instanceof Array && is.Object(schemaElement[0])){
					this.set(attribute, []);
					value = Backbone.Model.prototype.get.apply(this, arguments);
					if(schemaElement[0].single)
						value.add({});
				}
			}
			return value;
		},

		set: function(){
			var me = this;
			var getset = function(attribute, raw){
				var schemaElement = me.schema.tree[attribute] || me.schema.virtuals[attribute];
				if(schemaElement){
					var type = is.Array(schemaElement)?schemaElement[0].type:schemaElement.type;
					var ref = is.Array(schemaElement)?schemaElement[0].ref:schemaElement.ref;
					if(is.Object(raw) && ref || is.Array(raw)){
						var docColl = Backbone.Model.prototype.get.apply(me, [attribute]);
						if(docColl instanceof SagaModel || docColl instanceof SagaCollection){
							docColl.set(raw);
							return null;
						}

						var url = is.Function(me.url)?me.url():me.url;
						if(is.Array(schemaElement)){
							var collectionUrl = me.isNew()?"":(url+'/'+attribute);
							//collection of ref
							if(ref){
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
						}
						else {
							debugger;
							return new App.models[ref+"Model"](raw||{}, {url:me.isNew()?"":(url+'/'+attribute), parent:{instance:me, path:attribute}});
						}
					}
					else{
						if(schemaElement.type == "Date"){
							raw = Date.create(raw);
						}
						// take trace of initial attributes for revert
						if(me.schema.tree[attribute] && !(attribute in me._originalAttributes)){
							me._originalAttributes[attribute] = raw;
						}
						return raw;
					}
				}
				else{
					//if the attribute is the first part of a composed attribute and the server has send the value as object, e.g.: waited attr is user.name and server has sent user:{name:"..."} 
					if(is.Object(raw)){
						for(var key in raw){
							me.set(attribute+"."+key, raw[key]);
						}
					}
					return null;
				}
			}

			var args = Array.apply(null, arguments);

			if(args[0] && args[0].isString()){
				var setterName = "set";
				for(attrPart in args[0].split(".")){
					setterName+=attrPart.capitalize();
				}
				if(is.Function(this[setterName]) && this[setterName]!=arguments.callee.caller){
					return this[setterName](args[0], args[1]);
				}
				var value = getset(args[0], args[1]);
				if(value == null){
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

			var mget = function(attr){
				return function(){
					return this._mattributes[attr];
				};
			}

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
				if(key.contains(".")){
					var attr = key.split(".")[0];
					properties[attr] = {get: mget(attr)};
				}
			});

			this.schema.virtuals.keys().forEach(function(key){
				properties[key] = {get: get(key), set:set(key)};
				if(key.contains(".")){
					var attr = key.split(".")[0];
					properties[attr] = {get: mget(attr)};
				}
			});

			this.schema.actions.keys().forEach(function(key){
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

		// defineAttrProperty: function(attr){
		// 	var get = function(attr){
		// 		return function(){
		// 			return this.get(attr);
		// 		};
		// 	};

		// 	var mget = function(attr){
		// 		return function(){
		// 			return this._mattributes[attr];
		// 		};
		// 	}

		// 	var set = function(attr){
		// 		return function(value){
		// 			return this.set(attr, value);
		// 		};
		// 	};

		// 	var properties = {};
		// 	properties[attr] = {get: get(attr), set:set(attr)};
		// 	if(attr.contains(".")){
		// 		var splitAttr = attr.split(".")[0];
		// 		properties[splitAttr] = {get: mget(splitAttr)};
		// 	}

		// 	Object.defineProperties(this, properties);
		// },

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

		toJSON: function(mpath){
			var json;
			if(!mpath)
				json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			else
				json = _.clone(this._mattributes);

			childToJSON = function(parent){
				for(var attr in parent){
					if(parent[attr] && typeof parent[attr].toJSON == "function"){
						parent[attr] = parent[attr].toJSON(mpath);
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

		sgValidate: function(attr){
			if(!attr){
				for(var attr in this.treeVirtuals()){
					var val = this.sgValidate(attr);
					if(!val.success)
						return val;
				}
				return {success:true};
			}

			var validationRef = this.validationRef();
			var model = validationRef.instance;
			var path = validationRef.path;
			var pathAttr = path?path+"."+attr:attr;
			var url = model.url instanceof Function?model.url():model.url;
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
					success: ValidateFormat.validate(
								this[attr],
								App.server_routes[method][url].validation[pathAttr] || []
							)
				};
			}
			return {success:true};
		},

		//bind this to els
		bindToEls: function(els, attr){
			this.bindToImages(els.filter(':image'), attr);
			this.bindToInputDates(els.filter(':input[type=date]'), attr);
			this.bindToInputCheckboxs(els.filter(':input[type=radio]'), attr);
			this.bindToSelects(els.filter('select'), attr);
			this.bindToInputs(els.filter(':input').not(':input[type=date], :input[type=radio],select'), attr);
			this.bindToDefaultsEls(els.not(':image, :input'), attr);
		},

		bindToImages: function(imgs, attr){
			if(!imgs.length)
				return;
			if(this[attr] != null){
				imgs.attr('src', this[attr]);
			}
			this.on('change:'+attr, function(model){
				imgs.attr('src', this[attr]);
			});
		},

		bindToInputs: function(inputs, attr){
			if(!inputs.length)
				return;
			var me = this;
			inputs.change(function(){
				me[attr] = this.value;
			});

			if(this[attr] != null){
				inputs.val(this[attr]);
			}
			this.on('change:'+attr, function(){
				inputs.val(this[attr]);
			});
		},

		bindToInputDates: function(inputDates, attr){
			if(!inputDates.length)
				return;
			var me = this;
			inputDates.on('blur', function(evt){
				me[attr] = new Date(this.value);
			});

			if(this[attr] && this[attr].getTime()){
				inputDates.val(this[attr].inputFormat());
			}
			this.on('change:'+attr, function(){
				if(this[attr].getTime())
					inputDates.val(this[attr].inputFormat());
			});
		},

		bindToInputCheckboxs: function(inputs, attr){
			if(!inputs.length)
				return;
			var me = this;
			$('input[name="'+inputs.prop('name')+'"]', inputs.parentsUntil().last()).change(function(evt){
				me[attr] = inputs.prop('checked');
			});

			if(this[attr] != null){
				inputs.prop('checked', this[attr]);
			}
			this.on('change:'+attr, function(){
				inputs.prop('checked', this[attr]);
			});
		},

		bindToSelects: function(selects, attr){
			if(!selects.length)
				return;
			var me = this;
			selects.on('change', function(){
				me[attr] = this.options[this.selectedIndex].innerHTML;
			});

			if(this[attr] != null){
				$('[value='+this[attr]+']', selects).prop('selected', true);
			}
			this.on('change:'+attr, function(){
				$('[value='+this[attr]+']', selects).prop('selected', true);
			});
		},

		bindToDefaultsEls: function(els, attr){
			if(!els.length)
				return;
			if(this[attr] != null){
				els.html(this[attr]);
			}
			this.on('change:'+attr, function(){
				els.html(this[attr]);
			});
		},

		bindValidationToEls: function(els, attr, validClass, errorClass){
			this.on('change:'+attr, function(model){
				if(this.sgValidate(attr).success){
					els.removeClass(errorClass);
					els.addClass(validClass);
				}
				else{
					els.removeClass(validClass);
					els.addClass(errorClass);
				}
			});
		},

		fetch: function(options, data){
			if(is.String(options)){
				var url = typeof this.url == "function"?this.url():this.url;
				if(!url.endsWith('/')){
					url += '/';
				}
				return SGAjax.ajax({
					url: url+options,
					type: 'GET',
					data: data
				});
			}
			else{
				return Backbone.Model.prototype.fetch.apply(this, arguments);
			}
		}

	});

	return SagaModel;
});