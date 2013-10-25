define([
	'backbone.marionette',
], function (Marionette) {

	// prototype the base Marionette ItemView
	var ItemView = Marionette.ItemView.extend({

		modelBind: false,

		get_Template: function (data, settings) {
			return this._template ? _.template(this._template, data, settings) : this.template;
		},

		render: function(){
			Marionette.ItemView.prototype.render.apply(this, arguments);
			this.bindToModel();
		},

		bindToModel: function(){
			if(this.modelBind && this.model){
				this._modelBinder = new Backbone.ModelBinder();
				//custom spec
				if(this.modelBind.isObject()){
					this._modelBinder.bind(this.model, this.el, this.modelBind);
				}
				else{
					this._modelBinder.bind(this.model, this.el);
				}
			}
		}

	});

	return ItemView;
});