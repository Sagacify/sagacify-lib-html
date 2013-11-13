define(['backbone', 'saga/validation/ValidateFormat', './Collection', '../types/validateType'], function(Backbone, ValidateFormat, SagaCollection, is){
	var SagaModel = Backbone.Model.extend({

		constructor: function(attributes, options){
			if(options){
				if("url" in options)
					this.url = options.url;
			}

			this._originalAttributes = {};
			this.defineSchemaProperties();
			this.handleMattributes();
			Backbone.Model.prototype.constructor.apply(this, arguments);
		},

		primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectId"],

		get: function(attribute){
			var value = Backbone.Model.prototype.get.apply(this, arguments);
			if(!value){
				var schemaElement = this.schema.tree[attribute] || this.schema.virtuals[attribute];
				if(schemaElement && schemaElement.type && !this.primitiveTypes.contains(schemaElement.type)){
					this.set(attribute, {});
					value = Backbone.Model.prototype.get.apply(this, arguments);
				}
				if(schemaElement instanceof Array && is.Object(schemaElement[0])){
					this.set(attribute, []);
					value = Backbone.Model.prototype.get.apply(this, arguments);
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
									schema: schemaElement[0].doc,
									idAttribute: "_id"
								});
								var Collection = SagaCollection.extend({
									model: Model,
									url: collectionUrl,
									schema: schemaElement[0].collection
								});
								return new Collection(raw||[]);
							}
						}
						else{
							console.log(type)
							return new App.models[type+"Model"](raw||{}, {url:me.isNew()?"":(url+'/'+attribute)});
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
			if(mpath)
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

		sgValidate: function(attr){
			var url = this.url instanceof Function?this.url():this.url;
			var method;
			if(this.isNew()) {
				method = "post";
			}
			else {
				method = "put";
			}
			if(url.endsWith('/')) {
				url = url.substring(0, url.length-1);
			}

			if(url && App.server_routes[method][url] && App.server_routes[method][url].validation && App.server_routes[method][url].validation[attr]) {
				return {
					success: ValidateFormat.validate(
								this[attr],
								App.server_routes[method][url].validation[attr] || []
							)
				};
			}
			return {success:true};
		},

		//bind this to els
		bindToEls: function(els, attr){
			this.bindToImages(els.filter(':image'), attr);
			this.bindToInputDates(els.filter(':input[type=date]'), attr);
			this.bindToSelects(els.filter('select'), attr);
			this.bindToInputs(els.filter(':input').not(':input[type=date], select'), attr);
			this.bindToDefaultsEls(els.not(':image, :input'), attr);
		},

		bindToImages: function(imgs, attr){
			if(!imgs.length)
				return;
			this.on('change:'+attr, function(model){
				imgs.attr('src', this[attr]);
			});
		},

		bindToInputs: function(inputs, attr){
			if(!inputs.length)
				return;
			var me = this;
			inputs.on('change', function(){
				me[attr] = this.value;
			});
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
			this.on('change:'+attr, function(){
				if(this[attr].getTime())
					inputDates.val(this[attr].inputFormat());
			});
		},

		bindToSelects: function(selects, attr){
			if(!selects.length)
				return;
			var me = this;
			selects.on('change', function(){
				me[attr] = this.options[this.selectedIndex].innerHTML;
			});
			this.on('change:'+attr, function(){
				$('[value='+this[attr]+']', selects).prop('selected', true);
			});
		},

		bindToDefaultsEls: function(els, attr){
			if(!els.length)
				return;
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
		}

	});

	return SagaModel;
});