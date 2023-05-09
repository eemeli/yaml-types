import { test } from 'tap'
import { parse, parseDocument, stringify } from 'yaml'

import { functionTag } from '.'

test('parse valid', t => {
  const res: Function = parse(
    `!function |-
"foo"
() => 'bar'
`,
    { customTags: [functionTag] }
  )
  t.type(res, 'function')
  t.equal(res.toString(), `() => 'bar'`)
  t.equal(res.name, 'foo')
  t.equal(res(), undefined, 'does not actually run the code specified')
  t.end()
})

test('parse invalid name serialization', t => {
  const doc = parseDocument(
    `!function |-
name: "invalid
blah
`,
    { customTags: [functionTag] }
  )
  t.has(doc.errors, { length: 1, 0: { code: 'TAG_RESOLVE_FAILED' } })
  t.end()
})

function foo() {
  return 1
}
test('stringify', t => {
  const res = stringify(foo, { customTags: [functionTag] })
  // the divergent toString is because typescript parses this test
  // prior to executing it, and it outputs JS with 4-space indentation
  // and extraneous semicolons.
  t.equal(
    res,
    `!function |-
"foo"
function foo() {
    return 1;
}
`
  )
  t.end()
})

test('unnamed function', t => {
  // it's actually kind of tricky to get a function that V8 won't
  // assign *some* sort of intelligible name to. It has to never be
  // assigned to any variable, or directly pass as an argument to
  // a named function at its point of creation, hence this line noise.
  const res = stringify((() => () => {})(), { customTags: [functionTag] })
  t.equal(
    res,
    `!function |-
""
() => { }
`
  )
  t.end()
})

test('parse completely empty value', t => {
  const src = `!function |-\n`
  const res: Function = parse(src, { customTags: [functionTag] })
  t.type(res, 'function')
  t.equal(res.name, undefined)
  t.equal(res(), undefined)
  t.end()
})

class Foo extends Boolean {}
test('stringify a class', t => {
  const res = stringify(Foo, { customTags: [functionTag] })
  // don't test the actual class body, because that will break
  // if/when TypeScript is updated.
  t.ok(
    res.startsWith(`!function |-
"Foo"
class Foo extends Boolean {`),
    'shows class toString value'
  )
  t.end()
})
