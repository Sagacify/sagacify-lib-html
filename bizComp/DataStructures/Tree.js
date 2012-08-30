define([
	"dojo/_base/declare",
    "dojo/_base/array"],

    function(declare, array) {
    	return declare("Tree", [], {

    		/* Attribute */
            tree : {},
            tree2 : {},



    		constructor : function(dataArray, options){
                var me = this;
                this.tree = {};
                this.tree2 = {};
                /* Build Category Tree - array */
    			dataDict = {};
    			for(var i in dataArray){
    				dataDict[dataArray[i][options.id]] = dataArray[i];
    			}
                //console.log(dataDict);
    			for(var i in dataDict){
    				this.tree[i] = [dataDict[i][options.name], []];
    			}
                //console.log(this.tree);
    			for(var i in dataDict){
    				if (dataDict[i][options.parentNode]) {
    					this.tree[dataDict[i][options.parentNode]][1].push(dataDict[i][options.id]);
    				}
    			}

                /* Buils Tree */
                tree2 = {};
                this.entryToDelete = [];
                for(var i in this.tree){
                    /* If not root nodes*/
                    if (this.tree[i][1].length > 0){
                        array.forEach(this.tree[i][1], function(entry, j){
                            /* Link to parent nodes*/
                            //console.log(entry);
                            me.entryToDelete.push(entry);
                            if (i in tree2){
                                tree2[i]["childs"].push({id : entry, name: me.tree[entry][0], childs:[]});
                            }
                            else {
                                tree2[i] = {id:i, name:me.tree[i][0], childs:[{id : entry, name: me.tree[entry][0], childs:[]}]};
                            }
                        });
                    }
                    /* Root nodes */
                    else {
                        tree2[i] = {id:i, name:me.tree[i][0], childs:[]};
                    }
                }
                for (var i in this.entryToDelete){
                    console.log(this.entryToDelete[i]);
                    delete tree2[this.entryToDelete[i]];
                }
                this.tree2 = tree2;
                console.log(this.tree2);
                console.log(this.tree);
    		}
    	});
    });