define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/Alert',
	'saga/widgets/mobile/NumPad',
	'dojo/dom-construct',
	'dojo/on',
	'saga/widgets/mobile/LoadingBar',
	'dojo/_base/fx'], 
	
	function(declare, ViewController, Alert, NumPad, domConstruct, on, LoadingBar, fx) {
	
	return declare('saga.ApplicationViewController', [ViewController], {
		
		alert: null,
		
		numPad: null,
		
		mask: null,	
		
		constructor: function(args) {
			Window = this;
		},	
		
		postCreate: function() {
			this.inherited(arguments);
		},
		
		showAlert: function(){
			if(!this.alert){
				this.mask = domConstruct.create("div", {style:"background:rgba(0,0,0,0.4);z-index:2;position:absolute;top:0px;left:0px;width:"+this.domNode.clientWidth+"px;height:"+this.domNode.clientHeight+"px"}, this.domNode);
				var alert = new Alert();
				alert.placeAt(this.domNode);
				this.alert = alert;
				var me = this;
				$('.modalView a').click(function() {
					me.dismissAlert();
	        	});
	        	on(this.mask, "click", function(evt){
	        		me.dismissAlert();
	        	});
			}
			this.mask.style.display = "";
			this.alert.domNode.style.display = "";
			$('.modalView').fadeTo(500, 1);
		},
		
		dismissAlert: function(){
			var me = this;
			this.mask.style.display = "none";
			$('.modalView').fadeTo(500, 0, function(){
				me.alert.domNode.style.display = "none";
			});
		},
		
		presentNumPad: function(){
			if(this.numPadVisible)
				return;
			this.numPad.domNode.style.display = "";
			this.numPad.performTransition(null, 1, "revealv", null);
		},
		
		dismissNumPad: function(){
			if(!this.numPadVisible)
				return;
			this.numPad.performTransition(null, -1, "revealv", null);
		},
		
		presentLoadingBar: function(){
			var me = this;
			/*if(this.loadingBar.status == "loading" || this.loadingBar.status == "transitionToLoading" || this.loadingBar.status == "loadingToDismiss"){
				this.loadingBar.counter
				return;	
			}*/
			this.loadingBar.counter++;
			console.log("loading: "+this.loadingBar.counter);
			if(this.loadingBar.counter > 1)
				return;
			//this.loadingBar.performTransition(null, -1, "revealv", null);
			//this.loadingBar.status = "transitionToLoading";
			if(this.currentPresentLoadingBarAnimation)
				return;
			if(this.currentPresentDismissBarAnimation){
				this.currentPresentDismissBarAnimation.stop();
				this.currentPresentDismissBarAnimation = null;
				return;
			}
			
			this.loadingBar.domNode.style.display = "";
			this.loadingBar.domNode.style.opacity = 1;
			this.loadingBar.domNode.style.top = "-50px";
			this.currentPresentLoadingBarAnimation = fx.animateProperty({
				node:me.loadingBar.domNode,
				duration:200,
				properties:{
					top:0
				},
				onEnd: function(){
					//me.loadingBar.domNode.style.display = "";
					//me.loadingBar.domNode.style.top = "0px";
					/*if(me.loadingBar.status == "loadingToDismiss")
						me.dismissLoadingBar();
					else*/
				//		me.loadingBar.status = "loading";
					me.currentPresentLoadingBarAnimation = null;
				}
			}).play();
		},
		
		dismissLoadingBar: function(){
			this.loadingBar.counter--;
			console.log("unloading: "+this.loadingBar.counter);
			if(this.loadingBar.counter > 0)
				return;
			
			/*if(this.loadingBar.status == "loaded" || this.loadingBar.counter > 0)
				return;
			if(this.loadingBar.status == "transitionToLoading")
				this.loadingBar.status = "loadingToDismiss";
			else{*/
			if(this.currentPresentDismissBarAnimation)
				return;
			
			var me = this;
			this.currentPresentDismissBarAnimation = fx.fadeOut({
				node:me.loadingBar.domNode,
				onEnd:function(){
					me.loadingBar.domNode.style.display = "none";
					//me.loadingBar.status = "loaded";
					console.log("end fadeout")
					me.currentPresentDismissBarAnimation = null;
				}
			}).play();
			//}
		},
		
		startup: function(){
			this.numPad = new NumPad();
			this.numPad.domNode.style.top = this.frame.height+"px";
			this.numPad.domNode.style.left = "0px";
			this.numPad.domNode.style.position = "absolute";
			this.numPad.domNode.style.display = "none";
			this.numPad.placeAt(this.domNode);
			this.numPadVisible = false;
			var me = this;
			this.numPad.on("afterTransitionOut", function(){
				if(!me.numPadVisible){
					me.numPad.domNode.style.display = "";
					me.numPad.domNode.style.top = (me.domNode.clientHeight-me.numPad.domNode.clientHeight)+"px";
					me.numPad.domNode.style.left = "0px";
					me.numPadVisible = true;
				}
				else{
					me.numPad.domNode.style.top = me.domNode.clientHeight+"px";
					me.numPadVisible = false;
				}
			});
			
			var loadingBar = new LoadingBar();
			loadingBar.setWidth(this.frame.width);
			loadingBar.domNode.style.position = "absolute";
			loadingBar.domNode.style.display = "none";
			loadingBar.domNode.style.zIndex = 100;
			loadingBar.status = "loaded";
			loadingBar.counter = 0;
			loadingBar.placeAt(this.domNode);
			this.loadingBar = loadingBar;
			var me = this;
			/*this.loadingBar.on("afterTransitionOut", function(){
				me.loadingBar.domNode.style.display = "";
				me.loadingBar.domNode.style.top = "0px";
				if(me.loadingBar.status == "loadingToDismiss")
					me.dismissLoadingBar();
				else
					me.loadingBar.status = "loading";
			});*/
		}

	});
});