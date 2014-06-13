// var defaultExtend = Backbone.Collection.extend
// var newExtend = function(){
// 	console.log("EXTEND");
// 	var constructorFunction = defaultExtend.apply(this, arguments);

// 	// constructorFunction.__parentConstructor = this;
// 	// constructorFunction.addClassMethod = addClassMethod;
// 	// constructorFunction.removeClassMethod = removeClassMethod;
// 	// constructorFunction.getClassMethods = getClassMethods;
// 	// constructorFunction.addClassMethods = addClassMethods;

// 	// if (!this.getClassMethods) {
// 	// 	//Root object
// 	// 	return constructorFunction;
// 	// };

// 	// //move methods
// 	// var classMethods = this.getClassMethods();	
// 	// for(var fctName in classMethods){
// 	// 	constructorFunction.addClassMethod(fctName, classMethods, false)
// 	// }

// 	return constructorFunction;
// }


// var addClassMethods = function(object, override){
// 	for(name in object){
// 		this.addClassMethod(name, object[name], override);
// 	}
// }



// var addClassMethod = function(name, fct, override){
// 	if (this.getClassMethods()[name] && !override) {
// 		return;
// 	};
// 	this[name] = fct;
// 	this.getClassMethods()[name] = fct;
// }

// var removeClassMethod = function(name){
// 	if (!this.getClassMethods()[name]){
// 		return;
// 	}
// 	delete this.getClassMethods()[name];
// }

// var getClassMethods = function(){
// 	if (!this.__class_methods) {
// 		this.__class_methods = {};		
// 	};
// 	return this.__class_methods;
// }

// addMethodForBO = function(name, fct){
// 	Backbone.Model[name] = Backbone.Collection[name] = Backbone.Router[name] = Backbone.View[name] = Backbone.History[name] = fct;
// }

// // addMethodForBO('addClassMethod', addClassMethod);
// // addMethodForBO('removeClassMethod', removeClassMethod);
// // addMethodForBO('getClassMethods', getClassMethods);
// addMethodForBO('extend', newExtend);

