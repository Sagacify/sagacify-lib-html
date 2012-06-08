define(['dojo', 'bizComp/_Widget', 'dojox/mobile/View'], function(dojo, _Widget, View) {
	
	return dojo.declare('bizComp.View', [_Widget, View], {
	
		parent: null,
		
		frame: null,	
				
		constructor: function(args){
			if(args)
				this.frame = args.frame;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.frame)
				this.setFrame(this.frame);
		},
		
		setFrame: function(frame) {
			if(!this.frame)
				this.frame = {};
			
			if(frame.x) {
				this.frame.x = frame.x;
				this.domNode.style.left = frame.x + "px";
			}
			if(frame.y) {
				this.frame.y = frame.y;
				this.domNode.style.top = frame.y + "px";
			}
			if(frame.width) {
				this.frame.width = frame.width;
				this.domNode.style.width = frame.width + "px";
			}
			if(frame.height) {
				this.frame.height = frame.height;
				this.domNode.style.height = frame.height + "px";
			}
		}
		
	});
});
