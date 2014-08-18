define([
], function () {
	return function(SagaModel){
		return {

			__existGetterForAttribute: function(attribute){
				if (!_.isString(attribute)) {
					return false
				};
				var getter = attribute.asGetter();
				return (getter in this) && (_.isFunction(this[getter]));
			},

			get: function(attribute, options){
				options = _.defaults(options||{}, {
					getterForce:false
				});

				if (!options.getterForce &&  this.__existGetterForAttribute(attribute)) {
					return this[attribute.asGetter()](attribute, options);
				};

				return  Backbone.Model.prototype.get.apply(this, arguments);

			},
		}
	}


});