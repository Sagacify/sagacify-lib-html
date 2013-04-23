// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/DocumentHeader.html',
	'./KeyValue',
	'dojo/on',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'saga/admin/stores/AdminStore',
	'dojo/Deferred',
	'dojo/promise/all'],

    function(declare, _Widget, template, KeyValue, on, domConstruct, lang, AdminStore, Deferred, all){
         return declare('admin.DocumentHeader', [_Widget], {

			templateString: template,
			
			value: null,
			
			embedded: false,
			
			schema: null,
			
			keyStack: null,
			
			collection: null,
			
			inArray: false,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				
				var me = this;
				
				on(this.domNode, "click", function(evt){
					//if(me.embedded){
						evt.preventDefault();
						var hash = History.getState().hash;
						if(hash.charAt(hash.length-1) != '/')
							hash += "/";
						dojo.forEach(me.keyStack, function(key){
							hash += key+"/";
						});
						//History.pushState(null, null, hash+(me.inArray?me.value._id:""));
						History.pushState(null, null, hash+me.value._id);
					//}
				});
         	},
         	
         	getValue: function(){
         		return this.embedded?this.value:this.value._id;
         	},
         	
         	setValue: function(value){
         		if(!value){
         			this.value = null;
         			this.fillSchema();
         			return;
         		}
         		
         		if(this.embedded)
					this.domNode.href = "";
				else
					this.domNode.href = "/admin/collections/"+this.collection+"/"+((value instanceof Object)?value._id:value);
         			
           		var me = this;
				var deferred = new Deferred();
				var getSchema = function(){
					var deferred = new Deferred();
					AdminStore.singleton().getSchema(me.collection).then(function(result){
						me.schema = result;
						deferred.resolve(result);
					}, function(error){
						deferred.reject(error);
					});
					return deferred.promise;
				}
				
				var getDocumentHeader = function(){
					var deferred = new Deferred();
					AdminStore.singleton().getDocumentSummary(me.collection, value).then(function(result){
						me.value = result.object;
						deferred.resolve(result.object);
					}, function(error){
						deferred.reject(error);
					});
					return deferred.promise;
				}
				if(value instanceof Object)
					this.value = value;
				all([!this.schema?getSchema():null, !(value instanceof Object)?getDocumentHeader():null]).then(function(result){
					me.fillSchema();
          		}, function(error){
          			console.log(error);
          		});
         	},
         	
         	fillSchema: function(){
         		if(!this.value){
         			this.domNode.innerHTML = "null";
         			return;
         		}
         		var count = 0;
         		for(var key in this.schema){
          			if(key != "_id" && key != "_meta__" && key != "_collectionsByModel__" && count < 5){
          				domConstruct.create("li", {innerHTML:key+" : "+this.value[key]}, this.itemsNode);
          				count++;
          			} 
          		}
          		for(var key in this.value){
          			if(!this.schema[key] && count < 5){
          				domConstruct.create("li", {innerHTML:key+" : "+this.value[key]}, this.itemsNode);
          			} 
          		}
         	}
         	
        });
}); 
