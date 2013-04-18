define([
	'dojo/_base/declare',
	'saga/widgets/_Widget',
	'dojo/text!./templates/DocsGrid.html',
	'dojo/on',
	'./TargetedGrid',
	'dojo/dom-construct'],

    function(declare, _Widget, template, on, TargetedGrid, domConstruct){
         return declare('admin.DocsGrid', [_Widget], {
			
			templateString: template,
			
			collection: "",
			
			schema: null,
				        
	        target: null,
	        
	        data: null,
	        
	        renderActionCell: null,
        	        	        	             	
        	constructor : function(args) {
        		
        	},
        	
        	postCreate: function(){
        		this.inherited(arguments);
				this.grid = new TargetedGrid({collection:this.collection, schema:this.schema, target:this.target, data:this.data, renderActionCell: this.renderActionCell}, this.gridNode);
				var me = this;
          		this.displayBoxes = {};
          		var handleCheckboxChange = function(column){
          			on(checkbox, "change", function(evt){
          				me.grid.setColumnVisible(column, evt.target.checked);
          			});
          		}
          		for(var key in this.grid.displays){
          			var checkbox = domConstruct.create("input", {type:"checkbox", checked:this.grid.displays[key]}, this.controllersNode);
          			domConstruct.create("label", {innerHTML: key}, this.controllersNode);
          			handleCheckboxChange(key);
          			this.displayBoxes[key] = checkbox;
          		}

          		on(this.showColumnsButton, "click", function(evt){
					for(var key in me.displayBoxes){
						me.displayBoxes[key].checked = me.showColumnsButton.innerHTML=="Show all"?true:key=="_id"?true:me.schema._meta__.summaryFields?me.schema._meta__.summaryFields.indexOf(key)!==-1:true;
						me.collectionGrid.setColumnVisible(key, me.displayBoxes[key].checked);
					}
					if(me.showColumnsButton.innerHTML=="Show all"){
						me.showColumnsButton.innerHTML = "Show summary";
					}
					else{
						me.showColumnsButton.innerHTML = "Show all";
					}
          		});
        	},
        	
        	startup: function(){
        		this.grid.startup();
        		for(var key in this.grid.displays){
        			this.grid.setColumnVisible(key, this.grid.displays[key]);
        		}
        	}
        	
        	
        	
        });
}); 
