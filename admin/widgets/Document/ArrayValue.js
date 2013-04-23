// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/ArrayValue.html',
	'./InputString',
	'./InputNumber',
	'./InputBoolean',
	'./InputDate',
	'./InputLinkedObject',
	'./DocumentHeader',
	'./DicValue',
	'./InputImage',
	'dojo/on',
	'dojo/dom-construct',
	'dojo/_base/lang'],

    function(declare, _Widget, template, InputString, InputNumber, InputBoolean, InputDate, InputLinkedObject, DocumentHeader, DicValue, InputImage, on, domConstruct, lang){
         return declare('admin.ArrayValue', [_Widget], {

			templateString: template,
			
			schema: null,
			
			inputs: null,
			
			tmpArray: null,
			
			collection: null,
			
			keyStack: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				on(this.addButton, "click", function(evt){
					me.tmpArray.push(null);
					me.addInput(me.schema[0], (me.schema[0] instanceof Object)?{}:null, me.tmpArray.length-1);
				});
				
				if(this.schema.length == 1){
					if(!(this.schema[0] instanceof Object) && this.schema[0] != "String" && this.schema[0] != "Number" && this.schema[0] != "Boolean" && this.schema[0] != "Date"){
						this.addButton.style.display = "none";
						this.addExistingButton.style.display = "";
						this.addNewButton.style.display = "";
					}
					if(this.schema[0] instanceof Object){
						this.addButton.style.display = "none";
						this.addDicButton.style.display = "";
					}
				}
				else{
					this.gridButton.style.display = "none";
					this.addButton.style.display = "none";
				}
         	},
         	
         	createInput: function(type, index){
         		var me = this;
         		var input;
         		if(type instanceof Object){
         			var t = type._meta__?type._meta__.type:"";
         			switch(t){
         				case "Image":
         				var input = new InputImage();
         				break;
         				default:
         				if(type._id)
         					var input = new DocumentHeader({embedded: true, schema:type, keyStack:lang.clone(this.keyStack), inArray:true});
         				else
         					var input = new DicValue({schema:type, keyStack:lang.clone(this.keyStack)});
         				break;
         			}
         		}
         		else{
	         		switch(type){
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
						//input = new InputLinkedObject({collection:this.collection});
						input = new DocumentHeader({collection:this.collection, keyStack:lang.clone(this.keyStack), inArray:true});
						break;
					}
				}
				return input;
         	},
         	
         	addInput: function(type, inputValue, index){
         		var input = this.createInput(type, index);
				input.placeAt(this.valuesNode);
				if(inputValue){
					if(inputValue instanceof Object && inputValue._meta__ && inputValue._meta__.type == "Image"){
						if(inputValue._id)
							input.keyStack.push(inputValue._id);
						else
							input.keyStack.push(index);
					}
					input.setValue(inputValue);
				}
				else
					input.domNode.focus();
				
				var me = this;
				on(input, "change", function(evt){
					me.tmpArray[index] = input.getValue();
					me.onChange();
				});
				
				if(this.schema.length == 1){
					var button = domConstruct.create("button", {innerHTML:"-"}, this.valuesNode);
					var br = domConstruct.create("br", {}, this.valuesNode);
					on(button, "click", function(evt){
						input.destroyRecursive();
						domConstruct.destroy(button);
						domConstruct.destroy(br);
	
						me.tmpArray.splice(index, 1, null);
						me.onChange();
					});
				}
				else{
					domConstruct.create("br", {}, this.valuesNode);
				}
         	},
         	
         	getValue: function(){
         		if(this.schema.length == 1)
         			return this.tmpArray.filter(function(item){return item != null;});
         		else
         			return this.tmpArray;
         	},
         	
         	setValue: function(value){
         		this.tmpArray = lang.clone(value);
         		var me = this;
         		if(this.schema.length == 1){
	         		dojo.forEach(value, function(inputValue, i){
						me.addInput(me.schema[0], inputValue, i);
	         		});
         		}
         		else{
         			dojo.forEach(this.schema, function(subschema, i){
						var input = me.addInput(subschema, value[i], i);
	         		});
         		}
         	},
         	
         	onChange: function(){
         		
         	}
        	
        });
}); 
