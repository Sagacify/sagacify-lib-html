define([
	'../../types/validateType',
	'./MongooseSchema',
	'./MongoosePrimitiveSchema',
	'./MongooseArraySchema',

], function (
	is,
	MongooseSchema,
	MongoosePrimitiveSchema, 
	MongooseArraySchema
) {
	return function(){

		app.MongooseSchema = MongooseSchema;
		app.MongoosePrimitiveSchema = MongoosePrimitiveSchema;
		app.MongooseArraySchema = MongooseArraySchema;

		return function(jsonSchema){
			if ('doc' in jsonSchema && 'doc' in jsonSchema) {
				return new MongooseSchema(jsonSchema);
			}

			if (is.Array(jsonSchema)) {
				return new MongooseArraySchema(jsonSchema[0])
			}

			return new MongoosePrimitiveSchema(jsonSchema);
		}


	}
});
