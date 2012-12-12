define(['dojo/_base/declare', 'saga/widgets/_Widget', 'dojo/on', 'saga/utils/AndroidFix', 'dojo/has'], function(declare, _Widget, on, AndroidFix, has) {
	
	return declare('saga.TableViewCell', [_Widget], {
		
		cancelClick: false,
		cancelSimulatedClick: false,
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			
		},
		
		attachSubnodeClickEvent: function(subnode, fun){
			var me = this;
			on(subnode, "click", function(evt){
				me.cancelClick = true;
				if(has('android')>2)
					me.cancelSimulatedClick = true;
				fun(evt);
			});
			AndroidFix.simulateClick(subnode);
		},
		
		disableCancelClick: function(){
			if(has('android')>2){
				if(this.cancelSimulatedClick)
					this.cancelSimulatedClick = false;
				else
					this.cancelClick = false;
			}
			else{
				this.cancelClick = false;
			}
		}
		
	});
});
