define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/SearchBar.html',
	'dojo/dom-construct', 
	'dojo/on',
	'dojo/has'], 
	
	function(declare, _Widget, template, domConstruct, on, has) {
	
	return declare('saga.mobile.SearchBar', [_Widget], {

		templateString: template,
		
		height: 43,

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
			if(has("android"))
				this.searchFieldNode.type = "text";
				
			var me = this;
			on(this.formNode, "submit", function(evt){
				evt.preventDefault();
				me.searchFieldNode.blur();
			});
		}
		
	});
});
