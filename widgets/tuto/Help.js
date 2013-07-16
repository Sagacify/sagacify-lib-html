define([
	'dojo/_base/declare',
	'dojo/dom-attr'
], function(declare, domAttr) {
	return declare('saga.Help', null, {

		tutorialDescriptions: null,

		postCreate: function() {
			this.inherited(arguments);
			if(this.tutorialDescriptions && Object.keys(this.tutorialDescriptions).length) {
				if (NotificationCenterHelp.parentWidget && NotificationCenterHelp.parentWidget.desactivate){
					NotificationCenterHelp.parentWidget.desactivate();
				}
				NotificationCenterHelp.register(this);
			}
		},

		activate: function(offset) {
			var widget;
			var i = offset?1+offset:1;
			for(var step in this.tutorialDescriptions) {
				widget = $('[data-dojo-attach-point="' + step + '"]')[0];
				if(widget){
					domAttr.set(widget, 'data-intro', this.tutorialDescriptions[step]);
					domAttr.set(widget, 'data-step', i);
					i++;
				}
			}
		},

		desactivate: function(){
			var widget;
			for(var step in this.tutorialDescriptions) {
				widget = $('[data-dojo-attach-point="' + step + '"]')[0];
				if(widget){
					domAttr.remove(widget, 'data-intro');
					domAttr.remove(widget, 'data-step');
				}
			}
		}

	});
});