define(['dojo/_base/declare', '../NavigationController', 'dojox/mobile/ToolBarButton', 'dojo/Evented'], function(declare, NavigationController, ToolBarButton, Evented) {
	
	return declare('saga.RevealFrontViewController', [NavigationController, Evented], {
		
		_revealButton: null,
		
		constructor: function(args) {

		},		
		
		postCreate: function() {
			this.inherited(arguments);
			
			this.domNode.style.overflow = "hidden";
			
			this._addRevealButton();
		},
		
		_updateNavigationBar: function() {
			this.inherited(arguments);
			if(this._viewControllers.length == 1)
				this._addRevealButton();
		},
		
		_addRevealButton: function(){
			this._revealButton = new ToolBarButton({label:"Reveal"});
			this._revealButton.placeAt(this.navigationBar.domNode);
			var me = this;
			this._revealButton.on("click", function(args){
				me.emit("revealButtonPressed", {});
			});
		}
			
	});
});
