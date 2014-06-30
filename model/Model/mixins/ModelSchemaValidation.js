define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {

			isValidationRef: false,

			validationRef: function(){
				var instance = this;
				var path = "";
				while(instance){
					if(instance.isValidationRef){
						break;
					}
					var parent = instance.parent;
					instance = parent.instance;
					if(!instance){
						instance = this;
						path = "";
						break;
					}
					if(path&&parent.path)
						path = "."+path;
					path = parent.path+path;
				}
				return {instance:instance, path:path};
			},

			sgValidate: function(attr) {
				if(is.Array(attr)) {
					var me = this;
					var success = true;
					attr.forEach(function (attr) {
						success &= me.sgValidate(attr).success;
					});
					return {
						success: success
					};
				}
				if(!attr) {
					for(var attr in this.treeVirtuals()) {
						var val = this.sgValidate(attr);
						if(!val.success)
							return val;
					}
					return {
						success: true
					};
				}
				var validationRef = this.validationRef();
				var model = validationRef.instance;
				var path = validationRef.path;
				var pathAttr = path ? path + '.' + attr : attr;
				var url = model.url instanceof Function ? model.url() : model.url;
				var method;
				if(model.isNew()) {
					method = "post";
				}
				else {
					method = "put";
				}
				if(url.endsWith('/')) {
					url = url.substring(0, url.length-1);
				}
				if(url && App.server_routes[method][url] && App.server_routes[method][url].validation && App.server_routes[method][url].validation[pathAttr]) {
					return {
						success: ValidateFormat.validate(attr, this[attr], App.server_routes[method][url].validation[pathAttr] || [])
					};
				}
				else {
					return {
						success:
						true
					};
				}
			},			
			
		}
	}


});