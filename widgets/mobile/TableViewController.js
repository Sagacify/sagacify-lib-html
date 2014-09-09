define([
	'dojo/_base/declare', 
	'dojo/on', 
	'saga/widgets/mobile/ViewController',
	'saga/widgets/mobile/_ScrollableView',
	'saga/widgets/mobile/SearchBar',
	'dojo/Evented', 
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/dom-style',
	'dojo/query', 
	'dojox/mobile/EdgeToEdgeList', 
	'dojox/mobile/EdgeToEdgeCategory', 
	'dojox/mobile/RoundRectList', 
	'dojox/mobile/RoundRectCategory', 
	'dojo/date/locale',
	'dojo/has',
	'dojo/_base/lang'], 
	function(declare, on, ViewController, ScrollableView, SearchBar, Evented, domConstruct, domClass, domStyle, query, EdgeToEdgeList, EdgeToEdgeCategory, RoundRectList, RoundRectCategory, locale, has, lang) {
	
	return declare('saga.TableViewController', [ViewController], {
				
		parent: null,
		
		frame: null,
		
		_headers: null,
		
		_cellsBySection: null,
		
		_type: "EdgeToEdge",
		
		_containerClass: null,
		
		_options: null,
		
		pullToRefresh: false,
		
		_pullDownDiv: null,
		
		_cellsContainersBySection: null,
		
		_transparentBg: false,
		
		_slidingAfterLoading: false,
		
		searchBar: null,
		
		searchBarFixed: false,
		
		swapHeader: null,
		
		stickedHeaders: false,
		
		highlightCellSelection: false,
						
		constructor: function(args) {
			if(args) {
				this._type = args.type;
				//options.roundrect_marginside to fix the size between the edge of the table and the cells
				this._options = args.options;
				this.frame = args.frame;
				this.parent = args.parent;
				this._containerClass = args.containerClass;
				this._transparentBg = args.transparentBg;
			}
		},		
		
		postCreate: function() {
			this.inherited(arguments);

			if(window.uiDegradation){
				this.pullToRefresh = false;
			}
			
			var scrollableView = new ScrollableView({pullToRefresh:this.pullToRefresh, tableViewController:this, frame:this.getFrame()});
			scrollableView.domNode.style.left = this.frame.x+"px";
			scrollableView.domNode.style.top = this.frame.y+"px";
			scrollableView.domNode.style.width = this.frame.width+"px";
			scrollableView.domNode.style.height = this.frame.height+"px";
			scrollableView.placeAt(this.domNode);
			if(!window.uiDegradation){
				scrollableView.startup();
			}
			this.scrollableView = scrollableView;
			
			if(this.stickedHeaders)
				this.stickHeaders();
		},
		
		reload: function() {
			this.inherited(arguments);
			var keepFirstSection = null;
			this._cellsContainersBySection = [];
			dojo.forEach(this._headers, function(header, i){
				if(header){
					if(header.destroyRecursive)
						header.destroyRecursive();
					else
						domConstruct.destroy(header);
				}
			});
			
			dojo.forEach(this._cellsBySection, function(section, i){
				dojo.forEach(section, function(cell, j){
					if(cell && !(keepFirstSection && i==0)){
						if(cell.destroyRecursive)
							cell.destroyRecursive();
						else
							domConstruct.destroy(cell);
					}
				});
			});
			
			if(this.noItemCell){
				if(this.noItemCell.destroyRecursive)
					this.noItemCell.destroyRecursive();
				else
					domConstruct.destroy(this.noItemCell);
				this.noItemCell = null;
			}
			
			this._headers = [];
			if(keepFirstSection)
				this._cellsBySection = [this._cellsBySection[0]];
			else
				this._cellsBySection = [];

			//this.scrollableView.scrollTo({x:0, y:0});
			
			var numberOfSections = this.numberOfSections;
			if(!(numberOfSections > -1))
				numberOfSections = this.numberOfSections();
			var noItem = true;
			for (var i = keepFirstSection?1:0; i < numberOfSections; i++) {
				
				var header = this.viewForHeaderInSection(i);
				if (header){
					if(header.domNode)
						this.scrollableView.containerNode.appendChild(header.domNode);
					else
						this.scrollableView.containerNode.appendChild(header);
					this._headers.push(header);
				}
					
				var cells = [];

				var cellsContainer = domConstruct.create("ul", {"class":this.classForSection(i)});	
				this._cellsContainersBySection.push(cellsContainer);
				
				var numberOfRowsInSection = this.numberOfRowsInSection(i);
				for (var j = 0; j < numberOfRowsInSection; j++) {
					noItem = false;
					var cell = this.cellForRowAtIndexPath({section:i, row:j});
					if (cell) {
						if(cell.domNode)
							cellsContainer.appendChild(cell.domNode);
							//cellsContainer.addChild(cell);
						else
							cellsContainer.appendChild(cell);
					}
						
					cells.push(cell);
					//cell.setDelegate({delegate:this, indexPath:{section:i, row:j}});
				}
				this._cellsBySection.push(cells);
				this.scrollableView.containerNode.appendChild(cellsContainer);
			}
			
			if(noItem){
				var cell = this.cellForNoItem();
				if(cell) {
					if(cell.domNode)
						this.scrollableView.containerNode.appendChild(cell.domNode);
						//cellsContainer.addChild(cell);
					else
						this.scrollableView.containerNode.appendChild(cell);
					this.noItemCell = cell;
				}
			}	
						
			var me = this;
			dojo.forEach(this._cellsBySection, function(cells, i){
				dojo.forEach(cells, function(cell, j){
					if(cell){
					var node = cell.domNode?cell.domNode:cell;
					on(node, selectEvent, function(evt){
						var revealViewController = me.revealViewController;
						var navigationController = me.navigationController?me.navigationController:me.parent?me.parent.navigationController:null;
						if((revealViewController || navigationController) && cell.clickable){
							if(typeof cell.select == "function")
								cell.select();
							else
								domClass.add(node, "selected");

							var unselectCell = function(cell){
								if(typeof cell.unselect == "function")
									cell.unselect();
								else
									domClass.remove(node, "selected");
							}
							if(navigationController){
								navigationController.frontViewController().on("afterTransitionOut", function(args){
									unselectCell(cell)
								});
							}
							if(revealViewController){
								on(revealViewController, "revealEnd", function(args){
									unselectCell(cell);
								});
							}
						}
						me.didSelectRowAtIndexPath({section:i, row:j});	
					});
					
					/*if(has("android") >=3 && !(keepFirstSection && i==0)){
						on(node, "touchend", function(evt){
							var touches = evt.changedTouches,
		      				first = touches[0],
		      				type = "";
							var simulatedEvent = document.createEvent("MouseEvent");
		   					simulatedEvent.initMouseEvent("click", true, true, window, 1, 
		                              first.screenX, first.screenY, 
		                              first.clientX, first.clientY, false, 
		                              false, false, false, 0, null);
							
							if(node.clickEvent)
								node.dispatchEvent(simulatedEvent);
	    					evt.preventDefault();
						});
						on(node, "touchstart", function(evt){
							node.clickEvent = true;
						});
						on(node, "touchmove", function(evt){
							node.clickEvent = false;
						});
					}*/
					}
				});
			});
		},
		
		numberOfSections: 0,
		
		numberOfRowsInSection: function(section) {
			return 0;
		},
		
		viewForHeaderInSection: function(section) {
			return null;
		},
		
		cellForRowAtIndexPath: function(indexPath) {
			return null;
		},
		
		didSelectRowAtIndexPath: function(indexPath) {
			//console.log(indexPath.section + ", " + indexPath.row);
			//console.log(indexPath);
			/*var cell = this.existingCellForRowAtIndexPath(indexPath);
			var navigationController = this.navigationController?this.navigationController:this.parent?this.parent.navigationController:null;
			if(navigationController){
				var cellNode = cell.domNode?cell.domNode:cell;
				domClass.add(cellNode, "selected");
				navigationController.frontViewController().on("afterTransitionOut", function(args){
					domClass.remove(cellNode, "selected");
				});
			}*/
		},
		
		cellForNoItem: function(){
			//To be implemented by subclasses
		},
		
		classForSection: function(section){
			//To be implemented by subclasses
		},
		
		existingViewForHeaderInSection: function(section) {
			return this._headers[section];
		},
		
		existingCellForRowAtIndexPath: function(indexPath) {
			if(!this._cellsBySection)
				return null;
			if(!this._cellsBySection[indexPath.section])
				return null;
			return this._cellsBySection[indexPath.section][indexPath.row];
		},

		fitToContainerSize: function(){
			//this.scrollableView.domNode.style.overflow = 'scroll';
			return
			this.scrollableView.containerNode.style.position = 'relative';
			this.scrollableView.domNode.style.height = '';
			return
			this.frame.height = this.scrollableView.containerNode.clientHeight;
			this.scrollableView.domNode.style.height = this.frame.height + 'px';
			this.setFrame(this.frame);
			this.containerNode.style.height = this.frame.height + 'px';
			this.domNode.style.height = this.frame.height + 'px';
		},
		
		scrollToSection: function(section) {
			var to = {x:0, y:0};
			for(var i = 0; i < section; i++) {
				to.y -= this._headers[i].domNode?this._headers[i].domNode.clientHeight:this._headers[i].clientHeight;

				if(this._cellsBySection[i].length > 0){
					var cs = domStyle.getComputedStyle(this._cellsBySection[i][0].domNode.parentNode);
					to.y -= (this._cellsBySection[i][0].domNode.parentNode.clientHeight+parseInt(cs.marginTop, 10)+parseInt(cs.marginBottom, 10));
				}
				//for(var j = 0; j < this._cellsBySection[i].length; j++) {
					//to.y -= this._cellsBySection[i][j].domNode.clientHeight;
				//}
			}
			if(this.searchBar && !this.searchBarFixed)
				to.y -= this.searchBar.height;
			
			if(to.y > 0)
				to.y = 0;
				
			var min = this.frame.height-this.scrollableView.domNode.children[0].clientHeight;
			if(this.searchBar && this.searchBarFixed)
				min -= this.searchBar.height; 
			if(to.y < min)
				to.y = min;
				
			this.scrollableView.slideTo(to, 0.5, "ease-out");
			//this.scrollableView.scrollTo(to);
		},
		
		reloadTableViewDataSource: function() {
			//to be implemented by subclasses and call tableViewDataSourceReloadDone when reload done
		},
		
		tableViewDataSourceReloadDone: function() {
			this.scrollableView.tableViewDataSourceReloadDone();
		},
		
		/*setWidth:function(width) {
			if(this._type == "EdgeToEdge") {
				this.domNode.style.width = width+"px";
				this._cellsContainer.domNode.style.width = width+"px";
			}
			else {
				var marginside = 10;
				if(this._options && this._options.roundrect_marginside)
					marginside = this._options.roundrect_marginside;
				this.domNode.style.width = width+"px";
				this._cellsContainer.domNode.style.width = (width-marginside*2)+"px";
			}
		},*/
		
		addSearchBar: function(fixed){
			var searchBar = new SearchBar();
			if(fixed){
				searchBar.placeAt(this.domNode, "first");
				this.scrollableView.domNode.style.height = (this.frame.height-searchBar.height)+"px";
			}
			else
				searchBar.placeAt(this.scrollableView.containerNode);
			this.searchBar = searchBar;
		},
		
		sectionSize: function(section){
			var sectionSize = 0;
			var header = this.existingViewForHeaderInSection(section);
			if(header){
				var headerNode = header.domNode?header.domNode:header;
				sectionSize = headerNode.clientHeight;	
			}
			for(var i = 0; i < this.numberOfRowsInSection(section); i++){
				var row = this.existingCellForRowAtIndexPath({section:section, row:i});
				if(row){
					var rowNode = row.domNode?row.domNode:row;
					sectionSize += rowNode.clientHeight;	
				}
			}
			return sectionSize;
		},
		
		stickHeaders: function(){
			var swapHeader = domConstruct.create("div", {id:"swapHeader", style:"position:absolute;top:0px;left:0px;width:"+this.frame.width+"px;"}, this.domNode);
			this.swapHeader = swapHeader;
			
			var me = this;
			var getCurrentSection = function(curY){
				if(curY > 0)
					return -1;
				var numberOfSections = typeof me.numberOfSections == "function"?me.numberOfSections():me.numberOfSections;
				var totalSize = 0; 
				for(var i = 0; i < numberOfSections; i++){
					totalSize += me.sectionSize(i);
					if(totalSize > -curY)
						return i; 
				}
				return numberOfSections-1;
			}
			
			var currentSwapSection = -1;
			var handleSwap = function(){
				var curY = me.scrollableView.getPos().y;
				var currentSection = getCurrentSection(curY);
				if(currentSection != currentSwapSection){
					currentSwapSection = currentSection;
					domConstruct.empty(me.swapHeader);
					if(currentSwapSection != -1){
						var header = me.existingViewForHeaderInSection(currentSwapSection);
						if(header){
							var headerNode = header.domNode?header.domNode:header;
							domConstruct.place(lang.clone(headerNode), me.swapHeader);
						}
					}
				}
				var sectionsSize = 0;
				for(var i = 0; i <= currentSection; i++)
					sectionsSize += me.sectionSize(i);
				me.swapHeader.style.top = Math.min(0, sectionsSize-me.swapHeader.clientHeight+curY)+"px";
			}
			
			on(this.scrollableView, "scroll", function(to){
				//console.log("scroll from: "+me.scrollableView.getPos().y+" to:"+to.y);
				if(me.swapInterval)
					clearInterval(me.swapInterval);
				handleSwap();
			});
			
			on(this.scrollableView, "slide", function(to){
				//console.log("slide from: "+me.scrollableView.getPos().y+" to:"+to.y);
				if(me.swapInterval)
					clearInterval(me.swapInterval);
				
				me.swapInterval = setInterval(function(){
					handleSwap();
					var curY = me.scrollableView.getPos().y;
					if(curY == to.y)
						clearInterval(me.swapInterval);
				}, 1);
			});
		},
		
		addContainerClass: function(cl){
			domClass.add(this.scrollableView.containerNode, cl);
		},
		
		addUlClass: function(cl){
			dojo.forEach(this.scrollableView.containerNode.children, function(ul, i){
				domClass.add(ul, cl);
			});
		},
		
		handleCellTexts: function(){
			dojo.forEach(this._cellsBySection, function(section, i){
				dojo.forEach(section, function(cell, j){
					if(cell.handleText)
						cell.handleText();
				});
			});
		},

		scrollTo: function(to){
			this.scrollableView.scrollTo(to);
		},

		slideTo: function(to){
			this.scrollableView.slideTo(to);
		},

		scrollToBottom: function(){
			this.scrollTo({y:this.frame.height-this.scrollableView.containerNode.clientHeight})
		},

		slideToBottom: function(){
			this.slideTo({y:this.frame.height-this.scrollableView.containerNode.clientHeight})
		},

		scrollToTop: function(){
			this.scrollTo({y:0})
		},

		slideToTop: function(){
			this.slideTo({y:0})
		}

		
	});
});
