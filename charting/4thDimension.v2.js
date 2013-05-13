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
	var hostname = window.location.host;
	// Default port is port 80 (HTTP)
	var port = 80;
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
		'y': undefined
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
		root 	: 'root'
	};

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
			socket.emit(API_URLS['SOCKET_IO'][name], { name: true });
			socket.on(API_URLS['SOCKET_IO'][name], function(data) {
				callback(data);
			});
		}
		else {
			// Use Ajax
		}
	}

	// Initialize three select inputs to let the use choose :
	// - the collection
	// - the model
	// - the axis the values will by bound to
	function init_Selects() {
		API_get_Collections(function(collections) {
			var parent = main['parent'];
			var root = d.createElement('div');
			root.className = CLASS_NAMES['root'];
			parent.appendChild(root);
			var colSelect = d.createElement('select');
			root.appendChild(colSelect);
			if(collections) {
				var colOption;
				for(var i = 0; i < collections.length; i++) {
					colOption = d.createElement('option');
					colOption.setAttribute('value', collections[i]);
					colOption.innerHTML = collections[i];
					colSelect.appendChild(colOption);
				}
				var modSelect = d.createElement('select');
				root.appendChild(modSelect);
				API_get_Models(function(models) {
					if(models) {
						var modOption;
						for(var j = 0; j < models.length; j++) {
							modOption = d.createElement('option');
							modOption.setAttribute('value', models[j]);
							modOption.innerHTML = models[j];
							modSelect.appendChild(modOption);
						}
						var axisSelect = d.createElement('select');
						root.appendChild(axisSelect);
						var axisOption;
						var axisName;
						for(var k = 1; k <= 2; k++) {
							axisName = (k === 1) ? 'x' : 'y';
							axisOption = d.createElement('option');
							axisOption.setAttribute('value', axisName);
							axisOption.innerHTML = axisName;
							axisSelect.appendChild(axisOption);
						}
						var submit = d.createElement('button');
						submit.setAttribute('name', 'submit');
						submit.innerHTML = 'Render';
						root.appendChild(submit);
					}
				});
			}
		});
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
		init_Selects();
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
		if(count_Dimensions() === 2) { return console.error(e.maxDimensions); }
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
				if(!(get_Homogeneity(dimensions, data))) {
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
				console.log(Object.prototype.toString.call(data));
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
