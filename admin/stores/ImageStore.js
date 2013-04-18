define([
	"dojo/_base/declare", 
	"dojo/_base/Deferred",
	"./JsonStore",
	"./UrlManager"],
	function(declare, Deferred, JsonStore, UrlManager){
		declare("Store.ImageStore", [JsonStore], {
    		
    		getImage: function(_id){
    			return this.get(UrlManager.getImage(_id), {});
    		}
    		
		});   
		
		Store.ImageStore.singleton = function() {
    		if (Store.ImageStore._singleton == null)
				Store.ImageStore._singleton = new Store.ImageStore();
			return Store.ImageStore._singleton;
    	};
    
    	return Store.ImageStore;
	}
);
