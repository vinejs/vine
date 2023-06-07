import '@japa/assert'

declare module '@japa/assert' {
  interface Assert {
    validationErrors(promiseLike: Promise<any>, messages: any): Promise<void>
    validationOutput(promiseLike: Promise<any>, output: any): Promise<void>
  }
}
