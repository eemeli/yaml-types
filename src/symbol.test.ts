import { test } from 'tap'
import { parse, stringify } from 'yaml'

import { sharedSymbol } from '.'

test('parse', t => {
  const res: symbol = parse(`!symbol/shared foo`, {
    customTags: [sharedSymbol]
  })
  t.type(res, 'symbol')
  t.same(Symbol.keyFor(res), 'foo')
  t.end()
})

test('stringify shared', t => {
  const res = stringify(Symbol.for('some\nsymbol'), {
    customTags: [sharedSymbol]
  })
  t.equal(res, '!symbol/shared |-\nsome\nsymbol\n')
  t.end()
})

test('stringify private', t => {
  t.throws(() =>
    stringify(Symbol('some\nsymbol'), { customTags: [sharedSymbol] })
  )
  t.end()
})
