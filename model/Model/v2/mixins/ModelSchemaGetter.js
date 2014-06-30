define([
	'saga/validation/ValidateFormat',
	'./../../../Collection',
	'../../../../types/validateType',
	'../../../../ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			get: function(attribute){

				var getterName = "get"+attribute.capitalize();
				if(is.Function(this[getterName]) && this[getterName] != arguments.callee.caller)
					return this[getterName]();

				var value = Backbone.Model.prototype.get.apply(this, arguments);

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