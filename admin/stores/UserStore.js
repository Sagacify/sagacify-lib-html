define(["dojo/_base/declare", 
"dojo/_base/Deferred",
"./JsonStore",
"./UrlManager"],
	function(declare, Deferred, JsonStore, UrlManager){
		declare("Store.UserStore", [JsonStore], {
    		
    		register: function(user){
    			return this.post(UrlManager.userRegister(), user, {}, true);
    		},
    		
    		login: function(username, password){
    			return this.post(UrlManager.userLogin(), {username:username, password:password}, {}, true);
    		},
    		
            logout: function(username, password){
                
            },

            getLoggedUser: function(){
                return this.get(UrlManager.getLoggedUser());
            },
            
            getUsers: function(){
            	return this.get(UrlManager.getUsers(), {}, {});
            },
            getUsersDetails: function(user){
                return this.get(UrlManager.getUsersDetails(user));
            },
    		
            getContext: function(){
    			return this.get(UrlManager.getContext(), {}, {});
    		},

            putUser: function(user){
                return this.put(UrlManager.getUser(user._id), user, {});
            },

            getInbox: function(){
                return this.get(UrlManager.getInboxUrl());  
            },

            searchUserForText: function(text){
                return this.get(UrlManager.searchUserForTextUrl(text));
            },

            getMemberOfGroup:function(group){
                return this.get(UrlManager.getMemberOfGroupUrl(group));   
            }
		});   
		
		Store.UserStore.singleton = function() {
    		if (Store.UserStore._singleton == null)
				Store.UserStore._singleton = new Store.UserStore();
			return Store.UserStore._singleton;
    	};
    
    	return Store.UserStore;
	}
);
