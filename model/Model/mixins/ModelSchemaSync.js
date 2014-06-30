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

			url: function(options){
				if(!this._id && this.slug || options && options.slug){
					if (this.urlRoot.endsWith("/")) {
						return this.urlRoot + this.slug;
					} else {
						return this.urlRoot+"/"+this.slug;
					}
				}
				else{
					return Backbone.Model.prototype.url.apply(this, arguments);
				}
			},


			save: function(){
				if(arguments[0] instanceof Array){
					var fields = arguments[0];
					var json = this.toJSON();
					var partJson = {};
					fields.forEach(function(field){
						partJson[field] = json[field];
					});
					return this.save(partJson, {patch:true});
				}
				else{
					return Backbone.Model.prototype.save.apply(this, arguments);
				}
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
			
			toJSON: function(notmpath){
				if(this._isId){
					return this._id;
				}
				var json;
				if(notmpath !== true)
					json = Backbone.Model.prototype.toJSON.apply(this, arguments);
				else
					json = _.clone(this._mattributes);

				childToJSON = function(parent){
					for(var attr in parent){
						if(parent[attr] && typeof parent[attr].toJSON == "function"){
							var val = parent[attr].toJSON(notmpath);
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

		}
	}


});