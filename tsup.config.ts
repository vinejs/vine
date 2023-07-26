import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./index.ts', './src/types.ts'],
  outDir: './build',
  clean: true,
  format: 'esm',
  dts: true,
  target: 'esnext',
  noExternal: ['validator'], // remove this if you don't want to bundle validator
})
