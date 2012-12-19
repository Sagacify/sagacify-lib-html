define([
	'dojo/_base/declare', 
	'./DataViewController',
	'./DirectoryBar',
	'dojo/on'], 
	
	function(declare, DataViewController, DirectoryBar, on) {
	
	return declare('saga.DirectoryViewController', [DataViewController], {
		
		_classifiedItems: null,
		
		_barCorrespondances: null,
				
		constructor: function(args) {
			
		},	
		
		postCreate: function() {
			this.inherited(arguments);
			if(this.searchBar)
				this.searchBar.searchFieldNode.style.width = (this.frame.width-50)+"px";
			
			var directoryBar = new DirectoryBar({height:this.frame.height-20});
			directoryBar.placeAt(this.domNode);
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
				return item1[me.dataItemSortKey] > item2[me.dataItemSortKey];
			});	

			for(var i = 0; i < 27; i++)
				this._classifiedItems.push([]);
			
			dojo.forEach(sortedItems, function(item, i){
				var firstChar = item[me.dataItemSortKey].charAt(0);
				var correspondingIndex = 26;
				if(firstChar == 'A' || firstChar == 'a')
					correspondingIndex = 0;
				if(firstChar == 'B' || firstChar == 'b')
					correspondingIndex = 1;
				if(firstChar == 'C' || firstChar == 'c')
					correspondingIndex = 2;
				if(firstChar == 'D' || firstChar == 'd')
					correspondingIndex = 3;
				if(firstChar == 'E' || firstChar == 'e')
					correspondingIndex = 4;
				if(firstChar == 'F' || firstChar == 'f')
					correspondingIndex = 5;
				if(firstChar == 'G' || firstChar == 'g')
					correspondingIndex = 6;
				if(firstChar == 'H' || firstChar == 'h')
					correspondingIndex = 7;
				if(firstChar == 'I' || firstChar == 'i')
					correspondingIndex = 8;
				if(firstChar == 'J' || firstChar == 'j')
					correspondingIndex = 9;
				if(firstChar == 'K' || firstChar == 'k')
					correspondingIndex = 10;
				if(firstChar == 'L' || firstChar == 'l')
					correspondingIndex = 11;
				if(firstChar == 'M' || firstChar == 'm')
					correspondingIndex = 12;
				if(firstChar == 'N' || firstChar == 'n')
					correspondingIndex = 13;
				if(firstChar == 'O' || firstChar == 'o')
					correspondingIndex = 14;
				if(firstChar == 'P' || firstChar == 'p')
					correspondingIndex = 15;
				if(firstChar == 'Q' || firstChar == 'q')
					correspondingIndex = 16;
				if(firstChar == 'R' || firstChar == 'r')
					correspondingIndex = 17;
				if(firstChar == 'S' || firstChar == 's')
					correspondingIndex = 18;
				if(firstChar == 'T' || firstChar == 't')
					correspondingIndex = 19;
				if(firstChar == 'U' || firstChar == 'u')
					correspondingIndex = 20;
				if(firstChar == 'V' || firstChar == 'v')
					correspondingIndex = 21;
				if(firstChar == 'W' || firstChar == 'w')
					correspondingIndex = 22;
				if(firstChar == 'X' || firstChar == 'x')
					correspondingIndex = 23;
				if(firstChar == 'Y' || firstChar == 'y')
					correspondingIndex = 24;
				if(firstChar == 'Z' || firstChar == 'z')
					correspondingIndex = 25;
					
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
		
			me.processedData = [];
			dojo.forEach(me._classifiedItems, function(itemGroup, i) {
				if(itemGroup.length > 0) {
					var letter = "#";
					if(i == 0)
						letter = "A";
					if(i == 1)
						letter = "B";
					if(i == 2)
						letter = "C";
					if(i == 3)
						letter = "D";
					if(i == 4)
						letter = "E";
					if(i == 5)
						letter = "F";
					if(i == 6)
						letter = "G";
					if(i == 7)
						letter = "H";
					if(i == 8)
						letter = "I";
					if(i == 9)
						letter = "J";
					if(i == 10)
						letter = "K";
					if(i == 11)
						letter = "L";
					if(i == 12)
						letter = "M";
					if(i == 13)
						letter = "N";
					if(i == 14)
						letter = "O";
					if(i == 15)
						letter = "P";
					if(i == 16)
						letter = "Q";
					if(i == 17)
						letter = "R";
					if(i == 18)
						letter = "S";
					if(i == 19)
						letter = "T";
					if(i == 20)
						letter = "U";
					if(i == 21)
						letter = "V";
					if(i == 22)
						letter = "W";
					if(i == 23)
						letter = "X";
					if(i == 24)
						letter = "Y";
					if(i == 25)
						letter = "Z";
					me.processedData.push({letter:letter, rows:itemGroup});
				}
			});

		}

	});
});
