// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/InputString.html',
	'dojo/on'],

    function(declare, _Widget, template, on){
         return declare('admin.InputString', [_Widget], {

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
         		return this.inputNode.value;
         	},
         	
         	setValue: function(value){
         		this.inputNode.value = value||"";
         	},
         	
         	setReadOnly: function(readOnly){
				this.inputNode.readOnly = readOnly;
         	},
         	
         	onChange: function(){
         		
         	}
        	
        });
}); 
