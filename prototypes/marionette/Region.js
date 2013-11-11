define(['backbone.marionette'], function(){
	_.extend(Backbone.Marionette.Region.prototype, {
		showOnRender: function(parentLayout, view, doNotKeep){
			if(parentLayout.isRendered()){
				this.show(view);
			}
			else{
				var me = this;
				parentLayout.on('render:first', function(){
					me.show(view);
				});
			}
		}
	});
});