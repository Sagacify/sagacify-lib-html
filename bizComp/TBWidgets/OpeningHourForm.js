define([
	'dojo/_base/declare',
	'../_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/OpeningHourForm.html', 
	'dojo/dom-attr'
	], 
	function(declare, _Widget, Evented, template, domAttr, connect) {

	return declare('BizComp.OpeningHourForm', [_Widget, Evented], {

		templateString: template,
		
		constructor: function(args){
			
		},
		
		postCreate: function() {

		},
		
	});

});
