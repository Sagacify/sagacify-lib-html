define([
	'dojo/_base/declare',
	'dojo/dom-attr'
], function(declare, domAttr) {
	return declare('saga.Help', null, {

		tutorialDescriptions: null,

		postCreate: function() {
			this.inherited(arguments);
			if(this.tutorialDescriptions && Object.keys(this.tutorialDescriptions).length) {
				NotificationCenterHelp.register(this);
			}
		},

		activate: function() {
			var widget;
			var i = 0;
			for(var step in this.tutorialDescriptions) {
				widget = $('[data-dojo-attach-point="' + step + '"]')[0];
				domAttr.set(widget, 'data-intro', this.tutorialDescriptions[step]);
				domAttr.set(widget, 'data-step', i);
				i++;
			}
		}

	});
});