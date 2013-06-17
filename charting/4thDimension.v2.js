(function(exports, d) {
	// Method that extends an object to add new functions as properties.
	function extend(func, properties) {
		for(var property in properties) {
			if(properties.hasOwnProperty(property)) {
				func[property] = properties[property];
			}
		}
		return func;
	}

	// Exposed environement variables.
	var memory = [];
	var dimensions = {};
	// Default url is the current host
	//var hostname = window.location.host;
	var hostname = '127.0.0.1';
	// Default port is port 80 (HTTP)
	//var port = 80;
	var port = 8080;
	// Checks if the socket.io library is loaded.
	var SOCKET_IO_EXISTS = false;
	var socket;
	var parent = d.body;
	var INSTANCIATE = false;

	// Error messages.
	var e = {
		noArgs 			: 'No arguments specified to method.',
		noDimension 	: 'Invalid format for dimension.',
		noHomgeneity 	: 'Dataset isn\'t homogeneous.',
		maxDimensions 	: 'Already 2 dimensions initialized.',
		wrongType 		: 'Invalid type specified for dimension.',
		notEnoughArgs	: 'Not enough arguments specified to method.',
		versionFormat 	: 'Invalid version format.',
		noDependencies 	: 'Certain dependencies weren\'t met.',
		invalidUrl 		: 'Invalid or Cross-Domain Url.',
		invalidPort 	: 'Invalid port.'
	};

	// List of graphs axes.
	var axis = {
		'x': undefined,
		'y': undefined,
		'z': undefined
	};

	// Url names the REST API is going to make requests to.
	// "Slash first" format is enforced !
	var API_URLS = {
		SOCKET_IO : {
			collections : 'collections',
			models 		: 'models'
		},
		AJAX 	  : {
			collections : '/collections',
			models 		: '/models'
		}
	};

	// Class names used by divs and other useful dom elements.
	var CLASS_NAMES = {
		root 		: 'root',
		select 		: 'select',
		model 		: 'model',
		container 	: 'container',
		chart 		: 'chart'
	};

	// Initialize the dimension and draws the chart with the selected
	// configuration and data.
	function render_Chart() {
		var root = d.getElementsByClassName('root');
		var selectedValues = [];
		var selects;
		for(var i = 0; i < root.length; i++) {
			selects = root[i].getElementsByTagName('select');
			for(var k = 0; k < selects.length; k++) {
				if(selectedValues[i]) {
					selectedValues[i] += '.' + selects[k].options[selects[k].selectedIndex].text;
				}
				else {
					selectedValues[i] = selects[k].options[selects[k].selectedIndex].text;
				}
				if(selects[k].options[selects[k].selectedIndex].getAttribute('type')) {
					selectedValues[i] += '.' + selects[k].options[selects[k].selectedIndex].getAttribute('type');
				}
			}
		}
		var dimension;
		for(var j = 0; j < selectedValues.length; j++) {
			dimension = selectedValues[j].split('.');
			set_Dimension(dimension[0] + '.' + dimension[1], dimension[2]);
			set_Axis(dimension[0] + '.' + dimension[1], dimension[3]);
		}
		// TO DO : CREATE A CHART ROUTER THAT ROUTES CHART TYPE WITH THEIR NAME
		render_BarChart();
	}

	// After preparing axes and dimensions this method will render a chart in with D3.js.
	function render_BarChart() {
		var chart = d3.select('.' + CLASS_NAMES['container'])
					  .append('div')
					  .attr('class', CLASS_NAMES['chart']);
		chart.selecteAll('div')
			 .data(memory)
			 .enter()
			 .append('div')
			 .style('width', function(d) { return d * 10 + 'px'; })
			 .text(function(d) { return d; });
	}

	// Makes a REST API call to the server to get database collection names.
	// As of now (13/05/2013) only MongoDB (NoSQL) collections are supported.
	function API_get_Collections(callback) {
		get_Request('collections', function(collections) {
			if(collections) {
				callback(collections['values']);
			}
			else {
				callback(null);
			}
		});
	}

	// Makes a REST API call to the server to get database model names.
	// As of now (13/05/2013) only MongoDB (NoSQL) models are supported.
	function API_get_Models(callback) {
		get_Request('models', function(models) {
			if(models) {
				callback(models['values']);
			}
			else {
				callback(null);
			}
		});
	}

	// A request is made with the socket.io library. Fallback is Ajax.
	function get_Request(name, callback) {
		if(SOCKET_IO_EXISTS) {
			socket = io.connect(hostname + ':' + port);
			socket.emit('req_' + API_URLS['SOCKET_IO'][name], { name: true });
			socket.on('res_' + API_URLS['SOCKET_IO'][name], function(data) {
				callback(data);
			});
		}
		else {
			// Cross-browser Ajax support.
			var objects = [
				function() { return new XMLHttpRequest() },
				function() { return new ActiveXObject("MSxml2.XMLHHTP") },
				function() { return new ActiveXObject("MSxml3.XMLHHTP") },
				function() { return new ActiveXObject("Microsoft.XMLHTTP") }
			];
			function XHRobject() {
				var xhr = false;
				for(var i = 0; i < objects.length; i++) {
					try {
						xhr = objects[i]();
					}
					catch(e) {
						continue;
					}
					break;
				}
				return xhr;
			}
			var xhr = XHRobject();
			xhr.open("POST", API_URLS['AJAX'][name], true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var ajaxData = {
				name: true
			};
			var ajaxString;
			if(window.JSON) {
				ajaxString = JSON.stringify(ajaxData);
			}
			else {
				// Load the JSON2 file by Douglas Crockford that implements
				// the JSON format and related methods (e.g: parse and stringify)
				// https://github.com/douglascrockford/JSON-js
			}
			xhr.send(ajaxString);
			xhr.onreadystatechange = function() {
				if((xhr.readyState === 4) && (xhr.status === 200)) {
					callback(JSON.parse(xhr.responseText));
				}
			}
		}
	}

	// Makes the GET requests to get the necessary information to 
	// initialize the corresponding drop-down menus.
	function init_Selects(nAxis) {
		API_get_Collections(function(collections) {
			if(collections) {
				API_get_Models(function(models) {
					if(models) {
						construct_DOMElements(collections, models, nAxis);
					}
				});
			}
		});
	}

	// Initialize the appropriate number of select menus to let the
	// user configure the graph data that will be used.
	function construct_DOMElements(collections, models, nAxis) {
		var parent = main['parent'];			
			
		// Filters the displayed options in the model select drop-down menu.
		function click_Collection(className, text, model) {
			var elements = className.split('_');
			var index = elements[elements.length - 1];
			var modSelect = d.getElementsByClassName(CLASS_NAMES['model'] + '_' + index);
			modSelect[0].innerHTML = '';
			var modOption;
			var split;
			var attr;
			var type;
			for(var i = 0; i < model.length; i++) {
				split = model[i].split('.');
				attr = split[0];
				type = split[1];
				modOption = d.createElement('option');
				modOption.setAttribute('type', type);
				modOption.className = text;
				modOption.innerHTML = attr;
				modSelect[0].appendChild(modOption);
			}
		}

		// Initialize three select inputs to let the user choose :
		// - the collection
		// - the model attribute
		// - the axis the values will be bound to
		function construct_SelectCollections(collections, models, nAxis, i) {
			var root = d.createElement('div');
			root.className = CLASS_NAMES['root'];
			parent.appendChild(root);

			// Creates the select drop-down menu for the collection name choice.
			var colSelect = d.createElement('select');
			colSelect.className = CLASS_NAMES['select'] + '_' + i;
			root.appendChild(colSelect);
			colSelect.onchange = function(e) {
				click_Collection(this.className, this.options[this.selectedIndex].text, models[this.options[this.selectedIndex].text]);
			};

			var colOption;
			var modSelect = d.createElement('select');
			modSelect.className = CLASS_NAMES['model'] + '_' + i;
			root.appendChild(modSelect);
			for(var i = 0; i < collections.length; i++) {
				colOption = d.createElement('option');
				colOption.setAttribute('value', collections[i]);
				colOption.innerHTML = collections[i];
				colSelect.appendChild(colOption);
				if(i === 0) {
					construct_SelectModels(models[collections[0]], collections[0], modSelect);
				}
			}
			// Creates the select drop-down menu for the axis choice.
			var axisSelect = d.createElement('select');
			root.appendChild(axisSelect);
			var axisOption;
			var axisName;
			for(var k = 1; k <= nAxis; k++) {
				axisName = (k === 1) ? 'x' : (k === 2) ? 'y' : 'z';
				axisOption = d.createElement('option');
				axisOption.setAttribute('value', axisName);
				axisOption.innerHTML = axisName;
				axisSelect.appendChild(axisOption);
			}
			var lineBreak = d.createElement('br');
			root.appendChild(lineBreak);
		}

		// Creates the select drop-down menu for the key name choice.
		function construct_SelectModels(model, collection, modSelect) {
			var modOption;
			var split;
			var attr;
			var type;
			for(var key in model) {
				split = model[key].split('.');
				attr = split[0];
				type = split[1];
				modOption = d.createElement('option');
				modOption.setAttribute('type', type);
				modOption.className = collection;
				modOption.innerHTML = attr;
				modSelect.appendChild(modOption);
			}
		}

		// Create a submit button.
		function construct_ButtonSubmit(root) {
			var submit = d.createElement('button');
			submit.setAttribute('name', 'submit');
			submit.innerHTML = 'Render';
			root.appendChild(submit);
			submit.onclick = function(e) {
				render_Chart();
			};
		}

		// For each dimension used in the selected chart type three
		// drop-down select menus will be created.
		for(var i = 0; i < nAxis; i++) {
			construct_SelectCollections(collections, models, nAxis, i);
		}
		// /!\ Replace Parent /!\
		construct_ButtonSubmit(parent);
	}

	// Initialize new Axis by pairing it with an existing dimension.
	function set_Axis(dimensionName, axisName) {
		axis[axisName] = dimensionName;
	}

	// UI event handler for "Dimension" -> "Axis" pairing.
	function dom_AxisSelection() {
		var submitSelect = d.getElementsByClassName(CLASS_NAMES.submitSelect);
		submitSelect.onclick = function(e) {
			var colSelect = d.getElementsByClassName(CLASS_NAMES.collections);
			var colValue = colSelect.options[colSelect.selectedIndex].value;
			var modSelect = d.getElementsByClassName(CLASS_NAMES.models);
			var modValue = modValue.options[modValue.selectedIndex].value;
			var axisSelect = d.getElementsByClassName(CLASS_NAMES.axis);
			var axisValue = axisValue.options[axisValue.selectedIndex].value;
		};
	}

	// Main method that instanciates the "fourth object".
	function main(parent) {
		if(!(arguments.length)) { return console.error(e.noArgs); }
		// Check if d3 exists and if the d3 version dependencies are met.
		if(typeof d3 !== 'undefined') {
			if(check_Version('d3', d3.version)) {
				INSTANCIATE = true;
			}
		}
		// Check if socket.io is loaded.
		if(typeof io !== 'undefined') {
			SOCKET_IO_EXISTS = true;
		}
		if(INSTANCIATE) {
			// Once dependencies and versions have been met, reinstantiates
			// the "fourth" global object.
			// Also references every property that is exposed.
			exports.fourth = extend(exports.fourth, {
				// exposed functions
				set_Memory 			: set_Memory,
				set_Dimension 		: set_Dimension,
				set_ServerHostName  : set_ServerHostName,
				set_ServerPort		: set_ServerPort,
				set_Axis 			: set_Axis,
				// exposed variables
				memory 				: memory,
				dimensions			: dimensions,
				hostname 			: hostname,
				port 				: port,
				axis 				: axis,
				parent 				: parent
			});
		}
		// You have to specify the number of dimensions your chart type will be using
		// by passing it as an INT parameter to the init_Selects() method.
		init_Selects(3);
		dom_AxisSelection();
	}

	// Sets the base url at which the library is going to make requests to.
	function set_ServerHostName(hostname) {
		if(!(arguments.length)) { return console.error(e.noArgs); }
		// Checks if the url is valid.
		// The script should probably also look for cross-domain urls.
		var matchRegEx = new RegExp(/(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#!]*[\w\-\@?^=%&/~\+#])?/);
		if(!(matchRegEx.test(hostname, 'g'))) {
			return console.error(e.invalidUrl);
		}
		main['hostname'] = hostname;
	}

	// Sets the remote server port.
	function set_ServerPort(port) {
		if(!(arguments.length)) { return console.error(e.noArgs); }
		// Checks if the port is valid.
		port = +port;
		if(!((port > 0) && (port < Math.pow(2, 16)))) {
			return console.error(e.invalidPort);
		}
		main['port'] = port;
	}

	// Check if a library exists and if the version is equal or higher than
	// the dependencies specified in the "dependencies" property.
	function check_Version(libName, libVersion) {
		var dep = main['dependencies'][libName].split('.');
		var lib = exports[libName].version.split('.');
		if((dep.length !== 3) || (lib.length !== 3)) {
			return console.error(e.versionFormat);
		}
		if(!(dep.join() <= lib.join())) {
			return console.error(e.noDependencies);
		}
		return true;
	}

	// Initializes a new dimension based on a property name.
	function set_Dimension(key, type) {
		// Count the number of already initialized dimensions.
		function count_Dimensions() {
			var counter = 0;
			for(var key in dimensions) {
				if(dimensions.hasOwnProperty(key)) {
					counter++;
				}
			}
			return counter;
		}
		if(arguments.length < 2) { return console.error(e.notEnoughArgs); }
		if(count_Dimensions() > 3) { return console.error(e.maxDimensions); }
		if(!(get_Homogeneity(key))) {
			console.error(e.noHomgeneity);
		}
		else {
			switch(type.toLowerCase()) {
				case 'number':
					dimensions[key] = 'number';
					break;
				case 'date':
					dimensions[key] = 'date';
					break;
				case 'boolean':
					dimensions[key] = 'boolean';
					break;
				default:
					return console.error(e.wrongType);
			}
		}
	}

	// Returns the name and type of already initialized dimensions.
	function get_Dimension(name) {
		return name ? console.log('name ' + dimensions.name) : console.log(dimensions);
	}

	// Returns the specified data element's dimension value
	// and typecasts it to the proper type.
	function get_or_Cast(index, dimension) {
		switch(dimensions.dimension) {
			case 'number':
				return +(memory.index.dimension);
			case 'date':
				return typecast_Date(memory.index.dimension);
			case 'boolean':
				return typecast_Boolean(memory.index.dimension);
		}
	}

	// Stores data to the memory array.
	function set_Memory(data) {
		if(!(arguments.length)) { return console.error(e.noArgs); }
		// Stores array to memory.
		function store_Array(array) {
			return memory.push.apply(memory, array);
		}
		// Stores json string or object to memory.
		function store_Json(json) {
			if((typeof json) === 'string') {
				if(!JSON) {
					// Load the JSON2 file by Douglas Crockford that implements
					// the JSON format and related methods (e.g: parse and stringify)
					// https://github.com/douglascrockford/JSON-js
				}
				json = JSON.parse(json);
			}
			return memory.push(json);
		}
		var homogeneity = true;
		if(dimensions) {
			for(var dimension in dimensions) {
				if(!(get_Homogeneity(dimension, data))) {
					homogeneity = false;
				}
			}
		}
		if(homogeneity) {
			if(is_Array(data)) {
				store_Array(data);
			}
			else if(is_Object(data) || ((typeof data) === 'string')) {
				store_Json(data);
			}
			else {
				return console.error(e.wrongType);
			}
			if(arguments.length > 1) {
				var args = Array.prototype.splice.call(args, 0, 1);
				set_Memory(args);
			}
		}
		else {
			return console.error(e.noHomgeneity);
		}
	}

	// Checks if every single data object contains a specified dimension.
	function get_Homogeneity(key, target) {
		if(arguments.length === 1) {
			var i = memory.length;
			while(i--) {
				if(!(key in memory[i])) {
					return false;
				}
			}
			return true;
		}
		else {
			console.log(target);
			console.log(key);
			console.log(key in target);
			if(is_Object(target)) {
				return (key in target) ? true : false;
			}
			if(is_Array(target)) {
				var i = target.length;
				while(i--) {
					if(!(key in target[i])) {
						return false;
					}
				}
				return true;
			}
		}
	}

	// Typecasts a string into a valid Boolean object if possible.
	function typecast_Boolean(str) {
		switch(str.toLowerCase()) {
			case 'true' || '1' || 'yes':
				return true;
			case 'false' || '0' || 'no' || null || undefined:
				return false;
			default:
				return undefined;
		}
	}

	// Typecasts a string into a valid Date object if possible.
	function typecast_Date(str) {
		str.replace('T', ' ')
		   .replace('Z', ' ')
		   .replace(/-/g, '/');
		var date = new Date(str);
		return isNaN(date.getTime()) ? false : date;
	}

	// Asserts if type is Object. Better than "typeof" and "instanceof".
	function is_Object(_) {
		return (Object.prototype.toString.call(_) === '[object Object]');
	}

	// Asserts if type is Array. Better than "typeof" and "instanceof".
	function is_Array(_) {
		return (Object.prototype.toString.call(_) === '[object Array]');
	}

	// Extends the "fourth" global object.
	// Other properties and methods are hidden until the fourth() main method
	// has been called.
	var fourth = extend(main, {
		// version and dependencies
		version 		: '0.0.1',
		dependencies 	: { d3: '3.1.6' }
	});
	exports.fourth = fourth;
})(window, window.document);
