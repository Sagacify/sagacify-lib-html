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
		
		swipeEnabled: true,
		
		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.overflow = "hidden";
			var me = this;

			if(!this.revealFrontViewController){
				var frame = this.getFrame();
				this.revealFrontViewController = new RevealFrontViewController({viewController:this.viewController, frame:this.frame});
			}
			
        	this.containerView = new View({style:"height:"+this.frame.height+"px; width:"+this.frame.width+"px;"});//246
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
			
			domClass.add(this.containerView.domNode, "global");
        	domClass.add(this.containerView.domNode, "swipeme");
        	this.containerView.domNode.style.zIndex = 1;
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
			this.revealRearViewController = revealRearViewController;
		},
		
		revealStart: function(){
			var me = this;
			$('.swipeme').animate({left: 0}, 800, 'easeOutQuint', function(){me.revealEnd()});
		},
		
		revealEnd: function() {
			this.isRevealed = true;
			this.onRevealEnd.apply(this, []);
		},
		
		unrevealStart: function() {
			this.onUnrevealStart.apply(this, []);
			var me = this;
			$('.swipeme').animate({left: this.frame.width*0.75}, 800, 'easeOutQuint', function(){me.unrevealEnd()});
		},
		
		unrevealEnd: function() {
	        this.isRevealed = false;
		},
		
		onRevealEnd: function(){
			
		},
		
		onUnrevealStart: function(){
			
		},
		
		startup: function(){
			var swiped = $('.swipeme'),
                max = Math.floor(this.frame.width*0.75),
                check = 0,
                positionL,
	            me = this;
	         
	        //Warning: remove line "cancelEvent(event);" from drag method of hammer.js code to work properly with dojo animations 
	        swiped.on('drag', function (event) {
	        	if(this.swipeEnabled){
	                event.preventDefault();
	                positionL = Math.floor(swiped.position().left);
	                if(event.direction == 'right' && positionL < max){
	                    swiped.css({
	                        "left": event.distance
	                    });
	                }
	                else if(event.direction == 'left' && positionL != 0){
	                    swiped.css({
	                        "left": max - event.distance
	                    });
	                }
	            }
	        });
	        
	        swiped.on('dragend', function (event) {
				if(this.swipeEnabled){
	                event.preventDefault();
	                swiped.offset().left < max/2?me.revealStart():me.unrevealStart();
	            }
	        });
	
			swiped.on('swipe', function (event) {
				if(this.swipeEnabled){
	                event.preventDefault();
	                if(event.direction == 'right')
	                    me.unrevealStart();
	                else if(event.direction == 'left')
	                    me.revealStart();
				}
	        });
	       
	        
		},
		
		enableSwipe: function(enabled){
			this.swipeEnabled = enabled;
		}
			
	});
});
