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
Vine x 13,755,815 ops/sec ±1.51% (85 runs sampled)
Zod x 1,256,814 ops/sec ±1.16% (83 runs sampled)
Yup x 516,677 ops/sec ±0.61% (86 runs sampled)
Valibot x 5,856,615 ops/sec ±0.32% (90 runs sampled)
Joi x 1,757,520 ops/sec ±0.47% (86 runs sampled)
Ajv x 10,631,917 ops/sec ±0.59% (83 runs sampled)
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
Vine x 11,645,981 ops/sec ±0.64% (87 runs sampled)
Zod x 586,571 ops/sec ±0.98% (89 runs sampled)
Yup x 236,181 ops/sec ±0.54% (89 runs sampled)
Valibot x 3,530,527 ops/sec ±0.57% (89 runs sampled)
Joi x 875,866 ops/sec ±0.49% (87 runs sampled)
Ajv x 9,903,577 ops/sec ±0.55% (85 runs sampled)
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
Vine x 8,879,077 ops/sec ±0.81% (87 runs sampled)
Zod x 422,019 ops/sec ±0.99% (88 runs sampled)
Yup x 135,510 ops/sec ±0.58% (89 runs sampled)
Valibot x 2,934,557 ops/sec ±0.44% (88 runs sampled)
Joi x 630,307 ops/sec ±0.14% (92 runs sampled)
Ajv x 9,797,067 ops/sec ±0.22% (91 runs sampled)
Fastest is Ajv
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
Vine x 10,531,063 ops/sec ±0.80% (88 runs sampled)
Zod x 184,707 ops/sec ±1.00% (85 runs sampled)
Valibot x 2,454,900 ops/sec ±0.63% (90 runs sampled)
Joi x 722,437 ops/sec ±1.18% (86 runs sampled)
Ajv x 10,431,212 ops/sec ±0.51% (85 runs sampled)
Fastest is Vine
```
