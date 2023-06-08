# @vinejs/vine

![](https://github.com/thetutlage/static/blob/main/sponsorkit/sponsors.png?raw=true)

<hr>
<br />

<div align="center">
  <h3>One of the fastest validation library for Node.js</h3>
  <p>VineJS is a form data validation library for Node.js. You may use it to validate the HTTP request body in your backend applications.</p>
</div>

<br />

<div align="center">

[![gh-workflow-image]][gh-workflow-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url] [![snyk-image]][snyk-url]

</div>

## Benchmarks
Following are results of the benchmarks performed between Yup, Zod and VineJS.

- **Machine**: Apple M1 - 16GB Ram
- **Node.js version**: v20.2.0
- **Running benchmarks**: You can run benchmarks on your computer by executing `npm run benchmark` script.

```
===============================
Benchmarking with flat object
===============================
Vine x 9,208,428 ops/sec ±0.99% (86 runs sampled)
Zod x 1,158,997 ops/sec ±0.89% (87 runs sampled)
Yup x 413,173 ops/sec ±0.59% (90 runs sampled)
Fastest is Vine

=================================
Benchmarking with nested object
=================================
Vine x 8,157,981 ops/sec ±0.34% (89 runs sampled)
Zod x 558,226 ops/sec ±0.38% (87 runs sampled)
Yup x 192,073 ops/sec ±1.19% (90 runs sampled)
Fastest is Vine

======================
Benchmarking arrays
======================
Vine x 6,816,681 ops/sec ±1.65% (90 runs sampled)
Zod x 420,825 ops/sec ±0.35% (91 runs sampled)
Yup x 119,343 ops/sec ±0.38% (91 runs sampled)
Fastest is Vine

=======================
Benchmarking unions
=======================
Vine x 8,791,274 ops/sec ±0.65% (85 runs sampled)
Zod x 184,658 ops/sec ±0.53% (85 runs sampled)
Fastest is Vine
```

<div align="center">
  <h3>
    <a href="https://vinejs.dev">
      Benchmarks
    </a>
    <span> | </span>
    <a href="https://vinejs.dev/docs/introduction">
      Documentation
    </a>
    <span> | </span>
    <a href=".github/CONTRIBUTING.md">
      Contributing
    </a>
  </h3>
</div>

<div align="center">
  <sub>Built with ❤︎ by <a href="https://github.com/thetutlage">Harminder Virk</a>
</div>

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/vinejs/vine/test.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/vinejs/vine/actions/workflows/test.yml "Github action"

[npm-image]: https://img.shields.io/npm/v/vinejs/vine/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/vinejs/vine/v/latest "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/vinejs/vine?style=for-the-badge

[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/vinejs/vine?label=Snyk%20Vulnerabilities&style=for-the-badge
[snyk-url]: https://snyk.io/test/github/vinejs/vine?targetFile=package.json "snyk"
