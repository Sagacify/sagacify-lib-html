define([
	'backbone',
	'saga/types/validateType',
	'saga/model/MongooseModel/Model/Model',
	'saga/model/MongooseModel/Collection/Collection'

], function (
	Backbone, 
	is, 
	DefaultModel, 
	DefaultCollection 
) {

	return Backbone.Model.extend({

		initialize: function(options){
			this._parent = options.parent;
			this._subPath = options.subPath;

			this.generateCompliantOverride(options.override)

			Backbone.Model.prototype.initialize.apply(this, arguments);
		}, 


		generateCompliantOverride: function(override){
			function emptyFunction(){return {}};

			override = override || {model:{},collection:{}};

			//Model
			override.model = override.model||{};
			override.model.clazz = override.model.clazz||emptyFunction;
			override.model.instance = override.model.instance||emptyFunction;
			override.model.attrs = override.model.attrs||{};
			
			//Collection
			override.collection = override.collection||{};
			override.collection.instance = override.collection.instance||emptyFunction;
			override.collection.clazz = override.collection.clazz||emptyFunction;
			override.collection.attrs = override.collection.attrs||{};

			this._override = override;
		},

		getExtendsPath : function(){
			if (!this._parent) {
				return this.getModelName();
			};
			return this._parent.getExtendsPath()+"."+this._subPath;
		},

		showPath: function(){
			console.log("---->"+this.getExtendsPath());
		},

		setSuperSchema: function(superSchema){
			this._superSchema = superSchema;
		},

		getModelClass: function(){},

		getCollectionClass: function(){},

		defaultModelClass: function(){
			if (this._superSchema) {
				return this._superSchema.getModelClass();
			};

			return  DefaultModel
		},

		defaultCollectionClass: function(){
			if (this._superSchema) {
				return this._superSchema.getCollectionClass();
			};
			return  DefaultCollection
		},

		generateSubSchema: function(){
			
		}

	});
});
