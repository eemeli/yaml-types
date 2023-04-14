import { test } from 'tap'
import { parse, parseDocument, stringify } from 'yaml'

import { regexp } from '.'

test('parse valid', t => {
  const res: RegExp = parse(`!re /fo./g`, { customTags: [regexp] })
  t.type(res, RegExp)
  t.same(res, /fo./g)
  t.end()
})

test('parse invalid wrapper', t => {
  const doc = parseDocument(`!re foo/g`, { customTags: [regexp] })
  t.has(doc.errors, { length: 1, 0: { code: 'TAG_RESOLVE_FAILED' } })
  t.end()
})

test('parse invalid contents', t => {
  const doc = parseDocument(`!re /foo\\/g`, { customTags: [regexp] })
  t.has(doc.errors, { length: 1, 0: { code: 'TAG_RESOLVE_FAILED' } })
  t.end()
})

test('stringify', t => {
  const res = stringify(/foo/gm, { customTags: [regexp] })
  t.equal(res, '!re /foo/gm\n')
  t.end()
})
