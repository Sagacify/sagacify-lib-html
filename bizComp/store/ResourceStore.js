define(['dojo/_base/declare', 'dojo/_base/xhr', './Store'], function(declare, xhr, Store){

	return declare('bizcomp.store.ResourceStore', [Store], {
		
		constructor: function(args) {
			if(args) {
				this._synchronizationURI = args.synchronizationURI;
			}
			this._data = {};
		},
		
		resource: function(resourceId) {
			return this._data[resourceId];
		},
		
		resources: function() {
			var resources = [];
			for(var key in this._data)
				resources.push(this._data[key]);
			return resources;
		},
		
		setResource: function(resource) {
			this._data[resource.id] = resource;
		},
		
		setResources: function(resources) {
			var me = this;
			dojo.forEach(resources, function(resource, i){
				me.setResource(resource);
			});
		},
		
		synchronize: function() {
			var me = this;
			console.log(this._synchronizationURI);
			xhr.get({
		    
	    		url: this._synchronizationURI,
	    			    		
	    		handleAs:"json",
	    
	    		load: function(jsonData) {
	    			console.log(dojo.toJson(jsonData));
	    			me.setResources(jsonData.objects);
	    	    	me.emit("storeSynchronizationFinished", {data:me._data});
	    		}
			});
		}
	
	});

});

