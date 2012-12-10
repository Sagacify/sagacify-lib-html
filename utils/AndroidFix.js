define([
	'dojo/_base/declare', 
	'dojo/has'],
	function(declare, has) {
		declare('saga.AndroidFix', null, {

			constructor: function(args){
				
			},

			postCreate: function() {
				
			}
		});
		
		saga.AndroidFix.simulateClick = function(node){
			if(has('android')){
				on(node, "touchend", function(evt){
				var touches = event.changedTouches,
  				first = touches[0],
  				type = "";
				var simulatedEvent = document.createEvent("MouseEvent");
				simulatedEvent.initMouseEvent("click", true, true, window, 1, 
                          first.screenX, first.screenY, 
                          first.clientX, first.clientY, false, 
                          false, false, false, 0/*left*/, null);
				
				if(node.clickEvent)
					node.dispatchEvent(simulatedEvent);
					event.preventDefault();
				});
				on(node, "touchstart", function(evt){
					me.createNewMailNode.clickEvent = true;
				});
				on(node, "touchmove", function(evt){
					me.createNewMailNode.clickEvent = false;
				});	
			}
		};
		
		return saga.AndroidFix;
});
