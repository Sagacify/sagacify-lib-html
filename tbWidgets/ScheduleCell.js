function Clone(obj){
	var keys = Object.keys(obj)
	var result = {};
	for(var key in keys){
		result[keys[key]] = obj[keys[key]];
	}
	return result
}
		
function Push(array, obj){
	if(!obj)
		return ;
	array.push(obj);
}
		
define([
	'dojo/_base/declare',
	'saga/widgets/_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/ScheduleCell.html', 
	'dojo/dom-attr',
	'./Dropdown',
	'dojo/on',
	'dojo/dom-construct'
	], 
	function(declare, _Widget, Evented, template, domAttr, Dropdown, on, domConstruct) {

	return declare('BizComp.ScheduleCell', [_Widget, Evented], {

		templateString: template,
		
		constructor: function(args){
			this.name = args.name;
			this.isClose = false;
		},
		
		postCreate: function() {
			this.dayNode.innerHTML = this.name;
			var args = {
				instance:this, 
				onClose:function(dateText, inst){
					var date = new Date("07/23/2012 "+dateText);
					console.log(inst);
					inst.settings.instance.closeTimePicker(date,inst.settings.ref);
				},
				stepMinute: 10

			}
			/*args.ref = this.openMorningNode,
			$(this.openMorningNode).timepicker(Clone(args));
			
			args.ref = this.closeMorningNode
			$(this.closeMorningNode).timepicker(Clone(args));
			
			args.ref = this.openAfternoonNode;
			$(this.openAfternoonNode).timepicker(Clone(args));
			
			args.ref = this.closeAfternoonNode;
			$(this.closeAfternoonNode).timepicker(Clone(args));*/
			
			var me = this;
			on(this.buttonNode, "click", function(){
				var div = domConstruct.create("div");
				domConstruct.place(div, this, "before");
				var from = domConstruct.create("input", {}, div);
				args.ref = from,
				$(from).timepicker(Clone(args));
				
				var to = domConstruct.create("input", {}, div);
				args.ref = to,
				$(to).timepicker(Clone(args));
				me.getResult();
			});
			
		},
		closeTimePicker: function(aDate, ref){
			ref.selectedDate = aDate; 
		},
		checkTwoDate:function(firstDate, secondDate){
			if(firstDate == null || secondDate == null)
				return false;
			
			return firstDate.getTime()<secondDate.getTime();
		},
		/*changeCheckBoxState: function(args){
			this.switchTo(args.currentTarget.checked);
		},
		switchTo: function(close){
			this.isClose = close;
			this.ckeckboxNode.checked = this.isClose;
			if(close){
				this.openMorningNode.selectedDate = null;
				this.closeMorningNode.selectedDate = null;
				this.openAfternoonNode.selectedDate = null;
				this.closeMorningNode. selectedDate = null;
			}		
		},*/
		getResult: function(){
			/*if (!this.validate())
				return null;
			var result = new Array();
			Push(result, (this.stringify(this.openMorningNode)));
			Push(result, (this.stringify(this.closeMorningNode)));
			Push(result, (this.stringify(this.openAfternoonNode)));
			Push(result, (this.stringify(this.closeAfternoonNode)));*/
			var result = [];
			for(var i = 0; i < this.containerNode.children.length-1; i++) {
				var fromto = this.containerNode.children[i];
				var from = fromto.children[0];
				var to = fromto.children[1];
				result.push(this.stringify(from));
				result.push(this.stringify(to));
			}
			return result;
		},
		
		stringify:function(aNode){
			if(!aNode.selectedDate){
				return null;
			} else {
				var date = aNode.selectedDate;
				var hours = date.getHours();
				var hoursString = hours<10?"0"+hours:hours;
				var minutes = date.getMinutes();
				var minutesString = minutes<10?"0"+minutes:minutes;
				return hoursString+":"+minutesString; 
			}
		},
		checkRefAndNextRef: function(ref){
			var nextRef = this.getNextDate(ref);
			return this.checkTwoDate(ref.selectedDate, nextRef.selectedDate);
		},
		getNextDate: function(ref){
			if(ref == this.openMorningNode)
				return this.closeMorningNode;
			if(ref == this.closeMorningNode)
				return this.openAfternoonNode;
			if(ref == this.openAfternoonNode)
				return this.closeAfternoonNode;
			return null;
		},
		validate: function(){
			//closed by default
			if (this.openMorningNode.selectedDate == null &&
			this.closeMorningNode.selectedDate == null &&
			this.openAfternoonNode.selectedDate == null &&
			this.closeAfternoonNode.selectedDate == null) {
				this.switchTo(true);
				return true;
			} else {
				this.switchTo(false);
				return this.checkRefAndNextRef(this.openMorningNode) &&
						this.checkRefAndNextRef(this.closeMorningNode) &&
						this.checkRefAndNextRef(this.openAfternoonNode); 			
			}
		}
	});

});
			
