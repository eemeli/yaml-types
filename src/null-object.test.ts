import { test } from 'tap'
import { parse, parseDocument, stringify } from 'yaml'

import { nullobject } from '.'
test('parse valid', t => {
  const res: { a: 1 } = parse(`!nullobject { a: 1 }`, {
    customTags: [nullobject]
  })
  t.same(res, { a: 1 })
  t.equal(Object.getPrototypeOf(res), null)
  t.end()
})

test('parse invalid map', t => {
  const doc = parseDocument(`!nullobject [1]`, { customTags: [nullobject] })
  t.has(doc.warnings, { length: 1, 0: { code: 'TAG_RESOLVE_FAILED' } })
  t.end()
})

test('stringify', t => {
  const obj = Object.assign(Object.create(null), { a: 1 })
  const res = stringify(obj, { customTags: [nullobject] })
  t.equal(res, '!nullobject\na: 1\n')
  t.end()
})
