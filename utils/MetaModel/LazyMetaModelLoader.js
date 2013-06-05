define([
	'dojo/_base/declare',
	'dojo/dom-style'	
	],
	function(declare, AvatarGeneration, domStyle){
		declare("saga.LazyMetaModelLoader", null, {

             loadForm: function(className, callback){
                if (this.getMetaModel()[className]) {
                  callback(this.getMetaModel()[className]);
                } else {
                  var me = this;
                  FormStore.getMetaModel(className).then(function(response){
	                  me.getMetaModel()[className] = response;
	                  callback(me.getMetaModel()[className]);
                  });                                  
                }
             },

             getMetaModel: function(){
				return saga.LazyMetaModelLoader.getMetaModel();
             	// if (!this.metaModels) {
             	// 	this.metaModels = {};
             	// };
             	// return this.metaModels;
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

