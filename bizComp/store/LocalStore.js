define(['dojo', 'dojox', 'dojo/_base/declare', 'dojo/store/util/SimpleQueryEngine','dojo/store/Observable','dojo/store/util/QueryResults','dojox/storage','dojox/storage/LocalStorageProvider'], function(dojo, dojox, declare, sqe, observable){
/*
 * Definition of a general local offline _store using LocalStorage.
 * It relies on dojox.storage wrapper and is compliant with Dojo _store API.
 * @param:
 * - namespace: String used by dojox.storage to know where to _store the objects 
 */
return declare('bizcomp.store.LocalStore', null, {
	
	namespace: "",
	
	constructor: function(namespace) {
			
		var namespace = typeof namespace==="string"?namespace:this.namespace;
		
		this._store = dojo.delegate(dojox.storage);
		
	
		this._store.idProperty = "id";
		
		this._store.queryEngine = sqe;
		
		//return the id value for object
		this._store.getIdentity = function (object) {
			return object[this.idProperty];
		}
		
		//return the object for corresponding id
		this._store.get = function(id) {
	    	return dojox.storage.get(id, namespace);
		}
		
		//return the objects for corresponding keys
		//keys: array
		this._store.getMultiple = function(keys) {
			return dojox.storage.getMultiple(keys, namespace);
		}
		
		//return an array with all keys
		this._store.getKeys = function() {
			return dojox.storage.getKeys(namespace);
		}
		
		//test if key exists
		this._store.hasKey = function(key) {
			return dojox.storage.hasKey(key, namespace);
		}
		
		//put object in the store
		this._store.put = function(object, options){
		    
		    //var deferred = dojo.Deferred();
		    
		    var id = options && options.id || object.id;
		    
		  	dojox.storage.put(id, object, function(status, key, message){
		  		if(status == dojox.storage.FAILED){
			      	//handle failed
			    }
			    else if(status == dojox.storage.SUCCESS){
			     	 //handle success
			    }
		  	}, namespace);
	
		 	//return deferred;
		};
		
		//put object in the store, if not already inside
		this._store.add = function(object, options){
	
		    var id = options && options.id || object.id;
	
		    if(this.get(id) !== null){
		        throw new Error("Object already exists");
		    }
		    else {
		    	this.put(object, options);
		    }
		};
		
		//remove the object for the corresponding id
		this._store.remove = function(id) {
			dojox.storage.remove(id, namespace);
		}
		
		//remove all the objects in the store
		this._store.clear = function() {
			dojox.storage.clear(namespace);
		}
		
		this._store.query = function(query, options){
			
			var keys = dojox.storage.getKeys(namespace);
			
			var values = dojox.storage.getMultiple(keys, namespace)
			
			
	
		    var results = this.queryEngine(query, options)(values);
		    
		    return dojo.store.util.QueryResults(results);
		}
		
		//return all objects
		this._store.all = function() {
			
			var keys = dojox.storage.getKeys(namespace);
			
			var values = dojox.storage.getMultiple(keys, namespace)
			
			return values;
		}
		
		
		//Make observable the generated result sets by 'query' method
		this._store = observable(this._store);
	
	},
	
	put: function(object, options){
		this._store.put(object, options);
	},
	
	query: function(query, options){
		return this._store.query(query, options);
	},
	
	get: function(id) {
		return this._store.get(id);
	}

})

});

