define([
	'backbone',
	'./mixins/ModelSchemaPropertiesDefinition',
	'./mixins/ModelGetter',
	'./mixins/ModelSetter',
], function (
	Backbone,
	ModelSchemaPropertiesDefinition,
	ModelGetter,
	ModelSetter
	) {

	var SagaModel = Backbone.Model.extend({

		constructor: function(attributes, options){
			options = _.defaults(options||{}, {
				automaticGetterAndSetter:false,
			});

			this.__constructorOptions = options;
			
			Backbone.Model.prototype.constructor.apply(this, arguments);

			if (options.automaticGetterAndSetter) {
				if (attributes) {
					this._generateGetSetForAttributes(_.keys(attributes));
				}
			}
		},

		// clone: function(options) {
		// 	var options = _.clone(_.extend(this.__constructorOptions, options));
		// 	return new this.constructor(this.attributes, options);
		// },


	});

	_.extend(SagaModel.prototype, ModelSchemaPropertiesDefinition(SagaModel));
	_.extend(SagaModel.prototype, ModelGetter(SagaModel));
	_.extend(SagaModel.prototype, ModelSetter(SagaModel));

	


	return SagaModel;
});