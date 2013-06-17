define([
	'dojo/_base/declare',
	'saga/utils/AvatarGeneration',
	'dojo/dom-style', 
	'dojo/date/locale',
	'dojo/on'	
	],
	function(declare, AvatarGeneration, domStyle, locale, on){
		declare("Prototyping", null, {

		});
		
		Prototyping.setup = function(){
			if(History){
				History.openInTab = function(url){
				  var win=window.open(url, '_blank');
				  win.focus();				
				}
			}

			HTMLInputElement.prototype.inputDateCalendar = function(date, onChangeCallback){
				this.savedDate = date;

				this.isADateInput = true;
				
				this.dateFormatingPicker = 'dd/mm/yyyy';
				this.dateFormatingDojo = 'dd/MM/yyyy';
				$(this).attr('data-value', dojo.date.locale.format(this.savedDate, {selector:"date", datePattern: this.dateFormatingDojo}));

				var me = this;
			    me.pickDate = $(this).pickadate({
					weekdaysShort: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
					format:this.dateFormatingPicker,
					formatSubmit: this.dateFormatingPicker,
					// Buttons
					today: 'Today',
					clear: 'Clear',
					showMonthsShort: true, 
					onSet: function(){
						if (onChangeCallback) {
							onChangeCallback();	
						};
					}
                });
			}

			HTMLInputElement.prototype.inputTimeCalendar = function(date, onChangeCallback){
				this.savedDate = date;
				this.dateFormatingPicker = 'HH:i';
				this.dateFormatingDojo = "HH:m";

				var timeStr = dojo.date.locale.format(this.savedDate, {selector:"time", timePattern: this.dateFormatingDojo});
				this.value = timeStr
				var me = this;
			    this.picker = $(this).pickatime({
					// formatSubmit: formatPicker,
					format:this.dateFormatingPicker,
					onSet: function(){
						if (onChangeCallback) {
							onChangeCallback()	
						};
						
					}					
                });
			}

			HTMLInputElement.prototype.getDate = function(){
				 var result =  dojo.date.locale.parse(this.value, {datePattern:this.dateFormatingDojo, selector: "date"});
				 if (!result) {
				 	return new Date();
				 };
				 return result;
			}


			HTMLImageElement.prototype.loadPicture= function(picture){
				if (!picture) {
					return
				};

                this.src = picture.path;
                // (new AvatarPicture()).generateImg(this, this.data.author.name, this.data.author.name);    
			};

			HTMLImageElement.prototype.loadUser = function(user){
				if (!user) {
					return;
				};
				if (user.profilePicture) {
					this.loadPicture(user.profilePicture);
				} else {
					this.loadAvatar(user.name);
				}
			};

			HTMLImageElement.prototype.loadGroup = function(group){
				if (!group) {
					return;
				};
				if (group.logo) {
					this.loadPicture(group.logo);
				} else {
					this.loadAvatar(group.name);
				}
			};

			HTMLImageElement.prototype.loadAvatar = function(name){
                //No picture available
                var width = domStyle.get(this, "width");
                var height = domStyle.get(this, "height");
                
                canvasArray = (new AvatarGeneration()).createAvatar(this.parentNode, "100", "100", "Calibri", name);
                
                var data = canvasArray[0].toDataURL();
                // domAttr.set(this, "src", data);
                this.src = data;
                this.style.background = canvasArray[1];
			};

			Array.prototype.popFirst= function(){
				this.reverse();
				this.pop();
				this.reverse();
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
			
			String.prototype.capitalize = function() {
			    return this.charAt(0).toUpperCase() + this.slice(1);
			}
			
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


			String.prototype.isEmail = function(str){
				var re = /\S+@\S+\.\S+/;
				return re.test(this);
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

