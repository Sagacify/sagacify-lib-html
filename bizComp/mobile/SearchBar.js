define(['dojo/_base/declare', 'dojox/mobile/Heading', 'dojo/Evented', './TextField', 'dojox/mobile/ToolBarButton', 'dojo/dom-construct', 'dojo/on'], function(declare, Heading, Evented, TextField, ToolBarButton, domConstruct, on) {
	
	return declare('bizComp.mobile.SearchBar', [Heading, Evented], {

		width: 300,
		
		_searchField: null,
		
		_textField: null,
		
		_cancelButton: null,

		constructor: function(args) {
			if(args) {
				if(args.width)
					this.width = args.width;
			}
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			this._searchField = domConstruct.create("div", {style:"position:absolute;border:1px solid black;background:white;top:5px;left:6px;width:"+(this.width-6)+"px;height:30px;border-radius:25px;-moz-border-radius:25px;"}, this.domNode)
			
			this._textField = new TextField({placeholder:"Search", type:"text", style:"position:absolute;left:20px;top:2px;width:"+(this.width-66)+"px;height:22px;font-size:70%;"});
			this._textField.placeAt(this._searchField);
			
			this._cancelButton = new ToolBarButton({label:"Cancel"});
			this._cancelButton.domNode.style.float = "right";
			this._cancelButton.domNode.style.display = "none";
			this._cancelButton.placeAt(this.domNode);
			
			var me = this;
			on(this._textField.domNode, "focus", function(args){
				me.emit("focus");
			});
			
			on(this._textField.domNode, "blur", function(args){
				me.emit("blur");
			});
			
			on(this._textField.domNode, "keyup", function(args){
				me.emit("textChange", {text:me._textField.domNode.value});
			});
			
			on(this._cancelButton.domNode, "click", function(args){
				me.emit("cancel");
			});
		},
		
		setCancelMode: function(activated) {
			if(activated) {
				this._searchField.style.width = (this.width-55)+"px";
				this._textField.domNode.style.width = (this.width-110)+"px";
				this._cancelButton.domNode.style.display = "";
			}
			else {
				this._searchField.style.width = (this.width-6)+"px";
				this._textField.domNode.style.width = (this.width-66)+"px";
				this._cancelButton.domNode.style.display = "none";
				this.setText("");
			}
		},
		
		getText: function() {
			return this._textField.domNode.value;
		},
		
		setText: function(text) {
			this._textField.domNode.value = text;
		},
		
		focus: function() {
			this._textField.domNode.focus();
		}
		
		
		
	});
});
