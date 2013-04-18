// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/DicValue.html',
	'./KeySingleValue',
	'dojo/on',
	'dojo/dom-construct',
	'dojo/_base/lang'],

    function(declare, _Widget, template, KeySingleValue, on, domConstruct, lang){
         return declare('admin.DicValue', [_Widget], {

			templateString: template,
			
			dic: null,
			
			schema: null,
			
			keyStack: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
         	},
         	
         	getValue: function(){
         		return this.dic;
         	},
         	
         	setValue: function(value){
         		this.dic = value;
         		for(var key in this.schema){
          			if(key != "_id" && key != "_meta__" && key != "_collectionsByModel__"){
          				var keyValueItem = KeySingleValue.create({bind:value, key:key, type:this.schema[key], collection:this.schema._collectionsByModel__?this.schema._collectionsByModel__[this.schema[key]]:null, keyStack:lang.clone(this.keyStack)});
          				keyValueItem.placeAt(this.keyValuesNode);
          			} 
          		}
          		for(var key in value){
          			if(!this.schema.key){
          				switch(typeof value[key]){
          					case "number":
          					var type = "Number";
          					break;
          					case "string":
          					var type = "String";
          					break;
          					case "object":
          					if(value[key] instanceof Date)
	          					var type = "Date";
	          				else if(value[key] instanceof Array)
	          					var type = "Array";
	          				else if(value[key] instanceof Object)
	          					var type = "Object";
          					break;
          				}
          				var keyValueItem = KeySingleValue.create({bind:value, key:key, type:type, collection:this.schema._collectionsByModel__?this.schema._collectionsByModel__[this.schema[key]]:null, keyStack:lang.clone(this.keyStack)});
          				keyValueItem.placeAt(this.keyValuesNode);
          			} 
          		}
         	}
         	
        });
}); 
