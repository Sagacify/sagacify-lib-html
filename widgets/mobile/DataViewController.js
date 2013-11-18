define([
	'dojo/_base/declare', 
	'./TableViewController',
	'./SearchBar',
	'dojo/on'], 
	
	function(declare, TableViewController, SearchBar, on) {
	
	return declare('saga.DataViewController', [TableViewController], {
		
		data: null,
		
		dataItemKey: null,
		
		dataItemFilterKey: null,
		
		dataItemSortKey: null,
		
		processedData: null,
		
		searchBarFixed: false,
				
		constructor: function(args) {

		},	
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.dataItemKey){
				this.dataItemFilterKey = this.dataItemKey;
				this.dataItemSortKey = this.dataItemKey;
			}
			
			if(this.dataItemFilterKey){
				this.addSearchBar(this.searchBarFixed);
				var me = this;
				// on(this.searchBar.searchFieldNode, "keyup", function(evt){
				// 	me.filterData(me.searchBar.searchFieldNode.value);
				// 	me.reload();
				// });
				var queryString = '';
				var searchTimeout;
				on(me.searchBar.searchFieldNode, 'keydown', function (evnt) {
					on(me.searchBar.searchFieldNode, 'keyup', function (evt) {
						if((queryString !== me.searchBar.searchFieldNode.value) && me.searchBar.searchFieldNode.value.length) {
							queryString = me.searchBar.searchFieldNode.value;
							clearTimeout(searchTimeout);
							searchTimeout = setTimeout(function () {
								me.filterData(queryString);
								me.reload();
							}, 300);
						}
					});
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
					//return item[me.dataItemFilterKey].substring(0, text.length).toLowerCase() == text.toLowerCase();
					return item[me.dataItemFilterKey].match(new RegExp(text, "gi"));
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
