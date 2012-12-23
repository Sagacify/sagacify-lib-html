define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/Popover.html',
	'dojo/_base/fx'], 
	
	function(declare, _Widget, template, fx) {
	
	return declare('saga.Popover', [_Widget], {
		
		hidden: true,
		
		templateString: template,
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			
		},
		
		show: function(){
			this.domNode.style.display = "";
			fx.fadeIn({node:this.domNode, duration:200}).play();
			this.hidden = false;
		},
		
		hide: function(){
			var me = this;
			var onEnd = function(){
				me.domNode.style.display = "none";
			}
			fx.fadeOut({node:this.domNode, duration:200, onEnd:onEnd}).play();
			this.hidden = true;
		},
		
		toggle: function(){
			if(this.hidden)
				this.show()
			else
				this.hide();
		}
		
	});
});
