define([
	'dojo/_base/declare',
	'dojo/on',
	'admin/stores/AdminStore',
	'admin/stores/TargetedJsonStore',
	'dgrid/Grid',
	'dgrid/OnDemandGrid',
	'dgrid/ColumnSet',
	'dgrid/Selection',
	'dgrid/Keyboard',
	'dgrid/extensions/ColumnReorder',
	'dgrid/extensions/ColumnResizer',
	'dgrid/extensions/ColumnHider',
	'dojo/store/JsonRest',
	'dojo/store/Memory',
	'dojo/store/Observable',
	'dojo/dom-construct',
	'dojo/query',
	'dojo/_base/lang'],

    function(declare, on, AdminStore, TargetedJsonStore, Grid, OnDemandGrid, ColumnSet, Selection, Keyboard, ColumnReorder, ColumnResizer, ColumnHider, JsonRest, Memory, Observable, domConstruct, query, lang){
         return declare('admin.TargetedGrid', [OnDemandGrid, ColumnSet, Selection, Keyboard, ColumnReorder, ColumnResizer], {
			
			collection: "",
			
			schema: null,
			
	    	minRowsPerPage: 25,
	    	
	    	maxRowsPerPage: 25,
	    	
	    	bufferRows: 0,
	    	
	        columnSets: null,
	        
	        columns: [{label:"_id", field:"_id", id:"_id"}, {label:"text", field:"text"}],
	        
	        target: null,
	        
	        data: null,
	        
	        //sort: "col3", // initially sort by col3 ascending
			
			loadingMessage: "Loading...",
			
			actionLabel: "Action",
			
			displays: null,
        	        	        	             	
        	constructor : function(args) {
        		for(var key in args)
        			this[key] = args[key];
        		
				var me = this; 
				if(this.target){    	       		
        			var store = new TargetedJsonStore({target:this.target});
        		}
        		else{
        			var store = new Observable(new Memory({data:this.data}));
        		}
        		this.store = store;
        		this.noDataMessage = "No "+this.collection+" item";
			 			 
			 	var columnSets = [[[{label:"_id", field:"_id", id:"_id", renderCell: function(object, value, node, options){
							        	node.innerHTML = value;
						        	}}]], [[
			 		{label: this.actionLabel, field: '', sortable: false, renderCell: this.renderActionCell}]]];
				
			 	this.displays = {_id: true};
			 	
			 	//closure principle to keep context
			 	var func = function(key){
	 			if(key != "_id" && key != "_meta__" && key != "_collectionsByModel__" && (!me.schema._meta__.hiddenFields || me.schema._meta__.hiddenFields.indexOf(key)==-1)){
	 				
	 				me.displays[key] = (!me.schema._meta__.summaryFields || me.schema._meta__.summaryFields.indexOf(key)!=-1);
	 				
		 			var column;
		 			
			 			switch(me.schema[key]){
			 				case "Date":
			 					column = {label:key, field:key, renderCell: function(object, value, node, options){
			 						if(value)
						        		node.innerHTML = new Date(value);
						        	if(!me.displays[key])
						        		node.style.display = "none";
					        	}};
					        	break;
					        case "String":
					        	column = {label:key, field:key, renderCell: function(object, value, node, options){
					        		if(value)
						        		node.innerHTML = value;
						        	if(!me.displays[key])
						        		node.style.display = "none";
					        	}};
					        	break;
					        case "Number":
					        	column = {label:key, field:key, renderCell: function(object, value, node, options){
					        		if(value!=null && value!=undefined)
						        		node.innerHTML = value;
						        	if(!me.displays[key])
						        		node.style.display = "none";
					        	}};
					        	break;
					        case "Boolean":
					        	column = {label:key, field:key, renderCell: function(object, value, node, options){
					        		if(value!=null && value!=undefined)
						        		node.innerHTML = value;
						        	if(!me.displays[key])
						        		node.style.display = "none";
					        	}};
					        	break;
			 				default:
			 					column = {label:key, field:key, renderCell: function(object, value, node, options){
			 						if(value)
						        		node.innerHTML = value;
						        	if(!me.displays[key])
						        		node.style.display = "none";
					        	}};
			 					break;
			 			}
			 			
			 			columnSets[0][0].push(column);
			 		}	
		 		}
			 	
			 	for(var key in this.schema){
			 		func(key);
			 	}
			 	
			 	this.columnSets = columnSets;
        	},
        	
        	postCreate: function(){
        		this.inherited(arguments);
        		for(var key in this.displays){
			 		if(!this.displays[key])
			 			this.hideColumn(key);
			 	}
        	},
        	
        	displayColumn: function(column){
        		query(".grid .field-"+column).style("display", "");
				this.displays[column] = true;	
        	},
        	
        	hideColumn: function(column){
        		query(".grid .field-"+column).style("display", "none");
				this.displays[column] = false;	
        	},
        	
        	setColumnVisible: function(column, visible){
        		if(visible)
        			this.displayColumn(column);
        		else
        			this.hideColumn(column);
        	},
        	
        	setSearch: function(search){
        		this.store.fullSearch = search;
        	},
        	
        	renderActionCell: function(object, value, node, options){
	        	var button = domConstruct.create("button", {innerHTML:"action"}, node);
	        	on(button, "click", function(evt){
	        		evt.stopPropagation();
	        	});
	        }
        	
        });
}); 
