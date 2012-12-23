define([
	'dojo/_base/declare', 
	'dojox/mobile/SwapView',
	], 
	
	function(declare, SwapView){

	/*
	 Overrides dojox Swapview to avoid blink after swap on ios
	 * */

	return declare("saga.mobile._SwapView", [SwapView], {
		
		scrollTo: function(/*Object*/to){
			if(!this._beingFlipped){
				var newView, x;
				if(to.x < 0){
					newView = this.nextView(this.domNode);
					x = to.x + this.domNode.offsetWidth;
				}else{
					newView = this.previousView(this.domNode);
					x = to.x - this.domNode.offsetWidth;
				}
				if(newView){
					if(newView.domNode.style.display === "none"){
						/*
						  	newView.domNode.style.display = "";
							newView.resize();
						 */
						//Part of code modified to set first the position of the swap view before showing it 
						newView.resize();
						newView.domNode.style.webkitTransform = this.makeTranslateStr({x:x});
						newView.domNode.style.display = "";
					}
					newView._beingFlipped = true;
					newView.scrollTo({x:x});
					newView._beingFlipped = false;
				}
			}
			//the call to inherited function is surrounded by the '_beingFlipped' = true then false, to avoid calling the part of code already covered by this class
			this._beingFlipped = true;
			this.inherited(arguments);
			this._beingFlipped = false;
		},

	});
});
