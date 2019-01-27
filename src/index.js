/**
 *
 *
 * @class Grumpy
 * @extends {Map}
 */
class Grumpy extends Map {
  /**
   *Creates an instance of Grumpy.
   * @param {*} iterable
   * @memberof Grumpy
   */
  constructor(iterable) {
    super(iterable);
    Object.defineProperty(this, '_array', {
      value: null,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, '_keyArray', {
      value: null,
      writable: true,
      configurable: true
    });
  }

  /**
   *
   *
   * @param {*} key
   * @param {*} value
   * @returns
   * @memberof Grumpy
   */
  set(key, value) {
    this._array = null;
    this._keyArray = null;

    if (key === undefined) throw new Error('Parameter key not provided.');
    if (value === undefined) throw new Error('Parameter value not provided.');
    return super.set(key, value);
  }

  /**
   *
   *
   * @param {*} key
   * @returns
   * @memberof Grumpy
   */
  delete(key) {
    this._array = null;
    this._keyArray = null;

    if (key === undefined) throw new Error('Parameter key not provided.');
    return super.delete(key);
  }

  /**
   *
   *
   * @returns
   * @memberof Grumpy
   */
  array() {
    if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
    return this._array;
  }

  /**
   *
   *
   * @returns
   * @memberof Grumpy
   */
  keyArray() {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
    return this._keyArray;
  }

  /**
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
   */
  last(count) {
    const arr = this.array();

    if (count === undefined) return arr[arr.length - 1];
    if (isNaN(count)) throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

    return arr.slice(-count);
  }

  /**
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
   */
  lastKey(count) {
    const arr = this.keyArray();

    if (count === undefined) return arr[arr.length - 1];
    if (isNaN(count)) throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');

    return arr.slice(-count);
  }

  /**
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} count
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  sift(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const previousSize = this.size;
    for (const [key, val] of this)
      if (fn(val, key, this)) this.delete(key);
    return previousSize - this.size;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = new Grumpy();

    for (const [key, val] of this)
      if (fn(val, key, this)) results.set(key, val);
    return results;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;

    for (const [key, val] of this) arr[i++] = fn(val, key, this);
    return arr;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this)
      if (fn(val, key, this)) return true;
    return false;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this)
      if (!fn(val, key, this)) return false;
    return true;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} initialValue
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
   */
  each(fn, thisArg) {
    this.forEach(fn, thisArg);
    return this;
  }

  /**
   *
   *
   * @returns
   * @memberof Grumpy
   */
  clone() {
    return new this.constructor(this);
  }

  /**
   *
   *
   * @param {*} collections
   * @returns
   * @memberof Grumpy
   */
  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections)
      for (const [key, val] of coll) newColl.set(key, val);
    return newColl;
  }

  /**
   *
   *
   * @param {*} fn
   * @param {*} thisArg
   * @returns
   * @memberof Grumpy
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
   *
   *
   * @param {*} group
   * @returns
   * @memberof Grumpy
   */
  equals(group) {
    if (!group) return false;
    if (this === group) return true;
    if (this.size !== group.size) return false;
  }

  /**
   *
   *
   * @returns
   * @memberof Grumpy
   */
  deleteAll() {
    const returns = [];
    for (const item of this.values())
      if (item.delete) returns.push(item.delete());
    return returns;
  }

  /**
   *
   *
   * @param {*} [compareFunction=(x, y) => +(x > y) || +(x === y) - 1]
   * @returns
   * @memberof Grumpy
   */
  sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
    return new Grumpy([...this.entries()].sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
  }
}

module.exports = Grumpy;