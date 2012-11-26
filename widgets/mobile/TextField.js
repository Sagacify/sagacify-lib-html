define(['dojo/_base/declare', '../_Widget'], function(declare, _Widget) {
	
	return declare('saga.TextField', [_Widget], {
	
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
