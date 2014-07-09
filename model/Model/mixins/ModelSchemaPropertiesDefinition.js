define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

			_defineActionFunction: function() {

				var properties = {};
				var me = this;
				var getAction = function(action){
					return function(){
						return function(args, options){
							return this.do.apply(this, [action, args, options]);
						};
					};
				};
				this.mongooseSchema.getActions().keys().forEach(function(key){
					if(key in me)
						key = "_"+key;
					properties[key] = {get: getAction(key)};

				});

				Object.defineProperties(this, properties);
			},


			_defineAttributesProperties: function(){

				var me = this;
				var properties = {};

				var get = function(attr){
					return function(){
						return this.get(attr);
					};
				};

				var mget = function(attr){
					return function(){
						return this._mattributes[attr];
					};
				};

				var set = function(attr){
					return function(value){
						// if(attr == '__t' && (typeof this.__tIsValid != "function" || !this.__tIsValid(value))){
						// 	return;
						// }
						return this.set(attr, value);
					};
				};

				var properties = {id: {get:get("_id")}};
				var me = this;
				this.schemaAttributes().forEach(function(key){
					if(key in me)
						key = "_"+key;
					properties[key] = {get: get(key), set:set(key)};

					if(key.contains(".")){
						var attr = key.split(".")[0];
						properties[attr] = {get: mget(attr)};
					}
				});
				
				Object.defineProperties(this, properties);
			},

			schemaAttributes: function(){
				return this.mongooseSchema.getAttributes().keys();
			},


			defineSchemaProperties: function(){
				if(!this.mongooseSchema)
					return;
				this._defineAttributesProperties();
				this._defineActionFunction();
			},
			
			handleMattributes: function(){
				this._mattributes = {};
				var me = this;
				var handleMattribute = function(attr){
					me.on("change:"+attr, function(model, value, options){
						me._mattributes._set(attr, value);
					});
				}

				for(var attr in this.schema.tree){
					handleMattribute(attr);
				}
				for(var attr in this.schema.virtuals){
					handleMattribute(attr);
				}
			},

			
		}		
	}


});