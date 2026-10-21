import assert from 'node:assert/strict'
import { cpus } from 'node:os'
import { performance } from 'node:perf_hooks'
import vine, { ValidationError } from '../build/index.js'

// Run after `npm run build`. Compilation and warmup are outside timed batches.
const validator = vine.create({
  email: vine.string().trim().email().maxLength(254),
  username: vine
    .string()
    .trim()
    .minLength(3)
    .maxLength(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: vine.string().minLength(12).maxLength(128),
})

const inputs = [
  { email: ' alice@example.com ', username: ' alice_42 ', password: 'a-long-password-42!' },
  { email: 'bob.smith@example.org', username: 'bob_smith', password: 'another-password-7!' },
  { email: 'carol+news@example.net', username: 'carol_2026', password: 'correct-horse-battery' },
  { email: 'dan@example.com', username: 'dan', password: 'twelve-chars' },
]

// Prove both APIs do the same work, including normalization and rejection.
for (const input of inputs) {
  const expected = { ...input, email: input.email.trim(), username: input.username.trim() }
  assert.deepEqual(validator.validateSync({ ...input }), expected)
  assert.deepEqual(await validator.validate({ ...input }), expected)
}
for (const invalid of [
  { email: 'not-an-email' },
  { username: 'invalid username' },
  { password: 'too-short' },
]) {
  const input = { ...inputs[0], ...invalid }
  assert.throws(() => validator.validateSync({ ...input }), ValidationError)
  await assert.rejects(() => validator.validate({ ...input }), ValidationError)
}
for (const field of validator.toJSON().schema.schema.properties) {
  assert.ok(field.validations.every((rule) => rule.isAsync === false))
}

const iterations = 100_000
const samples = 15
let checksum = 0

function runSync(count) {
  const start = performance.now()
  for (let index = 0; index < count; index++) {
    checksum += validator.validateSync({ ...inputs[index % inputs.length] }).username.length
  }
  return ((performance.now() - start) * 1e6) / count
}

async function runAsync(count) {
  const start = performance.now()
  for (let index = 0; index < count; index++) {
    checksum += (await validator.validate({ ...inputs[index % inputs.length] })).username.length
  }
  return ((performance.now() - start) * 1e6) / count
}

runSync(50_000)
await runAsync(50_000)

const sync = []
const async = []
for (let sample = 0; sample < samples; sample++) {
  // Alternate order to avoid giving one mode all the cold or late samples.
  if (sample % 2 === 0) {
    sync.push(runSync(iterations))
    async.push(await runAsync(iterations))
  } else {
    async.push(await runAsync(iterations))
    sync.push(runSync(iterations))
  }
}

function summarize(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return {
    medianNs: Math.round(median),
    minNs: Math.round(sorted[0]),
    maxNs: Math.round(sorted.at(-1)),
    operationsPerSecond: Math.round(1e9 / median),
    samplesNs: values.map(Math.round),
  }
}

console.log(
  JSON.stringify(
    {
      node: process.version,
      platform: `${process.platform}/${process.arch}`,
      cpu: cpus()[0].model,
      iterationsPerSample: iterations,
      samples,
      async: summarize(async),
      sync: summarize(sync),
      checksum,
    },
    null,
    2
  )
)
