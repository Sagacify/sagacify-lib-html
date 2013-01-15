define([
	'dojo/_base/declare',
	'saga/widgets/_Widget',
	'dojo/on', 
	'dojo/has'],
	function(declare, _Widget, on, has) {
		return declare('saga.NativeBridge', [_Widget], {

			constructor: function(args){
				
			},

			postCreate: function() {
				
			},
			
			callFromNativeLayer: function(method, argument){
				this.onCallFromNativeLayer.apply(this, [{method:method, argument:argument}])
			},
			
			callToNativeLayer: function(method, argument){
				var iframe = document.createElement("IFRAME");
			    iframe.setAttribute("src", "js-frame:"+method+":"+argument);
			    document.documentElement.appendChild(iframe);
			    iframe.parentNode.removeChild(iframe);
			    iframe = null;
			},
			
			onCallFromNativeLayer: function(){
				
			},
			
			infoFromNativeLayer: function(info){
				this.onInfoFromNativeLayerReceived.apply(this, [info])
			},
		
			infoToNativeLayer: function(info){
				var iframe = document.createElement("IFRAME");
			    iframe.setAttribute("src", "js-frame:"+info);
			    document.documentElement.appendChild(iframe);
			    iframe.parentNode.removeChild(iframe);
			    iframe = null;
			},
		
			onInfoFromNativeLayerReceived: function(){
				
			}
		
		});
});
