define([
	'saga/model/SagaModel/Model/Model',

	'saga/model/MongooseModel/Collection/Collection',

	'saga/types/validateType',
	'saga/ajax/SGAjax',

	
	'./mixins/ModelEvents',
	'./mixins/ModelSchemaAction',
	'./mixins/ModelSchemaPropertiesDefinition',
	'./mixins/ModelSchemaSetter',
	'./mixins/ModelSchemaSync',
	'./mixins/ModelSchemaValidation',
	'./mixins/ModelSchemaGetter',
], function (
	Model,
	SagaCollection, 
	is, 
	SGAjax,

	ModelEvents,
	ModelSchemaAction,
	ModelSchemaPropertiesDefinition, 
	ModelSchemaSetter,
	ModelSchemaSync,
	ModelSchemaValidation,
	ModelSchemaGetter
	) {
	
	var MongooseModel = Model.extend({

		constructor: function(attributes, options){
			if(options){
				if("custom_url" in options)
					this.custom_url = options.custom_url;
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
			var ret = Model.prototype.constructor.apply(this, arguments);
			this.postCreate && this.postCreate(options);

			this._recorded = {};
			this.set('record-change', false);

			return ret;
		}, 

		_isRecordingChanges:null,
		_recorded:null,

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
			// this._mattributes = {};
			this.changed = {};
			this.src = null;
			return Model.prototype.clear.apply(this, arguments);
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
			var clone = Model.prototype.clone.apply(this, arguments);
			for(var attr in clone.attributes) {
				if(clone.attributes[attr] instanceof MongooseModel) {
					clone.attributes[attr] = clone.attributes[attr].clone();
				}
				if(clone.attributes[attr] instanceof SagaCollection) {
					clone.attributes[attr] = clone.attributes[attr].clone({models:true});
				}
			}
			return clone;
		}
		
	});


	_.extend(MongooseModel.prototype, ModelEvents(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaAction(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaPropertiesDefinition(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaSetter(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaSync(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaValidation(MongooseModel));
	_.extend(MongooseModel.prototype, ModelSchemaGetter(MongooseModel));
	

	return MongooseModel;
});