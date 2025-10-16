# Benchmarks

Following are the results from the benchmarks executed on the `Apple M3 Pro - 36 GB`. Feel free to clone this repo and re-run the benchmarks on your local computer.

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
Vine x 13,072,620 ops/sec ±1.09% (84 runs sampled)
Zod x 7,420,116 ops/sec ±0.34% (88 runs sampled)
Yup x 746,769 ops/sec ±0.42% (90 runs sampled)
Valibot x 6,558,725 ops/sec ±0.23% (90 runs sampled)
Joi x 2,252,419 ops/sec ±0.48% (90 runs sampled)
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
Vine x 9,445,152 ops/sec ±0.42% (88 runs sampled)
Zod x 3,628,979 ops/sec ±0.52% (91 runs sampled)
Yup x 344,506 ops/sec ±0.18% (91 runs sampled)
Valibot x 3,363,940 ops/sec ±0.17% (91 runs sampled)
Joi x 1,137,401 ops/sec ±0.41% (92 runs sampled)
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
Vine x 6,810,515 ops/sec ±0.44% (87 runs sampled)
Zod x 3,254,923 ops/sec ±0.14% (84 runs sampled)
Yup x 202,143 ops/sec ±0.21% (91 runs sampled)
Valibot x 3,064,924 ops/sec ±0.10% (89 runs sampled)
Joi x 795,110 ops/sec ±0.71% (89 runs sampled)
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
Vine x 9,949,804 ops/sec ±0.32% (84 runs sampled)
Zod x 2,106,060 ops/sec ±0.15% (89 runs sampled)
Valibot x 1,124,721 ops/sec ±0.21% (92 runs sampled)
Joi x 957,252 ops/sec ±0.11% (92 runs sampled)
Fastest is Vine
```
