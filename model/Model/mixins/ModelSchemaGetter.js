define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			get: function(attribute, options){
				options = _.defaults(options||{}, {
					lazyCreation:true
				});


				var getterName = "get"+attribute.capitalize();
				if(is.Function(this[getterName]) && this[getterName] != arguments.callee.caller)
					return this[getterName]();

				var value = Backbone.Model.prototype.get.apply(this, arguments);

				if (!options.lazyCreation) {
					return value;
				};

				if(!value){
			
					var schemaElement = this.mongooseSchema[attribute];
					if ( attribute != '_id' && (schemaElement instanceof app.MongoosePrimitiveSchema) && schemaElement.isModelReference()) {
						this.set(attribute, {});
						value = Backbone.Model.prototype.get.apply(this, arguments);						
					};
					
					if((schemaElement instanceof app.MongooseArraySchema) && is.Object(schemaElement._rawContentSchema)){
						this.set(attribute, []);
						value = Backbone.Model.prototype.get.apply(this, arguments);

						//hum
						if(schemaElement._rawContentSchema.single)
							value.add({});
					}
				}
				return value;
			},
			
		}
	}


});