define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/Alert',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ViewController, Alert, domConstruct, on) {
	
	return declare('saga.ApplicationViewController', [ViewController], {
		
		alert: null,
		
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
		}

	});
});