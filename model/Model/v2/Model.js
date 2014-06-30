define([
	'backbone',
	'./../../Collection',
	'../../../types/validateType',
	'../../../ajax/SGAjax',

	'./mixins/ModelSchemaAction',
	'./mixins/ModelSchemaPropertiesDefinition',
	'./mixins/ModelSchemaSetter',
	'./mixins/ModelSchemaSync',
	'./mixins/ModelSchemaValidation',
	'./mixins/ModelSchemaGetter',
], function (Backbone,
	
	SagaCollection, 
	is, 
	SGAjax,

	ModelSchemaAction,
	ModelSchemaPropertiesDefinition, 
	ModelSchemaSetter,
	ModelSchemaSync,
	ModelSchemaValidation,
	ModelSchemaGetter
	) {

	var SagaModel = Backbone.Model.extend({
		constructor: function(attributes, options){
			if(options){
				if("url" in options)
					this.url = options.url;
				if("urlRoot" in options)
					this.urlRoot = options.urlRoot;
				if(options.parent)
					this.parent = options.parent;
				this.isValidationRef = options.isValidationRef;
			}

			this._originalAttributes = {};
			this.defineSchemaProperties();
			this.handleMattributes();

			Backbone.Model.prototype.constructor.apply(this, arguments);
		}, 
		
		idAttribute: "_id",

		parent: {
			instance: null,
			path: null
		},

		primitiveTypes: ["String", "Number", "Boolean", "Date", "ObjectId"],

		//model to be transformed in id in toJSON if _isId
		_isId: false,


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
				if (this.urlRoot.endsWith("/")) {
					return this.urlRoot + this.slug;
				} else {
					return this.urlRoot+"/"+this.slug;
				}
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

		validForSave : function(){
			return null;
		},

		__tIsValid: function(__t){
			if(!App.__t_valids){
				return false;
			}
			else{
				return App.__t_valids.contains(__t);
			}
		},

		clone: function () {
			var clone = Backbone.Model.prototype.clone.apply(this, arguments);
			for(var attr in clone.attributes) {
				if(clone.attributes[attr] instanceof SagaModel) {
					clone.attributes[attr] = clone.attributes[attr].clone();
				}
				if(clone.attributes[attr] instanceof SagaCollection) {
					clone.attributes[attr] = clone.attributes[attr].clone({models:true});
				}
			}
			return clone;
		}
	});


	_.extend(SagaModel.prototype, ModelSchemaAction(SagaModel));
	_.extend(SagaModel.prototype, ModelSchemaPropertiesDefinition(SagaModel));
	_.extend(SagaModel.prototype, ModelSchemaSetter(SagaModel));
	_.extend(SagaModel.prototype, ModelSchemaSync(SagaModel));
	_.extend(SagaModel.prototype, ModelSchemaValidation(SagaModel));
	_.extend(SagaModel.prototype, ModelSchemaGetter(SagaModel));
	

	return SagaModel;
});