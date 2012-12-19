define([
	'dojo/_base/declare', 
	'./TableViewController',
	'./SearchBar',
	'dojo/on'], 
	
	function(declare, TableViewController, SearchBar, on) {
	
	return declare('saga.DataViewController', [TableViewController], {
		
		data: null,
		
		dataItemFilterKey: null,
		
		dataItemSortKey: null,
		
		processedData: null,
				
		constructor: function(args) {
			if(args.dataItemKey){
				this.dataItemFilterKey = args.dataItemKey;
				this.dataItemSortKey = args.dataItemKey;
			}
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.dataItemFilterKey){
				var searchBar = new SearchBar();
				searchBar.placeAt(this.scrollableView.containerNode);
				this.searchBar = searchBar;
				var me = this;
				on(searchBar.searchFieldNode, "keyup", function(evt){
					me.filterData(searchBar.searchFieldNode.value);
					me.reload();
				});
			}
			
			this.processData(this.data);
		},
		
		numberOfSections: function(){
			return 1;
		},
		
		numberOfRowsInSection: function(section) {
			return this.processedData.length;
		},
		
		dataItemForRowAtIndexPath: function(indexPath){
			return this.processedData[indexPath.row];
		},
		
		cellForRowAtIndexPath: function(indexPath){
			var dataItem = this.dataItemForRowAtIndexPath(indexPath);
			return this.cellForDataItem(dataItem);
		},
		
		cellForDataItem: function(item){
			//To be implemented by subclasses
		},
		
		filterData: function(text){
			if(!text){
				this.processData(this.data);
			}
			else{
				var me = this;
				var filteredData = this.data.filter(function(item){
					return item[me.dataItemFilterKey].substring(0, text.length).toLowerCase() == text.toLowerCase();
				});	
				this.processData(filteredData);	
			}
		},
		
		processData: function(data){
			var me = this;
			if(this.dataItemSortKey){
				this.processedData = data.sort(function(item1, item2){
					return item1[me.dataItemSortKey] > item2[me.dataItemSortKey];
				});	
			}
			else{
				this.processedData = data;
			}	
		}

	});
});
