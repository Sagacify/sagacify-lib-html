define(['backbone.marionette'], function(){

	var ItemViewCopy = {
		constructor: Backbone.Marionette.ItemView.prototype.constructor,
		render: Backbone.Marionette.ItemView.prototype.render
	}

	_.extend(Backbone.Marionette.ItemView.prototype, {
		constructor: function(options){
			this._handleGoTo();
			this.options = options||{};
			for(var key in options){
				if(key in this){
					this[key] = options[key];
				}
			}
			return ItemViewCopy.constructor.apply(this, arguments);
		},

		render: function(){
			ItemViewCopy.render.apply(this, arguments);
			for(var key in this.goTo){
				var sel = key.split(" ")[1];
				$(sel, this.$el).filter("a").attr("href", App.router.aliases[this.goTo[key]]||this.goTo[key]);
			}
			$(this.el).i18n();
		},

		_handleGoTo: function(){
			this.events = this.events||{};
			var me = this;
			if(this.goTo){
				this.goTo.keys().forEach(function(key){
					me.events[key] = function(evt){
						if(app.layout.modalRegion)
							app.layout.modalRegion.hide();
						app.router.navigate(me.goTo[key]);
					}
				});
			}
		}
	});
});