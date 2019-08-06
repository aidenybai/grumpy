/**
 * A Map with additional utility methods. This is used throughout many libraries rather than Arrays for anything that have
 * IDs, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Grumpy extends Map {
  /**
   * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
   * @name Grumpy#_array
   * @type {?Array}
   * @private
   */
  private _array: any = null;

  /**
   * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
   * @name Grumpy#_keyArray
   * @type {?Array}
   * @private
   */
  private _keyArray: any = null;

  constructor(iterable?: any[]) {
    super();

    if (iterable !== undefined) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }

  /**
   * Creates an ordered array of the valuess of this group, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the group, or if you change the length of the array
   * itself. If you don't want this caching behavior, use `[...group.values()]` or
   * `Array.from(group.values())` instead.
   * @returns {Array}
   */
  public array(): any[] {
    if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
    return this._array;
  }

  /**
   * Creates an identical shallow copy of this group.
   * @returns {Grumpy}
   */
  public clone(): Grumpy {
    return new Grumpy([...this.entries()]);
  }

  /**
   * Combines this group with others into a new group. None of the source groups are modified.
   * @param {...Grumpy} groups Groups to merge
   * @returns {Grumpy}
   */
  public concat(...groups: Grumpy[]): Grumpy {
    if (groups === undefined) throw new Error('Groups is a required argument');
    const newGroup: Grumpy = this.clone();
    for (const group of groups) {
      for (const [key, val] of group) {
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
   * @returns {Grumpy[]}
   */
  public cut(fn: Function, thisArg?: any): Grumpy[] {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    let results: Grumpy[] = [new Grumpy(), new Grumpy()];
    for (const [key, val] of this) {
      if (fn(val, key, this)) results[0].set(key, val);
      else results[1].set(key, val);
    }
    return results;
  }

  /**
   * Deletes a key with a value in this group.
   * @param {*} [key] Key in key-value relationship.
   * @param {number} [time] Amount of time until deletion.
   */
  public delete(key: any, time?: number): any {
    this._array = null;
    this._keyArray = null;

    if (key === undefined) throw new Error('Key is a required argument');
    if (time) {
      setTimeout(() => {
        this.delete(key);
      }, time);
    } else {
      super.delete(key);
    }
  }

  /**
   * Identical to
   * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
   * but returns the group instead of undefined.
   * @param {Function} fn Function to execute for each element
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Grumpy}
   */
  public each(fn: any, thisArg?: any): Grumpy {
    if (fn === undefined) throw new Error('Function is a required argument');
    this.forEach(fn, thisArg);
    return this;
  }

  /**
   * Checks if this group shares identical key-value pairings with another.
   * This is different to checking for equality using equal-signs, because
   * the groups may be different objects, but contain the same data.
   * @param {Grumpy} group Group to compare with
   * @returns {boolean} Whether the groups have identical contents
   */
  public equals(group: any): boolean {
    if (!group) return false;
    if (this === group) return true;
    if (this.size !== group.size) return false;
    for (const [key, value] of this) {
      if (!group.has(key) || value !== group.get(key)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if all items passes a test. Identical in behavior to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */

  public every(fn: Function, thisArg?: any): boolean {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a group instead of an Array.
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Grumpy]}
   */
  public filter(fn: Function, thisArg?: any): Grumpy {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    const results: Grumpy = new Grumpy();

    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Searches for a single item where the given function returns a truthy value. This behaves like
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * @param {Function} fn The function to test with (should return boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {*}
   */
  public find(fn: Function, thisArg?: any): any {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  /**
   * Obtains the first value(s) in this group.
   * @param {number} [count] Amount of values to obtain from the beginning
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
   * amount is negative
   */
  public first(count?: number): any {
    if (count === undefined) return this.values().next().value;
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    count = Math.min(this.size, count);

    const arr: any[] = [count];
    const iter: any = this.values();

    for (let i: number = 0; i < count; i++) {
      arr[i] = iter.next().value;
    }
    return arr;
  }

  /**
   * Obtains the first key(s) in this group.
   * @param {number} [count] Amount of keys to obtain from the beginning
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
   * amount is negative
   */
  public firstKey(count?: number): any {
    if (count === undefined) return this.keys().next().value;
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    count = Math.min(this.size, count);

    const arr: any[] = [count];
    const iter: any = this.keys();

    for (let i: number = 0; i < count; i++) {
      arr[i] = iter.next().value;
    }
    return arr;
  }

  /**
   * Maps each item into a Group, then joins the results into a single Group. Identical in behavior to
   * [Array.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).
   * @param {Function} fn Function that produces a new Group
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Grumpy}
   */
  public flatMap(fn: Function, thisArg?: any): Grumpy {
    const groups: any[] = this.map(fn, thisArg);
    return new Grumpy().concat(...groups);
  }

  /**
   * Creates an ordered array of the keys of this group, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the group, or if you change the length of the array
   * itself. If you don't want this caching behavior, use `[...group.keys()]` or
   * `Array.from(group.keys())` instead.
   * @returns {Array}
   */
  public keyArray(): any[] {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
    return this._keyArray;
  }

  /**
   * Obtains the last value(s) in this group. This relies on {@link Group#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [count] Amount of values to obtain from the end
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the start if
   * amount is negative
   */
  public last(count?: number): any {
    const arr: any[] = this.array();

    if (count === undefined) return arr[arr.length - 1];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    return arr.slice(-count);
  }

  /**
   * Obtains the last key(s) in this group. This relies on {@link Group#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [count] Amount of keys to obtain from the end
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the start if
   * amount is negative
   */
  public lastKey(count?: number): any {
    const arr: any[] = this.keyArray();

    if (count === undefined) return arr[arr.length - 1];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    return arr.slice(-count);
  }

  /**
   * Maps each item to another value. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {Function} fn Function that produces an element of the new array, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
  public map(fn: Function, thisArg?: any): any[] {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    const arr: any[] = [this.size];
    let i: number = 0;

    for (const [key, val] of this) {
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
  public mapValues(fn: Function, thisArg?: any): any[] {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const group: Grumpy = new Grumpy();
    for (const [key, val] of this) {
      group.set(key, fn(val, key, this));
    }
    return group.array();
  }

  /**
   * Obtains unique random value(s) from this group. This relies on {@link Group#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [count] Amount of values to obtain randomly
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values
   */
  public random(count?: number): any {
    let arr: any[] = this.array();

    if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');
    if (arr.length === 0) return [];

    const rand: any[] = [count];
    arr = arr.slice();

    for (let i: number = 0; i < count; i++) {
      rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    }
    return rand;
  }

  /**
   * Obtains unique random key(s) from this group. This relies on {@link Group#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [count] Amount of keys to obtain randomly
   * @returns {*|Array<*>} A single key if no amount is provided or an array
   */
  public randomKey(count?: number): any {
    let arr: any[] = this.keyArray();

    if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');
    if (arr.length === 0) return [];

    const rand: any[] = [count];
    arr = arr.slice();

    for (let i: number = 0; i < count; i++) {
      rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    }
    return rand;
  }

  /**
   * Applies a function to produce a single value. Identical in behavior to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `group`
   * @param {*} [initialValue] Starting value for the accumulator
   * @returns {*}
   */
  public reduce(fn: Function, initialValue?: any): any {
    if (fn === undefined) throw new Error('Function is a required argument');
    let accumulator: any;
    if (initialValue !== undefined) {
      accumulator = initialValue;
      for (const [key, val] of this) {
        accumulator = fn(accumulator, val, key, this);
      }
    } else {
      let first: boolean = true;
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
   * Creates a key with a value in this group.
   * @param {*} [key] Key in key-value relationship.
   * @param {*} [value] Value in key-value relationship.
   * @param {number} [time] Amount of time until expiration.
   */
  public set(key: any, value: any, time?: number): any {
    this._array = null;
    this._keyArray = null;

    if (key === undefined) throw new Error('Key is a required argument');
    if (value === undefined) throw new Error('Value is a required argument');
    if (time) {
      super.set(key, value);
      setTimeout(() => {
        this.delete(key);
      }, time);
    } else {
      super.set(key, value);
    }
  }

  /**
   * Shuffles the elements of a group and returns it.
   * @returns {Grumpy}
   */
  public shuffle(): Grumpy {
    const entries: any[] = [...this.entries()];
    let currentIndex: number = entries.length;
    let temporaryValue: any;
    let randomIndex: number;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = entries[currentIndex];
      entries[currentIndex] = entries[randomIndex];
      entries[randomIndex] = temporaryValue;
    }

    this.clear();
    for (const [key, val] of entries) {
      this.set(key, val);
    }
    return this;
  }

  /**
   * Removes entries that satisfy the provided filter function.
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {number} The number of removed entries
   */
  public sift(fn: Function, thisArg?: any): number {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    const previousSize: number = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this)) this.delete(key);
    }
    return previousSize - this.size;
  }

  /**
   * Checks if there exists an item that passes a test. Identical in behavior to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
  public some(fn: Function, thisArg?: any): boolean {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * The sort() method sorts the elements of a group and returns it.
   * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
   * @param {Function} [compareFunction] Specifies a function that defines the sort order.
   * If omitted, the group is sorted according to each character's Unicode code point value,
   * according to the string conversion of each element.
   * @returns {Grumpy}
   */
  public sort(compareFunction: any = (a: any, b: any) => +(a > b) || +(a === b) - 1): Grumpy {
    const entries: any[] = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
    this.clear();
    for (const [key, val] of entries) {
      this.set(key, val);
    }
    return this;
  }

  /**
   * The sorted method sorts the elements of a group and returns it.
   * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
   * @param {Function} [compareFunction] Specifies a function that defines the sort order.
   * If omitted, the group is sorted according to each character's Unicode code point value,
   * according to the string conversion of each element.
   * @returns {Grumpy}
   */
  public sorted(compareFunction: any = (a: any, b: any) => +(a > b) || +(a === b) - 1): Grumpy {
    return new Grumpy(
      [...this.entries()].sort((a, b) => {
        return compareFunction(a[1], b[1], a[0], b[0]);
      })
    );
  }
}

export default Grumpy;
