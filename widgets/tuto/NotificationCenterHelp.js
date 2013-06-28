define([
	'dojo/_base/declare'
], function(declare) {
	return declare('saga.NotificationCenterHelp', null, {

		tutorials: null,

		constructor: function(args) {
			this.inherited(arguments);
			this.tutorials = {};
		},

		activate: function(tutorialName) {
			//this.tutorials = [];
			//debugger;
		},

		register: function(widget, tutorialName) {
			if(!this.tutorials[tutorialName]) {
				this.tutorials[tutorialName] = [];
			}
			this.tutorials[tutorialName].push(widget);
		},

		getTutorialWidgets: function(tutorialName) {
			if(!this.tutorials[tutorialName]) {
				this.tutorials[tutorialName] = [];
			}
			return this.tutorials[tutorialName];
		}
	});
});