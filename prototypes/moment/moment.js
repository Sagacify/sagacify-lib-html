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

	Moment.fn.sgSetTime = function(time){
		if(!time){
			return;
		}
		var splitTime = time.split(':');
		var hours = splitTime[0];
		var minutes = splitTime[1];
		this.hours(hours).minutes(minutes);
	};

	Moment.fn.isInPast = function(){
		return this.isBefore(moment());
	};

	Moment.fn.isInFuture = function(){
		return this.isAfter(moment());
	};

	Moment.fn.sgFromNow = function(maxDays){
		maxDays = maxDays||2;
		if(moment().diff(this, 'days') <= maxDays){
			return this.fromNow();
		}
		else{
			return this.format("MMMM Do YYYY");
		}
	};

});

