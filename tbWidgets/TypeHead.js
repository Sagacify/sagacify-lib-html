define(['../_Widget', 'dojo/text!./templates/Typehead.html', 'dojo/dom-construct', 
'dojo/dom-attr', 'dojo/_base/connect', 'dojo/_base/array', 'bootstrap'], 
function (_Widget, template, domConstruct, domAttr, connect, array) {

    return dojo.declare('bootstrap.Typeahead', [_Widget], {

        templateString: template,

        data: null,

        placeholder: null,

        constructor: function (args) {
            this.data = args.data;
            this.placeholder = args.placeholder;
        },

        postCreate: function () {
            var dataSource = "[";
            var me = this;
            dojo.forEach(this.data, function (item, i) {
                dataSource += "\"" + item + "\"";
                if (i < me.data.length - 1) {
                    dataSource += ",";
                }
            });
            dataSource += "]";

            domAttr.set(this.domNode, "data-source", dataSource);
            domAttr.set(this.domNode, "data-items", this.data.length);

            if (this.placeholder)
                this.domNode.placeholder = this.placeholder;

            /*connect.connect(this.domNode, "onclick", this, function(evt){console.log(me.domNode.value)});
            connect.connect(this.domNode, "onkeyup", this, function(evt){
            console.log(evt);
            console.log(evt.keycode);
            if(evt.keyCode == 13) { //enter
            //me.emit("change", {value:me.domNode.value});
            console.log("emit");
            console.log(me.domNode);
            }
            });
            */

        },

        startup: function () {
            var me = this;
            var jqueryMe = $("#" + this.domNode.id);
            jqueryMe.change(function (args) {
                if (array.indexOf(me.data, jqueryMe.val()) != -1 || jqueryMe.val() == "")
                    me.emit("change", { value: jqueryMe.val() });
                //console.log(jqueryMe.val());
            });
        },

        setTextValue: function (value) {
            domAttr.set(this.inputText, "value", value);

        }

        /*startup: function(){
        if(this.placeholder)
        this.domNode.placeholder = this.placeholder;
        $('#'+this.domNode.id).typeahead({source:this.data});
        }*/

    });
});