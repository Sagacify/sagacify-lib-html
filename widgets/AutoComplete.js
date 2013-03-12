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
                        // debugger;
                        // this.currentHover = me.autocompeteNode.
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
                // this.addSelecteditem("un_tag");
                // this.addSuggestItem('other_tag');
          	},
        	
            addSelecteditem: function(item){
                var li = domConstruct.create("li");
                li.innerHTML = item[this.key];
                var a = domConstruct.create("a");
                domClass.add(a, 'removeTag');
                a.innerHTML = "X";
                dojo.place(a, li);
                dojo.place(li, this.tagListNode);
            
                var me = this;
                this.selectedItems.push(item);


                on(a, 'click', function(evt){
                    evt.preventDefault();
                   	this.parentNode.remove();
                    me.selectedItems = me.selectedItems.filter(function(selectedItem){return selectedItem.username != item.username;});
                });

            },

            addSuggestedItem: function(item){
                
                this.showSuggestedItem();

                var li = domConstruct.create('li');
                li.innerHTML = item[this.key];
                dojo.place(li, this.autocompeteNode, 'last');
                var me = this;
                on(li, 'click', function(evt){
                    evt.preventDefault();
                    me.transferItem(item);
                });
                this.suggestedItems.push(item[this.key]);
            },

            removeSuggestedItems: function(){
                
                this.hideSuggestedItem();

                dojo.empty(this.autocompeteNode);
                this.suggestedItems = [];
            },

            removeSelectedItems: function(){
                dojo.empty(this.tagListNode);
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
                this.suggestedItemsNode.style.display = '';
            },

            hideSuggestedItem: function(){
                this.suggestedItemsNode.style.display = 'none';
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

            reloadSearch: function(){
                // this.addSuggestItem("yvan");
            }, 

            getItems: function(){
                return this.selectedItems;
            }, 

            currentString:function(){
                return this.inputNode.value;
            }
        });
}); 