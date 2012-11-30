define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget', 
	'dojo/Evented', 
	'dojo/on', 
	'dojo/dom-construct', 
	'dojo/dom-class'], 
	function(declare, _Widget, Evented, View, on, domConstruct, domClass) {
	
	return declare('saga.Slider', [_Widget, Evented], {
		
		templateString: "<div style='left:10px;width:5px;height:200px;'></div>",
		
		constructor: function(args) {
			if(args) {
				
			}
		},
		
		postCreate: function() {
			
		},
		
		startup: function() {
			console.log("startup slider");
			var me = this;
			$('#'+this.domNode.id).slider({orientation:"vertical", range: "min", min: 0, max: 200, value: 100, slide: function( event, ui ) {
				me.emit("slide", {value:ui.value});
			}});
			
			var sliderButton = this.domNode.children[1];
			sliderButton.style.width = "15px";
			sliderButton.style.height = "15px";
			sliderButton.style.left = "-6px";			
		},
		
		setValue: function(value) {
			$('#'+this.domNode.id).slider({value: value});
		},
		
		getValue: function() {
			return $('#'+this.domNode.id).slider("value");
		}
		
	});
});