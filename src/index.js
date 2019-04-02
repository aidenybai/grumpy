/**
 * Grumpy v0.0.9
 * Copyright 2019 Aiden Bai
 * Released under the Apache-2.0 License
 * https://grumpy.js.org/
 */

/**
 * A Map with additional utility methods. This is used throughout manylibraries rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
module.exports = class Grumpy extends Map {
    constructor(iterable) {
      super(iterable);
  
      /**
       * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
       * @name Group#_array
       * @type {?Array}
       * @private
       */
      Object.defineProperty(this, '_array', {
        value: null,
        writable: true,
        configurable: true
      });
  
      /**
       * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
       * @name Group#_keyArray
       * @type {?Array}
       * @private
       */
      Object.defineProperty(this, '_keyArray', {
        value: null,
        writable: true,
        configurable: true
      });
    }
  
    set(key, value) {
      this._array = null;
      this._keyArray = null;
  
      if (key === undefined) throw new Error('Parameter key not provided.');
      if (value === undefined) throw new Error('Parameter value not provided.');
      return super.set(key, value);
    }
  
    delete(key) {
      this._array = null;
      this._keyArray = null;
  
      if (key === undefined) throw new Error('Parameter key not provided.');
      return super.delete(key);
    }
  
    /**
     * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
     * @name Group#_array
     * @type {?Array}
     * @private
     */
    array() {
      if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
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
      if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
      return this._keyArray;
    }
  
    /**
     * Obtains the first value(s) in this group.
     * @param {number} [amount] Amount of values to obtain from the beginning
     * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
     * amount is negative
     */
    first(count) {
      if (count === undefined) return this.values().next().value;
      if (isNaN(count)) throw new TypeError('The count must be a number.');
      if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
  
      count = Math.min(this.size, count);
  
      const arr = new Array(count);
      const iter = this.values();
  
      for (let i = 0; i < count; i++) arr[i] = iter.next().value;
      return arr;
    }
  
    /**
     * Obtains the first key(s) in this group.
     * @param {number} [amount] Amount of keys to obtain from the beginning
     * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
     * amount is negative
     */
    firstKey(count) {
      if (count === undefined) return this.keys().next().value;
      if (isNaN(count)) throw new TypeError('The count must be a number.');
      if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
  
      count = Math.min(this.size, count);
  
      const arr = new Array(count);
      const iter = this.keys();
  
      for (let i = 0; i < count; i++) arr[i] = iter.next().value;
      return arr;
    }
  
    /**
     * Obtains the last value(s) in this group. This relies on {@link Group#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of values to obtain from the end
     * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
     * amount is negative
     */
    last(count) {
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
    lastKey(count) {
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
    random(count) {
      let arr = this.array();
  
      if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
      if (isNaN(count)) throw new TypeError('The count must be a number.');
      if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
      if (arr.length === 0) return [];
  
      const rand = new Array(count);
      arr = arr.slice();
  
      for (let i = 0; i < count; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
      return rand;
    }
  
    /**
     * Obtains unique random key(s) from this group. This relies on {@link Group#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of keys to obtain randomly
     * @returns {*|Array<*>} A single key if no amount is provided or an array
     */
    randomKey(count) {
      let arr = this.keyArray();
  
      if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
      if (isNaN(count)) throw new TypeError('The count must be a number.');
      if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
      if (arr.length === 0) return [];
  
      const rand = new Array(count);
      arr = arr.slice();
  
      for (let i = 0; i < count; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
      return rand;
    }
  
    /**
     * Removes entries that satisfy the provided filter function.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {number} The number of removed entries
     */
    sift(fn, thisArg) {
      if (thisArg) fn = fn.bind(thisArg);
      const previousSize = this.size;
      for (const [key, val] of this)
        if (fn(val, key, this)) this.delete(key);
      return previousSize - this.size;
    }
  
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a group instead of an Array.
     * @param {Function} fn The function to test with (should return boolean)
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Group}
     * @example group.filter(user => user.username === 'Bob');
     */
    filter(fn, thisArg) {
      if (thisArg) fn = fn.bind(thisArg);
      const results = new Grumpy();
  
      for (const [key, val] of this)
        if (fn(val, key, this)) results.set(key, val);
      return results;
    }
  
    /**
     * Maps each item to another value. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array, taking three arguments
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Array}
     * @example group.map(user => user.tag);
     */
    map(fn, thisArg) {
      if (thisArg) fn = fn.bind(thisArg);
      const arr = new Array(this.size);
      let i = 0;
  
      for (const [key, val] of this) arr[i++] = fn(val, key, this);
      return arr;
    }
  
    /**
     * Maps each item to another value into a group. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new group, taking three arguments
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Array}
     * @example group.mapValues(user => user.tag);
     */
    mapValues(fn, thisArg) {
      if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
      const group = new this.constructor[Symbol.species]();
      for (const [key, val] of this) group.set(key, fn(val, key, this));
      return group;
    }
    
    /**
     * Checks if there exists an item that passes a test. Identical in behavior to
     * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {boolean}
     * @example group.some(user => user.discriminator === '0000');
     */
    some(fn, thisArg) {
      if (thisArg) fn = fn.bind(thisArg);
      for (const [key, val] of this)
        if (fn(val, key, this)) return true;
      return false;
    }
  
    /**
     * Checks if all items passes a test. Identical in behavior to
     * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {boolean}
     * @example group.every(user => !user.bot);
     */
    every(fn, thisArg) {
      if (thisArg) fn = fn.bind(thisArg);
      for (const [key, val] of this)
        if (!fn(val, key, this)) return false;
      return true;
    }
  
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `group`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example group.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce(fn, initialValue) {
      let accumulator;
      if (typeof initialValue !== 'undefined') {
        accumulator = initialValue;
        for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
      } else {
        let first = true;
        for (const [key, val] of this) {
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
     * @example
     * group
     *  .each(user => console.log(user.username))
     *  .filter(user => user.bot)
     *  .each(user => console.log(user.username));
     */
    each(fn, thisArg) {
      this.forEach(fn, thisArg);
      return this;
    }
  
    /**
     * Creates an identical shallow copy of this group.
     * @returns {Group}
     * @example const newGroup = someGroup.clone();
     */
    clone() {
      return new this.constructor(this);
    }
  
    /**
     * Combines this group with others into a new group. None of the source groups are modified.
     * @param {...Group} groups Groups to merge
     * @returns {Group}
     * @example const newGroup = someGroup.concat(someOtherGroup, anotherGroup);
     */
    concat(...groups) {
      const newGroup = this.clone();
      for (const group of groups)
        for (const [key, val] of group) newGroup.set(key, val);
      return newGroup;
    }
  
    /**
     * Partitions the group into two groups where the first group
     * contains the items that passed and the second contains the items that failed.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Group[]}
     * @example const [big, small] = group.partition(guild => guild.memberCount > 250);
     */
    cut(fn, thisArg) {
      if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
      const results = [new Grumpy(), new Grumpy()];
      for (const [key, val] of this) {
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
    equals(group) {
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
     * @example group.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
      return new Grumpy([...this.entries()].sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
    }
  }
