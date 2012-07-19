define(['dojo', 'dojox/mobile/ListItem', './TextField', 'dojo/_base/connect', 'dojo/on', 'dojo/dom-construct'], function(dojo, ListItem, TextField, connect, on, domConstruct) {
	
	return dojo.declare('bizComp.TableViewCell', [ListItem], {
		
		directInput: null,
		
		constructor: function(args) {
			if(args)
				this.directFieldInput = args.directFieldInput;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.clickable)
				connect.connect(this.domNode, "onclick", this, "onClick");
			
			if(this.directInput == "field") {
				var textField = new TextField();
				textField.domNode.style.background = "rgba(0,0,0,0)";
				textField.domNode.style.fontSize = "17px";
				textField.domNode.style.fontWeight = "bold";
				textField.domNode.style.color = "#324F85"
				textField.domNode.style.position = "absolute";
				textField.domNode.style.top = "5px";
				textField.domNode.style.left = "5px";
				textField.domNode.style.width = (Window.frame.width-20-20)+"px";
				textField.domNode.style.height = "30px";
				textField.domNode.style.textAlign = "right";
				textField.placeAt(this.domNode.children[0]);
			}
			else if(this.directInput instanceof Array) {
				var innerHTML = "";
				dojo.forEach(this.directInput, function(item, i){
					innerHTML += "<option>"+item+"</option>";
				});
				var select = domConstruct.create("select", {dir:"rtl", innerHTML:innerHTML}, this.domNode.children[0]);
				select.style.background = "rgba(0,0,0,0)";
				select.style.fontSize = "17px";
				select.style.fontWeight = "bold";
				select.style.color = "#324F85"
				select.style.position = "absolute";
				select.style.top = "5px";
				select.style.left = "5px";
				select.style.width = (Window.frame.width-20-10)+"px";
				select.style.height = "30px";
				select.style.outline = "none";
				select.style.border = "none";
				select.style["-webkit-appearance"] = "none";
			}
		},
		
	});
});
