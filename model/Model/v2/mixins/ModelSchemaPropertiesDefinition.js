define([
	'saga/validation/ValidateFormat',
	'./../../../Collection',
	'../../../../types/validateType',
	'../../../../ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

			defineSchemaProperties: function(){
				if(!this.schema)
					return;

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
						if(attr == '__t' && (typeof this.__tIsValid != "function" || !this.__tIsValid(value))){
							return;
						}
						return this.set(attr, value);
					};
				};

				var getAction = function(action){
					return function(){
						return function(args, options){
							return this.do.apply(this, [action, args, options]);
						};
					};
				};

				var properties = {id: {get:get("_id")}};

				var me = this;
				this.schema.tree.keys().forEach(function(key){
					if(key in me)
						key = "_"+key;
					properties[key] = {get: get(key), set:set(key)};

					if(key.contains(".")){
						var attr = key.split(".")[0];
						properties[attr] = {get: mget(attr)};
					}
				});

				this.schema.virtuals.keys().forEach(function(key){
					if(key in me)
						key = "_"+key;
					properties[key] = {get: get(key), set:set(key)};
					if(key.contains(".")){
						var attr = key.split(".")[0];
						properties[attr] = {get: mget(attr)};
					}
				});

				this.schema.actions.keys().forEach(function(key){
					if(key in me)
						key = "_"+key;
					properties[key] = {get: getAction(key)};
				});

				Object.defineProperties(this, properties);
			},
			
		}		
	}


});