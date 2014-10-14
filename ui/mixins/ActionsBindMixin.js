define([], function(){
	
	return {

	/*	actionsBind: false,


		__defaultSGAction : 'click',

		__bindActions: function(){
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
				me.__bindAction(this, trigger, method);
			});			
		},


		__bindAction: function(node, trigger, methodName){
			if (!this[methodName]) {
				throw "Define method for action:"+methodName;
			};

			var me = this;
			this.listenTo($(node), trigger, function(evt){
				me[methodName](evt, node);
			});

			if (methodName in this.__getActionNodes()) {
				var existingNode = this.__getActionNodes()[methodName].node;
				this.__getActionNodes()[methodName].node = $(existingNode.get().concat([node]));
			} else {
				this.__getActionNodes()[methodName] = {
					node : $(node),
					trigger : trigger
				};
			}
		}, 

		__unbindActions: function(){
			if (!this.actionsBind) {
				return;
			};

			_.each(this.__getActionNodes(), function(value, key){
				this.stopListening(value.node, value.trigger);
			}, this);
			this.__actionNodes = {};
		},

		__getActionNodes: function(){
			if (!this.__actionNodes) {
				this.__actionNodes = {};
			};
			return this.__actionNodes;
		},	
		*/
	}
});
