// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/InputBoolean.html',
	'dojo/on'],

    function(declare, _Widget, template, on){
         return declare('admin.InputBoolean', [_Widget], {

			templateString: template,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				on(this.selectNode, "change", function(evt){
					me.onChange(me.getValue());
				});
         	},
         	
         	getValue: function(){
         		return this.selectNode.value=="true";
         	},
         	
         	setValue: function(value){
         		this.selectNode.value = ""+value;
         	},
         	
         	setReadOnly: function(readOnly){
				this.inputNode.readOnly = readOnly;
         	},
         	
         	onChange: function(){
         		
         	}
        	
        });
}); 
