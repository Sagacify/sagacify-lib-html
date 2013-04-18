// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/InputDate.html',
	'dojo/on'],

    function(declare, _Widget, template, on){
         return declare('admin.InputDate', [_Widget], {

			templateString: template,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				on(this.inputNode, "change", function(evt){
					me.onChange(me.getValue());
				});
         	},
         	
         	getValue: function(){
         		return this.inputNode.value?new Date(this.inputNode.value).toISOString():null;
         	},
         	
         	setValue: function(value){
         		if(value)
         			this.inputNode.value = value.substring(0, 10);
         	},
         	
         	setReadOnly: function(readOnly){
				this.inputNode.readOnly = readOnly;
         	},
         	
         	onChange: function(){
         		
         	}
        	
        });
}); 
