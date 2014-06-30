define([], function(){
	
	return {

		actionsBind: false,

		bindActions: function(){
			if (!this.actionsBind) {
				return;
			};

			var me = this;
			$('[data-sgaction]', this.el).each(function(index){
				var $node = $(this);
				this.dataset["sgaction"+me.uid] = $node.data().sgaction
				delete this.dataset["sgaction"];
			});


			$('[data-sgaction'+this.uid+']', this.el).each(function(index){
				
				var data = this.dataset['sgaction'+me.uid];
				
				var actionsInfo = data && data.split(":");
					
				if (!actionsInfo || actionsInfo.length != 2) {
					throw "Error for 'data-sgaction' for the widget";
					return;
				};

				me.bindNodeToAction(this, actionsInfo[0], actionsInfo[1]);
			});			


		},

		bindNodeToAction: function(node, event, action){
			if (!this[action]) {
				throw "Define method for action:"+action;
			};
			var me = this;
			this.listenTo($(node), event, function(evt){
				me[action](evt);
			} )
		}
	}
});