define([], function(){
	
	return {

		outletsBind: false,


		bindOutlets: function(){

			if (!this.outletsBind) {
				return;
			};

			var me = this;

			$('[data-sgoutlet]', this.el).each(function(index){
				var $node = $(this);
				this.dataset["sgoutlet"+me.uid] = $node.data().sgoutlet
				delete this.dataset["sgoutlet"];
			});


			$('[data-sgoutlet'+this.uid+']', this.el).each(function(index){
				outletName = this.dataset['sgoutlet'+me.uid];
				me.bindOutlet(this, outletName);
			});

		},

		bindOutlet: function(node, outletName){
			
			if (this.getOutlets()[outletName]) {
				//already binded
				return;
			};
			this.getOutlets()[outletName] = $("[data-sgoutlet"+this.uid+"="+outletName+"]",this.el)
		},

		getOutlets: function(){
			if (!this.outlets) {
				this.outlets = {};
			};
			return this.outlets;
		}
	}
});