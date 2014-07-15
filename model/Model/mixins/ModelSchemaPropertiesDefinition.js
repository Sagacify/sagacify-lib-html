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
						return this.set(attr, value);
					};
				};

				var properties = {id: {get:get("_id")}};
				var me = this;
				this.schemaAttributes().forEach(function(key){
					me._generateGetSetForAttribute(key)
					// properties[key] = {};
					// properties[key].get = me._defineGetter(key);
					// var setter = me._defineSetter(key) 
					// if (setter) {
					// 	properties[key].set = setter;	
					// };
				});
				// Object.defineProperties(this, properties);
			},

			_generateGetSetForAttribute: function(attribute){
				// properties[attribute] = {};
				var descriptor = {};
				descriptor.get = this._defineGetter(attribute);
				var setter = this._defineSetter(attribute) 
				if (setter) {
					descriptor.set = setter;	
				};
				Object.defineProperty(this, attribute, descriptor);
				// Object.defineProperties(this, properties);
			},

			_defineGetter : function(attribute){
				var getterName = "get"+attribute.capitalize();
				if(is.Function(this[getterName]) && this[getterName]){
					return this[getterName];
				}

				if(key.contains(".")){
					return function(){
						return this._mattributes[attribute];
					};							
				}

				return function(){
					return this.get(attribute);
				};
			},

			_defineSetter : function(attribute){
				if(key.contains(".")){
					return null;
				};

				var setterName = "set"+attribute.capitalize();
				if(is.Function(this[setterName]) && this[setterName]){
					return this[setterName];
				}

				return function(value){
					return this.set(attribute, value);
				}
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