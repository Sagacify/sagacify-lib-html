define([
	'backbone',
	'./mixins/ModelSchemaPropertiesDefinition'
], function (
	Backbone,
	ModelSchemaPropertiesDefinition
	) {

	var SagaModel = Backbone.Model.extend({

		constructor: function(attributes, options){
			options = _.defaults(options||{}, {
				automaticGetterAndSetter:false,
			});
			
			Backbone.Model.prototype.constructor.apply(this, arguments);			

			if (options.automaticGetterAndSetter) {
				if (attributes) {
					this._generateGetSetForAttributes(_.keys(attributes));
				};
			};
		}, 
	});

	_.extend(SagaModel.prototype, ModelSchemaPropertiesDefinition(SagaModel));

	return SagaModel;
});