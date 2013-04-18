// bizApp.widget.ApplicationCell
define([
	"dojo/_base/declare",  
	"saga/widgets/_Widget",
	"dojo/text!./templates/CollectionHeader.html",
	"dojo/on"],

    function(declare, _Widget, template, on){
     return declare('admin.CollectionHeader', [_Widget], {

		templateString: template,
		
		label: "",
    	        	        	             	
    	constructor : function(args) {

    	},
    	
    	postCreate : function() {
			on(this.linkNode, "click", function(evt){
				evt.preventDefault();
			});
      	}
    	
    });
}); 
