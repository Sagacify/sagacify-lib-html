define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController', 
	'saga/widgets/mobile/revealViewController/RevealFrontViewController', 
	'saga/widgets/mobile/revealViewController/RevealRearViewController', 
	'dojox/mobile/View', 
	'dojo/_base/window',
	'dojo/on',
	'dojo/has',
	'dojo/dom-class'], 
	
	function(declare, ViewController, RevealFrontViewController, RevealRearViewController, View, win, on, has, domClass) {
	
	return declare('saga.RevealViewController', [ViewController], {
		
		viewController: null,
		
		revealFrontViewController: null,
		
		revealRearViewController: null,
		
		isRevealed: null,
				
		containerView: null,
		
		constructor: function(args) {
			if(has("android")){
				this._loadCss("saga/widgets/mobile/Assets/css/reveal-fix.css");
			}
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.overflow = "hidden";
			var me = this;

			if(!this.revealFrontViewController){
				var frame = this.getFrame();
				this.revealFrontViewController = new RevealFrontViewController({viewController:this.viewController, frame:this.frame});
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
			
			domClass.add(this.containerView.domNode, "global");
        	
		},
		
		setViewController: function(viewController){
			this.revealFrontViewController.setFrontViewController(viewController);
		},
		
		showViewController: function(viewController){
			this.setViewController(viewController);
			this.revealStart();
		},
		
		setRevealRearViewController: function(revealRearViewController){
			if(!revealRearViewController) {
				revealRearViewController = new RevealRearViewController({parent:this});
			}
			revealRearViewController.domNode.style.position = "absolute";
			revealRearViewController.placeAt(this.domNode, "first");
			/*on(revealRearViewController, "frontViewControllerSelected", function(frontViewController){
				me.setCurrentFrontViewController(frontViewController);
			});*/
			this.revealRearViewController = revealRearViewController;
		},
		
		revealStart: function() {
			this.containerView.domNode.style.overflow = "";
        	this.containerView.performTransition(null, 1, "reveal", null);	
        	//this.containerView.domNode.style["-webkit-transform"] = "translate3d(-50%,0px,0px)";
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
