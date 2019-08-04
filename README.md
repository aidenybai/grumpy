# Grumpy
<img src="https://badgen.net/travis/aidenybai/grumpy?color=purple&style=flat" height="20"> <img src="https://badgen.net/npm/v/grumpy?color=purple&style=flat"> <img src="https://badgen.net/npm/dt/grumpy?color=purple&style=flat"> <img src="https://badgen.net/badge/size/1.1%20MB/purple?style=flat"> <img src="https://badgen.net/david/dep/cringiest/grumpy?color=purple&style=flat">

<img src="https://cdn.jsdelivr.net/gh/aidenybai/grumpy@master/docs/img/grumpy.svg" height="130" align="right">

##### [API](https://grumpy.js.org/api) | [Install](https://yarn.pm/grumpy) | [Github](https://github.com/cringiest/grumpy)

> Grumpy is a NodeJS library which provides a painless way to deal with key-value storage. It's much more efficient than Object/Array hashmaps because it is based off of Javascript's built in [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class. 

##### What does Grumpy do?

Most things that you can do with `Array` and `Map` can be done using Grumpy! Here are a few examples to get you started:

* Add/remove sets of values in a scoped `Group`.
* Convert `Groups` into other data structures.
* Manipulate `Groups` using familiar `Array` methods.
* Fetch values from `Groups` using built-in methods.

##### Why should I use Grumpy?

* Small file size (~1kb).
* Blazing fast performance.
* Minimal & intuitive API.

Try it out here: [https://npm.runkit.com/grumpy](https://npm.runkit.com/grumpy)

### Installation

```bash
# Using yarn
yarn add grumpy

# Using npm
npm install grumpy
```

### Usage
Note: Grumpy requires at least `Node v6.4.0`.

Create an instance of Grumpy and manipulate the group. We're going to be assigning `key` to `value` and fetching and checking it once we've set it.

**Example** - Getting and setting values

Save file as **example.js**

```js
const Grumpy = require('grumpy');
const group = new Grumpy();

group.set('key', 'value');

group.get('key'); // returns 'value'
group.has('key'); // returns true
```

Execute script on the command line
```bash
node example.js
```
[More Examples](https://grumpy.js.org/examples/)
