define([
	'../_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/Dropdown.html', 
	'dojo/dom-construct', 
	'dojo/dom-attr', 
	'dojo/_base/connect'], 
	function(_Widget, Evented, template, domConstruct, domAttr, connect) {

	return dojo.declare('bootstrap.Dropdown', [_Widget, Evented], {

		templateString: template,
		
		selectedIndex: null,
		
		data: null,
		
		constructor: function(args){
			this.selectedIndex = args.selectedIndex;
			this.data = args.data;
		},
		
		postCreate: function() {
			var me = this;
			dojo.forEach(this.data, function(item, i){
				var li = domConstruct.create("li", {}, me.dropdownMenu);
				var itemNode = domConstruct.place("<a href=\"#\">" + item + "</a>", li);
				itemNode.index = i;
				connect.connect(li, "onclick", me, function(){
					if(me.selectedIndex != i) {
						me.selectIndex(i);
						me.emit("change",{value:me.data[me.selectedIndex], selectedIndex:me.selectedIndex});
					}
				});
			});
						
			if(this.selectedIndex)
				this.selectIndex(this.selectedIndex);
			else
				this.selectIndex(0);
			
		},
		
		selectIndex: function(index) {
			this.selectedIndex = index;
			this.dropdown.innerHTML = this.data[index] + " <span class=\"caret\"></span>";
		},
		
		selectedValue: function() {
			return this.data[this.selectedIndex];
		}
		
	});

});