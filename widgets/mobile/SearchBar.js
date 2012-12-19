define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/SearchBar.html',
	'dojo/dom-construct', 
	'dojo/on'], 
	
	function(declare, _Widget, template, domConstruct, on) {
	
	return declare('bizComp.mobile.SearchBar', [_Widget], {

		templateString: template,

		constructor: function(args) {
			
		},		
		
		postCreate: function() {
			this.inherited(arguments);
		},	
		
	});
});
