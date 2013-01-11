define([
	'dojo/_base/declare',
	 'saga/widgets/_Widget',
	 'dojox/mobile/View',
	 'dojo/text!./templates/LoadingBar.html',
	 'dojo/_base/config'], 
	 
	 function(declare, _Widget, View, template, config) {
	
	return declare('saga.LoadingBar', [_Widget, View], {
	
		templateString:template,
		
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			//workaround to bind webkit animations (that should work in 'View' class but does not)
			this._animEndHandle = this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this._animStartHandle = this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
				this._transEndHandle = this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			
			var spinner = new Spinner({color:"gray", lines:12, length:3, width:2, radius:5}).spin();
        	spinner.el.style.top = "25px";
        	this.domNode.appendChild(spinner.el);
        	this.spinner = spinner;
		},
		
		setWidth: function(width){
			this.domNode.style.width = width+"px";
			this.spinner.el.style.left = (width/2-45)+"px";
			this.labelNode.style.left = (width/2-20)+"px";
		}
		
	});
});