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
					indicator = indicator * 15; // day - de 1 mois
					if (difference < indicator) {
						var t = Math.floor(difference / 86400.0);
						if (t == 1) {
							return "About a day ago";
						} else {
							return Math.floor(difference / 86400.0) + " days ago";
						}
						
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

