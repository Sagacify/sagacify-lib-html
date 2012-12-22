define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojox/mobile/ScrollableView',
	'dojo/text!./templates/_ScrollableView.html',
	'dojo/date/locale',
	'dojo/has',
	'dojo/dom-class',
	'dojo/on'], 
	
	function(declare, _Widget, ScrollableView, template, locale, has, domClass, on) {
	
	return declare('saga._ScrollableView', [_Widget, ScrollableView], {
		
		templateString: template,
		
		pullToRefresh: false,
		
		tableViewController: null,
		
		constructor: function(args) {
			if(has("android") > 2 || has("chrome"))
				this.scrollType = 3;
		},
		
		postCreate: function(){
			this.inherited(arguments);
			if(this.pullToRefresh) {
				this.pullToRefreshNode.style.display = "";
				this.containerNode.style.top = "-500px";
				this.statusDiv.innerHTML = "Pull down to refresh...";
				this.lastUpdateDiv.innerHTML = "Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"});
				
				var spinner = new Spinner({color:"gray", lines:12, length:3, width:2, radius:5}).spin();
	        	spinner.el.style.left = (this.tableViewController.frame.width/2-70)+"px";
	        	spinner.el.style.top = "-51px";
	        	spinner.el.style.display = "none";
	        	this.pullToRefreshNode.appendChild(spinner.el);
	        	this.pullToRefreshNode.spinner = spinner.el;
	        	
	        	var me = this;
				on(this.arrowImg, "webkitAnimationEnd", function(evt){
					if(evt.animationName == "RefreshStart"){
						domClass.add(me.arrowImg, "endPull");
						domClass.remove(me.arrowImg, "animStartPull");
					}
					else{
						domClass.remove(me.arrowImg, "endPull");
						domClass.remove(me.arrowImg, "animEndPull");
					}
				});
      		}
		},
		
		scrollTo: function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node) {
			if(this.pullToRefresh) {
				if(this.pullToRefreshNode.loading) {
					this.statusDiv.innerHTML = "Loading...";
					this.arrowImg.style.display = "none";
					this.pullToRefreshNode.spinner.style.display = "";
				}
				else {
					if(to.y > 80) {
						this.statusDiv.innerHTML = "Release to refresh...";
					}
					else {
						this.statusDiv.innerHTML = "Pull down to refresh...";
					}
					this.arrowImg.style.display = "";
					this.pullToRefreshNode.spinner.style.display = "none";
				}
				if(this.pullToRefreshNode.loading) {
					this.statusDiv.innerHTML = "Loading...";
					this.arrowImg.style.display = "none";
					this.pullToRefreshNode.spinner.style.display = "";
				}
				else {
					if(to.y > 80) {
						this.statusDiv.innerHTML = "Release to refresh...";
						if(this.getPos().y <= 80){
							domClass.add(this.arrowImg, "animStartPull");
						}
					}
					else {
						this.statusDiv.innerHTML = "Pull down to refresh...";
						if(this.getPos().y > 80)
							domClass.add(this.arrowImg, "animEndPull");
					}
					//this.handlePullDownArrow(to.y);
					this.arrowImg.style.display = "";
					this.pullToRefreshNode.spinner.style.display = "none";
				}
			}
			
			this.inherited(arguments);
		},
		
		slideTo: function(/*Object*/to, /*Number*/duration, /*String*/easing) {
			if(this.pullToRefresh && !this.pullToRefreshNode.loading) {
				if(this.getPos().y > 80 && to.y == 0) {
					to.y = 80;
					this._nextSlideDest = to;
					this.pullToRefreshNode.loading = true;
					this.tableViewController.reloadTableViewDataSource();
					//this.emit("reload", {});
					
					this.statusDiv.innerHTML = "Loading...";
					this.arrowImg.style.display = "none";
					this.pullToRefreshNode.spinner.style.display = "";
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
			if(this.pullToRefresh) {
				dim.c.h-=500;
				dim.o.h-=500;
			}
			return dim;
		},
		
		tableViewDataSourceReloadDone: function() {
			if(this.pullToRefresh) {
				this.pullToRefreshNode.loading = false;
				this.lastUpdateDiv.innerHTML = "Last update: " + locale.format(new Date(), {selector:"date", datePattern:"MM/dd/yy hh:mm:a"});
				if(this._nextSlideDest)
					this._nextSlideDest.y = 0;
				else
					this.slideTo({y:0}, 0.3, "ease-out");
			}
		}
		
		
	});
});
