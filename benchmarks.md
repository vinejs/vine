# Benchmarks
Following are the results from the benchmarks executed on `Apple M1 Mac - 16GB`. Feel free to clone this repo and re-run the benchmarks on your local computer.

- We benchmark VineJS against only those validation libraries, that offers similar API for composing schema.
- Being slower does not mean bad. Continue using Yup or Zod if they work great for you, or if performance is not a bottleneck for you.
- VineJS performance is the outcome of our pre-compiling API. Both Yup and Zod has no option for pre-compiling schemas.

## Benchmarking against flat object
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
Vine x 9,208,428 ops/sec ±0.99% (86 runs sampled)
Zod x 1,158,997 ops/sec ±0.89% (87 runs sampled)
Yup x 413,173 ops/sec ±0.59% (90 runs sampled)
Fastest is Vine
```

## Benchmarking against nested object
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
Vine x 8,157,981 ops/sec ±0.34% (89 runs sampled)
Zod x 558,226 ops/sec ±0.38% (87 runs sampled)
Yup x 192,073 ops/sec ±1.19% (90 runs sampled)
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
Vine x 6,816,681 ops/sec ±1.65% (90 runs sampled)
Zod x 420,825 ops/sec ±0.35% (91 runs sampled)
Yup x 119,343 ops/sec ±0.38% (91 runs sampled)
Fastest is Vine
```

## Benchmarking unions
The source for this benchmark is saved inside the [./benchmarks/union.ts](./benchmarks/union.ts) file. You may run the benchmark as follows.

> **Note**: Yup does not have support for unions and hence there are no benchmarks for it.

```sh
npm run build
node build/benchmarks/union.js
```

### Results
```
=======================
Benchmarking unions
=======================
Vine x 8,791,274 ops/sec ±0.65% (85 runs sampled)
Zod x 184,658 ops/sec ±0.53% (85 runs sampled)
Fastest is Vine
```
