// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/Document.html',
	'./KeyValue',
	//'./KeyArrayValue',
	'dojo/on',
	'admin/stores/AdminStore'],

    function(declare, _Widget, template, KeyValue, /*KeyArrayValue,*/ on, AdminStore){
         return declare('admin.Document', [_Widget], {

			templateString: template,
			
			collection: null,
			
			_id: null,
			
			schema: null,
			
			doc: null,
			
			keyValueItems: null,
			
			backURI: null,
			
			_collectionsByModel__: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var adminStore = AdminStore.singleton();
				var me = this;
				this.fillSchema();
				
				on(this.saveButton, "click", function(evt){
					if(!me.collection){
						me.onCreation(me.doc);
					}
					else{
						if(me._id){
							adminStore.setDocument(me.collection, me._id, me.doc).then(function(result){
								console.log(result);
								History.pushState(null, null, "/admin/collections/"+me.collection);
							}, function(error){
								console.log(error);
							});
						}
						else{
							adminStore.createDocument(me.collection, me.doc).then(function(result){
								console.log(result);
								me.onCreation(result.object);
								var hash = History.getState().hash;
								var splitHash = hash.split("/");
								var lastRoutePart = splitHash[splitHash.length-1];
								if(lastRoutePart != "set_new" && lastRoutePart != "add_new")
									History.pushState(null, null, "/admin/collections/"+me.collection);
							}, function(error){
								console.log(error);
							});
						}	
					}
				});
				
				if(!me._id){
					this.deleteButton.style.display = "none";
				}
				else{
					on(this.deleteButton, "click", function(evt){
						adminStore.deleteDocument(me.collection, me._id).then(function(result){
							console.log(result);
							History.pushState(null, null, "/admin/collections/"+me.collection);
						}, function(error){
							console.log(error);
						});
					});	
				}
				
				on(this.cancelButton, "click", function(evt){
					History.back();
				});
          	},
          	
          	fillSchema: function(){
          		this.keyValueItems = {};
				if(this._id){
	          		var keyValueItem = new KeyValue({bind:this.doc, key:"_id", type:"String", keyStack:[]});
	          		keyValueItem.setReadOnly(true);
	          		keyValueItem.placeAt(this.itemsNode);
	          		this.keyValueItems._id = keyValueItem;
	          	}

          		for(var key in this.schema){
          			if(key != "_id" && key != "_meta__" && key != "_collectionsByModel__"){
	          			/*if(this.schema[key] instanceof Array){
	          				var keyValueItem = new KeyArrayValue({bind:this.doc, key:key, type:this.schema[key][0], collection:this.schema._collectionsByModel__[this.schema[key][0]]});
	          				keyValueItem.placeAt(this.itemsNode);
	          				this.keyValueItems[key] = keyValueItem;
	          			}
	          			else {*/
	          				var keyValueItem = new KeyValue({bind:this.doc, key:key, type:this.schema[key], collection:this._collectionsByModel__?this._collectionsByModel__[this.schema[key]]:this.schema._collectionsByModel__[this.schema[key]], keyStack:[]});
	          				keyValueItem.placeAt(this.itemsNode);
	          				this.keyValueItems[key] = keyValueItem;	
	          			//}
          			} 
          		}
          	},
          	
          	onCreation: function(){
          		
          	}
        	
        });
}); 
