define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

			_schemaSetModelAttribute: function(attribute, raw, options){
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

			_schemaSetCollectionAttribute: function(attribute, raw, options){

				var mSchema = this.mongooseSchema[attribute];
				
				var docColl = this.get(attribute, {lazyCreation:false});

				// var docColl = Backbone.Model.prototype.get.apply(this, [attribute]);

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
						},
						url: collectionUrl
					});
				return collection;
			},	


			_schemaSetter: function (attribute, raw, options){

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


					return raw;

				} else {

					//if the attribute is the first part of a composed attribute and the server has sent the value as object, e.g.: waited attr is user.name and server has sent user:{name:"..."} 
					if(is.Object(raw)){
						for(var key in raw){
							this.set(attribute+"."+key, raw[key]);
						}
					}

					//Strange case...
					if (options && options.force) {
						return raw;
					};

					//Custom client attribute
					return raw;
				}
			},

			recordCollectionsChanges: function(record){
				var colSubSet = this.getAllCollections();
				for(var attribute in colSubSet){
					this.recordCollectionChanges(attribute, colSubSet[attribute], record);
				}
			},

			recordCollectionChanges: function(attribute, collection, record){
				if (record) {
					var me = this;
					this.listenTo(collection, 'add', function(addedModel){
						me.recordChange(attribute, {add:addedModel});
					});
					this.listenTo(collection, 'remove', function(deletedModel){
						me.recordChange(attribute, {remove:deletedModel});
					});
				} else {
					this.stopListening(collection);	
				}
			},

			startRecordingChange: function(){
				this.recordCollectionsChanges(true);
				this._isRecordingChanges = true;
			},


			stopRecordingChange: function(){
				this.recordCollectionsChanges(false);
				this._isRecordingChanges = true;
			},

			resetRecord: function(){
				var oldRecord = this._recorded;
				this._recorded = {}
				return oldRecord;
			}, 

			recordedChanges: function(){
				return this._recorded;
			},

			isRecordingChanges: function(){
				return !!this._isRecordingChanges;
			},

			recordChange: function(attribute, raw){
				// if (attribute == 'author.avatar') {
				// 	debugger
				// };
				if (!(attribute in this._recorded)) {
					this._recorded[attribute] = [];
				};
				this._recorded[attribute].push(raw);
			},

			set: function SGSetter(attribute, raw, options){
				options = _.defaults(options||{}, {
					record:true
				})

				if (this.isRecordingChanges() && options.record) {
					this.recordChange(attribute, raw);
				};

				// if (attribute == '_id' && raw.isString) {
				// 	this.cid = raw;
				// };

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

					var value = this._schemaSetter(attribute, raw, options);
					if(value === undefined){
						return;
					} else{
						return Backbone.Model.prototype.set.apply(this, [attribute, value, options]);
					}
				}
				
				if(attribute && attribute.isObject()){
					return this.batchSet(attribute, options);
				}
				return Backbone.Model.prototype.set.apply(this, arguments);
			},


			batchSet: function(dict, options){

				if(dict instanceof SagaModel){
					return Backbone.Model.prototype.set.apply(this, [dict.toJSON(), options]);
				}

				dict = dict.clone();
				if(dict._id){
					this.set("_id", dict._id, options);
					delete dict._id;
				}

				var me = this;
				dict.keys().forEach(function(key){
					var value = me._schemaSetter(key, dict[key], options);
					if(value === undefined){
						delete dict[key];	
					} else{
						dict[key] = value;
					}
				});
				
				var res =  Backbone.Model.prototype.set.apply(this, [dict, options]);

				this.trigger('batch-update', this.changed);
				
				return res;
			},	
			
		}
	}


});