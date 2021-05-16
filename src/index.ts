class Grumpy extends Map {
  private _array: any = null;
  private _keyArray: any = null;

  constructor(iterable?: any[]) {
    super();

    if (iterable !== undefined) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }

  public array(): any[] {
    if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
    return this._array;
  }

  public clone(): Grumpy {
    return new Grumpy([...this.entries()]);
  }

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

  public each(fn: any, thisArg?: any): Grumpy {
    if (fn === undefined) throw new Error('Function is a required argument');
    this.forEach(fn, thisArg);
    return this;
  }

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

  public every(fn: Function, thisArg?: any): boolean {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  public filter(fn: Function, thisArg?: any): Grumpy {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    const results: Grumpy = new Grumpy();

    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  public find(fn: Function, thisArg?: any): any {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

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

  public flatMap(fn: Function, thisArg?: any): Grumpy {
    const groups: any[] = this.map(fn, thisArg);
    return new Grumpy().concat(...groups);
  }

  public keyArray(): any[] {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
    return this._keyArray;
  }

  public last(count?: number): any {
    const arr: any[] = this.array();

    if (count === undefined) return arr[arr.length - 1];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    return arr.slice(-count);
  }

  public lastKey(count?: number): any {
    const arr: any[] = this.keyArray();

    if (count === undefined) return arr[arr.length - 1];
    if (!Number.isInteger(count) || count < 1)
      throw new RangeError('Count must be an integer greater than 0');

    return arr.slice(-count);
  }

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

  public mapValues(fn: Function, thisArg?: any): any[] {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const group: Grumpy = new Grumpy();
    for (const [key, val] of this) {
      group.set(key, fn(val, key, this));
    }
    return group.array();
  }

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

  public sift(fn: Function, thisArg?: any): number {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    const previousSize: number = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this)) this.delete(key);
    }
    return previousSize - this.size;
  }

  public some(fn: Function, thisArg?: any): boolean {
    if (fn === undefined) throw new Error('Function is a required argument');
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  public sort(compareFunction: any = (a: any, b: any) => +(a > b) || +(a === b) - 1): Grumpy {
    const entries: any[] = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
    this.clear();
    for (const [key, val] of entries) {
      this.set(key, val);
    }
    return this;
  }

  public sorted(compareFunction: any = (a: any, b: any) => +(a > b) || +(a === b) - 1): Grumpy {
    return new Grumpy(
      [...this.entries()].sort((a, b) => {
        return compareFunction(a[1], b[1], a[0], b[0]);
      })
    );
  }
}

export default Grumpy;
