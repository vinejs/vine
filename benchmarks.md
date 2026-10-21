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

## Async vs sync registration validation

Run the same registration schema through `await validator.validate(data)` and
`validator.validateSync(data)`:

```sh
npm run build
node benchmarks/registration.mjs
```

The schema validates an email address, a 3 to 30 character username containing
letters, numbers or underscores, and a 12 to 128 character password. It trims
email and username values. None of its rules are async.

The benchmark uses the built package, checks that both APIs normalize and reject
the same inputs, then measures successful validations with four rotating inputs.
Each call receives a fresh input object. Compilation is excluded, both modes get
50,000 warmup calls, and each mode gets 15 samples of 100,000 validations. The
execution order alternates between samples. Async calls are awaited individually.

Three independent runs in an orb, Node.js 26.5.1, Linux x64, Intel Xeon 2.60 GHz:

| Run | Async median | Sync median | Async ops/sec | Sync ops/sec |
| --- | ------------ | ----------- | ------------- | ------------ |
| 1   | 2.483 µs     | 2.422 µs    | 402,694       | 412,861      |
| 2   | 2.420 µs     | 2.405 µs    | 413,183       | 415,758      |
| 3   | 2.410 µs     | 2.314 µs    | 414,952       | 432,090      |

Sync throughput was 0.6% to 4.1% higher in these runs. Sample ranges overlap, so
this workload does not establish a substantial performance advantage. These
numbers measure validation only, not request handling, compilation or error paths.

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
