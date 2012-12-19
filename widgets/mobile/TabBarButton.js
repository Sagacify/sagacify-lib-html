define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/TabBarButton.html',
	'dojo/on',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'dojo/dom-class',
	'saga/utils/Utils'], 
	
	function(declare, _Widget, template, on, lang, domConstruct, domClass, Utils) {
	
	return declare('saga.TabBarButton', [_Widget], {
		
		templateString: template,
		
		label: "",
		
		imgPosition: null,
				
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.imgPosition)
				domClass.add(this.domNode, "item"+this.imgPosition);
		},

		select: function(){
			domClass.add(this.domNode, "selected");
		},
		
		unselect: function(){
			domClass.remove(this.domNode, "selected");
		}
	});
});
