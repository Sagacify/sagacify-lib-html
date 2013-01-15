define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/ScrollableViewController',
	'dojo/dom-construct',
	'dojo/on'], 
	
	function(declare, ScrollableViewController, domConstruct, on){

	return declare("saga.Logger", [ScrollableViewController], {
		
		logString: "",
		
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			this.domNode.style.zIndex = 100;
			this.domNode.style.background = "white";
		},
		
		attachToApp: function(){
			var button = domConstruct.create("button", {id:"debuggerButton", innerHTML:"D", style:"position:absolute;z-index:100;width:30px;background:red"}, Window.domNode);
			var me = this;
			on(button, selectEvent, function(evt){
				Window.presentViewController(me);
			}); 
		},
		
		log: function(msg){
			var now = new Date();
			this.logString += "<font color=gray size='2'>" + now + ": </font><br>" + msg + "<br/>";
			this.scrollableView.containerNode.innerHTML = this.logString;
		}
		
	});
});
