define([
	'dojo/_base/declare',
  'app/stores/ClientAdminStore'
	],
	function(declare, ClientAdminStore){
		declare("saga.LazyMetaModelLoader", null, {

             loadForm: function(collectionName, callback){
                if (this.getMetaModel()[collectionName]) {
                  callback(this.getMetaModel()[collectionName]);
                } else {
                  var me = this;
                  this.getStore(collectionName).getMetaModel(collectionName).then(function(response){
	                  // me.getMetaModel()[className] = response;
	                  callback(response);
                  });                                  
                }
             },

             getMetaModel: function(){
				      return saga.LazyMetaModelLoader.getMetaModel();
             }, 

             getStore: function(collectionName){
              this.store = new ClientAdminStore()
              this.store.collectionName = collectionName;
              return this.store;
             }
		});

		saga.LazyMetaModelLoader.getMetaModel = function(){
         	if (!this.metaModels) {
         		this.metaModels = {};
         	};
         	return this.metaModels;
       	}
		
		return saga.LazyMetaModelLoader;
	}
);

