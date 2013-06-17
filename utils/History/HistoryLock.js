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
					me.defaultPushStateArgs = arguments;
					me.reprocessingPushState();
				}

				// this.defaultBack = History.back;
				// // History.back = function(){
				// // 	debugger
				// // 	/* HistoryLock class (Yvan)*/
				// // 	// me.defaultBackArgs = arguments;
				// // 	// me.reprocessingPushState();
				// // }

				// // history.forward = function(){
				// // 	debugger
				// // }

				// // History.Adapter.bind(window,'statechange',function(){
				// // 	// debugger
				// // 	console.log("Change state!");
				// //     // if (!window.stateChangeIsLocal) {
				// //     //     someAjaxLoadFunction(History.getState().url);
				// //     // }
				// //     // else {
				// //     //     window.stateChangeIsLocal = false;
				// //     // }
				// // });				

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

