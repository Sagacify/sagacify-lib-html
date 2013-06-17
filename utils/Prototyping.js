define([
	'dojo/_base/declare'
	],
	function(declare){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){

			Array.prototype.last = function(){
				return this[this.length-1];
			};

			Array.prototype.contains = function(item) {
				return this.indexOf(item) != -1;
			};
			
			Array.prototype.containsObject = function(_id){
				return this.filter(function(item){return item._id == _id;}).length > 0;
			};
			
			Array.prototype.remove = function(item){
				var index = this.indexOf(item);
				if(index != -1)
					this.splice(index, 1);
			};
			
			Array.prototype.removeObject = function(_id){
				for(var i = 0; i < this.length; i++){
					if(this[i]._id == _id){
						this.splice(i, 1);
						return;	
					}
				}
			};
			
			String.prototype.inject = function(occurences){
				var strToReturn = this;
				occurences.forEach(function(occurence){
					strToReturn = strToReturn.replace("%s", occurence);
				});
				return strToReturn;
			};
			
			String.prototype.startsWith = function(str){
				return this.slice(0, str.length) == str;
			};
			
			String.prototype.endsWith = function(str){
				return this.slice(this.length-str.length, this.length) == str
			};

			Number.prototype.max2DigitsAfterDecimal = function(){
				if(this % 1 != 0)
					return this.toFixed(2);
				else
					return this;
			};

			Date.prototype.getWeekDayName = function(){
				return this.weekDayName()[this.getDay()];
			};

			Date.prototype.weekDayName = function(){
				return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			};

			Date.prototype.verbose = function(){
				var me = this;
				function verboseWithFutureDate(aLastDate)
				{
					var difference =  Math.abs(me.getTime() - aLastDate.getTime());
					difference = difference/1000;
					if (difference < 60) {
						return "A moment ago";
					}
					var indicator = 3600; //minutes - de 3600
					if (difference < indicator) {
						return "In "+Math.floor(difference / 60.0)+" minutes";
					}
					indicator = indicator * 24; // hours -  de 24h
					if (difference < indicator) {
						return "In "+Math.floor(difference / 3600.0)+" hours";
					}
					indicator = indicator * 15; // day - de 1 mois
					if (difference < indicator) {
						return "In "+Math.floor(difference / 86400.0)+" days";
					}
					return me.toLocaleDateString();
				};

				function verboseWithLastDate(aLastDate)
				{
					var difference =  Math.abs(me.getTime() - aLastDate.getTime());
					difference = difference/1000;
					if (difference < 60) {
						var t = Math.floor(difference);
						if (t <= 1) {
							return "About a minute ago";
						} else {
							return t + " seconds ago";
						}
						
					}
					var indicator = 3600; //minutes - de 3600
					if (difference < indicator) {
						var t = Math.floor(difference / 60.0);
						if (t == 1) {
							return "About a minute ago";	
						} else {
							return t + " minutes ago";	
						}
					}

					indicator = indicator * 24; // hours -  de 24h
					if (difference < indicator) {
						var t = Math.floor(difference / 3600.0);
						if (t == 1) {
							return "About an hour ago";
						} else {
							return t + " hours ago";
						}
						
					}

					//Dans les 6 jours
					indicator = indicator * 6; // day - de 1 mois
					if (difference < indicator) {
						var t = Math.floor(difference / 86400.0);
						if (t == 1) {
							return "Yesterday at "+me.toLocaleTimeString();
						} else {
							return me.getWeekDayName() + " at " + me.toLocaleTimeString();
							// return Math.floor(difference / 86400.0) + " days ago";
						}
					}
					return me.toLocaleDateString();
				};

				var now = new Date();
				if (this < now) {
					return verboseWithLastDate(now);		
				} else {
					return verboseWithFutureDate(now);
				}


			};
		};
		
		return Prototyping;
	}
	);

