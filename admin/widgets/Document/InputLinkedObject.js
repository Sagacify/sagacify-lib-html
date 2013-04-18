// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/InputLinkedObject.html',
	'dojo/on'],

    function(declare, _Widget, template, on){
         return declare('admin.InputLinkedObject', [_Widget], {

			templateString: template,
			
			collection: null,
        	        	        	             	
        	constructor : function(args) {
			
        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				on(this.domNode, "click", function(evt){
					//evt.preventDefault();
					//History.pushState(null, null, "/admin/collections/"+me.collection+"/"+me.getValue());
				});
         	},
         	
         	getValue: function(){
         		return this.domNode.innerHTML;
         	},
         	
         	setValue: function(value){
         		if(value)
         			this.domNode.href = "/admin/collections/"+this.collection+"/"+value;
         		else
         			this.domNode.href = null;
         		this.domNode.innerHTML = value;
         	},
         	
         	setReadOnly: function(readOnly){

         	}
        	
        });
}); 
