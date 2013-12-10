define([
	'dojo/_base/declare',
	 'saga/widgets/_Widget',
	 'dojox/mobile/View',
	 'dojo/text!./templates/LoadingBar.html',
	 'dojo/_base/config',
	 'dojo/_base/fx'], 
	 
	 function(declare, _Widget, View, template, config, fx) {
	
	return declare('saga.LoadingBar', [_Widget, View], {
	
		templateString:template,
		
		loadingLabel: "Loading...",
		
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
			this.width = width;
			this.domNode.style.width = width+"px";
			this.spinner.el.style.left = (width/2-45)+"px";
			this.spinner.el.style.width = "40px";
			this.labelNode.style.left = (width/2-20)+"px";
			this.specialLabelNode.style.left = "20px";
			this.specialLabelNode.style.width = (width-40)+"px";
		},
		
		setLoadingLabel: function(label){
			this.labelNode.innerHTML = label;
		},
		
		setSpecialMessage: function(message){
			this.specialLabelNode.style.display = "";
			this.specialLabelNode.innerHTML = message;
			this.labelNode.style.display = "none";
			this.spinner.el.style.left = (this.width/2)+"px";
			fx.animateProperty({
				node:this.domNode,
				duration:200,
				properties:{
					height:90
				}
			}).play();
		},
		
		removeSpecialMessage: function(message){
			this.specialLabelNode.style.display = "none";
			this.labelNode.style.display = "";
			this.spinner.el.style.left = (this.width/2-45)+"px";
			fx.animateProperty({
				node:this.domNode,
				duration:200,
				properties:{
					height:50
				}
			}).play();
		}
		
	});
});