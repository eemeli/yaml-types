import { test } from 'tap'
import { parse, stringify } from 'yaml'

import { symbol } from '.'

test('parse', t => {
  const res: symbol = parse(`!symbol foo`, { customTags: [symbol] })
  t.type(res, 'symbol')
  t.same(Symbol.keyFor(res), 'foo')
  t.end()
})

test('stringify shared', t => {
  const res = stringify(Symbol.for('some\nsymbol'), { customTags: [symbol] })
  t.equal(res, '!symbol |-\nsome\nsymbol\n')
  t.end()
})

test('stringify private', t => {
  t.throws(() => stringify(Symbol('some\nsymbol'), { customTags: [symbol] }))
  t.end()
})
