define([
	'../_Widget', 
	'dojo/Evented', 
	'dojo/text!./templates/DropImage.html',
	'dojo/on',
	'dojo/dom-construct', 
	'dojo/dom-attr', 
	'dojo/_base/connect',
	'dojo/_base/lang',
	'dojo/io/iframe',
	'dojo/_base/event',
	'dojo/_base/config'],
	function(_Widget, Evented, template, on, domConstruct, domAttr, connect, lang, iframe, event, config) {

	return dojo.declare('DropImage', [_Widget, Evented], {

		templateString: template,
		
		_url: null,
		
		
		constructor: function(args){
			if(args) {
				this._url = args.url;
			}
		},
		
		onClick : function(evt){
			event.stop(evt);
			var me = this;			
			iframe.send({
						url : me._url,
						form : me.dropImageFormNode,
						handleAs: "json"
				}).then(function(response){
							if (response.path){
								console.log(response.path);
								me.emit('fileUploaded', {'path':response.path});
							}
							else {
								console.log('Raise Error : No path returned');
							}
						},
						function(error, ioArgs){
							console.log('Raise Error : Server side error');
							console.log(error);
						});			
		},
		
		postCreate: function() {
			this.inherited(arguments);
			// Setup the dnd listeners.
			
			var me = this;
			console.log("url: "+config.baseUrl);
			this.maskNode.style.backgroundImage = "url("+config.baseUrl+"lib/bizComp/img/DropImageBg.png)";
			
			on(this.inputFileNode, "change", function(args){
				iframe.send({
						url : me._url,
						form : me.dropImageFormNode,
						handleAs: "json"
				}).then(function(response){
							if (response.path){
								console.log(response.path);
								me.emit('fileUploaded', {'path':response.path});
							}
							else {
								console.log('Raise Error : No path returned');
							}
						},
						function(error, ioArgs){
							console.log('Raise Error : Server side error');
							console.log(error);
						});			
			});
			
			//on(this.submitFormNode, 'click', function(evt){
				
			
			//var dropZone = this.drop_zoneNode;
			
			
			
			//on(dropZone, 'dragover', this._handleDragOver);
			//on(dropZone, 'drop', this._handleDragSelect);
			//dropZone.addEventListener('dragover', lang.hitch(this, "_handleDragOver"), false);
			//dropZone.addEventListener('drop', lang.hitch(this, "_handleFileSelect"), false);
			//dropZone.addEventListener('drop', lang.hitch(this, "_handleFileDrop"), false);
			//console.log(this.listNode);
			
			
		},
		
		_handleFileDrop : function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			
			var files = evt.dataTransfer.files; // FileList object.
			
			this.emit('drop', {files : files});
		},
		
		_handleFileSelect : function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			
			var files = evt.dataTransfer.files; // FileList object.
			
			// files is a FileList of File objects. List some properties.
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
			  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
			              f.size, ' bytes, last modified: ',
			              f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
			              '</li>');
			}
			console.log(this);
			this.listNode.innerHTML = '<ul>' + output.join('') + '</ul>';
		},
	
		_handleDragOver : function (evt) {
		    evt.preventDefault();
		    evt.stopPropagation();
		    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		}
		
		
	});

});