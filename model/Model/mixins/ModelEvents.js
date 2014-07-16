define([], function () {

	// @pre trigger contains '.'
	function cutTrigger(trigger){
		res = {};
		var mPath = trigger.replace('change:','');
		res.submodelName = mPath.split('.')[0];
		res.subTrigger = 'change:'+mPath.replace(res.submodelName+'.', '');
		return res;
	};

	return function(SagaModel){
		return {

			__isMpathTrigger: function(trigger){
				return _.isString(trigger) && trigger.contains('.') && trigger.startsWith('change:')
			},


			on: function(trigger, callback, context){
				//Regex= change:XYZ.ABC
				if (this.__isMpathTrigger(trigger)) {
					var newTrigger = cutTrigger(trigger);
					var subModel = this[newTrigger.submodelName];
					if (subModel instanceof Backbone.Model) {
						subModel.on(newTrigger.subTrigger, callback, context);
						return;
					};
				};
				return Backbone.Model.prototype.on.apply(this, arguments);
			}, 

			off: function(trigger, callback, context){
				if (_.isString(trigger) && trigger.contains('.') && trigger.startsWith('change:')) {
					var newTrigger = cutTrigger(trigger);
					var subModel = this[newTrigger.submodelName];
					if (subModel instanceof Backbone.Model) {
						subModel.off(newTrigger.subTrigger, callback, context);
						return;
					};
				}
				return Backbone.Model.prototype.on.apply(this, arguments);
			}
		}
	}

});