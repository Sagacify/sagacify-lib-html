define(['dojo', 'saga/widgets/_Widget'], function(dojo, _Widget) {
	
	return dojo.declare('saga.Checkbox', [_Widget], {
	
		templateString:"<input type='checkbox'></input>",
		
		placeholder: null,
		
		consructor: function(args) {
			
		},
		
		postCreate: function() {
			
		}		
	});
});
