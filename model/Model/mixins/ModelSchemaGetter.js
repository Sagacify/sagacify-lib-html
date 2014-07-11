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

			//Sub set of objects containing only collection
			getAllCollections: function(){
				var attrs = this.mongooseSchema.getAttributes()
				var res = {};
				for(attribute in attrs){
					if (attrs[attribute] instanceof app.MongooseArraySchema && !attrs[attribute].contentIsPrimitiveArray()) {
						res[attribute] = this[attribute];
					};
				}
				return res;
			},

			//Sub set of objects containing only collection
			getAllModel: function(){

			}

			
		}
	}


});