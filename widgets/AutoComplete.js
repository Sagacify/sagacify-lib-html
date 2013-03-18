define([
	'dojo/_base/declare', 
	'saga/widgets/_Widget',
	'dojo/text!./templates/AutoComplete.html',
    'dojo/dom-construct',
    'dojo/dom-class',
	'dojo/on'],

    function(declare, _Widget, template, domConstruct, domClass, on){
         return declare('saga.AutoComplete', [_Widget], {
            title:null,
            templateString: template,

            selectedItems:[],
            suggestedItems: [],

            suggestedItemHidden: true,
            
            key: "_id",

        	constructor : function(args) {

        	},
        	
        	postCreate : function() {

                // inputNode
                var me = this;
                on(this.inputNode, 'keyup', function(evt){
                    me.inputChange();
                });
                on(this.inputNode, 'change', function(evt){
                    console.log("change");
                });
                on(this.inputNode, 'keydown', function(evt){

                    if (evt.keyIdentifier == "Down") {
                        if (!this.navigationMode) {
                            this.navigationMode = true;
                        };
                    };

                    if (evt.keyIdentifier == "enter") {
                        this.navigationMode = true;
                    };

                    if (evt.keyIdentifier == "left") {
                        if (this.navigationMode) {

                        };
                        
                    };

                    if (evt.keyIdentifier == "right") {
                        if (this.navigationMode) {

                        };
                    };

                });
          	},
            addSelecteditem: function(item){
                var li = this.generateSelectedNode(item);
                dojo.place(li, this.selectedListNode);

                var me = this;
                this.selectedItems.push(item);

            },


            addSuggestedItem: function(item){
                
                this.showSuggestedItem();

                var li = this.generateSuggestedNode(item);
                dojo.place(li, this.suggestedListNode, 'last');

                var me = this;
                on(li, 'click', function(evt){
                    evt.preventDefault();
                    me.transferItem(item);
                });
                this.suggestedItems.push(item[this.key]);
            },



            removeSuggestedItems: function(){
                
                this.hideSuggestedItem();

                dojo.empty(this.suggestedListNode);
                this.suggestedItems = [];
            },

            removeSelectedItems: function(){
                dojo.empty(this.selectedListNode);
                this.selectedItems = [];
            },

            transferItem: function(item){
                this.removeSuggestedItems();
                // this.inputNode.placeholder = this.placeholder;
                this.inputNode.value = '';
                this.addSelecteditem(item);
                this.inputNode.focus();
            }, 

            showSuggestedItem: function(){
                this.suggestedContainerNode.style.display = '';
            },

            hideSuggestedItem: function(){
                this.suggestedContainerNode.style.display = 'none';
            },

            inputChange: function(){
                var me = this;
                this.reloadSearch(function(data){
                	me.removeSuggestedItems();
                	for (var i = 0; i < data.length; i++) {
                		me.addSuggestedItem(data[i]);
            		};
                });
            },


            getItems: function(){
                return this.selectedItems;
            }, 

            currentString:function(){
                return this.inputNode.value;
            },



            //Call to kill a selected node
            deleteSelectedNode: function(node, item){
                var newItems = [];
                for (var i = 0; i < this.selectedItems.length; i++) {
                    if (!(this.selectedItems[i] == item)) {
                        newItems.push(this.selectedItems[i]);
                    };
                };
                this.selectedItems = newItems;

                domConstruct.destroy(node);
            },


            //OVERRIDE ME
            generateSelectedNode: function(item){
                var li = domConstruct.create("li");
                li.innerHTML = item[this.key];
                var a = domConstruct.create("a");
                domClass.add(a, 'removeTag');
                a.innerHTML = "X";
                dojo.place(a, li);

                var me = this;
                on(a, 'click', function(evt){
                    evt.preventDefault();
                    me.deleteSelectedNode(li);
                });

                return li;
            },


            generateSuggestedNode: function(item){
                var li = domConstruct.create('li');
                li.innerHTML = item[this.key];
                return li;
            },

            reloadSearch: function(){

            }, 


        });
}); 