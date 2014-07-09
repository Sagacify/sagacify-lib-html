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

		return function(jsonSchema, parent, attribute, override){
			if ('doc' in jsonSchema && 'doc' in jsonSchema) {
				return new MongooseSchema({schema:jsonSchema, parent:parent, subPath:attribute, override:override});
			}

			if (is.Array(jsonSchema)) {
				return new MongooseArraySchema({content:jsonSchema[0], parent:parent, subPath:attribute, override:override})
			}

			return new MongoosePrimitiveSchema({schema:jsonSchema, parent:parent, subPath:attribute, override:override});
		}


	}
});
