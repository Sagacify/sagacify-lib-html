define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget', 
	'dojo/text!./templates/DirectoryBar.html', 
	'saga/utils/Utils', 
	'dojo/on'], 
	
	function(declare, _Widget, template, Utils, on) {
	
	return declare('saga.DirectoryBar', [_Widget], {
	
		templateString: template,
		
		height: 480,
		
		//_items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"],
				
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			this.searchImg.src = Utils.svgSupport()?"saga/widgets/mobile/Assets/img/search.svg":"saga/widgets/mobile/Assets/img/search.png";
			this.ulNode.style.height = this.height+"px";
			dojo.forEach(this.ulNode.children, function(letterNode, i){
				on(letterNode, "mousemove", function(evt){
					console.log(i);
				});
			});
		}
	
	});
});
