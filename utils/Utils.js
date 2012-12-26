define([
	'dojo/_base/declare',
	'dojo/on', 
	'dojo/has'],
	function(declare, on, has) {
		declare('saga.Utils', null, {

			constructor: function(args){
				
			},

			postCreate: function() {
				
			}
		});
		
		saga.Utils.svgSupport = function(){
			var support = has("android")?has("android")>=3:true;
			return support;
		};
		
		saga.Utils.detectOS = function(){
			if(navigator.userAgent.match(/iPhone|iPad|iPod/i))
				return "iOS";
			if(navigator.userAgent.match(/Android/i))
				return "Android";
			if(navigator.userAgent.match(/BlackBerry/i))
				return "BlackBerry";
			if(navigator.userAgent.match(/Opera Mini/i))
				return "Opera";
			if(navigator.userAgent.match(/IEMobile/i))
				return "IE";
			return null;
		};
		
		saga.Utils.detectWebOrNative = function(){
			if(document.URL.indexOf('http://') == -1 && document.URL.indexOf('https://') == -1)
				return "Native";
			else
				return "Web";
		};
		
		return saga.Utils;
});
