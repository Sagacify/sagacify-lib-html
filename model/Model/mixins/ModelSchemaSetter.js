define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

			_schemaSetModelAttribute: function(attribute, raw){
				var mSchema = this.mongooseSchema[attribute];
				var docColl = Backbone.Model.prototype.get.apply(this, [attribute]);
				if(docColl){
					docColl.set(raw);
					return undefined;
				}
				return new (mSchema.getModelClass())(
					raw||{}, 
					{
						url: this._generateUrl()+'/'+attribute, 
						parent:{
							instance:this, 
							path:attribute
						}
					});
			},

			_schemaSetCollectionAttribute: function(attribute, raw){

				var mSchema = this.mongooseSchema[attribute];
				var docColl = Backbone.Model.prototype.get.apply(this, [attribute]);
				if(docColl){
					if (mSchema.contentIsPrimitiveArray()) {
						return raw;	
					} else {
						docColl.set(raw);
						return undefined;
					}
				}

				var Collection = mSchema.getCollectionClass()
				if (!Collection) {
					return raw
				};
				var collectionUrl = this._generateUrl()+'/'+attribute;
				var collection = new Collection(raw||[], {
						parent:{
							instance:this, 
							path:attribute
						}
					});
				collection.url = collectionUrl;
				return collection;
			},	


			_schemaSetter: function (attribute, raw){

				if(raw instanceof SagaModel || raw instanceof SagaCollection || attribute == '_id'){
					return raw;
				}

				var mSchema = this.mongooseSchema[attribute];
				var schemaElement = this.schema.tree[attribute] || this.schema.virtuals[attribute];	
				if(mSchema){

					if(mSchema instanceof app.MongooseArraySchema){
						return this._schemaSetCollectionAttribute(attribute, raw);
					}

					if ((mSchema instanceof app.MongoosePrimitiveSchema) && mSchema.freeType()) {
						return raw;
					};

					if (is.Object(raw) && ((mSchema instanceof app.MongoosePrimitiveSchema) && mSchema.isModelReference())) {
						return this._schemaSetModelAttribute(attribute, raw);
					}

					if (mSchema instanceof app.MongoosePrimitiveSchema) {
						//handle as primitive
						if(mSchema.type == "Date"){
							raw = new Date(raw);
						}
						// take trace of initial attributes for revert
						if(this.schema.tree[attribute] && !(attribute in this._originalAttributes)){
							this._originalAttributes[attribute] = raw;
						}
						return raw;
					};

					debugger
					return raw;

					// } else {

					// 	//handle as primitive
					// 	if(mSchema.type == "Date"){
					// 		raw = new Date(raw);
					// 	}
					// 	// take trace of initial attributes for revert
					// 	if(this.schema.tree[attribute] && !(attribute in this._originalAttributes)){
					// 		this._originalAttributes[attribute] = raw;
					// 	}
					// 	return raw;
					// }
				} else {

					//if the attribute is the first part of a composed attribute and the server has sent the value as object, e.g.: waited attr is user.name and server has sent user:{name:"..."} 
					if(is.Object(raw)){
						for(var key in raw){
							this.set(attribute+"."+key, raw[key]);
						}
					}

					//Strange case...
					if (raw && raw.force) {
						return raw;
					};

					return undefined;
				}
			},

			set: function SGSetter(attribute, raw){

				if (attribute == '_id' && raw.isString) {
					this.cid = raw;
				};

				// ??
				if(arguments.callee.caller == Backbone.Model.prototype.save){
					return true;
				}

				// ??
				if(raw && raw.add === true && !is.Object(attribute)){
					console.log(attribute)
					console.log(raw)
					throw new Error('String cannot be directly added.');
					return;
				}

				if(attribute && attribute.isString()){

					var setterName = "set"+attribute.capitalize();
					if(is.Function(this[setterName]) && this[setterName]!=arguments.callee.caller){
						return this[setterName](attribute, raw);
					}									

					var value = this._schemaSetter(attribute, raw);
					if(value === undefined){
						return;
					} else{
						return Backbone.Model.prototype.set.apply(this, [attribute, value]);
					}
				}
				
				if(attribute && attribute.isObject()){
					return this.batchSet(attribute);
				}
				return Backbone.Model.prototype.set.apply(this, arguments);
			},


			batchSet: function(dict){

				if(dict instanceof SagaModel){
					return Backbone.Model.prototype.set.apply(this, [dict.toJSON()]);
				}
				var args = Array.apply(null, arguments);

				dict = dict.clone();
				if(dict._id){
					this.set("_id", dict._id);
					delete dict._id;
				}

				var me = this;
				dict.keys().forEach(function(key){
					var value = me._schemaSetter(key, dict[key]);
					if(value === undefined){
						delete dict[key];	
					} else{
						dict[key] = value;
					}
				});
				return Backbone.Model.prototype.set.apply(this, [dict]);
			},	
			
		}
	}


});