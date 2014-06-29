define([
	'backbone',
	'./ModelBase',
	'./ModelClass'

], function (Backbone, ModelBase, ModelClass) {

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
		}		
	});
	_.extend(SagaModel.prototype, ModelBase(SagaModel));

	return SagaModel;
});