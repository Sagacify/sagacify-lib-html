define([
	'dojo/_base/declare'
], function(declare) {
	return declare('saga.NotificationCenterHelp', null, {

		parentWidget: null,

		constructor: function(args) {
			this.inherited(arguments);
		},

		/*activate: function(tutorialName) {
			//this.tutorials = [];
			//debugger;
		},*/

		register: function(widget) {
			this.parentWidget = widget;
		}
	});
});