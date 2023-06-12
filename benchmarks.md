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
Vine x 9,451,180 ops/sec ±0.98% (88 runs sampled)
Zod x 1,193,685 ops/sec ±0.33% (89 runs sampled)
Yup x 410,183 ops/sec ±0.31% (89 runs sampled)
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
Vine x 8,424,483 ops/sec ±0.21% (88 runs sampled)
Zod x 559,955 ops/sec ±0.28% (89 runs sampled)
Yup x 190,961 ops/sec ±0.27% (90 runs sampled)
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
Vine x 6,864,364 ops/sec ±0.31% (90 runs sampled)
Zod x 409,199 ops/sec ±0.28% (89 runs sampled)
Yup x 115,652 ops/sec ±0.28% (89 runs sampled)
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
Vine x 9,033,819 ops/sec ±0.24% (87 runs sampled)
Zod x 179,340 ops/sec ±0.35% (87 runs sampled)
Fastest is Vine
```
