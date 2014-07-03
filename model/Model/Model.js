define([
	'backbone',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax',

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
					this.urlRoot = options.url;
				if("urlRoot" in options)
					this.urlRoot = options.urlRoot;
				if(options.parent)
					this.parent = options.parent;
				this.isValidationRef = options.isValidationRef;
			}

			this._originalAttributes = {};
			this.defineSchemaProperties();
			this.handleMattributes();
			var ret = Backbone.Model.prototype.constructor.apply(this, arguments);
			this.postCreate && this.postCreate();

			return ret;
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


		revert: function(){
			for(var key in this._originalAttributes){
				this.set(key, this._originalAttributes[key]);
			}
		},


		//Deprecated
		treeVirtuals: function(){
			return this.schema.virtuals.clone().merge(this.schema.tree);
		},

		//TODO: improve function to avoid remove embedded models and collections, and clear them
		clear: function(){

			var attributes = this.mongooseSchema.getAttributes();
			for(var attribute in attributes){
				var subSchema = attributes[attribute];
				var currentValue = this.get(attribute, {lazyCreation:false});

				if (currentValue) {
					if (is.Object(currentValue) && 'clear' in currentValue) {
						currentValue.clear();
						continue;
					};
				};
			};

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