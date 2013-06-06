define([
	'dojo/_base/declare',
	'dojo/dom-style'	
	],
	function(declare, AvatarGeneration, domStyle){
		declare("saga.HistoryLock", null, {

			locked :false,

			defaultPushState : null,
			defaultPushStateArgs : null,

			constructor: function(){
				this.inherited(arguments);
				this.setup();

			},

			setup : function(){
				var me = this;
				this.defaultPushState = History.pushState;
				History.pushState = function(){
					/* HistoryLock class (Yvan)*/
					me.defaultPushStateArgs = arguments;
					me.reprocessingPushState();
				}
			},

			lock : function(handlingPush){
				if(this.locked){

				} else {
					this.handlingPush = handlingPush;
					this.locked = true;
				}
			},

			unlock : function(){
				if(!this.locked){

				} else {
					this.locked = false;
					this.callDefault();
				}
			},

			reprocessingPushState: function(){
				if (this.locked) {
					this.handlingPush();
				} else {
					this.callDefault();	
				}
			},

			callDefault: function(){
				if (!this.defaultPushStateArgs) {
					return;
				};
				this.defaultPushState.apply(History.pushState, this.defaultPushStateArgs);
				this.defaultPushStateArgs = null;
			}, 

			reset: function(){
				this.locked = false;
				this.defaultPushStateArgs = null;
			}
		});
		
		return saga.HistoryLock;
	}
	);

