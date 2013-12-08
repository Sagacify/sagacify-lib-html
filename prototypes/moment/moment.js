define([
	'moment'
], function (Moment){

	Moment.fn.sgAddTime = function(time){
		if(!time || !time.contains(':')){
			return;
		}
		var splitTime = time.split(':');
		if(!splitTime[0] || !splitTime[1]){
			return;
		}
		return this.add(parseInt(splitTime[0]), 'hours').add(parseInt(splitTime[1]), 'minutes');
	};

});

