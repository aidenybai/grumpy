const Grumpy = require('grumpy');
const assert = require('assert');

const test = (desc, fn) => {
  try {
    fn();
  } catch (err) {
    console.error(`Failed to ${desc}`);
    throw err;
  }
};

test('Map operations', () => {
  const group = new Grumpy();

  group.set('a', 1);
  assert.strictEqual(group.size, 1);
  assert.ok(group.has('a'));
  assert.strictEqual(group.get('a'), 1);

  group.delete('a');
  assert.ok(!group.has('a'));
  assert.strictEqual(group.get('a'), undefined);

  group.clear();
  assert.strictEqual(group.size, 0);
});

test('Convert Group to array', () => {
  const group = new Grumpy();
  
  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const array1 = group.array();
  assert.deepStrictEqual(array1, [1, 2, 3]);
  assert.ok(array1 === group.array());

  group.set('d', 4);
  const array2 = group.array();
  assert.deepStrictEqual(array2, [1, 2, 3, 4]);
  assert.ok(array2 === group.array());
});

test('Get the first item of the Group', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  assert.strictEqual(group.first(), 1);
});

test('Get the first 3 items of the Group where size equals', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  assert.deepStrictEqual(group.first(3), [1, 2, 3]);
});

test('Get the first 3 items of the Group where size is least', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  assert.deepStrictEqual(group.first(3), [1, 2]);
});

test('Get the last item of the Group', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  assert.deepStrictEqual(group.last(), 2);
});

test('Get the last 3 items of the Group', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  assert.deepStrictEqual(group.last(3), [1, 2, 3]);
});

test('Get the last 3 items of the Group where size is least', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  assert.deepStrictEqual(group.last(3), [1, 2]);
});

test('filter items from the Group', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const filtered = group.filter(x => x % 2 === 1);
  assert.strictEqual(group.size, 3);
  assert.strictEqual(filtered.size, 2);
  assert.deepStrictEqual(filtered.array(), [1, 3]);
});

test('Cut a Grumpy into two Groups', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  group.set('d', 4);
  group.set('e', 5);
  group.set('f', 6);
  const [even, odd] = group.cut(x => x % 2 === 0);
  assert.deepStrictEqual(even.array(), [2, 4, 6]);
  assert.deepStrictEqual(odd.array(), [1, 3, 5]);
});

test('Map items in a Group into an array', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const mapped = group.map(x => x + 1);
  assert.deepStrictEqual(mapped, [2, 3, 4]);
});

test('Check if some items pass a predicate', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  assert.ok(group.some(x => x === 2));
});

test('Check if every items pass a predicate', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  assert.ok(!group.every(x => x === 2));
});

test('Reduce Group into a single value with initial value', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const sum = group.reduce((a, x) => a + x, 0);
  assert.strictEqual(sum, 6);
});

test('Reduce Group into a single value without initial value', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const sum = group.reduce((a, x) => a + x);
  assert.strictEqual(sum, 6);
});

test('Iterate over each item', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const a = [];
  group.each((v, k) => a.push([k, v]));
  assert.deepStrictEqual(a, [['a', 1], ['b', 2], ['c', 3]]);
});

test('Shallow clone the Group', () => {
  const group = new Grumpy();

  group.set('a', 1);
  group.set('b', 2);
  group.set('c', 3);
  const clone = group.clone();
  assert.deepStrictEqual(group.array(), clone.array());
});

test('Merge multiple Groups', () => {
  const group1 = new Grumpy();
  group1.set('a', 1);

  const group2 = new Grumpy();
  group2.set('b', 2);

  const group3 = new Grumpy();
  group3.set('c', 3);

  const merged = group1.concat(group2, group3);
  assert.deepStrictEqual(merged.array(), [1, 2, 3]);
  assert.ok(group1 !== merged);
});

test('Check equality of two Groups', () => {
  const group1 = new Grumpy();
  group1.set('a', 1);

  const group2 = new Grumpy();
  group2.set('a', 1);

  assert.ok(group1.equals(group2));
  group2.set('b', 2);

  assert.ok(!group1.equals(group2));
  group2.clear();

  assert.ok(!group1.equals(group2));
});

test('Sort a Group', () => {
  const group = new Grumpy();

  group.set('a', 3);
  group.set('b', 2);
  group.set('c', 1);
  assert.deepStrictEqual(group.array(), [3, 2, 1]);
  const sorted = group.sort((a, b) => a - b);
  assert.deepStrictEqual(sorted.array(), [1, 2, 3]);
});
