define([
	'dojo/_base/declare',
	'../_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/OpeningHourForm.html', 
	'dojo/dom-attr',
	'./ScheduleCell',
	'dijit/Calendar',
	], 
	function(declare, _Widget, Evented, template, domAttr, ScheduleCell, Calendar) {

	return declare('BizComp.OpeningHourForm', [_Widget, Evented], {

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
		},
		validate: function(){
			this.getResult();
		},
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





