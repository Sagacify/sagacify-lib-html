define(['dojo/_base/declare', 'saga/widgets/_Widget', 'dojo/on', 'saga/utils/AndroidFix'], function(declare, _Widget, on, AndroidFix) {
	
	return declare('saga.TableViewCell', [_Widget], {
		
		cancelClick: false,
		cancelAndroidClick: false,
		
		constructor: function(args) {
			
		},
		
		postCreate: function() {
			
		},
		
		attachSubnodeClickEvent: function(subnode, fun){
			var me = this;
			on(subnode, "click", function(evt){
				me.cancelClick = true;
				fun(evt);
			});
			AndroidFix.simulateClick(subnode);
		}
		
	});
});
