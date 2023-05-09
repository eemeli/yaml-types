import { test } from 'tap'
import { Document, type Scalar, parse, stringify } from 'yaml'

import { sharedSymbol, symbol } from '.'

test('parse shared', t => {
  const res: symbol = parse(`!symbol/shared foo`, {
    customTags: [sharedSymbol, symbol]
  })
  t.type(res, 'symbol')
  t.same(Symbol.keyFor(res), 'foo')
  t.end()
})

test('stringify shared', t => {
  const doc = new Document<Scalar, false>(Symbol.for('some\nsymbol'), {
    customTags: [sharedSymbol, symbol]
  })
  t.equal(doc.toString(), '!symbol/shared |-\nsome\nsymbol\n')

  doc.contents.value = Symbol('foo')
  t.throws(() => doc.toString(), { name: 'TypeError' })

  doc.contents.value = 42
  t.throws(() => doc.toString(), { name: 'TypeError' })

  t.throws(() =>
    stringify(Symbol('some\nsymbol'), { customTags: [sharedSymbol] })
  )

  t.end()
})

test('parse private', t => {
  const res: symbol = parse(`!symbol foo`, {
    customTags: [sharedSymbol, symbol]
  })
  t.type(res, 'symbol')
  t.notOk(Symbol.keyFor(res))
  t.end()
})

test('stringify private', t => {
  const doc = new Document<Scalar, false>(Symbol('some\nsymbol'), {
    customTags: [sharedSymbol, symbol]
  })
  t.equal(doc.toString(), '!symbol |-\nsome\nsymbol\n')

  doc.contents.value = Symbol.for('foo')
  t.equal(doc.toString(), '!symbol foo\n')

  doc.contents.value = 'foo'
  t.throws(() => doc.toString(), { name: 'TypeError' })

  t.end()
})
