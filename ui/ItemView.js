define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin'
], function (Marionette, Mixin, ModelBindMixin) {

	var ItemView = Marionette.ItemView.extend({

		constructor: function(){
			this.model = this.getModel();
			Marionette.ItemView.prototype.constructor.apply(this, arguments);
		},

		render: function(options){
			if(!this.template)
				this.template = this.get_Template(options||this.model||this.data);

			var elems = this.parseFirstElement();

			Marionette.ItemView.prototype.render.apply(this, arguments);

			this.reinjectFirstElement(elems);
			
			this.bindToModel();
		},

		getModel: function(){
			return null;
		}

	});

	_.extend(ItemView.prototype, Mixin, ModelBindMixin);

	return ItemView;
});