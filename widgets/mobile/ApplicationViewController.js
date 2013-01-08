define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/Alert',
	'saga/widgets/mobile/NumPad',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ViewController, Alert, NumPad, domConstruct, on) {
	
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
			if(!this.numPad){
				this.numPad = new NumPad();
				this.numPad.domNode.style.top = this.domNode.clientHeight+"px";
				this.numPad.domNode.style.left = "0px";
				this.numPad.domNode.style.zIndex = "2";
				this.numPad.domNode.style.position = "absolute";
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
			}
			this.numPad.domNode.style.display = "";
			this.numPad.performTransition(null, 1, "revealv", null);
		},
		
		dismissNumPad: function(){
			this.numPad.performTransition(null, -1, "revealv", null);
		},

	});
});