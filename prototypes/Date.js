Date.prototype.getWeekDayName = function () {
	return this.weekDayName()[this.getDay()];
};

Date.prototype.weekDayName = function () {
	return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
};

Date.prototype.isToday = function () {
	var now = new Date();
	return this.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
};

Date.prototype.getDistance = function () {
	var now = new Date();
	return now.setHours(0, 0, 0, 0) - this.setHours(0, 0, 0, 0);
};

Date.prototype.incrementDays = function (number) {
	var tempDate = new Date(this);
	return new Date(tempDate.setDate(tempDate.getDate() + number));
};

Date.prototype.getShortWeekday = function () {
	return this.toLocaleDateString('en-US', { weekday: 'short'});
};

sec = 1000;
min = 60*sec;
hour = 60*min;
day = 24*hour;
week = 7*day;
year = 52*week;