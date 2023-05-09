import { test } from 'tap'
import { parse, stringify } from 'yaml'

import { classTag, functionTag } from '.'

test('parse valid', t => {
  const res: { new (): any } = parse(
    `!class |-
class X extends Y {
  constructor() {
    this.a = 1
    throw new Error('bad idea to actually run this')
  }
  z = 3
}
`,
    { customTags: [classTag, functionTag] }
  )
  t.type(res, 'function')
  t.equal(
    res.toString(),
    `class X extends Y {
  constructor() {
    this.a = 1
    throw new Error('bad idea to actually run this')
  }
  z = 3
}`
  )
  t.equal(res.name, 'X')
  const inst = new res()
  t.notMatch(
    inst,
    {
      a: Number,
      z: Number
    },
    'does not actually run the code specified'
  )
  t.end()
})

test('unnamed class', t => {
  // it's actually kind of tricky to get a class that V8 won't
  // assign *some* sort of intelligible name to. It has to never be
  // assigned to any variable, or directly pass as an argument to
  // a named function at its point of creation, hence this line noise.
  const res = stringify((() => class {})(), {
    customTags: [classTag, functionTag]
  })
  t.equal(
    res,
    `!class |-
class {\n    }
`
  )
  t.end()
})

test('parse completely empty value', t => {
  const src = `!class |-\n`
  const res: { new (): any } = parse(src, { customTags: [classTag] })
  t.type(res, 'function')
  t.equal(res.name, undefined)
  t.equal(res.toString(), '')
  t.end()
})

class Foo extends Boolean {}
test('stringify a class', t => {
  const res = stringify(Foo, { customTags: [classTag, functionTag] })
  // don't test the actual class body, because that will break
  // if/when TypeScript is updated.
  t.ok(
    res.startsWith(`!class |-
class Foo extends Boolean {`),
    'shows class toString value'
  )
  t.end()
})

test('stringify not a class for identify coverage', t => {
  const res = stringify(() => {}, { customTags: [classTag, functionTag] })
  t.equal(
    res,
    `!function |-
""
() => { }
`
  )
  t.end()
})
