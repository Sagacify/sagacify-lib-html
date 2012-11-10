define(['dojo/_base/declare', 'bizComp/_Widget', './TextField', 'dojo/dom-construct'], function(declare, _Widget, TextField, domConstruct) {
	
	return declare('bizComp.TextField', [_Widget], {
	
		templateString:"<div></div>",
		
		width: "100px",
		
		height: "30px",
		
		placeholder: null,
		
		textField: null,
		
		consructor: function(args) {
			if(args) {
				this.placeholder = args.placeholder;
				if(args.width)
					this.width = args.width;
				if(args.height)
					this.height = args.height;
			}
		},
		
		postCreate: function() {			
			this.domNode.style.border = "1px solid black";
			this.domNode.style.background = "white";
			this.domNode.style.width = this.width;
			this.domNode.style.height = this.height;
			this.domNode.style.borderRadius = "25px";
			this.domNode.style["-moz-border-radius"] = "25px";
			
			this.textField = new TextField({placeholder:this.placeholder, type:"text", style:"position:absolute;left:20px;top:4px;width:"+(this.width-30)+"px;height:"+(this.height-8)+"px;font-size:70%;"});
			this.textField.placeAt(this.domNode);
		},
		
		setPlaceholder: function(placeholder) {
			this.placeholder = placeholder;
			this.textField.domNode.placeholder = placeholder;
		}
		
	});
});
