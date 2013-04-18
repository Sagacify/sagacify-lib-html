// bizApp.widget.ApplicationCell
define([
	"dojo/_base/declare",  
	"saga/widgets/_Widget",
	"dojo/text!./templates/DatabaseHeader.html",
	"dojo/on"],

    function(declare, _Widget, template, on){
     return declare('admin.DatabaseHeader', [_Widget], {

		templateString: template,
		
		name: "",
    	        	        	             	
    	constructor : function(args) {

    	},
    	
    	postCreate : function() {
			on(this.linkNode, "click", function(evt){
				evt.preventDefault();
			});
      	}
    	
    });
}); 
