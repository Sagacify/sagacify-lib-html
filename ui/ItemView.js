define([
	'backbone.marionette',
	'./Mixin',
	'./mixins/ModelBindMixin',
	'./mixins/ActionsBindMixin',
	'./mixins/OutletBindMixin', 
	'./mixins/ModelBindMixinV2'

], function (Marionette, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin, ModelBindMixinV2) {
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
			this.__bindActions();
			this.__createAllBinders();

			return Marionette.ItemView.prototype.bindUIElements.apply(this, arguments);
		},

		unbindUIElements: function(){
			this.__destroyAllBinder();
			this.__unbindActions();
			return Marionette.ItemView.prototype.unbindUIElements.apply(this, arguments);
		}
		
	});

	_.extend(ItemView.prototype, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin, ModelBindMixinV2);

	return ItemView;
});