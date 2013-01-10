define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojox/mobile/View',
	'dojo/text!./templates/NumPad.html',
	'dojo/_base/config',
	'dojo/on',
	'dojo/dom-class'], 
	
	function(declare, _Widget, View, template, config, on, domClass) {
	
	return declare('saga.NumPad', [_Widget, View], {
		
		templateString: template,
		
		focus: false,
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			//workaround to bind webkit animations (that should work in 'View' class but does not)
			this._animEndHandle = this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this._animStartHandle = this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
				this._transEndHandle = this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			var me = this;
			dojo.forEach(this.domNode.children, function(li, i){
				var text = li.children[0].innerHTML;
				on(li, "click", function(evt){
					evt.preventDefault();
					me.onKeySelected.apply(me, [text]);
					if(text == "OK")
						Window.dismissNumPad();
				});
				on(li, "mousedown", function(evt){
					domClass.add(li, "selected");					
				});
				on(li, "mouseup", function(evt){
					domClass.remove(li, "selected");					
				});
				on(li, "touchstart", function(evt){
					domClass.add(li, "selected");					
				});
				on(li, "touchend", function(evt){
					domClass.remove(li, "selected");					
				});
			});
			
			on(this.domNode, "focus", function(evt){
				me.focus = true;
			});
			on(this.domNode, "blur", function(evt){
				me.focus = false;
			});
		},
		
		onKeySelected: function(){
			
		}
		
	});
});
