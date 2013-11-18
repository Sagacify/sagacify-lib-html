define([
	'backbone.marionette'
], function () {

	_.extend(Backbone.Marionette.View.prototype, {

		bindUIElements: function () {
			if(this.ui) {
				// store the ui hash in _uiBindings so they can be reset later
				// and so re-rendering the view will be able to find the bindings
				if(!this._uiBindings) {
					this._uiBindings = this.ui;
				}

				// get the bindings result, as a function or otherwise
				var bindings = _.result(this, "_uiBindings");

				// empty the ui so we don't have anything to start with
				this.ui = {};

				// bind each of the selectors
				var selectorNames = Object.keys(bindings);
				var len = selectorNames.length;
				var selector;
				var i;
				while(len--) {
					i = selectorNames[len];
					selector = bindings[i];
					this.ui[i] = $(selector, this.$el);
				}
			}
		}

	});

});