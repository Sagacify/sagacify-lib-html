define(['dojo/_base/declare', '../_Widget', 'dojo/Evented', 'dojo/dom-construct', 'dojo/on'], function(declare, _Widget, Evented, domConstruct, on) {
	
	return declare('bizComp.DirectoryBar', [_Widget, Evented], {
	
		templateString:"<div></div>",
		
		_items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"],
				
		consructor: function(args) {
			if(args) {
				
			}
		},
		
		postCreate: function() {
			var me = this;
			dojo.forEach(this._items, function(item, i) {
				var div = domConstruct.create("div", {innerHTML:"<font color=gray>"+item+"</font>", style:"text-align:center;line-height:15px;width:15px;height:15px;font-size:70%;font-color:red;"}, me.domNode);
				on(div, "click", function(args){
					me.emit("directoryBarPressed", {item:item, index:i});
				});
			});
		}
	
	});
});
