define([
	'dojo/_base/declare',
	'dojo/dom-style',
	'dojo/on'
	],
	function(declare, AvatarGeneration, domStyle, on){
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
					me.endProcess = me.callDefault;
					me.defaultPushStateArgs = arguments;
					me.reprocessingPushState();
				}

				this.defaultBack = History.back;
				History.back = function(){
					
					me.endProcess = me.callDefaultBack;
					/* HistoryLock class (Yvan)*/
					me.defaultBackArgs = arguments;
					me.reprocessingBack();
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
					this.endProcess();
				}
			},

			reprocessingPushState: function(){
				if (this.locked) {
					this.handlingPush();
				} else {
					this.callDefault();	
				}
			},

			reprocessingBack: function(){
				if (this.locked) {
					this.handlingPush();
				} else {
					this.callDefaultBack();	
				}
			},

			callDefault: function(){
				if (!this.defaultPushStateArgs) {
					return;
				};
				this.defaultPushState.apply(History.pushState, this.defaultPushStateArgs);
				this.defaultPushStateArgs = null;
			}, 

			callDefaultBack: function(){
				if (!this.defaultBackArgs) {
					return;
				};
				this.defaultBack.apply(History.back, this.defaultBackArgs);
				this.defaultBackArgs = null;				
			},

			reset: function(){
				this.locked = false;
				this.defaultPushStateArgs = null;
				this.defaultBackArgs = null;
			}
		});
		
		return saga.HistoryLock;
	}
	);

