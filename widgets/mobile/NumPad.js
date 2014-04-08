define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojox/mobile/View',
	'dojo/text!./templates/NumPad.html',
	'dojo/_base/config',
	'dojo/on',
	'dojo/dom-class',
	'dojo/dom-style'], 
	
	function(declare, _Widget, View, template, config, on, domClass, domStyle) {
	
	return declare('saga.NumPad', [_Widget, View], {
		
		templateString: template,
		
		focus: false,

		separator: true,
				
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
			//this.domNode.style["-webkit-touch-callout"] = "none";
			var me = this;
			dojo.forEach(this.domNode.children, function(li, i){
				var text = li.children[0].innerHTML;
				if(text == '.' && !me.separator){
					domStyle.set(li, 'opacity', 0.5);
				}

				on(li, selectEvent, function(evt){
					evt.preventDefault();
					if(text != "." || me.separator){
						me.onKeySelected.apply(me, [text]);
					}
					if(text == "OK")
						Window.dismissNumPad();
					evt.stopPropagation();
				});
				on(li, downEvent, function(evt){
					if(text != "." || me.separator){
						domClass.add(li, "selected");
					}				
				});
				on(li, upEvent, function(evt){
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
