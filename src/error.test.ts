import { test } from 'tap'
import { parse, stringify } from 'yaml'

import { inspect } from 'node:util'

import { error } from '.'
test('parse basic', t => {
  const res: RangeError = parse(
    `!error
name: RangeError
message: hello
stack: |2
  RangeError: hello
      at some-file.js:1:2
      at Object.someMethod (/path/to/other-file.js:123:420)
`,
    { customTags: [error] }
  )
  t.type(res, RangeError)
  t.match(res, {
    name: 'RangeError',
    message: 'hello',
    stack: `RangeError: hello
    at some-file.js:1:2
    at Object.someMethod (/path/to/other-file.js:123:420)
`
  })
  t.end()
})

test('parse custom named error', t => {
  const res: Error = parse(
    `!error
name: CustomErrorSubclass
message: custom message
otherProperty: 123
`,
    { customTags: [error] }
  )
  t.type(res, Error)
  t.match(res, {
    name: 'CustomErrorSubclass',
    message: 'custom message',
    // if no stack in the yaml, none in the error object either
    stack: undefined,
    otherProperty: 123
  })
  t.end()
})

test('stringify basic', t => {
  const e = new Error('message')
  const res = stringify(e, { customTags: [error] })
  t.match(res, /^!error\nname: Error\nmessage: message\nstack: /)
  t.end()
})

test('stringify with custom inspect', t => {
  const e = Object.assign(new URIError('blah'), {
    // no real need to do this, stacks are just annoying to test,
    // and we already verified above that gets a stack in the yaml.
    stack: undefined,
    cause: { foo: 'bar' },
    a: true,
    b: false,
    c: 123,
    [inspect.custom]: () => {
      return { a: 1, b: 2 }
    }
  })
  const res = stringify(e, { customTags: [error] })
  t.equal(
    res,
    `!error
name: URIError
message: blah
cause:
  foo: bar
a: 1
b: 2
`
  )
  t.end()
})

test('stringify with custom toJSON', t => {
  const e = Object.assign(new URIError('blah'), {
    // no real need to do this, stacks are just annoying to test,
    // and we already verified above that gets a stack in the yaml.
    stack: undefined,
    a: true,
    b: false,
    c: 123,
    toJSON: () => {
      return { a: 1, b: 2 }
    }
  })
  const res = stringify(e, { customTags: [error] })
  t.equal(
    res,
    `!error
name: URIError
message: blah
a: 1
b: 2
`
  )
  t.end()
})

test('supports all known error types', t => {
  const types: { new (m: string): Error }[] = [
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    Error
  ]
  t.plan(types.length)
  for (const Cls of types) {
    t.test(Cls.name, t => {
      const e = new Cls('message')
      const res = stringify(e, { customTags: [error] })
      t.match(
        res,
        `!error
name: ${Cls.name}
message: message
`
      )
      const parsed = parse(res, { customTags: [error] })
      t.type(parsed, Cls)
      t.end()
    })
  }
})
