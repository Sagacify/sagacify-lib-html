define([
	'saga/validation/ValidateFormat',
	'saga/model/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax'
], function (ValidateFormat, SagaCollection, is, SGAjax) {
	return function(SagaModel){
		return {
			do: function(action, args, options){
				var actionUrl = this._generateUrl() + '/' + action;
				
				if(args instanceof Array) {
					argsObj = {};
					if(this.schema.actions[action]){
						if (this.schema.actions[action].args) {
							this.schema.actions[action].args.forEach(function(arg, i){
								argsObj[arg] = args[i];
							});
						}
					}
					args = argsObj;
				}

				var deferred = SGAjax.ajax({
					type: 'POST',
					url: actionUrl,
					data: args || {}
				});

				var me = this;
				deferred.done(function(data){
					me.trigger('action', args);
					me.trigger('action:'+action, args);
				});

				return deferred;
			},
			
		}
	}


});