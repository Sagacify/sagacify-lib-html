define(['dojo', 'dojo/_base/connect', 'dojox/mobile/ScrollableView', 'dojo/dom-construct', 'dojo/query', 'dojox/mobile/EdgeToEdgeList', 'dojox/mobile/EdgeToEdgeCategory', 'dojox/mobile/RoundRectList', 'dojox/mobile/RoundRectCategory', 'dojo/date/locale', 'spin/Spin'], function(dojo, connect, ScrollableView, domConstruct, query, EdgeToEdgeList, EdgeToEdgeCategory, RoundRectList, RoundRectCategory, locale) {
	
	return dojo.declare('bizComp.TableView', [ScrollableView], {
		
		parent: null,
		
		_headers: null,
		
		_cellsBySection: null,
		
		_type: "EdgeToEdge",
		
		_pullDownDiv: null,
						
		constructor: function(args) {
			this._type = args.type;
		},		
		
		postCreate: function() {
			this._pullDownDiv = domConstruct.create("div", {style:"width:320px; height:500px; position:relative;"}, this.containerNode);
			this.containerNode.style.top = "-500px";
			dojo.style(this._pullDownDiv, "backgroundColor", new dojo.Color([226,231,237]));
			
			var statusDiv = domConstruct.create("div", {style:"top:452px;width:320px; height:20px; position:absolute;text-align:center;font-size:13px;font-weight:bold;", innerHTML:"Pull down to refresh..."}, this._pullDownDiv);
			dojo.style(statusDiv, "color", new dojo.Color([87,108,137]));
			this._pullDownDiv.statusDiv = statusDiv;
			
			var lastUpdateDiv = domConstruct.create("div", {style:"top:470px; width:320px; height:20px; position:absolute;text-align:center;font-size:12px;", innerHTML:"Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"})}, this._pullDownDiv);
			dojo.style(lastUpdateDiv, "color", new dojo.Color([87,108,137]));
			this._pullDownDiv.lastUpdateDiv = lastUpdateDiv;
			
			var arrowImg = domConstruct.create("img", {style:"display:block;position:absolute;left:25px;top:435px;", src:"js/M2C/Assets/blueArrow_down.png"}, this._pullDownDiv);
			this._pullDownDiv.arrowImg = arrowImg;
			
			var spinner = new Spinner({color:"gray", lines:12, length:3, width:2, radius:5}).spin();
        	spinner.el.style.top = "468px";
        	spinner.el.style.left = "40px";
        	spinner.el.style.display = "none";
        	this._pullDownDiv.appendChild(spinner.el);
        	this._pullDownDiv.spinner = spinner.el;
        	
			//this.reload();
		},
		
		reload: function() {
			this.inherited(arguments);
			dojo.forEach(this._headers, function(header, i){
				if(header)
					header.destroyRecursive();
			});
			
			dojo.forEach(this._cellsBySection, function(section, i){
				dojo.forEach(section, function(cell, j){
					if(cell)
						cell.destroyRecursive();
				});
			});
			
			this._headers = [];
			this._cellsBySection = [];
			
			for (var i = 0; i < this.numberOfSections; i++) {
				var header = this.viewForHeaderInSection(i);
				if (header) 
					this.containerNode.appendChild(header.domNode);
				this._headers.push(header);
					
				var cells = [];
				
				var cellsContainer;
				if (this._type == "RoundRect")
					cellsContainer = new RoundRectList();
				else
					cellsContainer = new EdgeToEdgeList();
					
				for (var j = 0; j < this.numberOfRowsInSection(j); j++) {
					var cell = this.cellForRowAtIndexPath({section:i, row:j});
					if (cell)
						cellsContainer.addChild(cell);
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
		
		load: function() {
			this.reload();
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
		
		scrollTo: function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node) {
			
			if(this._pullDownDiv) {
				if(this._pullDownDiv.loading) {
					this._pullDownDiv.statusDiv.innerHTML = "Loading...";
					this._pullDownDiv.arrowImg.style.display = "none";
					this._pullDownDiv.spinner.style.display = "";
				}
				else {
					if(to.y > 65) {
						this._pullDownDiv.arrowImg.src = "js/M2C/Assets/blueArrow_up.png";
						this._pullDownDiv.statusDiv.innerHTML = "Release to refresh...";
					}
					else {
						this._pullDownDiv.arrowImg.src = "js/M2C/Assets/blueArrow_down.png";
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
				if(this.getPos().y > 65 && to.y == 0) {
					to.y = 65;
					this._nextSlideDest = to;
					this._pullDownDiv.loading = true;
					this.reloadTableViewDataSource();
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
	
		
		reloadTableViewDataSource: function() {
			//to be implemented by subclasses
		},
		
		tableViewDataSourceReloadDone: function() {
			if(this._pullDownDiv) {
				this._pullDownDiv.loading = false;
				this._pullDownDiv.lastUpdateDiv.innerHTML = "Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"});
				if(this._nextSlideDest)
					this._nextSlideDest.y = 0;
				else
					this.slideTo({y:0}, 0.3, "ease-out");
			}
		}
		
		
	});
});
