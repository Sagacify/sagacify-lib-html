define([
	'dojo/_base/declare', 
	'./ViewController', 
	'./revealViewController/RevealFrontViewController', 
	'./revealViewController/RevealRearViewController', 
	'dojox/mobile/View', 
	'dojo/_base/window',
	'dojo/on'], 
	
	function(declare, ViewController, RevealFrontViewController, RevealRearViewController, View, win, on) {
	
	return declare('saga.RevealViewController', [ViewController], {
		
		viewController: null,
		
		revealFrontViewController: null,
		
		revealRearViewController: null,
		
		isRevealed: null,
				
		containerView: null,
		
		constructor: function(args) {

		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.overflow = "hidden";
			var me = this;

			if(!this.revealFrontViewController){
				this.revealFrontViewController = new RevealFrontViewController({viewController:viewController, frame:me.frame});
			}
			
        	this.containerView = new View({style:"height:"+this.frame.height+"px; width:"+this.frame.width*0.75+"px;"});//246
    		this.containerView.placeAt(this.domNode);

        	this.isRevealed = true;
        	
        	this.revealFrontViewController.placeAt(this.containerView.domNode);
        	this.revealFrontViewController.on("revealButtonPressed", function(args){
        		if(me.isRevealed)
        			me.unrevealStart();
        		else {
        			me.revealStart();
        		}
        	});
        	
        	this.containerView.on("afterTransitionOut", function(){
        		if(me.isRevealed) {
	        		me.unrevealEnd();
	        	}
				else
					me.revealEnd();
			});
        	
		},
		
		setViewController: function(viewController){
			this.revealFrontViewController.setFrontViewController(viewController);
		},
		
		setRevealRearViewController: function(revealRearViewController){
			if(!revealRearViewController) {
				revealRearViewController = new RevealRearViewController({parent:this});
			}
			revealRearViewController.domNode.style.position = "absolute";
			revealRearViewController.placeAt(this.domNode, "first");
			on(revealRearViewController, "frontViewControllerSelected", function(frontViewController){
				me.setCurrentFrontViewController(frontViewController);
			});
			this.revealRearViewController = revealRearViewController;
		},
		
		revealStart: function() {
			this.containerView.domNode.style.overflow = "";
        	this.containerView.performTransition(null, 1, "reveal", null);	
		},
		
		revealEnd: function() {
			this.containerView.domNode.style.left = "0px";
			this.containerView.domNode.style.display = "";
			this.isRevealed = true;
			this.onRevealEnd.apply(this, []);
		},
		
		unrevealStart: function() {
			this.containerView.performTransition(null, -1, "reveal", null);
			this.onUnrevealStart.apply(this, []);
		},
		
		unrevealEnd: function() {
			this.containerView.domNode.style.left = this.frame.width*0.75+"px";
	        this.containerView.domNode.style.overflow = "hidden";
	        this.containerView.domNode.style.display = "";
	        this.isRevealed = false;
		},
		
		onRevealEnd: function(){
			
		},
		
		onUnrevealStart: function(){
			
		}
			
	});
});
