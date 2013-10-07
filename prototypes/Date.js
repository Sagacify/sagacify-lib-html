Date.prototype.getWeekDayName = function(){
	return this.weekDayName()[this.getDay()];
};

Date.prototype.weekDayName = function(){
	return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
};

sec = 1000;
min = 60*sec;
hour = 60*min;
day = 24*hour;
week = 7*day;
year = 52*week;