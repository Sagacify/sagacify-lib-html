define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget', 
	'dojo/text!./templates/DirectoryBar.html', 
	'saga/utils/Utils', 
	'dojo/on',
	'dojo/dom-class'], 
	
	function(declare, _Widget, template, Utils, on, domClass) {
	
	return declare('saga.DirectoryBar', [_Widget], {
	
		templateString: template,
		
		height: 480,
		
		searchItem: true,
		
		//_items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"],
				
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			this.searchImg.src = Utils.svgSupport()?"saga/widgets/mobile/Assets/img/search.svg":"saga/widgets/mobile/Assets/img/search.png";
			
			var me = this;
			dojo.forEach(this.ulNode.children, function(letterNode, i){
				on(letterNode, "click", function(evt){
					me.onLetterSelected.apply(me, [i]);
				});
			});
			on(this.searchImg, "click", function(evt){
				me.onLetterSelected.apply(me, [-1]);
			});
			if(this.searchItem){
				this.ulNode.style.height = (this.height-20)+"px";
			}
			else{
				this.searchImg.style.display = "none";
				this.ulNode.style.height = this.height+"px";
			}
			
			on(this.ulNode, "mousedown", function(evt){
				domClass.add(me.ulNode, "selected");
			});
			on(this.ulNode, "mouseup", function(evt){
				domClass.remove(me.ulNode, "selected");
			});
		},
		
		onLetterSelected: function(){
			
		}
	
	});
});
