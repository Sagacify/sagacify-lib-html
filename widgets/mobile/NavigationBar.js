define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/NavigationBar.html',
	'dojo/on',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'dojo/dom-attr',
	'saga/utils/Utils'], 
	
	function(declare, _Widget, template, on, lang, domConstruct, domAttr, Utils) {
	
	return declare('saga.NavigationBar', [_Widget], {
		
		templateString: template,
		
		clonedChildren: [],
		
		constructor: function(args){
			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			on(this.revealButton, "click", function(evt){
				evt.preventDefault();
			});
			on(this.backButton, "click", function(evt){
				evt.preventDefault();
			});
			on(this.cancelButton, "click", function(evt){
				evt.preventDefault();
			});
			on(this.addButton, "click", function(evt){
				evt.preventDefault();
			});
			on(this.infoButton, "click", function(evt){
				evt.preventDefault();
			});
			on(this.settingsButton, "click", function(evt){
				evt.preventDefault();
			});
			
			var svgSupport = Utils.svgSupport();	
			this.revealImg.src = svgSupport?"saga/widgets/mobile/Assets/img/reveal.svg":"saga/widgets/mobile/Assets/img/reveal.png";
			this.backImg.src = svgSupport?"saga/widgets/mobile/Assets/img/back.svg":"saga/widgets/mobile/Assets/img/back.png";
			this.cancelImg.src = svgSupport?"saga/widgets/mobile/Assets/img/remove.svg":"saga/widgets/mobile/Assets/img/remove.png";
			this.addUserImg.src = svgSupport?"saga/widgets/mobile/Assets/img/add.svg":"saga/widgets/mobile/Assets/img/add.png";
			this.settingsImg.src = svgSupport?"saga/widgets/mobile/Assets/img/settings.svg":"saga/widgets/mobile/Assets/img/settings.png";
			this.infoImg.src = svgSupport?"saga/widgets/mobile/Assets/img/info.svg":"saga/widgets/mobile/Assets/img/info.png";
			
			var me = this;
			dojo.forEach(this.domNode.children, function(child, i){
				me.clonedChildren.push(lang.clone(child));
			});
		},
		
		reset: function(){
			domConstruct.empty(this.domNode);
			var me = this;
			dojo.forEach(this.clonedChildren, function(clonedChild, i){
				 var node = domConstruct.place(lang.clone(clonedChild), me.domNode);
				 me[domAttr.get(node, "data-dojo-attach-point")] = node;
				 on(node, "click", function(evt){
					evt.preventDefault();
				});
			});
			this.setTitle("");
		},

		setTitle: function(newTitle){
			this.titleNode.innerHTML = newTitle;
		}

	});
});
