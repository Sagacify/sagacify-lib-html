define(['backbone.marionette'], function(){

	var RegionCopy = {
		close: Backbone.Marionette.Region.prototype.close
	}

	_.extend(Backbone.Marionette.Region.prototype, {
		showOnRender: function(parentLayout, view, doNotKeep){
			if(parentLayout.sgisRendered()){
				this.show(view);
			}
			else{
				var me = this;
				parentLayout.on('render:first', function(){
					me.show(view);
				});
			}
		},

		showSafe: function(view){
			this.ensureEl();

    //var isViewClosed = view.isClosed || _.isUndefined(view.$el);

    //var isDifferentView = view !== this.currentView;

    //if (isDifferentView) {
      //this.close();
    //}

    if(!view.sgisRendered())
    view.render();

    //if (isDifferentView || isViewClosed) {
      this.open(view);
    //}
    
    this.currentView = view;

    //Backbone.Marionette.triggerMethod.call(this, "show", view);
    //Backbone.Marionette.triggerMethod.call(view, "show");
		}
	});
});