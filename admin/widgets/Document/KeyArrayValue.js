// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/KeyArrayValue.html',
	'./InputString',
	'./InputNumber',
	'./InputBoolean',
	'./InputDate',
	'./InputLinkedObject',
	'dojo/on',
	'dojo/dom-construct',
	'dojo/_base/lang'],

    function(declare, _Widget, template, InputString, InputNumber, InputBoolean, InputDate, InputLinkedObject, on, domConstruct, lang){
         return declare('admin.KeyArrayValue', [_Widget], {

			templateString: template,
			
			type: "String",
			
			inputs: null,
			
			bind: null,
			
			tmpArray: null,
			
			collection: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				this.tmpArray = lang.clone(this.bind[this.key]);
				//this.inputs = [];
				this.setValue(this.bind[this.key]);
				var me = this;
				on(this.addButton, "click", function(evt){
					me.tmpArray.push(null);
					me.addInput(null, me.tmpArray.length-1);
				});
				
				if(this.type != "String" && this.type != "Number" && this.type != "Boolean" && this.type != "Date"){
					this.addButton.style.display = "none";
					this.addExistingButton.style.display = "";
					this.addNewButton.style.display = "";
					on(this.addExistingButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1))
							hash += "/";
						History.pushState(null, null, hash+me.key+"/add_existing");
					});
					on(this.addNewButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1))
							hash += "/";
						History.pushState(null, null, hash+me.key+"/add_new");
					});
					on(this.gridButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1))
							hash += "/";
						History.pushState(null, null, hash+me.key);
					});	
				}
         	},
         	
         	createInput: function(){
         		var me = this;
         		var input;
         		switch(this.type){
					case "String":
					input = new InputString();
					break;
					case "Number":
					input = new InputNumber();
					break;
					case "Boolean":
					input = new InputBoolean();
					break;
					case "Date":
					input = new InputDate();
					break;
					default:
					input = new InputLinkedObject({collection:this.collection});
					break;
				}
				return input;
         	},
         	
         	addInput: function(inputValue, index){
         		var input = this.createInput();
				input.placeAt(this.valuesNode);
				if(inputValue)
					input.setValue(inputValue);
				else
					input.domNode.focus();
				//this.inputs.push(input);
				on(input, "change", function(evt){
					me.tmpArray[index] = input.getValue();
					me.bind[me.key] = me.tmpArray.filter(function(item){return item != null;});
				});
				var button = domConstruct.create("button", {innerHTML:"-"}, this.valuesNode);
				var br = domConstruct.create("br", {}, this.valuesNode);
				var me = this;
				//var inputsLength = me.inputs.length;
				on(button, "click", function(evt){
					input.destroyRecursive();
					domConstruct.destroy(button);
					domConstruct.destroy(br);
					//me.inputs.splice(inputsLength-1, 1, null);
					me.tmpArray.splice(index, 1, null);
					me.bind[me.key] = me.tmpArray.filter(function(item){return item != null;});
				});
         	},
         	
         	getValue: function(){
         		var value = [];
         		dojo.forEach(this.inputs, function(input, i){
         			if(input){
         				var inputValue = input.getValue();
         				if(inputValue)
         					value.push(inputValue);	
         			}
         		});
         		return value;
         	},
         	
         	setValue: function(value){
         		var me = this;
         		dojo.forEach(value, function(inputValue, i){
         			/*var input = me.createInput();
					input.placeAt(me.valuesNode);
					input.setValue(inputValue);
					me.inputs.push(input);*/
					me.addInput(inputValue, i);
         		});
         	}
        	
        });
}); 
