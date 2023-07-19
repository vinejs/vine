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
Vine x 9,348,814 ops/sec ±1.16% (87 runs sampled)
Zod x 1,163,370 ops/sec ±0.64% (87 runs sampled)
Yup x 407,485 ops/sec ±0.65% (89 runs sampled)
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
Vine x 8,404,075 ops/sec ±0.39% (88 runs sampled)
Zod x 542,439 ops/sec ±1.00% (88 runs sampled)
Yup x 189,718 ops/sec ±0.74% (88 runs sampled)
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
Vine x 6,733,943 ops/sec ±0.84% (87 runs sampled)
Zod x 400,623 ops/sec ±0.75% (88 runs sampled)
Yup x 115,169 ops/sec ±0.43% (88 runs sampled)
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
Vine x 7,809,771 ops/sec ±0.37% (87 runs sampled)
Zod x 180,376 ops/sec ±0.35% (89 runs sampled)
Fastest is Vine
```
