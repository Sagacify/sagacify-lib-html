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
		
		saga.Utils.isFirefox = function(){
			return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		};
		
		saga.Utils.svgSupport = function(){
			var support = has("android")?false:!window.uiDegradation;
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
			if (navigator.userAgent.match(/AppleWebKit/i)) {
				return "Safari";
			};
			return null;
		};
		
		saga.Utils.detectWebOrNative = function(){
			if(document.URL.indexOf('http://') == -1 && document.URL.indexOf('https://') == -1 && saga.Utils.detectOS()!=null && navigator.connection)
				return "Native";
			else
				return "Web";
		};
		
		saga.Utils.simulateEvent = function(node, evtName){
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(evtName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			node.dispatchEvent(evt);
		};
		
		saga.Utils.simulateClick = function(node){
			saga.Utils.simulateEvent(node, "click");	
		};

		saga.Utils.loadCss = function(path, id) {
			var e = document.createElement("link");
			e.href = path;
			e.type = "text/css";
			e.rel = "stylesheet";
			e.media = "screen";
			if(id)
				e.id = id;
			document.getElementsByTagName("head")[0].appendChild(e);
		};

		
		return saga.Utils;
});
