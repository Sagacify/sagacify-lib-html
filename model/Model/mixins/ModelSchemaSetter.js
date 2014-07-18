define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

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
				this.set('record-change', false);

				this.recordCollectionsChanges(true);
				this._isRecordingChanges = true;
			},


			stopRecordingChange: function(){
				this.set('record-change', false);

				this.recordCollectionsChanges(false);
				this._isRecordingChanges = true;
			},

			resetRecord: function(){
				this.set('record-change', false);
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
				this.set('record-change', true, {record:false});
				if (!(attribute in this._recorded)) {
					this._recorded[attribute] = [];
				};
				this._recorded[attribute].push(raw);
			},



			// @pre attribute in this.mongooseSchema
			setMSchemaAttribute: function(attribute, raw, options){

				var currentValue = this.get(attribute);
				if (currentValue != undefined) {
					if (this._isACollectionAttribute(attribute)) {
						currentValue.set(raw);
						this.trigger('change:'+attribute, this, raw);
						return;
					};
					if (this._isAModelAttribute(attribute)) {
						if (_.isString(raw)) {
							currentValue.set('_id',raw);	
						} else {
							currentValue.set(raw);	
						}
						this.trigger('change:'+attribute, this, raw);
						return;
					};
				};

				if (this._isADateAttribute(attribute)) {
					raw = new Date(raw);
				};

				return Backbone.Model.prototype.set.apply(this, [attribute, raw, options]);
			},


			__existSetterForAttribute: function(attribute){
				if (!_.isString(attribute)) {
					return false
				};
				var setter = attribute.asSetter();
				return (setter in this) && (_.isFunction(this[setter]));
			},

			set: function SGSetter(attribute, raw, options){
				options = _.defaults(options||{}, {
					record:true,
					setterForce:false
				});

				if (!options.setterForce &&  this.__existSetterForAttribute(attribute)) {
					return this[attribute.asSetter()](raw, options);
				};

				if (this.isRecordingChanges() && options.record) {
					this.recordChange(attribute, raw);
				};

				if(attribute && attribute.isString()){
					if (attribute in this.mongooseSchema) {
						return this.setMSchemaAttribute(attribute, raw, options);
					} else {
						if(is.Object(raw)){
							//Check mpath attributes
							for(var key in raw){
								this.set(attribute+"."+key, raw[key]);
							}
						}						
					}

					//Custom attributes
					return  Backbone.Model.prototype.set.apply(this, [attribute, raw, options]);
				};

				if(attribute && attribute.isObject()){
					return this.batchSet(attribute, options);
				};


				//Custom attributes
				return  Backbone.Model.prototype.set.apply(this, [attribute, raw, options]);
			},


			batchSet: function(dict, options){

				if(dict instanceof SagaModel){
					return Backbone.Model.prototype.set.apply(this, [dict.toJSON(), options]);
				}

				var specialKeys = [];

				_.each(dict, function(value, attribute){
					if (value != undefined) {
						var currentVal = this.get(attribute);
						if (this._isARelationship(attribute)) {
							specialKeys.push(attribute);	
						};
					};
				}, this);

				for (var i = 0; i < specialKeys.length; i++) {
					//process special attributes
					this.set(specialKeys[i], dict[specialKeys[i]])

					//Remove from primitive dict
					delete dict[specialKeys[i]]
				};

				//Process simple attributes
				// Backbone.Model.prototype.set.apply(this, [dict, options]);
				_.each(dict, function(value, attribute){
					this.set(attribute, value, options);
				}, this);
				this.trigger('batch-update', this.changed);
				
				return this;
			},	
			
		}
	}


});