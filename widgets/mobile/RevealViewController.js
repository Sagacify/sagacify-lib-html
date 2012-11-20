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
		
		viewControllers: null,
		
		revealFrontViewControllers: null,
		
		revealRearViewController: null,
		
		isRevealed: null,
		
		currentFrontViewController: null,
		
		containerView: null,
		
		constructor: function(args) {
			//this.revealFrontViewControllers = args.viewControllers;
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.overflow = "hidden";
			var me = this;
			var revealFrontViewControllers = this.revealFrontViewControllers;
			if(!revealFrontViewControllers){
				revealFrontViewControllers = [];
				dojo.forEach(this.viewControllers, function(viewController, i){
					var revealFrontViewController = new RevealFrontViewController({viewController:viewController, frame:me.frame});
					revealFrontViewControllers.push(revealFrontViewController);
				});	
				this.revealFrontViewControllers = revealFrontViewControllers;
			}
			
        	this.containerView = new View({style:"height:"+this.frame.height+"px; width:"+this.frame.width*0.75+"px;"});//246
    		this.containerView.placeAt(this.domNode);

        	this.isRevealed = true;
        	
        	dojo.forEach(this.revealFrontViewControllers, function(revealFrontViewController, i){
        		revealFrontViewController.placeAt(me.containerView.domNode);
        		//revealFrontViewController.setFrame({height:460});
        		if(i != 0) {
        			revealFrontViewController.domNode.style.display = "none";
        		}
        		else
        			me.currentFrontViewController = revealFrontViewController;
        			
        		revealFrontViewController.on("revealButtonPressed", function(args){
	        		if(me.isRevealed)
	        			me.unrevealStart();
	        		else {
	        			me.revealStart();
	        		}
	        	});
        	});
        	
        	this.containerView.on("afterTransitionOut", function(){
        		if(me.isRevealed) {
	        		me.unrevealEnd();
	        	}
				else
					me.revealEnd();
			});
        	
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
		
		setCurrentFrontViewController: function(frontViewController) {
			this.currentFrontViewController.domNode.style.display = "none";
			frontViewController.domNode.style.display = "";
			this.currentFrontViewController = frontViewController;
		},
		
		revealStart: function() {
			if(dojo.isChrome) {
				//this.containerView.domNode.style.left = "320px";
				//this.containerView.domNode.style.left = this.frame.width*0.75+"px";
			}
			this.containerView.domNode.style.overflow = "";
        	this.containerView.performTransition(null, 1, "reveal", null);	
		},
		
		revealEnd: function() {
			this.containerView.domNode.style.left = "0px";
			this.containerView.domNode.style.display = "";
			//this.containerView.domNode.style.overflow = "";
			this.isRevealed = true;
		},
		
		unrevealStart: function() {
			this.containerView.performTransition(null, -1, "reveal", null);
			//handle problem with chrome and reveal animation when overflow is not hidden
			if(dojo.isChrome) {
				/*var me = this;
				me.timeout = setTimeout(function handleOverflow(){
					var m = win.doc.defaultView.getComputedStyle(me.containerView.domNode, '')["-webkit-transform"];
					if(m && m.indexOf("matrix") === 0){
						var arr = m.split(/[,\s\)]+/);
						var posX = arr[4];
						if(posX > 100)
							me.containerView.domNode.style.overflow = "hidden";
					}
					me.timeout = setTimeout(handleOverflow, 1);
				}, 1);*/
			}
		},
		
		unrevealEnd: function() {
			//this.containerView.domNode.style.left = "246px";
			this.containerView.domNode.style.left = this.frame.width*0.75+"px";
	        this.containerView.domNode.style.overflow = "hidden";
	        this.containerView.domNode.style.display = "";
	        this.isRevealed = false;
		}
			
	});
});
