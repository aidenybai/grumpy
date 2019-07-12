/**
 * A Map with additional utility methods. This is used throughout many libraries rather than Arrays for anything that have
 * IDs, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Grumpy extends Map {
	/**
	 * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
	 * @name Group#_array
	 * @type {?Array}
	 * @private
	 */
	private _array: any = null;

	/**
	 * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
	 * @name Group#_keyArray
	 * @type {?Array}
	 * @private
	 */
	private _keyArray: any = null;

	constructor(iterable?: any[]) {
		super();

		if (iterable) {
			for (const [ key, value ] of iterable) {
				this.set(key, value);
			}
		}
	}

	set(key: any, value: any, time?: number): any {
		this._array = null;
		this._keyArray = null;

		if (key === undefined) throw new Error('Parameter key not provided.');
		if (value === undefined) throw new Error('Parameter value not provided.');
		if (time) {
			super.set(key, value);
			setTimeout(() => {
				this.delete(key);
			}, time);
		} else {
			super.set(key, value);
		}
	}

	delete(key: any, time?: number): any {
		this._array = null;
		this._keyArray = null;

		if (key === undefined) throw new Error('Parameter key not provided.');
		if (time) {
			setTimeout(() => {
				this.delete(key);
			}, time);
		} else {
			super.delete(key);
		}
	}

	/**
   * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
   * @name Group#_array
   * @type {?Array}
   * @private
   */
	array() {
		if (!this._array || this._array.length !== this.size) this._array = [ ...this.values() ];
		return this._array;
	}

	/**
   * Creates an ordered array of the keys of this group, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the group, or if you change the length of the array
   * itself. If you don't want this caching behavior, use `[...group.keys()]` or
   * `Array.from(group.keys())` instead.
   * @returns {Array}
   */
	keyArray() {
		if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [ ...this.keys() ];
		return this._keyArray;
	}

	/**
   * Obtains the first value(s) in this group.
   * @param {number} [amount] Amount of values to obtain from the beginning
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
   * amount is negative
   */
	first(count?: number) {
		if (count === undefined) return this.values().next().value;
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

		count = Math.min(this.size, count);

		console.log(count);
		const arr = [ count ];
		const iter = this.values();

		for (let i = 0; i < count; i++) {
			arr[i] = iter.next().value;
		}
		return arr;
	}

	/**
   * Obtains the first key(s) in this group.
   * @param {number} [amount] Amount of keys to obtain from the beginning
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
   * amount is negative
   */
	firstKey(count?: number) {
		if (count === undefined) return this.keys().next().value;
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

		count = Math.min(this.size, count);

		const arr = [ count ];
		const iter = this.keys();

		for (let i = 0; i < count; i++) {
			arr[i] = iter.next().value;
		}
		return arr;
	}

	/**
   * Obtains the last value(s) in this group. This relies on {@link Group#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain from the end
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
   * amount is negative
   */
	last(count?: number) {
		const arr = this.array();

		if (count === undefined) return arr[arr.length - 1];
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

		return arr.slice(-count);
	}

	/**
   * Obtains the last key(s) in this group. This relies on {@link Group#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain from the end
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the start if
   * amount is negative
   */
	lastKey(count?: number) {
		const arr = this.keyArray();

		if (count === undefined) return arr[arr.length - 1];
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

		return arr.slice(-count);
	}

	/**
   * Obtains unique random value(s) from this group. This relies on {@link Group#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain randomly
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values
   */
	random(count?: number) {
		let arr = this.array();

		if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
		if (arr.length === 0) return [];

		const rand = [ count ];
		arr = arr.slice();

		for (let i = 0; i < count; i++) {
			rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
		}
		return rand;
	}

	/**
   * Obtains unique random key(s) from this group. This relies on {@link Group#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain randomly
   * @returns {*|Array<*>} A single key if no amount is provided or an array
   */
	randomKey(count?: number) {
		let arr = this.keyArray();

		if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (isNaN(count)) throw new TypeError('The count must be a number.');
		if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
		if (arr.length === 0) return [];

		const rand = [ count ];
		arr = arr.slice();

		for (let i = 0; i < count; i++) {
			rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
		}
		return rand;
	}

	/**
   * Searches for a single item where the given function returns a truthy value. This behaves like
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {*}
   */
	find(fn: any, thisArg?: any) {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [ key, val ] of this) {
			if (fn(val, key, this)) return val;
		}
		return undefined;
	}

	/**
   * Removes entries that satisfy the provided filter function.
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {number} The number of removed entries
   */
	sift(fn: any, thisArg?: any) {
		if (thisArg) fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [ key, val ] of this) {
			if (fn(val, key, this)) this.delete(key);
		}
		return previousSize - this.size;
	}

	/**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a group instead of an Array.
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Group}
   */
	filter(fn: any, thisArg?: any) {
		if (thisArg) fn = fn.bind(thisArg);
		const results = new Grumpy();

		for (const [ key, val ] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}

	/**
   * Maps each item to another value. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {Function} fn Function that produces an element of the new array, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
	map(fn: any, thisArg?: any) {
		if (thisArg) fn = fn.bind(thisArg);
		const arr = [ this.size ];
		let i = 0;

		for (const [ key, val ] of this) {
			arr[i++] = fn(val, key, this);
		}
		return arr;
	}

	/**
   * Maps each item to another value into a group. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {Function} fn Function that produces an element of the new group, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
	mapValues(fn: any, thisArg?: any) {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const group = new Grumpy();
		for (const [ key, val ] of this) {
			group.set(key, fn(val, key, this));
		}
		return group.values();
	}

	/**
   * Checks if there exists an item that passes a test. Identical in behavior to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
	some(fn: any, thisArg?: any) {
		if (thisArg) fn = fn.bind(thisArg);
		for (const [ key, val ] of this) {
			if (fn(val, key, this)) return true;
		}
		return false;
	}

	/**
   * Checks if all items passes a test. Identical in behavior to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */

	every(fn: any, thisArg?: any) {
		if (thisArg) fn = fn.bind(thisArg);
		for (const [ key, val ] of this) {
			if (!fn(val, key, this)) return false;
		}
		return true;
	}

	/**
   * Applies a function to produce a single value. Identical in behavior to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `group`
   * @param {*} [initialValue] Starting value for the accumulator
   */
	reduce(fn: any, initialValue?: any) {
		let accumulator;
		if (typeof initialValue !== 'undefined') {
			accumulator = initialValue;
			for (const [ key, val ] of this) {
				accumulator = fn(accumulator, val, key, this);
			}
		} else {
			let first = true;
			for (const [ key, val ] of this) {
				if (first) {
					accumulator = val;
					first = false;
					continue;
				}
				accumulator = fn(accumulator, val, key, this);
			}
		}
		return accumulator;
	}

	/**
   * Identical to
   * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
   * but returns the group instead of undefined.
   * @param {Function} fn Function to execute for each element
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Group}
   */
	each(fn: any, thisArg?: any) {
		this.forEach(fn, thisArg);
		return this;
	}

	/**
   * Creates an identical shallow copy of this group.
   * @returns {Group}
   */
	clone() {
		return new Grumpy([ ...this.entries() ]);
	}

	/**
   * Combines this group with others into a new group. None of the source groups are modified.
   * @param {...Group} groups Groups to merge
   * @returns {Group}
   */
	concat(...groups: any) {
		const newGroup = this.clone();
		for (const group of groups) {
			for (const [ key, val ] of group) {
				newGroup.set(key, val);
			}
		}
		return newGroup;
	}

	/**
   * Partitions the group into two groups where the first group
   * contains the items that passed and the second contains the items that failed.
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Group[]}
   */
	cut(fn: any, thisArg?: any) {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = [ new Grumpy(), new Grumpy() ];
		for (const [ key, val ] of this) {
			if (fn(val, key, this)) results[0].set(key, val);
			else results[1].set(key, val);
		}
		return results;
	}

	/**
   * Checks if this group shares identical key-value pairings with another.
   * This is different to checking for equality using equal-signs, because
   * the groups may be different objects, but contain the same data.
   * @param {Group} group Group to compare with
   * @returns {boolean} Whether the groups have identical contents
   */
	equals(group: any) {
		if (!group) return false;
		if (this === group) return true;
		if (this.size !== group.size) return false;
	}

	/**
   * The sort() method sorts the elements of a group and returns it.
   * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
   * @param {Function} [compareFunction] Specifies a function that defines the sort order.
   * If omitted, the group is sorted according to each character's Unicode code point value,
   * according to the string conversion of each element.
   * @returns {Group}
   */
	sort(compareFunction: any) {
		const entries = [ ...this.entries() ];
		entries.sort(compareFunction);
		this.clear();
		for (const [ key, val ] of entries) {
			this.set(key, val);
		}
		return this;
	}
}

export default Grumpy;
