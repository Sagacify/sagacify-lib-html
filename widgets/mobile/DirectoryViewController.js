
define([
	'dojo/_base/declare', 
	'./DataViewController',
	'./DirectoryBar',
	'dojo/on'], 
	
	function(declare, DataViewController, DirectoryBar, on) {
	
	return declare('saga.DirectoryViewController', [DataViewController], {
		
		_classifiedItems: null,
		
		_barCorrespondances: null,

		starLabel: "Main",

		directoryBar: true,
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.searchBar)
				this.searchBar.searchFieldNode.style.width = (this.frame.width-50)+"px";

			if(this.directoryBar && !window.uiDegradation){
				var directoryBar = new DirectoryBar({height:this.frame.height-20, searchItem:!this.searchBarFixed, star:this.staredItems()!=undefined});
				directoryBar.placeAt(this.domNode);
				var me = this;
				on(directoryBar, "letterSelected", function(letterIndex){
					if(letterIndex == -1)
						me.scrollableView.slideTo({y:0}, 0.5, "ease-out");
					else
						me.scrollToSection(me._barCorrespondances[letterIndex], me.searchBarFixed?0:43);
				});

				on(this.searchBar.searchFieldNode, "keyup", function(evt){
					if(me.searchBar.searchFieldNode.value)
						directoryBar.domNode.style.display = "none";
					else
						directoryBar.domNode.style.display = "";
				});
			}
		},
		
		numberOfSections: function(){
			return this.processedData.length;
		},
		
		numberOfRowsInSection: function(section) {
			return this.processedData[section].rows.length;
		},
		
		viewForHeaderInSection: function(section){
			if(!this.searchBar.searchFieldNode.value){
				var letter = this.processedData[section].letter;
				return this.headerForLetter(letter);	
			}
		},
		
		headerForLetter: function(letter){
			//To be implemented by subclasses
		},
		
		dataItemForRowAtIndexPath: function(indexPath){
			return this.processedData[indexPath.section].rows[indexPath.row];
		},
		
		cellForDataItem: function(item){
			//To be implemented by subclasses
		},
		
		processData: function(data){
			if(!this.dataItemSortKey){
				this.processedData = this.data;
				return;
			}
			
			var me = this;
			
			this._classifiedItems = [];
			this._barCorrespondances = [];
			
			var sortedItems = data.sort(function(item1, item2){
				if(typeof item1[me.dataItemSortKey] == "string" && typeof item2[me.dataItemSortKey] == "string"){
					return item1[me.dataItemSortKey].localeCompare(item2[me.dataItemSortKey]);
				}
				else{
					return item1[me.dataItemSortKey] > item2[me.dataItemSortKey];
				}
			});	
			
			var staredItems = this.staredItems();
			var offsetStar = 0;
			if(staredItems && !this.searchBar.searchFieldNode.value){
				offsetStar = 1;
				this._classifiedItems.push([]);
				dojo.forEach(staredItems, function(staredItem, i){
					me._classifiedItems[0].push(staredItem);
				});
			}

			for(var i = 0; i < 27; i++)
				this._classifiedItems.push([]);
			dojo.forEach(sortedItems, function(item, i){
				var firstChar = item[me.dataItemSortKey].charAt(0);
				var correspondingIndex = 26+offsetStar;
				if(firstChar == 'A' || firstChar == 'a')
					correspondingIndex = 0+offsetStar;
				if(firstChar == 'B' || firstChar == 'b')
					correspondingIndex = 1+offsetStar;
				if(firstChar == 'C' || firstChar == 'c')
					correspondingIndex = 2+offsetStar;
				if(firstChar == 'D' || firstChar == 'd')
					correspondingIndex = 3+offsetStar;
				if(firstChar == 'E' || firstChar == 'e')
					correspondingIndex = 4+offsetStar;
				if(firstChar == 'F' || firstChar == 'f')
					correspondingIndex = 5+offsetStar;
				if(firstChar == 'G' || firstChar == 'g')
					correspondingIndex = 6+offsetStar;
				if(firstChar == 'H' || firstChar == 'h')
					correspondingIndex = 7+offsetStar;
				if(firstChar == 'I' || firstChar == 'i')
					correspondingIndex = 8+offsetStar;
				if(firstChar == 'J' || firstChar == 'j')
					correspondingIndex = 9+offsetStar;
				if(firstChar == 'K' || firstChar == 'k')
					correspondingIndex = 10+offsetStar;
				if(firstChar == 'L' || firstChar == 'l')
					correspondingIndex = 11+offsetStar;
				if(firstChar == 'M' || firstChar == 'm')
					correspondingIndex = 12+offsetStar;
				if(firstChar == 'N' || firstChar == 'n')
					correspondingIndex = 13+offsetStar;
				if(firstChar == 'O' || firstChar == 'o')
					correspondingIndex = 14+offsetStar;
				if(firstChar == 'P' || firstChar == 'p')
					correspondingIndex = 15+offsetStar;
				if(firstChar == 'Q' || firstChar == 'q')
					correspondingIndex = 16+offsetStar;
				if(firstChar == 'R' || firstChar == 'r')
					correspondingIndex = 17+offsetStar;
				if(firstChar == 'S' || firstChar == 's')
					correspondingIndex = 18+offsetStar;
				if(firstChar == 'T' || firstChar == 't')
					correspondingIndex = 19+offsetStar;
				if(firstChar == 'U' || firstChar == 'u')
					correspondingIndex = 20+offsetStar;
				if(firstChar == 'V' || firstChar == 'v')
					correspondingIndex = 21+offsetStar;
				if(firstChar == 'W' || firstChar == 'w')
					correspondingIndex = 22+offsetStar;
				if(firstChar == 'X' || firstChar == 'x')
					correspondingIndex = 23+offsetStar;
				if(firstChar == 'Y' || firstChar == 'y')
					correspondingIndex = 24+offsetStar;
				if(firstChar == 'Z' || firstChar == 'z')
					correspondingIndex = 25+offsetStar;
					
				me._classifiedItems[correspondingIndex].push(item);
			});
			
			dojo.forEach(me._classifiedItems, function(itemGroup, i) {
				if(i == 0)
					me._barCorrespondances.push(0);
				else if(itemGroup.length != 0)
					me._barCorrespondances.push(me._barCorrespondances[i-1]+1);
				else
					me._barCorrespondances.push(me._barCorrespondances[i-1]);
			});
		
			this.processedData = [];
			dojo.forEach(this._classifiedItems, function(itemGroup, i) {
				if(itemGroup.length > 0) {
					var letter = "#";
					if(staredItems && i == 0){
						letter = me.starLabel;
					}	
					if(i == 0+offsetStar)
						letter = "A";
					if(i == 1+offsetStar)
						letter = "B";
					if(i == 2+offsetStar)
						letter = "C";
					if(i == 3+offsetStar)
						letter = "D";
					if(i == 4+offsetStar)
						letter = "E";
					if(i == 5+offsetStar)
						letter = "F";
					if(i == 6+offsetStar)
						letter = "G";
					if(i == 7+offsetStar)
						letter = "H";
					if(i == 8+offsetStar)
						letter = "I";
					if(i == 9+offsetStar)
						letter = "J";
					if(i == 10+offsetStar)
						letter = "K";
					if(i == 11+offsetStar)
						letter = "L";
					if(i == 12+offsetStar)
						letter = "M";
					if(i == 13+offsetStar)
						letter = "N";
					if(i == 14+offsetStar)
						letter = "O";
					if(i == 15+offsetStar)
						letter = "P";
					if(i == 16+offsetStar)
						letter = "Q";
					if(i == 17+offsetStar)
						letter = "R";
					if(i == 18+offsetStar)
						letter = "S";
					if(i == 19+offsetStar)
						letter = "T";
					if(i == 20+offsetStar)
						letter = "U";
					if(i == 21+offsetStar)
						letter = "V";
					if(i == 22+offsetStar)
						letter = "W";
					if(i == 23+offsetStar)
						letter = "X";
					if(i == 24+offsetStar)
						letter = "Y";
					if(i == 25+offsetStar)
						letter = "Z";
					me.processedData.push({letter:letter, rows:itemGroup});
				}
			});
		},
		
		staredItems: function(){
			//To be implemented by subclasses
		}

	});
});
