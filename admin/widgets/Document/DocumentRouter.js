// bizApp.widget.ApplicationCell
define([
	'dojo/_base/declare',  
	'saga/widgets/_Widget',
	'dojo/text!./templates/DocumentRouter.html',
	'./Document',
	'./Image',
	'./File',
	'admin/widgets/Common/DocsGrid',
	'dojo/on',
	'admin/stores/AdminStore',
	'admin/stores/ImageStore',
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/dom-construct',
	'./DicValue',
	'./InputImage'],

    function(declare, _Widget, template, Document, Image, File, DocsGrid, on, AdminStore, ImageStore, all, Deferred, domConstruct, DicValue, InputImage){
         return declare('admin.DocumentRouter', [_Widget], {

			templateString: template,
			
			collection: null,
			
			_id: null,
			
			schema: null,
			
			doc: null,
			
			image: null,
			
			keyValueItems: null,
        	        	        	             	
        	constructor : function(args) {

        	},
        	
        	postCreate : function() {
				this.inherited(arguments);
				var me = this;
				on(this.backToDocButton, "click", function(evt){
					 History.pushState(null, null, "/admin/collections/"+me.collection+"/"+(me._id||"new"));
				});
          	},
          	
          	fetch: function(callback){
          		var adminStore = AdminStore.singleton();
          		var imageStore = ImageStore.singleton();
				var me = this;
				var deferred = new Deferred();
          		var getSchema = function(){
          			var deferred = new Deferred();
          			adminStore.getSchema(me.collection).then(function(schema){
          				_collectionsByModel__ = schema._collectionsByModel__;
						console.log(schema);
						deferred.resolve(schema);
					}, function(error){
						console.log(error);
						deferred.reject(error);
					});
					return deferred.promise;
          		}
          		
          		var getDoc = function(){
          			var deferred = new Deferred();
          			adminStore.getDocument(me.collection, me._id).then(function(result){
						console.log(result);
						deferred.resolve(result.object);
					}, function(error){
						console.log(error);
						deferred.reject(error);
					});	
					return deferred.promise;
          		}
          		
          		var getImage = function(){
          			var deferred = new Deferred();
          			imageStore.getImage(me._id).then(function(result){
						console.log(result);
						deferred.resolve(result.object);
					}, function(error){
						console.log(error);
						deferred.reject(error);
					});	
					return deferred.promise;
          		}
          		
          		if(this._id){
          			all([getSchema(), getDoc(), this.collection=="images"?getImage(this._id):null]).then(function(result){
          				me.schema = result[0];
          				me.doc = result[1];
          				if(result[2])
          					me.doc.devImage = result[2];
						deferred.resolve();
	          		}, function(error){
	          			console.log(error);
	          		});
          		}
          		else{
          			all([getSchema()]).then(function(result){
          				me.schema = result[0];
          				me.doc = me.doc||{};
	          			deferred.resolve();
	          		}, function(error){
	          			console.log(error);
	          		});
          		}
          		
          		return deferred;
          	},
          	
          	route: function(route){
          		if(route.charAt(route.length-1)=='/')
        			route = route.substring(0, route.length-1);
				if(route.charAt(0)=='/')
        			route = route.substring(1, route.length);
				
          		//domConstruct.empty(this.docNode);
          		while(this.docNode.hasChildNodes()) {
    				this.docNode.removeChild(this.docNode.lastChild);
				}

          		var me = this;
          		var splitRoute = route.split("/");
          		/*var validRoute = function(){
          			var limit = splitRoute.length-2;
          			for(var i = 0; i < limit; i++){
          				
          			}
          		}*/
          		var showSubView = function(){
          			var lastRoutePart = splitRoute[splitRoute.length-1];
          			switch(lastRoutePart){
	      				case "":
	      				me.showFullDoc();
	      				break;
	      				case "set_existing":
	      				me.showSetAddExisting(splitRoute);
	      				break;
	      				case "add_existing":
	      				me.showSetAddExisting(splitRoute);
	      				break;
	      				case "set_new":
	      				me.showSetAddNew(splitRoute);
	      				break;
	      				case "add_new":
	      				me.showSetAddNew(splitRoute);
	      				break;
	      				case "add":
	      				me.showSetAddNew(splitRoute);
	      				break;
	      				default:
						me.showSubPart(splitRoute);
						break;     				
	      			}
          		};
      			
          		if(!this.schema)
          			this.fetch().then(function(){showSubView()});
          		else{
          			showSubView();
          		}
          	},
          	
          	showFullDoc: function(){
          		if(this.collection == "images"){
          			var image = new Image({_id:this._id, doc:this.doc, schema:this.schema});
          			image.placeAt(this.docNode);
          		}
          		else if(this.collection == "files" && !this._id){
          			var file = new File({_id:this._id, doc:this.doc, schema:this.schema});
          			file.placeAt(this.docNode);
          		}
          		else{
          			var doc = new Document({_id:this._id, doc:this.doc, schema:this.schema, collection:this.collection});
          			doc.placeAt(this.docNode);	
          		}
          	},
          	
          	showSubPart: function(splitRoute){
          		var me = this;
          		
          		var subschema = this.schema;
          		var nbRouteParts = splitRoute.length;
				for(var i = 0; i < splitRoute.length; i++){
					if(subschema instanceof Array)
						subschema = subschema[0];
					else if(subschema instanceof Object)
						subschema = subschema[splitRoute[i]];
					else{
						nbRouteParts = i;
						i = splitRoute.length;
					}
				}
          		
          		var bind = this.doc;
          		var bindSchema = this.schema;
				for(var i = 0; i < nbRouteParts; i++){
					if(bind instanceof Array){
						bindSchema = bindSchema[0];
						bind = bind.filter(function(item){return item._id == splitRoute[i] || item == splitRoute[i]})[0];
					}
					else{
						bindSchema = bindSchema;
						if(!bind[splitRoute[i]]){
							if(bindSchema instanceof Array)
								bind[splitRoute[i]] = [];
							else if(bindSchema instanceof Object)
								bind[splitRoute[i]] = {};
						}
						bind = bind[splitRoute[i]];
					}
				}
				
				console.log(subschema)
				console.log(bind)
				
				if(bind instanceof Array){
					var isEmbedded = subschema[0] instanceof Object;
					var arrayKey = splitRoute[splitRoute.length-1];
					
					if(isEmbedded){
						var renderActionCell = function(object, value, node, options){
				        	var button = domConstruct.create("button", {innerHTML:"-"}, node);
				        	on(button, "click", function(evt){
								var indexToRemove = function(){
									for(var i = 0; i < bind.length; i++){
										if(bind[i]._id == object._id)
											return i;
									}
								};
								bind.splice(indexToRemove(), 1);
								var parentRow = node;
								for(var i = 0; i < 8; i++)
									parentRow = parentRow.parentNode;
								domConstruct.destroy(parentRow);
				        		evt.stopPropagation();
				        	});
				        }
						
						var docsGrid = new DocsGrid({schema:subschema[0], data:bind, renderActionCell:renderActionCell});
		          		docsGrid.placeAt(this.docNode);
		          		docsGrid.startup();
		          		
		          		docsGrid.grid.on(".dgrid-row:click", function(evt){
		          			var hash = History.getState().hash;
							if(hash.charAt(hash.length-1) != '/')
								hash += "/";
							var row = docsGrid.grid.row(evt);
						    History.pushState(null, null, hash+row.data._id);
						});
					}
					else{
						var renderActionCell = function(object, value, node, options){
				        	var button = domConstruct.create("button", {innerHTML:"-"}, node);
				        	on(button, "click", function(evt){
								var adminStore = AdminStore.singleton();
								adminStore.deleteFromDocumentArray(me.collection, me._id, arrayKey, object._id).then(function(result){
									bind.splice(bind.indexOf(object._id), 1);
									console.log(bind);
									docsGrid.grid.refresh();
								}, function(error){
									
								});
				        		evt.stopPropagation();
				        	});
				        }
						
						var docsGrid;
						var adminStore = AdminStore.singleton();
						adminStore.getSchema(this.schema._collectionsByModel__[subschema[0]]).then(function(schema){
			          		docsGrid = new DocsGrid({schema:schema, target:"/adminapi/collections/"+me.collection+"/"+me._id+"/"+arrayKey, renderActionCell:renderActionCell});
			          		docsGrid.placeAt(me.docNode);
			          		docsGrid.startup();
			          		
			          		docsGrid.grid.on(".dgrid-row:click", function(evt){
								var row = docsGrid.grid.row(evt);
							    History.pushState(null, null, "/admin/collections/"+me.collection+"/"+row.data._id);
							});
						});	
					}
				}
				else if(bind instanceof Object){
					var type = subschema._meta__?subschema._meta__.type:"";
					switch(type){
						case "Image":
						var dic = new InputImage({schema:subschema});
						dic.placeAt(this.docNode);
						dic.setValue(bind);
						break;
						default:
						var dic = new DicValue({schema:subschema, keyStack:[]});
						dic.placeAt(this.docNode);
						dic.setValue(bind);
						break;
					}
				}
				//linked
				else{
					debugger
					if(!this.subLinkedDoc || this.subLinkedDoc._id != bind){
						this.subLinkedDoc = new admin.DocumentRouter({collection:_collectionsByModel__[subschema], _id:bind});
					}

					this.subLinkedDoc.placeAt(this.docNode);
					var subroute = "";
					for(var i = nbRouteParts; i < splitRoute.length; i++){
						subroute += splitRoute[i]+"/";
					}
					this.subLinkedDoc.route(subroute);
				}
					
          		
          	},
          	
          	showSetAddExisting: function(splitRoute){
          		var me = this;
          		var bind = this.doc;
				for(var i = 0; i < splitRoute.length-2; i++){
					if(bind instanceof Array)
						bind = bind.filter(function(item){return item._id == splitRoute[i]})[0];
					else
						bind = bind[splitRoute[i]];
				}
				var subschema = this.schema;
				for(var i = 0; i < splitRoute.length-1; i++){
					if(subschema instanceof Array)
						subschema = subschema[0];
					else
						subschema = subschema[splitRoute[i]];
				}
				var arrayKey = splitRoute[splitRoute.length-2];
				
				var isArray = bind[splitRoute[splitRoute.length-2]] instanceof Array;
          		var renderActionCell = function(object, value, node, options){
		        	var button = domConstruct.create("button", {innerHTML:isArray?"add":"set"}, node);
		        	on(button, "click", function(evt){
		        		if(isArray){
		        			var adminStore = AdminStore.singleton();
							adminStore.addToDocumentArray(me.collection, me._id, arrayKey, object._id).then(function(result){
								bind[splitRoute[splitRoute.length-2]].push(object._id);
								History.back();
							}, function(error){
								
							});
		        		}
		        		else{
							bind[splitRoute[splitRoute.length-2]] = object._id;
							History.back();
						}
		        		evt.stopPropagation();
		        	});
		        }
		        var adminStore = AdminStore.singleton();
				adminStore.getSchema(this.schema._collectionsByModel__[isArray?subschema[0]:subschema]).then(function(schema){
					var docsGrid = new DocsGrid({schema:schema, target:"/adminapi/collections/"+me.schema._collectionsByModel__[isArray?subschema[0]:subschema], renderActionCell:renderActionCell});
	          		docsGrid.placeAt(me.docNode);
	          		docsGrid.startup();
	          		
	          		docsGrid.grid.on(".dgrid-row:click", function(evt){
						var row = docsGrid.grid.row(evt);
					    History.pushState(null, null, "/admin/collections/"+me.collection+"/"+row.data._id);
					});
				});
          	},
          	
          	showSetAddNew: function(splitRoute){
          		var me = this;
          		var bind = this.doc;
				for(var i = 0; i < splitRoute.length-2; i++){
					if(bind instanceof Array)
						bind = bind.filter(function(item){return item._id == splitRoute[i]})[0];
					else
						bind = bind[splitRoute[i]];
				}
				var subschema = this.schema;
				for(var i = 0; i < splitRoute.length-1; i++){
					if(subschema instanceof Array)
						subschema = subschema[0];
					else
						subschema = subschema[splitRoute[i]];
				}
				var arrayKey = splitRoute[splitRoute.length-2];
				var isArray = bind[splitRoute[splitRoute.length-2]] instanceof Array;
				var isEmbedded = isArray?subschema[0] instanceof Object:subschema instanceof Object;

				if(isEmbedded){
					var doc = new Document({_id:null, doc:{_id:"new_"+Math.floor(Math.random()*Math.pow(10, 16))}, schema:isArray?subschema[0]:subschema, _collectionsByModel__:this.schema._collectionsByModel__});
	          		doc.placeAt(me.docNode);
	          		on(doc, "creation", function(doc){
	          			if(isArray){
		        			bind[splitRoute[splitRoute.length-2]].push(doc);
							History.back();
		        		}
	          			else{
	          				bind[splitRoute[splitRoute.length-2]] = doc;
	          				History.back();
	          			}
	          		});
				}
				else{
					var adminStore = AdminStore.singleton();
					adminStore.getSchema(this.schema._collectionsByModel__[isArray?subschema[0]:subschema]).then(function(schema){
						console.log(schema);
						var doc = new Document({_id:null, doc:{}, schema:schema, collection:me.schema._collectionsByModel__[isArray?subschema[0]:subschema]});
		          		doc.placeAt(me.docNode);
		          		on(doc, "creation", function(doc){
		          			if(isArray){
			        			var adminStore = AdminStore.singleton();
								adminStore.addToDocumentArray(me.collection, me._id, arrayKey, doc._id).then(function(result){
									bind[splitRoute[splitRoute.length-2]].push(doc._id);
									History.back();
								}, function(error){
									
								});
			        		}
		          			else{
		          				bind[splitRoute[splitRoute.length-2]] = doc._id;
		          				History.back();
		          			}
		          		});
					}, function(error){
						console.log(error);
					});	
				}
				
          	}
          	
        });
}); 
