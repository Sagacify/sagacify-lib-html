/*!
* This module exports a Directed Acyclic Word Graph class.
*/

define([], function () {

	function Node () {

		this.parents = [];

		this.addParent = function (parentPointer) {
			if(parentPointer) {
				this.parents.push.call(this.parents, parentPointer);
			}
		};

	}

	return function DAWG () {

		this.children = {};

		this.autocomplete = function (qs) {
			function cleanupLetter (ltr) {
				return ltr.replace(/(\_[0-9]+)$/g, '');
			}
			var ltrs = Object.keys(this.children).map(cleanupLetter);
		};

		this.get = function (key) {
			function readLetter (obj, ltr, i) {
				var hash = ltr + '_' + i;
				return (obj instanceof Node) ? obj[hash] : obj;
			}
			return key.split('').reduce(readLetter, this.children);
		};

		this.set = function (key) {
			function upsertLetter (obj, ltr, i, str) {
				var hash = ltr + '_' + i;
				if(obj[hash] === undefined) {
					obj[hash] = new Node();
				}
				obj[hash].addParent(str[i - 1] !== undefined ? obj[str[i - 1] + '_' + (i - 1)] : null);
				return obj;
			}
			key.split('').reduce(upsertLetter, this.children);
		};

	};

});