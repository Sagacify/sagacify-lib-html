// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/Collection.html',
	'./CollectionHeader',
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
	'dojo/dom-construct',
	'dojo/query',
	'dojo/_base/lang',
	'admin/widgets/Common/DocsGrid'],

    function(declare, _Widget, template, CollectionHeader, on, AdminStore, TargetedJsonStore, Grid, OnDemandGrid, ColumnSet, Selection, Keyboard, ColumnReorder, ColumnResizer, ColumnHider, JsonRest, Memory, domConstruct, query, lang, DocsGrid){
         return declare('admin.Collection', [_Widget], {

			templateString: template,
			
			name: "",
			
			schema: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var adminStore = AdminStore.singleton();
				var me = this;
				adminStore.getSchema(this.name).then(function(schema){
					console.log(schema);
					me.schema = schema;
					me.adminGrid = new DocsGrid({collection:me.name, schema:schema, target:"/adminapi/collections/"+me.name}, me.gridNode);
					me.adminGrid.grid.on(".dgrid-row:click", function(evt){
						var row = me.adminGrid.grid.row(evt);
					    History.pushState(null, null, "/admin/collections/"+me.name+"/"+row.data._id);
					});
					//collectionGrid.startup();
					//me.createColumnDisplayers(me.collectionGrid.displays);
				}, function(error){
					console.log(error);
				});
				
				on(this.createButton, "click", function(evt){
					History.pushState(null, null, "/admin/collections/"+me.name+"/new");
				});
				
				on(this.searchNode, "keyup", function(evt){
					if(me.adminGrid.grid.store.fullSearch != me.searchNode.value){
						me.adminGrid.grid.setSearch(me.searchNode.value);
						me.adminGrid.grid.refresh();
					}
				});

          	},
          	
          	createColumnDisplayers: function(displays){
          		var me = this;
          		this.displayBoxes = {};
          		var handleCheckboxChange = function(column){
          			on(checkbox, "change", function(evt){
          				me.collectionGrid.setColumnVisible(column, evt.target.checked);
          			});
          		}
          		for(var key in displays){
          			var checkbox = domConstruct.create("input", {type:"checkbox", checked:displays[key]}, this.columnDisplayersNode);
          			domConstruct.create("label", {innerHTML: key}, this.columnDisplayersNode);
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
        	
        	createTable: function() { 
        		var me = this;       	       		
        		var store = new TargetedJsonStore({target:"http://localhost:4000/adminapi/collections/examples", headers:{Authorization:"bearer "+localStorage.access_token}});
				//var jsonStore = new JsonRest({target:"http://localhost:4000/adminapi/collections/examples", headers:{Authorization:"bearer "+localStorage.access_token}});
			 
			 	var ComplexGrid = declare([OnDemandGrid, ColumnSet, Selection, Keyboard, ColumnReorder, ColumnResizer]);
			 
			 	var columnSets = [[[{label:"_id", field:"_id", id:"_id", renderCell: function(object, value, node, options){
			 							if(me.hidden)
			 								node.style.display = "none";
							        	node.innerHTML = value;
						        	}}]], [[
			 		{label: 'Action', field: '', sortable: false, renderCell: function(object, value, node, options){
			        	var button = domConstruct.create("button", {innerHTML:"action"}, node);
			        	on(button, "click", function(evt){
			        		evt.stopPropagation();
			        	});
			        }}]]];
				
			 	
			 	//closure principle to keep context
			 	var func = function(key){
		 			if(key != "_id" && key != "_meta__" && (!me.schema._meta__.summaryFields || me.schema._meta__.summaryFields.indexOf(key)!=-1) && (!me.schema._meta__.hiddenFields || me.schema._meta__.hiddenFields.indexOf(key)==-1)){
			 			var column;
			 			var type = me.schema[key].type?me.schema[key].type:me.schema[key];
			 			
			 			var splitType = type.split("_");
			 			if(splitType.length == 1){
				 			switch(splitType[0]){
				 				case "Date":
				 					column = {label:key, field:key, renderCell: function(object, value, node, options){
							        	node.innerHTML = new Date(value);
						        	}};
						        	break;
						        case "String":
						        	column = {label:key, field:key};
						        	break;
						        case "Number":
						        	column = {label:key, field:key};
						        	break;
						        case "Boolean":
						        	column = {label:key, field:key};
						        	break;
				 				default:
				 					column = {label:key, field:key};
				 					break;
				 			}
			 			}
			 			else{
			 				var subtype = splitType[1];
			 				column = {label:key, field:key/*, renderCell: function(object, value, node, options){
					        	//node.innerHTML = "[" + " " + subtype + "s (" + value.length + ") ]";
				        	}*/};
			 			}
			 			columnSets[0][0].push(column);
			 		}	
		 		}
			 	
			 	for(var key in this.schema){
			 		func(key);
			 	}
			    var grid = new ComplexGrid({
			    	store:store,
			    	minRowsPerPage: 25,
			    	maxRowsPerPage: 25,
			    	bufferRows: 0,
			        columnSets: columnSets,
			        //columns: {_id:"_id", text:"text"},
			        //sort: "col3", // initially sort by col3 ascending
					noDataMessage: "No "+this.name+" item",
					loadingMessage: "Loading..."
			    }, this.gridNode);

			    //grid.refresh();
			    //grid.startup();
			    startupQueue.push(grid);
			    var me = this;
				/*grid.on(".dgrid-row:click", function(evt){
					var row = grid.row(evt);
				    History.pushState(null, null, "/admin/collections/"+me.name+"/"+row.data._id);
				});*/
				
        	}
        	
        });
}); 
