define([
	'saga/types/validateType',
], function (is) {
	return function(SagaModel){
		return {

			_generateGetSetForAttributes: function(attributes){
				for (var i = attributes.length - 1; i >= 0; i--) {
					this._generateGetSetForAttribute(attributes[i])
				};
			},

			_generateGetSetForAttribute: function(attribute){
				var descriptor = {};
				descriptor.get = this._defineGetter(attribute);
				var setter = this._defineSetter(attribute) 
				if (setter) {
					descriptor.set = setter;	
				};
				try {
					Object.defineProperty(this, attribute, descriptor);	
				} catch(e){
					debugger
					throw 'error with property '+attribute;
				}
			},

			_defineGetter : function(attribute){
				var getterName = "get"+attribute.capitalize();
				if(is.Function(this[getterName]) && this[getterName]){
					return this[getterName];
				}

				return function(){
					return this.get(attribute);
				};
			},

			_defineSetter : function(attribute){

				var setterName = "set"+attribute.capitalize();
				if(is.Function(this[setterName]) && this[setterName]){
					return this[setterName];
				}

				return function(value){
					return this.set(attribute, value);
				}
			},
	
		}		
	}

});