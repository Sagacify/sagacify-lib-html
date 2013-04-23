define([
	"dojo/_base/declare", 
	"dojo/_base/Deferred",
	"./JsonStore",
	"./UrlManager"],
	function(declare, Deferred, JsonStore, UrlManager){
		declare("Store.AdminStore", [JsonStore], {
    		
            getCollections: function(){
                return this.get(UrlManager.getCollections());  
            },
            
            getCollection: function(name){
                return this.get(UrlManager.getCollection(name));  
            },
            
            getDocument: function(collection, _id){
                return this.get(UrlManager.getDocument(collection, _id));  
            },
            
            getDocumentSummary: function(collection, _id){
                return this.get(UrlManager.getDocumentSummary(collection, _id));  
            },
            
            getDocumentArray: function(collection, _id, arrayKey){
                return this.get(UrlManager.getDocumentArray(collection, _id, arrayKey));  
            },
            
            addToDocumentArray: function(collection, _id, arrayKey, item){
                return this.post(UrlManager.getDocumentArray(collection, _id, arrayKey), {item:item});  
            },
            
            deleteFromDocumentArray: function(collection, _id, arrayKey, item){
                return this.remove(UrlManager.getDocumentArray(collection, _id, arrayKey), {item:item});  
            },
            
            getSchema: function(collection){
                return this.get(UrlManager.getSchema(collection));  
            },
            
            setDocument: function(collection, _id, doc){
            	cleanDoc(doc);
                return this.put(UrlManager.getDocument(collection, _id), doc);  
            },
            
            createDocument: function(collection, doc){
            	cleanDoc(doc);
                return this.post(UrlManager.getCollection(collection), doc);  
            },
            
            deleteDocument: function(collection, _id){
            	return this.remove(UrlManager.getDocument(collection, _id)); 
            }
            
		});   
		
		var cleanArray = function(array){
				dojo.forEach(array, function(item, i){
					if(item instanceof Array)
						cleanArray(item);
					else if(item instanceof Object)
						cleanDoc(item);
				});		
			}
			
		var cleanDoc = function(doc){
			if(doc._id && (doc._id.substring(0,4)=="new_" || doc._id == "new"))
				delete doc._id;
			for(var key in doc){
				if(doc[key] instanceof Array)
					cleanArray(doc[key]);
				else if(doc[key] instanceof Object)
					cleanDoc(doc[key]);
			}
		}
		
		Store.AdminStore.singleton = function() {
    		if(Store.AdminStore._singleton == null)
				Store.AdminStore._singleton = new Store.AdminStore();
			return Store.AdminStore._singleton;
    	};

    	return Store.AdminStore;
	}
);
