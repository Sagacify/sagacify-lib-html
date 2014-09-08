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

			//Memory management
			// this.__constructorOptions = options;
			// window.instances[this.cid] = this;

			Backbone.Model.prototype.constructor.apply(this, arguments);

			if (options.automaticGetterAndSetter) {
				if (attributes) {
					this._generateGetSetForAttributes(_.keys(attributes));
				}
			}
		},

		clear: function(){
			this.stopListening();
			this.collection && (this.collection = null);
			this._SGISCLEARED = true;
			// debugger
			// window.instances[this.cid] = "cleared";

			return Backbone.Model.prototype.clear.apply(this, arguments);
		},
	});

	_.extend(SagaModel.prototype, ModelSchemaPropertiesDefinition(SagaModel));
	_.extend(SagaModel.prototype, ModelGetter(SagaModel));
	_.extend(SagaModel.prototype, ModelSetter(SagaModel));

	


	return SagaModel;
});