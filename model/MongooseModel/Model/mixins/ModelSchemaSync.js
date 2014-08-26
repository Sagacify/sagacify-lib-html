define([
	'saga/validation/ValidateFormat',
	'saga/model/MongooseModel/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			_generateUrl: function(){
				return  is.Function(this.url)?this.url():this.url;
			},

			url: function(options){
				if (this.custom_url) {
					return this.custom_url;
				};
				if(!this._id && this.slug || options && options.slug){
					if (this.urlRoot.endsWith("/")) {
						return this.urlRoot + this.slug;
					} else {
						return this.urlRoot+"/"+this.slug;
					}
				}
				else{
					if (!this.urlRoot && !this.collection) {
						this.urlRoot = '/api/'+this.mongooseSchema.getCollectionName()+"/";
					};
					return Backbone.Model.prototype.url.apply(this, arguments);
				}
			},

			save: function(attributesToInclude, options){
				options = _.defaults(options||{}, {
					schemaSerialization:false,
					attributeToKeep:attributesToInclude,
					recordedChanges:false,					
				});

				options.attrsToValidate = attributesToInclude;

				options.recordedChanges && this.stopRecordingChange();

				if (options.recordedChanges) {
					var success =  options.success;
					options.success = function(model, resp, options){
						success && success(model, resp, options);
						if (options.recordedChanges) {
							model.resetRecord();
							model.startRecordingChange();
						};
					}

				};


				return Backbone.Model.prototype.save.apply(this, [undefined, options]);
			},


			destroy: function(){
				var deferred = Backbone.Model.prototype.destroy.apply(this, arguments);

				var me = this;
				deferred && deferred.done(function (res) {
					me.trigger('sync:destroy');
				});

				return deferred;
			},

			fetch: function(attr, data, options){
				if(is.String(attr)){


					var url = this._generateUrl();

					if(!url.endsWith('/')){
						url += '/';
					}
					var promise = SGAjax.ajax({
						url: url+attr,
						type: 'GET',
						data: data
					});

					if(options && options.merge){
						var me = this;
						promise.done(function(result){
							me[attr] = result;
						});
					}

					return promise;
				}
				else{
					return Backbone.Model.prototype.fetch.apply(this, arguments);
				}
			},
			
			toJSON: function(options){

				options =_.defaults(options||{}, {
					schemaSerialization:false, 
					notmpath:undefined, 
					attributeToKeep:null,
					recordedChanges:false,
				});

				if (options.recordedChanges) {
					options.attributeToKeep = _.keys(this.recordedChanges())
				};


				var json = null;
				if (options.schemaSerialization) {
					json = this.JSONFromSchema(options);
				} else {
					json = this._JSONFromAttr(options);	
				}

				if (options.attributeToKeep) {
					json = _.pick(json, options.attributeToKeep)
				};

				if ('record-change' in json) {
					delete json['record-change'];
				};

				return json;
			},

			//First version, json from attributes
			_JSONFromAttr: function(options){
				if(this._isId){
					return this._id;
				}
				var json;
				if(options.notmpath !== true)
					json = Backbone.Model.prototype.toJSON.apply(this, arguments);
				else
					json = _.clone(this._mattributes||{});

				childToJSON = function(parent){
					for(var attr in parent){
						if(parent[attr] && typeof parent[attr].toJSON == "function"){
							var val = parent[attr].toJSON(options);
							if(parent[attr] instanceof SagaModel){
								if(val && !val.isEmpty()){
									parent[attr] = val;
								}
								else{
									delete parent[attr];
								}
							}
							else{
								parent[attr] = val;
							}
						}
						else if(is.Object(parent[attr])||is.Array(parent[attr])){
							childToJSON(parent[attr]);
						}
					}
				}
				childToJSON(json);
				return json;				
			},


			JSONFromSchema: function(options){
				options = _.defaults(options||{}, {
					schemaFormat:undefined
				})

				if (!options.schemaFormat) {
					return this.JSONFromSchema({schemaFormat:this.mongooseSchema});
				};

				// put id only
				if (options.schemaFormat instanceof app.MongoosePrimitiveSchema) {
					if (this.isNew()) {
						//Full format
						var expandedResult = this.JSONFromSchema({schemaFormat:this.mongooseSchema});
						if (expandedResult.keys().length) {
							return expandedResult;
						};
						return undefined;
					};
					return this._id;
				};



				var outputJSON = {};
				var attributes = options.schemaFormat.getAttributes();

				if (options.schemaFormat.isASemiEmbedded()) {
					attributes = _.pick(attributes, '_id')
				};				

				for(var attribute in attributes){

					var subSchema = attributes[attribute];
					var currentValue = this.get(attribute, {lazyCreation:false});

					if (currentValue != undefined) {
						if (is.Object(currentValue) && 'JSONFromSchema' in currentValue) {
							var value = currentValue.JSONFromSchema({schemaFormat:subSchema});
							//Collection or model or embedded schema
							(value != undefined) && (outputJSON[attribute] = value);
							continue;
						};
						//Primitive case
						outputJSON[attribute] = currentValue;
					};
				};

				return outputJSON;
			},


		}
	}


});