define([
	'dojo/_base/declare',
	'dojo/on',
	'saga/widgets/_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/OpeningHourForm.html', 
	'dojo/dom-attr',
	'saga/tbWidgets/ScheduleCell',
	'dijit/Calendar'
	], 
	function(declare, on, _Widget, Evented, template, domAttr, ScheduleCell, Calendar) {

	return declare('saga.OpeningHourForm', [_Widget, Evented], {

		templateString: template,
		
		constructor: function(args){
					
		},
		
		postCreate: function() {
			this.array = new Array();
			for(var i = 6; i >= 0; i--){
				var cell = new ScheduleCell({"name":dayEnum[i]});
				this.array.push(cell);
				cell.placeAt(this.scheduleCellParentNode,'after');
			}
			
			//on(this.validateButton, 'click', this.getResult);
		},
		/*validate1: function(){
			this.getResult();
		},*/
		getResult:function(){
			var result = new Array();
			for(var i  in this.array){
				result.push(this.array[i].getResult());
			}
			return result.reverse();
		}
	});
});


var dayEnum = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]





