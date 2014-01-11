define([
	'backbone.marionette',
	'./Mixin',
	'./ModelBindMixin'
], function (Marionette, Mixin, ModelBindMixin) {

	// prototype of the base Marionette Layout
	var Layout = Marionette.Layout.extend({

		constructor: function(){
			this._handleFirstRender();
			this.model = this.getModel();
			Marionette.Layout.prototype.constructor.apply(this, arguments);
		},

		render: function (options) {
			this.template = this.get_Template(options||this.model||this.data||this.options);
			 
			var elems = this.parseFirstElement();

			Marionette.Layout.prototype.render.apply(this, arguments);
			
			this.reinjectFirstElement(elems);

			this.bindToModel();
		},

		getModel: function(){
			return null;
		},

		showChildOnRender: function(region, childClass, childArgs, childName, keepOnRegionClose){
			keepOnRegionClose = true
			childName = (/*childName == null ||*/ childName === true) ? 'childView' : childName;

			// if(region.currentView && region.currentView._keepOnRegionClose){
			// 	delete region.currentView;
			// }

			if(!childName || !(this[childName] instanceof childClass)) {
				var view = new childClass(childArgs||{});
				// if(keepOnRegionClose){
				// 	view._keepOnRegionClose = true;
				// 	delete region.currentView;
				// }

				if(childName){
					this[childName] = view;
				}

				region.showOnRender(this, view);

				return view;
			}
			else{
				// if(this[childName]._keepOnRegionClose){
				// 	var render = this[childName].render;
				// 	this[childName].render = function(){};
				// 	region.showOnRender(this, this[childName]);
				// 	this[childName].render = render;
				// }
				// else{
					console.log('bouh', this[childName].cid)
					region.showOnRender(this, this[childName]);
				//}
				return this[childName];
			}
		}

	});

	_.extend(Layout.prototype, Mixin, ModelBindMixin);

	return Layout;
});