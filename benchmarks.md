# Benchmarks

Following are the results from the benchmarks executed on the `Apple M1 Mac - 16GB`. Feel free to clone this repo and re-run the benchmarks on your local computer.

- We benchmark VineJS against only those validation libraries that offer similar API for composing schema.
- Being slower does not mean bad. Continue using Yup or Zod if they work great for you or if performance is not a bottleneck for you.
- VineJS performance is the outcome of our pre-compiling API. Both Yup and Zod have no option for pre-compiling schemas.

## Benchmarking against a flat object
The source for this benchmark is saved inside the [./benchmarks/flat_object.ts](./benchmarks/flat_object.ts) file. You may run the benchmark as follows.

```sh
npm run build
node build/benchmarks/flat_object.js
```

### Results
```
===============================
Benchmarking with flat object
===============================
Vine x 9,149,087 ops/sec ±0.35% (89 runs sampled)
Zod x 1,167,525 ops/sec ±0.70% (85 runs sampled)
Yup x 404,760 ops/sec ±0.38% (86 runs sampled)
Fastest is Vine
```

## Benchmarking against a nested object
The source for this benchmark is saved inside the [./benchmarks/nested_object.ts](./benchmarks/nested_object.ts) file. You may run the benchmark as follows.

```sh
npm run build
node build/benchmarks/nested_object.js
```

### Results
```
=================================
Benchmarking with nested object
=================================
Vine x 8,024,818 ops/sec ±0.26% (89 runs sampled)
Zod x 553,710 ops/sec ±0.34% (88 runs sampled)
Yup x 191,407 ops/sec ±0.26% (88 runs sampled)
Fastest is Vine
```

## Benchmarking arrays
The source for this benchmark is saved inside the [./benchmarks/array.ts](./benchmarks/array.ts) file. You may run the benchmark as follows.

```sh
npm run build
node build/benchmarks/array.js
```

### Results
```
======================
Benchmarking arrays
======================
Vine x 6,564,289 ops/sec ±0.29% (88 runs sampled)
Zod x 410,636 ops/sec ±0.77% (87 runs sampled)
Yup x 114,580 ops/sec ±0.31% (88 runs sampled)
Fastest is Vine
```

## Benchmarking unions
The source for this benchmark is saved inside the [./benchmarks/union.ts](./benchmarks/union.ts) file. You may run the benchmark as follows.

> **Note**: Yup does not support unions, so there are no benchmarks for it.

```sh
npm run build
node build/benchmarks/union.js
```

### Results
```
=======================
Benchmarking unions
=======================
Vine x 8,407,062 ops/sec ±0.28% (87 runs sampled)
Zod x 181,892 ops/sec ±0.34% (88 runs sampled)
Fastest is Vine
```
