define([
	'../../types/validateType'
	], function(is){
	
	var Klass = {};
	
	//Class methods
	Klass.generateEmbeddeds = function(schema){
		this.getEmbeddedSchema();
		
		for(var key in schema.doc.tree){
			this.generateEmbeddedForSchema(schema.doc.tree[key]);
		}
	}

	Klass.generateEmbeddedForSchema = function(subSchema){
		if (is.Array(subSchema)) {
			return this.generateEmbeddedCollection(subSchema);
		};
		//no other case for the moment
	}

	Klass.generateEmbeddedCollection = function(subSchema){
		if (is.Array(subSchema)) {
			debugger
		};
	}

	Klass.getEmbeddedSchema = function(){
		if (!this._embeddedsSchema) {
			this._embeddedsSchema = {};
		};
		return this._embeddedsSchema;
	}

	Klass.getEmbeddedCollection = function(){
		if (!this._embeddedsCollection) {
			this._embeddedsCollection = {};
		};
		return this._embeddedsCollection;
	}

	return Klass;

});
