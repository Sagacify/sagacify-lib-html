define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			_generateUrl: function(){
				return  is.Function(this.url)?this.url():this.url;
			},

			// setUrl: function(customUrl){
			// 	this.customUrl = customUrl;
			// },

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
				})

				if(attributesToInclude instanceof Array){
					var json = this.toJSON(options);
					return this.save(_.pick(json, attributesToInclude), {patch:true});
				}

				return Backbone.Model.prototype.save.apply(this, arguments);
			},


			destroy: function(){
				var deferred = Backbone.Model.prototype.destroy.apply(this, arguments);

				var me = this;
				deferred.done(function (res) {
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
					notmpath:undefined
				});

				if (options.schemaSerialization) {
					return this.JSONFromSchema();
				};

				if(this._isId){
					return this._id;
				}
				var json;
				if(options.notmpath !== true)
					json = Backbone.Model.prototype.toJSON.apply(this, arguments);
				else
					json = _.clone(this._mattributes);

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


			JSONFromSchema: function(schemaFormat){
				if (!schemaFormat) {
					return this.JSONFromSchema(this.mongooseSchema);
				};

				// put id only
				if (schemaFormat instanceof app.MongoosePrimitiveSchema) {
					if (this.isNew()) {
						//Full format
						var expandedResult = this.JSONFromSchema(this.mongooseSchema);
						if (expandedResult.keys().length) {
							return expandedResult;
						};
						return undefined;
					};
					return this._id;
				};

				var outputJSON = {};
				var attributes = schemaFormat.getAttributes()
				for(var attribute in attributes){
					var subSchema = attributes[attribute];
					var currentValue = this.get(attribute, {lazyCreation:false});

					if (currentValue) {
						if (is.Object(currentValue) && 'JSONFromSchema' in currentValue) {
							var value = currentValue.JSONFromSchema(subSchema);
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