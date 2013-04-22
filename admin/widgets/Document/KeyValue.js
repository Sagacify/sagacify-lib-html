// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/KeyValue.html',
	'./InputString',
	'./InputNumber',
	'./InputBoolean',
	'./InputDate',
	'./InputLinkedObject',
	'./ArrayValue',
	'./DicValue',
	'./DocumentHeader',
	'dojo/on',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'exports'],

    function(declare, _Widget, template, InputString, InputNumber, InputBoolean, InputDate, InputLinkedObject, ArrayValue, DicValue, DocumentHeader, on, domConstruct, lang, exports){
         declare('admin.KeyValue', [_Widget], {

			templateString: template,
			
			type: null,
			
			input: null,
			
			bind: null,
			
			valueSchema: null,
			
			collection: null,
			
			keyStack: null,
        	        	        	             	
        	constructor : function(args) {
				
        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				this.keyStack.push(this.key);
				
				if(this.type instanceof Array){
					if(!this.bind[this.key]){
						this.bind[this.key] = [];
					}
					this.input = new ArrayValue({schema:this.type, collection:this.collection, keyStack:lang.clone(this.keyStack)});
					this.input.placeAt(this.domNode);
					on(this.input.addExistingButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1) != '/')
							hash += "/";
						dojo.forEach(me.keyStack, function(key){
							hash += key+"/";
						});
						History.pushState(null, null, hash+"add_existing");
					});
					on(this.input.addNewButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1) != '/')
							hash += "/";
						dojo.forEach(me.keyStack, function(key){
							hash += key+"/";
						});
						History.pushState(null, null, hash+"add_new");
					});
					on(this.input.gridButton, "click", function(evt){
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1) != '/')
							hash += "/";
						dojo.forEach(me.keyStack, function(key){
							hash += key+"/";
						});
						History.pushState(null, null, hash);
					});	
					on(this.input.addDicButton, "click", function(evt){
						var doc = {_id:"new_"+Math.floor(Math.random()*Math.pow(10, 16))};
						me.bind[me.key].push(doc);
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1) != '/')
							hash += "/";
						dojo.forEach(me.keyStack, function(key){
							hash += key+"/";
						});
						History.pushState(null, null, hash+doc._id);
					});	
				}
				else if(this.type instanceof Object){
					if(!this.bind[this.key]){
						this.bind[this.key] = {};
					}
					var type = this.type._meta__?this.type._meta__.type:"";
					switch(type){
						case "Image":
						this.input = new InputImage();
						this.input.placeAt(this.domNode);
						break;
						default:
						this.input = new DicValue({schema:this.type, keyStack:lang.clone(this.keyStack)});
						this.input.placeAt(this.domNode);
						break;
					}
				}
				else{
					switch(this.type){
						case "String":
						this.input = new InputString();
						this.input.placeAt(this.domNode);
						break;
						case "Number":
						this.input = new InputNumber();
						this.input.placeAt(this.domNode);
						break;
						case "Boolean":
						this.input = new InputBoolean();
						this.input.placeAt(this.domNode);
						break;
						case "Date":
						this.input = new InputDate();
						this.input.placeAt(this.domNode);
						break;
						default:
						//this.input = new InputLinkedObject({collection:this.collection});
						this.input = new DocumentHeader({collection:this.collection});
						this.input.placeAt(this.domNode);
						if(this.bind[this.key]){
							var delButton = domConstruct.create("button", {innerHTML:"Delete"}, this.domNode);
							on(delButton, "click", function(evt){
								me.bind[me.key] = null;
								me.input.setValue(undefined);
							});
							var addExistingButton = domConstruct.create("button", {innerHTML:"Set existing"}, this.domNode);
							//var addNewButton = domConstruct.create("button", {innerHTML:"Set new"}, this.domNode);
							var addNewLink = domConstruct.create("a", {href:"", target:"_blank", innerHTML:"Set new"}, this.domNode); 
						}
						else{
							var addExistingButton = domConstruct.create("button", {innerHTML:"Set existing"}, this.domNode);
							//var addNewButton = domConstruct.create("button", {innerHTML:"Set new"}, this.domNode);
							var addNewLink = domConstruct.create("a", {href:"/bla", target:"_blank", innerHTML:"Set new"}, this.domNode);
						}
						on(addExistingButton, "click", function(evt){
							var hash = History.getState().hash;
							if(hash.charAt(hash.length-1) != '/')
								hash += "/";
							dojo.forEach(me.keyStack, function(key){
								hash += key+"/"
							});
							History.pushState(null, null, hash+"set_existing");
						});
						/*on(addNewButton, "click", function(evt){
							var hash = History.getState().hash;
							if(hash.charAt(hash.length-1) != '/')
								hash += "/";
							dojo.forEach(me.keyStack, function(key){
								hash += key+"/"
							});
							History.pushState(null, null, hash+"set_new");
						});*/
						break;
					}
				}
				
				this.setValue(this.bind[this.key]);
				
				var me = this;
				if(this.input && !(this.input instanceof DicValue)){
					on(this.input, "change", function(evt){
						me.bind[me.key] = me.getValue();
					});	
				}
         	},
         	
         	getValue: function(){
         		if(this.input)
         			return this.input.getValue();
         	},
         	
         	setValue: function(value){
         		if(this.input)
					this.input.setValue(value);
         	},
         	
         	setReadOnly: function(readOnly){
         		if(this.input)
					this.input.setReadOnly(readOnly);
         	}
        	
        });
        
     exports.create = admin.KeyValue;
     return admin.KeyValue;
}); 
