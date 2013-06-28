define([
	'dojo/_base/declare',
	'dojo/dom-attr'
], function(declare, domAttr) {
	return declare('saga.Help', null, {

		linkedTutorials: null,

		tutorialDomElement: null,

		postCreate: function() {
			this.inherited(arguments);
			if(this.linkedTutorials && Object.keys(this.linkedTutorials).length) {
				var me = this;
				this.getTutorials(function(item) {
					//NotificationCenterHelp.register(me, tutorialName);
				});
			}
			//NotificationCenterHelp.register(this, 'createNode');
		},

		activate: function(tutorialName, i) {
			for(var i = 0; i < this.linkedTutorials[tutorialName].length; i++) {
				domAttr.set(this.linkedTutorials[tutorialName][i][0], 'data-intro', this.generateMessage(tutorialName, i));
				domAttr.set(this.linkedTutorials[tutorialName][i][0], 'data-step', i);
			}
			/*domAttr.set(this.domNode, 'data-intro', this.generateMessage(tutorialName));
			//domAttr.set(this.domNode, 'data-position', this.generateMessage());
			domAttr.set(this.domNode, 'data-step', i);*/
		},

		generateMessage: function(tutorialName, i) {
			return this.linkedTutorials[tutorialName][i][1];
		},

		/*addTutorials: function(tutorials) {
			this.linkedTutorials = tutorials;
		},*/

		getTutorials: function(callback) {
			for(var tutorialName in this.linkedTutorials) {
				callback(tutorialName);
			}
		}

	});
});