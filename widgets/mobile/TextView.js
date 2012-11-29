define(['dojo/_base/declare', 'saga/widgets/_Widget'], function(declare, _Widget) {
	
	return declare('saga.TextView', [_Widget], {
	
		templateString:"<textarea style='outline:none;border:none;'></textarea>",
		
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
		},
		
		setValue: function(value) {
			this.domNode.value = value;	
		},
		
		setEditable: function(editable){
			if(editable)
				this.domNode.removeAttribute("readonly");
			else
				this.domNode.setAttribute("readonly", "readonly");	
		}
	});
});
