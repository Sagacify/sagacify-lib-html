define([
	'./native/native',
	'./backbone/backbone',
	'./marionette/marionette',
	'./jquery/jquery',
	'./moment/moment'
], function (){

	// var oldAppendChildFunction =  HTMLElement.prototype.appendChild;
	// HTMLElement.prototype.appendChild = function(newChild){
	// 	if (this.SGBinded && this.SGSetBinding && !newChild.SGBinded) {
	// 		this.SGSetBinding();
	// 	};
	// 	oldAppendChildFunction.apply(this, arguments);
	// }

	// var oldinsertBeforeFunction =  HTMLElement.prototype.insertBefore;
	// HTMLElement.prototype.insertBefore = function(newChild, refChild){
	// 	if (this.SGBinded && this.SGSetBinding && !newChild.SGBinded) {
	// 		this.SGSetBinding();
	// 	};
	// 	oldinsertBeforeFunction.apply(this, arguments);
	// }


	// var oldreplaceChildFunction =  HTMLElement.prototype.replaceChild;
	// HTMLElement.prototype.replaceChild = function(newChild){
	// 	if (this.SGBinded && this.SGSetBinding && !newChild.SGBinded) {
	// 		this.SGSetBinding();
	// 	};
	// 	oldreplaceChildFunction.apply(this, arguments);
	// }	

	// HTMLElement.prototype.SGSetBinding = function(){
	
	// 	this.SGBinded = true;
	// 	for (var i = this.childNodes.length - 1; i >= 0; i--) {
	// 		if (this.childNodes[i].SGSetBinding) {
	// 			this.childNodes[i].SGSetBinding();	
	// 		};
	// 	};
	// }


});