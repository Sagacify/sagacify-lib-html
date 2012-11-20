define(['dojo/_base/declare', '../NavigationController', 'dojox/mobile/ToolBarButton', 'dojo/Evented'], function(declare, NavigationController, ToolBarButton, Evented) {
	
	return declare('saga.RevealFrontViewController', [NavigationController, Evented], {
		
		_revealButton: null,
		
		constructor: function(args) {

		},		
		
		postCreate: function() {
			this.inherited(arguments);
			
			this.domNode.style.overflow = "hidden";
			
			this._revealButton = new ToolBarButton({label:"Reveal"});
			this._revealButton.placeAt(this.navigationBar.domNode);
			var me = this;
			this._revealButton.on("click", function(args){
				me.emit("revealButtonPressed", {});
			});
		},
		
		_updateHeaderBar: function() {
			this.inherited(arguments);
			if(this._viewControllers.length >= 2) {
				this._revealButton.domNode.style.display = "none";
			}
			else {
				this._revealButton.domNode.style.display = "";
			}
		}
			
	});
});
