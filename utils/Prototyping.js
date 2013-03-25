define([
	'dojo/_base/declare'
	],
	function(declare){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){
			Array.prototype.contains = function(item) {
				return this.indexOf(item) != -1;
			};
			
			Array.prototype.containsObject = function(_id){
				return this.filter(function(item){return item._id == _id;}).length > 0;
			};

			Date.prototype.verbose = function(){
				var me = this;
				function verboseWithFutureDate(aLastDate)
				{
					var difference =  Math.abs(me.getTime() - aLastDate.getTime());
					difference = difference/1000;
					if (difference < 60) {
						return "There was a moment.";
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
					return me.toLocaleString();
				};

				function verboseWithLastDate(aLastDate)
				{
					var difference =  Math.abs(me.getTime() - aLastDate.getTime());
					difference = difference/1000;
					if (difference < 60) {
						return "There was a moment.";
					}
					var indicator = 3600; //minutes - de 3600
					if (difference < indicator) {
						return Math.floor(difference / 60.0) + " minutes ago";
					}
					indicator = indicator * 24; // hours -  de 24h
					if (difference < indicator) {
						return Math.floor(difference / 3600.0) + " hours ago";
					}
					indicator = indicator * 15; // day - de 1 mois
					if (difference < indicator) {
						return Math.floor(difference / 86400.0) + " days ago";
					}

					return me.toLocaleString();
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

