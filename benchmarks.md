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
Vine x 9,744,651 ops/sec ±0.65% (86 runs sampled)
Zod x 1,277,525 ops/sec ±0.70% (89 runs sampled)
Yup x 521,218 ops/sec ±0.27% (89 runs sampled)
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
Vine x 8,501,749 ops/sec ±0.47% (86 runs sampled)
Zod x 589,418 ops/sec ±0.17% (89 runs sampled)
Yup x 233,343 ops/sec ±0.25% (89 runs sampled)
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
Vine x 6,622,071 ops/sec ±0.55% (89 runs sampled)
Zod x 424,309 ops/sec ±0.15% (90 runs sampled)
Yup x 136,655 ops/sec ±0.22% (88 runs sampled)
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
Vine x 8,495,306 ops/sec ±0.37% (86 runs sampled)
Zod x 317,658 ops/sec ±0.23% (88 runs sampled)
Fastest is Vine
```
