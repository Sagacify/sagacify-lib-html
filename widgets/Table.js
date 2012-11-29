define([
	'saga/widgets/_Widget', 
	'dojo/Evented', 
	'dojo/on',
	'dojo/dom-construct'],
	function(_Widget, Evented, on, domConstruct) {
		return dojo.declare('Saga.DropImage', [_Widget, Evented], {

			templateString : "<table><thead data-dojo-attach-point='theadNode'></thead><tbody></tbody></table>",


			headers : null,
			data : null,
			actions : null,

			constructor : function(args) {
				if (args.headers){
					this.headers = args.headers;
				}
				if (args.data){
					this.data = args.data;
				}
				if (args.actions){
					this.actions = args.actions;
				}

				//missing class attributes of tr, 
			},

			postCreate : function () {
				var tr = domConstruct.create("tr", {}, this.theadNode);

				/* Header section */
				for(var i in this.headers){
					domConstruct.create("th", {innerHTML:this.headers[i]}, tr);
				}
				// if actions, create an other header column

				/* Row section */
				for(var i in this.data) {
					domConstruct.create("")
				}

			}


		});

	});
