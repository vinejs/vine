# Benchmarks

Following are the results from the benchmarks executed on the `Apple M1 Pro Mac - 16GB`. Feel free to clone this repo and re-run the benchmarks on your local computer.

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
Vine x 11,081,135 ops/sec ±0.81% (83 runs sampled)
Zod x 6,478,164 ops/sec ±0.11% (91 runs sampled)
Yup x 434,455 ops/sec ±0.11% (91 runs sampled)
Valibot x 5,619,021 ops/sec ±0.44% (91 runs sampled)
Joi x 2,110,782 ops/sec ±0.14% (92 runs sampled)
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
Vine x 8,373,023 ops/sec ±1.26% (86 runs sampled)
Zod x 3,348,141 ops/sec ±0.16% (92 runs sampled)
Yup x 150,579 ops/sec ±0.10% (92 runs sampled)
Valibot x 3,057,636 ops/sec ±0.15% (92 runs sampled)
Joi x 1,018,951 ops/sec ±0.11% (92 runs sampled)
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
Vine x 6,175,760 ops/sec ±0.34% (90 runs sampled)
Zod x 2,848,728 ops/sec ±0.35% (89 runs sampled)
Yup x 74,826 ops/sec ±0.14% (91 runs sampled)
Valibot x 2,835,312 ops/sec ±0.17% (91 runs sampled)
Joi x 740,695 ops/sec ±0.62% (92 runs sampled)
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
Vine x 9,287,022 ops/sec ±0.33% (89 runs sampled)
Zod x 1,998,166 ops/sec ±0.12% (91 runs sampled)
Valibot x 1,039,123 ops/sec ±0.15% (91 runs sampled)
Joi x 876,441 ops/sec ±0.17% (92 runs sampled)
Fastest is Vine
```
