define([], function(){
	
	return {

		actionsBind: false,


		__defaultSGAction : 'click',

		bindActions: function(){
			if (!this.actionsBind) {
				return;
			};

			this._putUids('sgaction');

			var me = this;
			$('[data-sgaction-'+this.uid+']', this.el).each(function(index){
				
				var data = $(this).attr('data-sgaction-'+me.uid)
				var actionsInfo = data && data.split(":");
				if (!actionsInfo || !actionsInfo.length) {
					throw "Error for 'data-sgaction' for the widget "
					return;
				};

				var method, trigger;
				if (actionsInfo.length == 1) {
					method = actionsInfo[0]
					trigger = this.__defaultSGAction;
				} else {
					method = actionsInfo[1];
					trigger = actionsInfo[0];
				}
				me.bindNodeToAction(this, trigger, method);
			});			


		},

		bindNodeToAction: function(node, trigger, methodName){
			if (!this[methodName]) {
				throw "Define method for action:"+methodName;
			};

			var me = this;
			this.listenTo($(node), trigger, function(evt){
				me[methodName](evt);
			});

			this.getActionNodes()[methodName] = node;

		}, 

		getActionNodes: function(){
			if (!this.__actionNodes) {
				this.__actionNodes = {};
			};
			return this.__actionNodes;
		},	
	}
});