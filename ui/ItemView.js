define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin',
	'./ActionsBindMixin',
	'./OutletBindMixin'


], function (Marionette, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin) {
	var ItemView = Marionette.ItemView.extend({

		constructor: function(){
			this.uid = String.guid();
			Marionette.ItemView.prototype.constructor.apply(this, arguments);
		},

		render: function(options){
			if(!this.template)
				this.template = this.get_Template(options||this.rawModel||this.model||this.data);

			Marionette.ItemView.prototype.render.apply(this, arguments);

			this.reinjectFirstElement();
		},

		bindUIElements: function(){

			this.bindToModel();
			this.bindOutlets();
			this.bindActions();

			return Marionette.ItemView.prototype.bindUIElements.apply(this, arguments);
		},

	});

	_.extend(ItemView.prototype, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin);

	return ItemView;
});