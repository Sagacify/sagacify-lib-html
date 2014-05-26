define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin',
	'./ActionsBindMixin',
	'./OutletBindMixin'
], function (Marionette, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin) {

	// prototype of the base Marionette Layout
	var Layout = Marionette.Layout.extend({

		constructor: function(){
			this._handleFirstRender();		
			this.uid = String.guid();
			Marionette.Layout.prototype.constructor.apply(this, arguments);
		},

		render: function (options) {

			this.template = this.get_Template(options||this.rawModel||this.model||this.data||this.options);
			
			Marionette.Layout.prototype.render.apply(this, arguments);
			
			this.reinjectFirstElement();
			
		},

		bindUIElements: function(){

			this.bindToModel();
			this.bindOutlets();
			this.bindActions();

			return Marionette.Layout.prototype.bindUIElements.apply(this, arguments);
		},

		showChildOnRender: function(region, childClass, childArgs, childName, keepOnRegionClose){

			childName = (childName === true) ? 'childView' : childName;

			if(!childName || !(this[childName] instanceof childClass)) {
				var view = new childClass(childArgs||{});
				if(childName){
					this[childName] = view;
				}
				else{
					this[childName] = null;
				}

				region.showOnRender(this, view);

				return view;
			} else {
				region.showOnRender(this, this[childName]);
				return this[childName];
			}
		}

	});

	_.extend(Layout.prototype, Mixin, ModelBindMixin, ActionsBindMixin, OutletBindMixin);

	return Layout;
});