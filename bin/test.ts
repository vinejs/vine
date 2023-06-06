import { assert } from '@japa/assert'
import { pathToFileURL } from 'node:url'
import { snapshot } from '@japa/snapshot'
import { expectTypeOf } from '@japa/expect-type'
import { specReporter } from '@japa/spec-reporter'
import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    suites: [
      {
        name: 'unit',
        files: ['tests/unit/**/*.spec(.js|.ts)'],
      },
      {
        name: 'integration',
        files: ['tests/integration/**/*.spec(.js|.ts)'],
      },
    ],
    plugins: [assert(), runFailedTests(), expectTypeOf(), snapshot()],
    reporters: [specReporter()],
    importer: (filePath) => import(pathToFileURL(filePath).href),
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
