define(['dojo', 'bizComp/_Widget'], function(dojo, _Widget) {
	
	return dojo.declare('bizComp.TextField', [_Widget], {
	
		templateString:"<input type='text' style='outline:none;border:none;'></input>",
		
		placeholder: null,
		
		consructor: function(args) {
			if(args) {
				this.placeholder = args.placeholder;
				this.type = args.type;
			}
		},
		
		postCreate: function() {
			this.setPlaceholder(this.placeholder);
			this.setType(this.type);
		},
		
		setPlaceholder: function(placeholder) {
			this.placeholder = placeholder;
			this.domNode.placeholder = placeholder;
		},
		
		setType: function(type) {
			this.type = type;
			this.domNode.type = type;
		}
		
	});
});
