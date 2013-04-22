define(['dojo/_base/declare'], function(declare){

	var UrlManager = declare('i4.UrlManager', [], {
									
	});
	
	/* USER */
	/* ***** */
	UrlManager.userRegister = function() {
		return localStorage.serverPath+"/auth/local/register";
	};
	
	UrlManager.userLogin = function() {
		return localStorage.serverPath+"/auth/local/login";
	};
	
	UrlManager.getUser = function(userID) {
		if(userID)
			return localStorage.serverPath+"/api/users/"+userID;
		else
			return localStorage.serverPath+"/api/user";
	};
	
	UrlManager.getLoggedUser = function() {
		return localStorage.serverPath+"/api/user/";
	};

	UrlManager.getInboxUrl = function() {
		return UrlManager.getLoggedUser()+"inbox/";
	};
	
	UrlManager.getSentUrl = function() {
		return UrlManager.getLoggedUser()+"sent/";
	};

	UrlManager.getUsers = function() {
		return localStorage.serverPath+"/api/users";
	};
	
	UrlManager.getUsersDetails = function(user) {
		return UrlManager.getUsers()+"/"+user._id;
	};


	UrlManager.getContext = function() {
		return localStorage.serverPath+"/api/user/context";
	};
	
	UrlManager.searchUserForTextUrl = function(text) {
		return this.getUsers()+'/username/search/'+text;
	}

	/* FILE */
	/* ***** */
	UrlManager.getFile = function(_id) {
		return localStorage.serverPath+"/api/files/"+_id;
	};
	
	UrlManager.createFile = function(){
		return localStorage.serverPath+"/api/files";
	};


	/* IMAGE */
	/* ***** */
	UrlManager.getImage = function(_id) {
		return localStorage.serverPath+"/api/images/"+_id;
	};
	
	UrlManager.createImage = function(){
		return localStorage.serverPath+"/api/images";
	};
	

	/* ADMIN */
	/* ********** */
	UrlManager.getCollections = function() {
		return localStorage.serverPath+"/adminapi/collections/";
	};
	
	UrlManager.getCollection = function(name) {
		return UrlManager.getCollections()+name;
	};
	
	UrlManager.getDocument = function(collection, _id) {
		return UrlManager.getCollection(collection)+"/"+_id;
	};
	
	UrlManager.getDocumentSummary = function(collection, _id) {
		return UrlManager.getDocument(collection, _id)+"/summary";
	};
	
	UrlManager.getDocumentArray = function(collection, _id, arrayKey) {
		return UrlManager.getDocument(collection, _id)+"/"+arrayKey;
	};
	
	UrlManager.getSchema = function(collection) {
		return UrlManager.getCollection(collection)+"/schema";
	};
	
	return UrlManager;

});
