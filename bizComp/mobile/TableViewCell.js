define(['dojo/_base/declare', 'dojox/mobile/ListItem', './TextField', 'dojo/_base/connect', 'dojo/on', 'dojo/dom-construct', 'dojo/query'], function(declare, ListItem, TextField, connect, on, domConstruct, query) {
	
	return declare('bizComp.TableViewCell', [ListItem], {
		
		directInput: null,
		
		constructor: function(args) {
			if(args)
				this.directInput = args.directInput;
		},
		
		postCreate: function() {
			this.inherited(arguments);
			var me = this;
			if(this.clickable){
				this.domNode.style.cursor = "pointer";
				on(this.domNode, "click", function(args){
					me._setSelectedAttr(true);
				});
			}
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
				select.style.width = (Window.frame.width-35-10)+"px";
				select.style.height = "30px";
				select.style.outline = "none";
				select.style.border = "none";
				select.style["-webkit-appearance"] = "none";
				this.select = select;
			}
			
		},
		
		setHeight: function(height) {
			this.domNode.style.height = height+"px";
			this.domNode.children[0].children[0].style.top = (((height-12)/2)-14)+"px";
		}
		
	});
});
