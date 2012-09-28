define([
	'dojo/_base/declare', 
	'dojo/_base/connect', 
	'dojox/mobile/ScrollableView',
	'dojo/Evented', 
	'dojo/dom-construct',
	'dojo/dom-class', 
	'dojo/query', 
	'dojox/mobile/EdgeToEdgeList', 
	'dojox/mobile/EdgeToEdgeCategory', 
	'dojox/mobile/RoundRectList', 
	'dojox/mobile/RoundRectCategory', 
	'dojo/date/locale', 
	'spin/Spin'], 
	function(declare, connect, ScrollableView, Evented, domConstruct, domClass, query, EdgeToEdgeList, EdgeToEdgeCategory, RoundRectList, RoundRectCategory, locale) {
	
	return declare('bizComp.TableViewController', [ScrollableView, Evented], {
		
		parent: null,
		
		frame: null,
		
		_headers: null,
		
		_cellsBySection: null,
		
		_type: "EdgeToEdge",
		
		_containerClass: null,
		
		_options: null,
		
		_pullToRefresh: false,
		
		_pullDownDiv: null,
		
		_cellsContainer: null,
		
		_transparentBg: false,
		
		_slidingAfterLoading: false,
						
		constructor: function(args) {
			if(args) {
				this._type = args.type;
				//options.roundrect_marginside to fix the size between the edge of the table and the cells
				this._options = args.options;
				this.frame = args.frame;
				this._pullToRefresh = args.pullToRefresh;
				this.parent = args.parent;
				this._containerClass = args.containerClass;
				this._transparentBg = args.transparentBg;
			}
		},		
		
		postCreate: function() {
			if(this._pullToRefresh) {
				this._pullDownDiv = domConstruct.create("div", {style:"width:320px; height:500px; position:relative;"}, this.containerNode);
				this.containerNode.style.top = "-500px";
				dojo.style(this._pullDownDiv, "backgroundColor", new dojo.Color([226,231,237]));
				
				var statusDiv = domConstruct.create("div", {style:"top:452px;width:320px; height:20px; position:absolute;text-align:center;font-size:13px;font-weight:bold;", innerHTML:"Pull down to refresh..."}, this._pullDownDiv);
				dojo.style(statusDiv, "color", new dojo.Color([87,108,137]));
				this._pullDownDiv.statusDiv = statusDiv;
				
				var lastUpdateDiv = domConstruct.create("div", {style:"top:470px; width:320px; height:20px; position:absolute;text-align:center;font-size:12px;", innerHTML:"Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"})}, this._pullDownDiv);
				dojo.style(lastUpdateDiv, "color", new dojo.Color([87,108,137]));
				this._pullDownDiv.lastUpdateDiv = lastUpdateDiv;
				
				var arrowImg = domConstruct.create("img", {style:"display:block;position:absolute;left:25px;top:435px;", src:dojo.moduleUrl("bizComp/mobile/Assets/")+"blueArrow_down.png"}, this._pullDownDiv);
				this._pullDownDiv.arrowImg = arrowImg;
				
				var spinner = new Spinner({color:"gray", lines:12, length:3, width:2, radius:5}).spin();
	        	spinner.el.style.top = "468px";
	        	spinner.el.style.left = "40px";
	        	spinner.el.style.display = "none";
	        	this._pullDownDiv.appendChild(spinner.el);
	        	this._pullDownDiv.spinner = spinner.el;
      		}

        	if(this.frame)
        		this.setFrame(this.frame);
        	
			//this.reload();
		},
		
		reload: function() {
			this.inherited(arguments);
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
					if(cell){
						if(cell.destroyRecursive)
							cell.destroyRecursive();
						else
							domConstruct.destroy(cell);
					}
				});
			});
			
			this._headers = [];
			this._cellsBySection = [];
			
			
			this.scrollTo({x:0, y:0});
			
			
			var numberOfSections = this.numberOfSections;
			if(!(numberOfSections > -1))
				numberOfSections = this.numberOfSections();
			
			for (var i = 0; i < numberOfSections; i++) {
				
				var header = this.viewForHeaderInSection(i);
				if (header) 
					this.containerNode.appendChild(header.domNode);
				this._headers.push(header);
					
				var cells = [];
				
				var cellsContainer;
				if (this._type == "RoundRect") {
					cellsContainer = new RoundRectList();
					//fix the size between the edge of the table and the cells					
					if(this._options && this._options.roundrect_marginside) {
						cellsContainer.domNode.style.marginLeft = this._options.roundrect_marginside+"px";
						cellsContainer.domNode.style.marginRight = this._options.roundrect_marginside+"px";
					}
				}
				else {
					cellsContainer = new EdgeToEdgeList();
				}
				if(this._transparentBg)
					cellsContainer.domNode.style.background = "transparent";
				this._cellsContainer = cellsContainer;
				if(this._containerClass){
					domClass.remove(cellsContainer.domNode);
					domClass.add(cellsContainer.domNode, this._containerClass);
				}
				
				var numberOfRowsInSection = this.numberOfRowsInSection(i);
				for (var j = 0; j < numberOfRowsInSection; j++) {
					var cell = this.cellForRowAtIndexPath({section:i, row:j});
					if (cell) {
						if(cell.domNode)
							cellsContainer.addChild(cell);
						else
							cellsContainer.domNode.appendChild(cell);
					}
						
					cells.push(cell);
					//cell.setDelegate({delegate:this, indexPath:{section:i, row:j}});
				}
				this._cellsBySection.push(cells);
				this.containerNode.appendChild(cellsContainer.domNode);
				
			}
					
			var me = this;
			dojo.forEach(this._cellsBySection, function(cells, i){
				dojo.forEach(cells, function(cell, j){
					connect.connect(cell.domNode, "onclick", this, function(){
						me.didSelectRowAtIndexPath({section:i, row:j});
					})
				});
			});
			
		},
		
		/*load: function() {
			this.reload();
		},*/
		
		setFrame: function(frame) {
			if(!this.frame)
				this.frame = {};
			
			if(frame.x) {
				this.frame.x = frame.x;
				this.domNode.style.left = frame.x + "px";
			}
			if(frame.y) {
				this.frame.y = frame.y;
				this.domNode.style.top = frame.y + "px";
			}
			if(frame.width) {
				this.frame.width = frame.width;
				this.domNode.style.width = frame.width + "px";
			}
			if(frame.height) {
				this.frame.height = frame.height;
				this.domNode.style.height = frame.height + "px";
			}
			
			if(this._pullToRefresh) {
				this._pullDownDiv.style.width = frame.width + "px";
				this._pullDownDiv.statusDiv.style.width = frame.width + "px";
				this._pullDownDiv.lastUpdateDiv.style.width = frame.width + "px";
				this._pullDownDiv.arrowImg.style.left = ((frame.width -320)/2 + 25) + "px";
				this._pullDownDiv.spinner.style.left = ((frame.width -320)/2 + 40) + "px";
			}
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
		},
		
		
		existingViewForHeaderInSection: function(section) {
			return this._headers[section];
		},
		
		existingCellForRowAtIndexPath: function(indexPath) {
			return this._cellsBySection[indexPath.section][indexPath.row];
		},
		
		scrollToSection: function(section) {
			var to = {x:0, y:0};
			for(var i = 0; i < section; i++) {
				to.y -= this._headers[i].domNode.clientHeight;
				to.y -= 2;
				for(var j = 0; j < this._cellsBySection[i].length; j++) {
					console.log(i + ", " + j);
					to.y -= this._cellsBySection[i][j].domNode.clientHeight;
					to.y -= 1;
				}
			}
			console.log(this._headers[0].domNode.clientHeight);
			console.log(this._cellsBySection[0][0].domNode.clientHeight);
			console.log(to.y);
			this.scrollTo(to);
		},
		
		scrollTo: function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node) {
			//console.log(to.y);
			if(this._pullDownDiv) {
				if(this._pullDownDiv.loading) {
					this._pullDownDiv.statusDiv.innerHTML = "Loading...";
					this._pullDownDiv.arrowImg.style.display = "none";
					this._pullDownDiv.spinner.style.display = "";
				}
				else {
					if(to.y > 65) {
						this._pullDownDiv.arrowImg.src = dojo.moduleUrl("bizComp/mobile/Assets/")+"blueArrow_up.png";
						this._pullDownDiv.statusDiv.innerHTML = "Release to refresh...";
					}
					else {
						this._pullDownDiv.arrowImg.src = dojo.moduleUrl("bizComp/mobile/Assets/")+"blueArrow_down.png";
						this._pullDownDiv.statusDiv.innerHTML = "Pull down to refresh...";
					}
					this._pullDownDiv.arrowImg.style.display = "";
					this._pullDownDiv.spinner.style.display = "none";
				}
			}
			
			this.inherited(arguments);
		},
		
		slideTo: function(/*Object*/to, /*Number*/duration, /*String*/easing) {
			if(this._pullDownDiv && !this._pullDownDiv.loading) {
				/*if(this._slidingAfterLoading){
					if(this.getPos().y==0)
						this._slidingAfterLoading = false;
				}
				else*/ if(this.getPos().y > 65 && to.y == 0) {
					to.y = 65;
					this._nextSlideDest = to;
					this._pullDownDiv.loading = true;
					this.reloadTableViewDataSource();
					this.emit("reload", {});
				}
			}
			this.inherited(arguments);
		},
		
		_runSlideAnimation: function(/*Object*/from, /*Object*/to, /*Number*/duration, /*String*/easing, node, idx) {
			if(node == this.containerNode){
				this._nextSlideDest = null;
			}
			this.inherited(arguments);
		},

		//override the getDim method of the scrollable.js class to handle the addition of the "pullToScroll" header		
		getDim: function() {
			var dim = this.inherited(arguments);
			if(this._pullToRefresh) {
				dim.c.h-=500;
				dim.o.h-=500;
			}
			return dim;
		},
		
		reloadTableViewDataSource: function() {
			//to be implemented by subclasses
		},
		
		tableViewDataSourceReloadDone: function() {
			if(this._pullDownDiv) {
				this._pullDownDiv.loading = false;
				//this._slidingAfterLoading = true;
				this._pullDownDiv.lastUpdateDiv.innerHTML = "Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"});
				if(this._nextSlideDest)
					this._nextSlideDest.y = 0;
				else
					this.slideTo({y:0}, 0.3, "ease-out");
			}
		},
		
		setWidth:function(width) {
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
		},
		
		_loadCss: function(path, id) {
			var e = document.createElement("link");
			e.href = path;
			e.type = "text/css";
			e.rel = "stylesheet";
			e.media = "screen";
			if(id)
				e.id = id;
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		
		_unloadCss: function(id){
			var el = document.getElementById(id);
			if(el)
				domConstruct.destroy(el);
		},
		
	});
});
