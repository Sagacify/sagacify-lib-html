define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/NavigationController', 
	'dojox/mobile/ToolBarButton', 
	'dojo/Evented',
	'dojo/on'], 
	
	function(declare, NavigationController, ToolBarButton, Evented, on) {
	
	return declare('saga.RevealFrontViewController', [NavigationController, Evented], {
		
		_revealButton: null,
		
		constructor: function(args) {

		},		
		
		postCreate: function() {
			this.inherited(arguments);
			
			this.domNode.style.overflow = "hidden";
			this.domNode.style.background = "white";
			
			this._addRevealButton();			
		},
		
		_updateNavigationBar: function() {
			this.inherited(arguments);
			if(!this._customNavBar){
				if(this._viewControllers.length == 1)
					this._addRevealButton();	
			}
			else{
				if(this._viewControllers.length == 1){
					this.navigationBar.revealButton.style.display = "";
					var me = this;
					on(this.navigationBar.revealButton, selectEvent, function(args){
						args.preventDefault();
						me.emit("revealButtonPressed", {});
					});
				}
				else
					this.navigationBar.revealButton.style.display = "none";
			}
		},
		
		_addRevealButton: function(){
			if(!this._customNavBar){
				this._revealButton = new ToolBarButton({label:"Reveal"});
				this._revealButton.placeAt(this.navigationBar.domNode);
				var me = this;
				this._revealButton.on(selectEvent, function(args){
					args.preventDefault();
					me.emit("revealButtonPressed", {});
				});	
			}
			else{
				
			}
		}
			
	});
});
