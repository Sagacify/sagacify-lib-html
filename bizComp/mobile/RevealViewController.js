define(['dojo', 'bizComp/_Widget', './revealView/RevealFrontViewController', './revealView/RevealRearViewController', 'dojox/mobile/View', 'dojo/_base/window'], function(dojo, _Widget, RevealFrontViewController, RevealRearViewController, View, win) {
	
	return dojo.declare('bizComp.RevealViewController', [_Widget], {
		
		viewControllers: null,
		
		revealFrontViewControllers: null,
		
		revealRearViewController: null,
		
		isRevealed: null,
		
		currentFrontViewController: null,
		
		containerView: null,
		
		constructor: function(args) {
			this.viewControllers = args.viewControllers;
			this.revealFrontViewControllers = args.viewControllers;
			this.revealRearViewController = args.revealViewController;
		},		
		
		postCreate: function() {
			this.domNode.style.overflow = "hidden";
			
			var revealFrontViewControllers = this.revealFrontViewControllers;
			/*dojo.forEach(this.viewControllers, function(viewController, i){
				var revealFrontViewController = new RevealFrontView({viewController:viewController});
				revealFrontViewControllers.push(revealFrontViewController);
			});*/
			
			if(!this.revealRearViewController) {
				this.revealRearViewController = new RevealRearViewController({parent:this});
			}
			this.revealRearViewController.domNode.style.position = "absolute";
			this.revealRearViewController.placeAt(this.domNode);
			
        	this.containerView = new View({style:"height:460px; width:246px;"});
    		this.containerView.placeAt(this.domNode);

        	var me = this;
        	this.isRevealed = true;
        	
        	dojo.forEach(this.revealFrontViewControllers, function(revealFrontViewController, i){
        		revealFrontViewController.placeAt(me.containerView.domNode);
        		revealFrontViewController.setFrame({height:460});
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
		
		setCurrentFrontViewController: function(frontViewController) {
			this.currentFrontViewController.domNode.style.display = "none";
			frontViewController.domNode.style.display = "";
			this.currentFrontViewController = frontViewController;
		},
		
		revealStart: function() {
			if(dojo.isChrome) {
				this.containerView.domNode.style.left = "320px";
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
				var me = this;
				me.timeout = setTimeout(function handleOverflow(){
					var m = win.doc.defaultView.getComputedStyle(me.containerView.domNode, '')["-webkit-transform"];
					if(m && m.indexOf("matrix") === 0){
						var arr = m.split(/[,\s\)]+/);
						var posX = arr[4];
						if(posX > 100)
							me.containerView.domNode.style.overflow = "hidden";
					}
					me.timeout = setTimeout(handleOverflow, 1);
				}, 1);
			}
		},
		
		unrevealEnd: function() {
			this.containerView.domNode.style.left = "246px";
	        this.containerView.domNode.style.overflow = "hidden";
	        this.containerView.domNode.style.display = "";
	        this.isRevealed = false;
		}
			
	});
});
