declare class Grumpy<K, V> extends Map<K, V> {
	private _array: V[];
	private _keyArray: K[];

	public array(): V[];
	public clone(): Grumpy<K, V>;
	public concat(...collections: Grumpy<K, V>[]): Grumpy<K, V>;
  public cut(fn: (value: V, key: K, collection: Grumpy<K, V>) => boolean): [Grumpy<K, V>, Grumpy<K, V>];
	public each(fn: (value: V, key: K, collection: Grumpy<K, V>) => void, thisArg?: any): Grumpy<K, V>;
	public equals(collection: Grumpy<any, any>): boolean;
	public every(fn: (value: V, key: K, collection: Grumpy<K, V>) => boolean, thisArg?: any): boolean;
	public filter(fn: (value: V, key: K, collection: Grumpy<K, V>) => boolean, thisArg?: any): Grumpy<K, V>;
	public first(): V | undefined;
	public first(count: number): V[];
	public firstKey(): K | undefined;
	public firstKey(count: number): K[];
	public keyArray(): K[];
	public last(): V | undefined;
	public last(count: number): V[];
	public lastKey(): K | undefined;
	public lastKey(count: number): K[];
	public map<T>(fn: (value: V, key: K, collection: Grumpy<K, V>) => T, thisArg?: any): T[];
	public random(): V | undefined;
	public random(count: number): V[];
	public randomKey(): K | undefined;
	public randomKey(count: number): K[];
	public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: Grumpy<K, V>) => T, initialValue?: T): T;
  public sift(fn: (value: V, key: K, collection: Grumpy<K, V>) => boolean, thisArg?: any): number;
	public some(fn: (value: V, key: K, collection: Grumpy<K, V>) => boolean, thisArg?: any): boolean;
	public sort(compareFunction?: (a: V, b: V, c?: K, d?: K) => number): Grumpy<K, V>;
}

export = Grumpy;
