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
		return this.hours(hours).minutes(minutes);
	};

	Moment.fn.sgGetTime = function(){
		var hours = this.hours();
		if(hours < 10){
			hours = '0' + hours;
		}
		var minutes = this.minutes();
		if(minutes < 10){
			minutes = '0' + minutes;
		}
		return hours + ':' + minutes;
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

	Moment.duration.fn.format = function(regex){
		var format = '';
		if(regex.startsWith('auto')){
			var years = this.years();
			var yearsLabel = regex == 'auto_short' ? 'y' : ' year';

			var months = this.months();
			var monthsLabel = regex == 'auto_short' ? 'M' : ' month';

			var days = this.days();
			var daysLabel = regex == 'auto_short' ? 'd' : ' day';

			var hours = this.hours();
			var hoursLabel = regex == 'auto_short' ? 'h' : ' hour';

			var minutes = this.minutes();
			var minutesLabel = regex == 'auto_short' ? 'm' : ' minute';

			var seconds = this.seconds();
			var secondsLabel = regex == 'auto_short' ? 's' : ' second';

			unitTimeFormat = function(unitTime, singularLabel){
				return unitTime + ((unitTime > 1 && regex != 'auto_short')? singularLabel+'s' : singularLabel);;
			}
			if(years)
				format += unitTimeFormat(years, yearsLabel) + ', ';
			if(months)
				format += unitTimeFormat(months, monthsLabel) + ', ';
			if(days)
				format += unitTimeFormat(days, daysLabel) + ', ';
			if(hours)
				format += unitTimeFormat(hours, hoursLabel) + ', ';
			if(minutes)
				format += unitTimeFormat(minutes, minutesLabel) + ', ';
			format += unitTimeFormat(seconds, secondsLabel);

			if(format.endsWith(', ')){
				format = format.substring(0, format.length-2);
			}
		}
		else{
			format = regex;
		}
		return format;
	};

});

