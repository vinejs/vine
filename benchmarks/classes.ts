import { z } from 'zod'
// @ts-ignore
import Benchmark from 'benchmark'

const suite = new Benchmark.Suite()

class ObjectType {
  constructor(public props: any) {}
  toTree() {
    return {
      type: 'object',
      props: Object.keys(this.props).map((prop) => {
        return this.props[prop]
      }),
    }
  }
}

class StringType {
  toTree() {
    return {
      type: 'string',
    }
  }
}

class BooleanType {
  toTree() {
    return {
      type: 'boolean',
    }
  }
}

class ArrayType {
  constructor(public elem: any) {}

  toTree() {
    return {
      type: 'array',
      elements: this.elem.toTree(),
    }
  }
}

function toObject(props: any) {
  return {
    props,
    toTree() {
      return {
        type: 'object',
        props: Object.keys(this.props).map((prop) => {
          return this.props[prop]
        }),
      }
    },
  }
}

function toString() {
  return {
    toTree() {
      return {
        type: 'string',
      }
    },
  }
}

function toBoolean() {
  return {
    toTree() {
      return {
        type: 'boolean',
      }
    },
  }
}

function toArray(elem: any) {
  return {
    toTree() {
      return {
        type: 'array',
        elem: elem.toTree(),
      }
    },
  }
}

suite
  .add('Class based schema', {
    defer: false,

    // benchmark test function
    fn: function (deferred: any) {
      const schema = new ObjectType({
        username: new StringType(),
        isAdmin: new BooleanType(),
        contacts: new ArrayType(
          toObject({
            email: new StringType(),
            phone: new StringType(),
          })
        ),
      })
      // deferred.resolve()
    },
  })
  .add('Function based schema', {
    defer: false,

    // benchmark test function
    fn: function (deferred: any) {
      const schema = toObject({
        username: toString(),
        isAdmin: toBoolean(),
        contacts: toArray(
          toObject({
            email: toString(),
            phone: toString(),
          })
        ),
      })
      // deferred.resolve()
    },
  })
  .add('Zod', {
    defer: false,
    fn: function () {
      const zodSchema = z.object({
        username: z.string(),
        isAdmin: z.boolean(),
        contacts: z.array(
          z.object({
            email: z.string(),
            phone: z.string(),
          })
        ),
      })
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
