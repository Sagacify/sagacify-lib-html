define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin'
], function (Marionette, Mixin, ModelBindMixin) {
	var ItemView = Marionette.ItemView.extend({

		constructor: function(){
			Marionette.ItemView.prototype.constructor.apply(this, arguments);
		},

		render: function(options){
			if(!this.template)
				this.template = this.get_Template(options||this.rawModel||this.model||this.data);

			Marionette.ItemView.prototype.render.apply(this, arguments);

			this.reinjectFirstElement();
			
			this.bindToModel();
		}

	});

	_.extend(ItemView.prototype, Mixin, ModelBindMixin);

	return ItemView;
});